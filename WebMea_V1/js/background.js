var currentTab;
var version = "1.0";


var isActive = false;
var cspHeaders;
var id=1;
var site;
var site_num=0;
var sub_sitep=[];
var sub_site_num=0;
var domain_num=0; 
var tabid=0;
var t;
var t_sub;
var tscroll;
var newURL=[];
var b_newURL=[];
var subURL=[];

var server_url = "https://cysecurity.mines.edu:8049/*";
var db = openDatabase('V_CSPinfo_DB', '1.0', 'CSP_Report', 1000 * 1024 * 1024); 
db.transaction(function (tx) { 
                tx.executeSql('DROP TABLE IF EXISTS LOGS_1');
                tx.executeSql('DROP TABLE IF EXISTS CSP_Header_1');
                tx.executeSql('DROP TABLE IF EXISTS CSP_Meta_1');
                tx.executeSql('DROP TABLE IF EXISTS S_RL_1');
                tx.executeSql('DROP TABLE IF EXISTS Status_Code_1');
                tx.executeSql('DROP TABLE IF EXISTS Html_1');
                tx.executeSql('DROP TABLE IF EXISTS Request_1');

});

db.transaction(function (tx) { 
               
        tx.executeSql('CREATE TABLE IF NOT EXISTS S_RL_1 (id,site_url,type,domain)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS Html_1 (id,site_url,dom)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS CSP_Meta_1 (id,site_url,cspmetaheader,cspmetacon)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS Request_1 (tabId,requestId,site,reqSite,startTime,status,contentType,method,frameId,initiator,parentFrameId,responseHeaders)');
 tx.executeSql('CREATE TABLE IF NOT EXISTS CSP_Header_1 (id,site_url,CSP_Header_1,csp_content)');
      /*  tx.executeSql('CREATE TABLE IF NOT EXISTS LOGS_1 (id unique,document_uri, referrer,violated_directive,blocked_uri,disposition, effective_directive,original_policy,script_sample,Status_Code,from_site,line_number,column_number,content,source_file)');*/
        tx.executeSql('CREATE TABLE IF NOT EXISTS Status_Code_1 (id,siteurl,StatusC)');

        
});

var CSP_exist=true;
var mcspHeaders;

const url = chrome.runtime.getURL('upnewurl_49.txt');
var xhr = new XMLHttpRequest();
xhr.open('GET', url, true);
xhr.onreadystatechange = function()
{
    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200)
    {
       newURL_1=xhr.responseText.split(" ,");
       newURL=[...new Set(newURL_1)];
       for(var i=0;i<newURL.length;i++){

            var x=newURL[i];
            if(newURL[i].split("/")[0]=="http:"){x= newURL[i].replace("http://","https://");} 
            x=x.replace("/?","?");
            if(x.match("#")){x=x.substring(0, x.indexOf("#"));}
            if(x.match("@")){x=x.substring(0, x.indexOf("@"));}
            if(x[x.length-1]=="/"){x=x.substring(0, x.length - 1);}
            b_newURL[i]=x;

           newURL[i]=newURL[i].concat(" HP");
           console.log(newURL[i]);
       }
       domain_num=newURL.length;
    }
};
xhr.send();

start_time=0
time_list=[]
dataclear= function() {time_list.push(((new Date()).getTime()-start_time)/1000)}


