 var num=0;
 var site;
 var crawl_num=10; 
 var all_usite=[]
 site=location.hostname;
 console.log("crawl_page:" + location.href);
hrefnum=document.getElementsByTagName('a');
if(hrefnum.length==0){
     var str="there is no subhref in site:"+site;
     chrome.runtime.sendMessage(                     
                      {siteinfo: str}, function(response) {
                                           console.log("send suburl");});
}
else{
     var str="there are "+crawl_num+" hrefs in site:"+site;
     chrome.runtime.sendMessage(                     
                      {siteinfo: str}, function(response) {
                                           console.log("send suburl");});
     allsite=document.getElementsByTagName('a')
     all_usite_1=[...new Set(allsite)];
     var n=0;
     var all_usite_2=[]
     for(var a of all_usite_1){
       
       var sub_path=a.href.split('?')[0]
       
       if((sub_path.match(site)) && (a.href.split('#')[0]!=location.href.split('#')[0]) && a.href.match("http")){
        all_usite_2[n]=a.href;
        //console.log(" "+a.href+" aaa");
       n++;
       }
     }
     for(var i=0;i<all_usite_2.length;i++){
       if(all_usite_2[i].substr(all_usite_2[i].length-1,1)=="/")
        {
         var b=all_usite_2[i].substring(0, all_usite_2[i].length-1);
         console.log(b) 
         if(all_usite_2.indexOf(b)>-1){all_usite_2.splice(all_usite_2.indexOf(b),1)}
        }
      }
     all_usite=[...new Set(all_usite_2)];
    



     if(all_usite.length<crawl_num){
       crawl_num=all_usite.length;      
     }

     for(var a of all_usite){
        // console.log(" "+a+" num="+num);
           if(num==crawl_num || num>crawl_num){break;}
           else{
                        var sub_path=a.split('?')[0]
                        sub_path=sub_path.split('#')[0]
                        var greets=a+","+sub_path  
                        chrome.runtime.sendMessage(
                        {greeting: greets}, function(response) {
                                           console.log("send "+greets+" num="+num);});
                         num++;
               }
          
     }
   
}


 