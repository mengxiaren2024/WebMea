 var num=0;
 var site;
 var crawl_num=10; 
 site=location.hostname;
 console.log("crawl_page:" + location.href);
hrefnum=document.getElementsByTagName('a');
if(hrefnum.length==0){
     var str="there is no subhref in site:"+site;
     chrome.runtime.sendMessage(                     
                      {siteinfo: str}, function(response) {
                                           console.log("send ");});
}
else{
     if(hrefnum.length<crawl_num){
       crawl_num=hrefnum.length;      
     }
     var str="there are "+crawl_num+" hrefs in site:"+site;
     chrome.runtime.sendMessage(                     
                      {siteinfo: str}, function(response) {
                                           console.log("send ");});

     for(var a of document.getElementsByTagName('a')){
           console.log(" "+a.href+" num="+num);
           if(num==crawl_num || num>crawl_num){break;}
           else{
                var sub_path=a.href.split('?')[0]
                if((sub_path.match(site)) && (a.href.split('#')[0]!=location.href.split('#')[0]) && a.href.match("http")){
                  sub_path=sub_path.split('#')[0]
                  var greets=a.href+","+sub_path  
                  chrome.runtime.sendMessage(
                      {greeting: greets}, function(response) {
                                           console.log("send "+greets+" num="+num);});
                   num++;
              }
           }
     }

     
}

 