chrome.runtime.onMessage.addListener(function(request, sender) {
  
  if (request.action == "generate") {
   chrome.storage.sync.get({
      cspGeneratorUrl: 'https://csp.4armed.io',
      unsafe: false
    }, function(items) {
      $.get(items.cspGeneratorUrl + '/policy/' + request.host + (items.unsafe === true ? '?unsafe=1' : ''), function(data){
        chrome.runtime.sendMessage(data);
      })
    });
  } else if (request.action == "csp-on") {
    console.log('[*] enabling Content-Security-Policy');
    isActive = true;
    cspHeaders = { name: "Content-Security-Policy", value: request.csp };
    CSP.browser.setIcon('on');
  } else if (request.action == "csp-report-on") {
    console.log('[*] enabling Content-Security-Policy-Report-Only');
    isActive = true;
    cspHeaders = { "name": "Content-Security-Policy-Report-Only", "value": request.csp };
    CSP.browser.setIcon('on');
  } else if (request.action == "csp-off") {
    console.log('[*] disabling CSP');
    isActive = false;
    CSP.browser.setIcon('off');
  }
  else if (request.action == "crawPage") {
     console.log('[*] starting crawl page');
     chrome.tabs.onUpdated.addListener(function(tabs,info){ 
         if (info.status === 'complete') {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
              console.log("site_num:"+site_num+"domain:"+tabs[0].url+ " "+tabs[0].id);
              chrome.tabs.executeScript(tabs[0].id, {file:'js/getmetas.js'});
              chrome.tabs.executeScript(tabs[0].id, {file:'js/domsave.js'});
              chrome.tabs.executeScript(tabs[0].id, {file:'js/pagescroll.js'});
              if(newURL[site_num-1].split(" ")[1]=="HP"){
                 var doname=newURL[site_num-1].split(" ")[0];
                 var dnum=site_num;
                 db.transaction(function (tx) {                
                   var sqlstring="INSERT INTO S_RL_1 (id,site_url,type,domain) VALUES ("+site_num+",'"+doname+"','domain',"+dnum+")";               
                   tx.executeSql(sqlstring);})
                 chrome.tabs.executeScript(tabs[0].id, {file:'js/content_script.js'});
              }
            });

         }       
     });
/////////////////////////////////////////////////////////////////for domain websites change using labels
       t=setInterval(function(){

       var millisecondsPerWeek = 1000 * 60;
       var oneWeekAgo = (new Date()).getTime() - millisecondsPerWeek;
       //calculate removing time

       start_time=(new Date()).getTime()
       chrome.browsingData.remove({
         "since": oneWeekAgo
                  }, {
                       //"appcache": true,
                       "cache": true,
                       "cacheStorage": true,
                       "cookies": true,
                       "downloads": true,
                       "fileSystems": true,
                       "formData": true,
                       "history": true,
                       //"indexedDB": true,
                       //"passwords": true,
                       //"serviceWorkers": true,
                       //"webSQL": true,
                       "localStorage": true
        }, dataclear); 
      
       if(site_num<newURL.length){crawl_page(newURL[site_num].split(" ")[0]);
       console.log("site is:"+newURL[site_num].split(" ")[0]+" num is :"+site_num);site_num++;}     else{alert("end");console.log("crawled page: "+ newURL.length);
       for(var a=0;a<newURL.length;a++)
       {console.log("crawled site: "+ newURL[a]+" b_crawl:"+b_newURL[a]);}
       console.log("max:"+Math.max.apply(Math,time_list));
       sum=0;
       for(var a=0;a<time_list.length;a++)
       {console.log("time: "+ time_list[a]);sum=sum+time_list[a]}console.log("average:"+(sum/time_list.length));clearTimeout(t);}}
       ,60000);
       }
  else if (request.greeting!= null) {
       var greets=request.greeting.split(" ");
       var subnum=10;
      // console.log("greets:"+greets+" glength:"+greets.length);
       if(subnum>greets.length){subnum=greets.length}
       var offset=0;
       var sql_sub=[];
       for(var greet of greets)
       {
         var sub_url=greet;
         var sub_path=greet.split('?')[0];
             sub_path=sub_path.replace("http://","https://");
             sub_path=sub_path.replace("/?","?");
             if(sub_path.match("@")){sub_path=sub_path.substring(0, sub_path.indexOf("@"));}
             if(sub_path[sub_path.length-1]=="/"){sub_path=sub_path.substring(0, sub_path.length - 1);}
        if( offset<subnum && sub_sitep.indexOf(sub_path)<0){
            var position=site_num+offset;
            console.log("position:"+ position);
            newURL.splice(position,0,sub_url);
            var x=sub_url;
            if(sub_url.split("/")[0]=="http:"){x= sub_url.replace("http://","https://");}
            x=x.replace("/?","?"); 
            if(x.match("#")){x=x.substring(0, x.indexOf("#"));}
            if(x.match("@")){x=x.substring(0, x.indexOf("@"));}
            if(x[x.length-1]=="/"){x=x.substring(0, x.length - 1);}
            b_newURL.splice(position,0,x);
            
            sub_sitep.push(sub_path);
            var pos=position+1;
            sql_sub.push("INSERT INTO S_RL_1 (id,site_url,type,domain) VALUES ("+pos+",'"+greet+"','sub_domain',"+site_num+");");              
            offset++; console.log("offset:"+offset);
         }
       }
     sub_sitep=[];
     db.transaction(function (tx) { 
                    for(sqls of sql_sub){ tx.executeSql(sqls);}                             
                 
     });
  }
     

  else if(request.siteinfo != null) {
      console.log("site_info: "+request.siteinfo);    
  }
 
  else if(request.dom != null) {
    
     var Jdom=JSON.parse(request.dom);
     console.log("dom url:"+Jdom["siteurl"])
     console.log("dom html:"+Jdom["dom"])
     Jdom["dom"] =Jdom["dom"].replace(/\'/g,"\'\'");
     db.transaction(function (tx) { 
                                    var sqlstring="INSERT INTO Html_1 (id,site_url,dom) VALUES ("+site_num+",'"+Jdom["siteurl"]+"','"+Jdom["dom"]+"')";            
                 //   var sqlstring="INSERT INTO Html_1 (id,site_url,dom) VALUES ("+site_num+",'"+Jdom["siteurl"]+"','"+""+"')";              
                   tx.executeSql(sqlstring); 
                 })
  }

  else if(request.metacheck != null) {
      console.log("meta: "+request.metacheck); 
      var meta=   request.metacheck.replace(/\'/g, "");
      var meta2= meta.split(",,")
      var metaurl=meta2[0]
      var sql_meta=[]
      for(var i=1;i<meta2.length;i++){
         var meta_con=meta2[i].split(",");
         var meta_header=meta_con[0]
         var meta_content=meta_con[1]
         sql_meta.push("INSERT INTO CSP_Meta_1 (id,site_url,cspmetaheader,cspmetacon) VALUES ('"+site_num+"','"+metaurl+"','"+meta_header+"','"+meta_content+"')");

      }
       
       db.transaction(function (tx) { 
                    for(sqls of sql_meta){ tx.executeSql(sqls);}                             
                 
     });   
  
  } ;

  });




//////////////////////////////////////////////////////////////////////////////////////////
const networkFilters = {
        urls: ["*://*/*"]
};
var ssite="";
 chrome.webRequest.onCompleted.addListener((details) => {
     
        const { tabId, requestId } = details;
        if(tabId<0){console.log(tabId+" is less than zero"); return;}
        else{
           chrome.tabs.get(parseInt(details.tabId), function (tab) {
              ssite = tab.url;});
            status= details.statusCode
            frameId=details.frameId
            initiator=details.initiator
            parentFrameId=details.parentFrameId
            responseHeaders=""
            details.responseHeaders.forEach((hd, i)=> responseHeaders=responseHeaders+" <"+hd.name+","+hd.value+">");  
            db.transaction(function (tx) { 
                  var sqlstring="INSERT INTO Request_1 (tabId,requestId,site,reqSite,startTime,status,contentType,method,frameId,initiator,parentFrameId,responseHeaders) VALUES ("+tabId+","+requestId+",'"+ssite+"','"+details.url+"','"+details.timeStamp+"','"+status+"','"+details.type+"','"+details.method+"','"+frameId+"','"+initiator+"','"+parentFrameId+"','"+responseHeaders+"')";               
                   tx.executeSql(sqlstring); 
                 })    
     }

 }, networkFilters,["responseHeaders"]);



//////////////////////////////////////////////////////////////////////
var callback = function(details) { 
      var site_csp= details.url; 
      console.log("details.url:"+details.url)
     
      var x=details.url;
          if(details.url.split("/")[0]=="http:"){x= details.url.replace("http://","https://");} 
            x=x.replace("/?","?");
            if(x.match("#")){x=x.substring(0, x.indexOf("#"));}
            if(x.match("@")){x=x.substring(0, x.indexOf("@"));}
            if(x[x.length-1]=="/"){x=x.substring(0, x.length - 1);}
   if(b_newURL.indexOf(x)>-1){
            
            for (var i = 0; i < details.responseHeaders.length; i++) {
                if ('content-security-policy' === details.responseHeaders[i].name.toLowerCase() || 'content-security-policy-report-only' === details.responseHeaders[i].name.toLowerCase()) { 
                  CSP_exist=false;
                  //modify CSP
                  //site information     
                  var csp_split=details.responseHeaders[i].value.split(";");
                  for(var n=0;n<csp_split.length;n++){
                     if(csp_split[n].match("report-uri")){csp_split[n]=" ";}
                  }
                  var mcsp='';
                  for(var n=0;n<csp_split.length;n++){
                     if(csp_split[n]!=" "){mcsp=mcsp+csp_split[n]+";"}
                  }
                  mcsp=mcsp+ "report-uri https://cysecurity.mines.edu:8049/*"
                  console.log(mcsp);
                  details.responseHeaders[i].value=mcsp;
                  console.log("the csp num is:"+i+" site is:"+site_csp+details.responseHeaders[i].name+" "+details.responseHeaders[i].value); 
                  var cspname=details.responseHeaders[i].name;
                  var cspcon=details.responseHeaders[i].value.replace(/\'/g, "");
                 /////  ////////////save into DB2
/*                db.transaction(function (tx) { 
                 
                  var sqlstring="INSERT INTO CSP_Header_1 (id,site_url,CSP_Header_1,csp_content) VALUES ("+site_num+",'"+site_csp+"','"+cspname+"','"+cspcon+"')";
                  
                   tx.executeSql(sqlstring); 
                 })*/
                    var request_Cheader = new XMLHttpRequest();
                 request_Cheader.open("POST", server_url, true);
                 request_Cheader.setRequestHeader("Content-type", "csp-header/json");
                 request_Cheader.send(JSON.stringify({"id":site_num, "siteurl":site_csp, "cspheader":cspname, "cspcontent":cspcon})) 
 
                }
          }

          if (isActive && CSP_exist) {
                     // Add the CSP header we want
              details.responseHeaders.push(cspHeaders);
              var csph=cspHeaders.value.replace(/\'/g, "");
             /* db.transaction(function (tx) { 
                 var sqlstring="INSERT INTO CSP_Header_1 (id,site_url,CSP_Header_1,csp_content) VALUES ("+site_num+",'"+site_csp+"','designed_CSP_only','"+csph+"')";
              
                tx.executeSql(sqlstring); 
             })*/
                    var request_Cheader = new XMLHttpRequest();
                 request_Cheader.open("POST", server_url, true);
                 request_Cheader.setRequestHeader("Content-type", "csp-header/json");
                 request_Cheader.send(JSON.stringify({"id":site_num, "siteurl":site_csp,  "cspheader":"designed_CSP_only", "cspcontent":csph}))  
          }
          CSP_exist=true;
          return {responseHeaders: details.responseHeaders} }
};

var filter = {
  urls: ["*://*/*"],
  types: ["main_frame", "sub_frame"]
};


////////////////////////////////////////////////
/*chrome.webRequest.onBeforeRequest.addListener(

    function(details) {
        var tabid = details.tabId;      
      
      if (tabid >= 0) {
          chrome.tabs.get(parseInt(tabid), function (tab) {
              site = tab.url;
          });}
       
        console.log("org:"+site) 

   if(details.method == "POST" ){
            var postedString = decodeURIComponent(String.fromCharCode.apply(null,
                                      new Uint8Array(details.requestBody.raw[0].bytes)));
  
              
              postedString = postedString.replace(/\'/g, "");
              postedString= postedString.replace("{\"csp-report\":", ""); 
              postedString= postedString.replace("}}", "}"); 
              
              postedString = postedString.replace(/-/g, "_");

            console.log(postedString)
            var   postedString_obj=JSON.parse(postedString);
            var document_uri=null;
            var referrer=null;
            var violated_directive=null;
           var blocked_uri=null;
           var disposition=null;
           var effective_directive=null;
           var original_policy=null;
           var source_file=null;
           var script_sample=null;
           var Status_Code=null;
           var line_number=null;
           var column_number=null;
           var contents=null;
           var page_num=site_num;
           if(postedString_obj.document_uri)
           {document_uri=postedString_obj.document_uri;}

           if(postedString_obj.referrer)
           {referrer=postedString_obj.referrer;}

           if(postedString_obj.violated_directive)
           {violated_directive=postedString_obj.violated_directive;}

           if(postedString_obj.blocked_uri)
           {blocked_uri=postedString_obj.blocked_uri;}

           if(postedString_obj.disposition)
          {disposition=postedString_obj.disposition;}

           if(postedString_obj.effective_directive)
           {effective_directive=postedString_obj.effective_directive;}

           if(postedString_obj.original_policy)
          {original_policy=postedString_obj.original_policy;}

           if(postedString_obj.source_file)
           {source_file=postedString_obj.source_file;}

           if(postedString_obj.script_sample)
           {script_sample=postedString_obj.script_sample;}

           if(postedString_obj.status_code)
           { Status_Code=postedString_obj.status_code;}

           if(postedString_obj.document_uri)
          { line_number=postedString_obj.line_number;}

           if(postedString_obj.line_number)
           { column_number= postedString_obj.column_number;}          


           if(blocked_uri=="eval" || blocked_uri=="inline"){
              contents="script";
           }
           else{contents="url_src";}
           ////////////////////////////////////////////////////////////////////////download resources
           //////////////////////////////////////////////////////////////////////////////////////////////
       db.transaction(function (tx) { 
                              var sqlstring="INSERT INTO LOGS_1 (id,document_uri, referrer,violated_directive,blocked_uri,disposition, effective_directive,original_policy,script_sample,Status_Code,from_site,line_number,column_number,content,source_file) VALUES ("+id+",'"+document_uri+"','"+referrer+"','"+violated_directive+"','"+blocked_uri+"','"+disposition+"','"+effective_directive+"','"+original_policy+"','"+script_sample+"','"+Status_Code+"','"+site+"','"+line_number+"','"+column_number+"','"+contents+"','"+source_file+"')";
                tx.executeSql(sqlstring); 
             id++;   
                               
            })
            
            
        }
    },
   
      { urls:["https://cysecurity.mines.edu:8049/*"],types:["csp_report"]},
          [
		"blocking","requestBody"
	  ]
);*/
/////////////////////////////////////////

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
details.requestHeaders.push({"name":"site_num","value":details.timeStamp.toString()});

    return {requestHeaders: details.requestHeaders};
  },
   { urls:["https://cysecurity.mines.edu:8049/*"],types:["csp_report"]},
  ["blocking", "requestHeaders"]);


chrome.webRequest.onHeadersReceived.addListener(callback, filter, ["blocking", "responseHeaders"]);

chrome.webRequest.onResponseStarted.addListener(function(details){
   console.log("details.url:"+details.url+" status code:"+ details.statusCode);
      
      var x=details.url;
            if(details.url.split("/")[0]=="http:"){x= details.url.replace("http://","https://");} 
            x=x.replace("/?","?");
            if(x.match("#")){x=x.substring(0, x.indexOf("#"));}
            if(x.match("@")){x=x.substring(0, x.indexOf("@"));}
            if(x[x.length-1]=="/"){x=x.substring(0, x.length - 1);}

      if(b_newURL.indexOf(x)>-1){
      db.transaction(function (tx) { 
                  var sqlstring="INSERT INTO Status_Code_1 (id,siteurl,StatusC) VALUES ("+site_num+",'"+details.url+"','"+details.statusCode+"')";               
                   tx.executeSql(sqlstring); 
                 })
   }
},
{
 urls: ["<all_urls>"]
},
["responseHeaders"]);

function crawl_page(nurl){ 
   chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs){
        	chrome.tabs.update(tabs[0].id, {'url': nurl});
                tabid=tabs[0].id;
   })   
}
