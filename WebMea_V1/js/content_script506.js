 var site;
 var crawl_num=15; 
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
       allsite=document.getElementsByTagName('a')
       var num_allu1=0;
       var all_usite_1=[];
       for(var a of allsite){ 
         all_usite_1[num_allu1] = a.href.split('#')[0];
         //all_usite_1[num_allu1] = all_usite_1[num_allu1] .split('?')[0];
        num_allu1++;
       }
       all_usite_1=[...new Set(all_usite_1)];



     var n=0;
     var all_usite_2=[]
     var all_usite_3=[]
     for(var a of all_usite_1){       
       if((a.match(site)) && (a.split('?')[0]!=location.href.split('?')[0]) && (a!=location.href.split('#')[0]) && a.match("http")){
        all_usite_2[n]=a;
        //console.log(" "+a+" aaa");
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
     console.log("all_usite_2 length:"+all_usite_2.length)
     
     for(var i=0;i<all_usite_2.length;i++){
         all_usite_3[i]=all_usite_2[i].split('?')[0];
      }
     all_usite_3=[...new Set(all_usite_3)];
     console.log("all_usite_3 length:"+all_usite_3.length)

     for(i=0;i<all_usite_2.length;i++){ 
        var site_short= all_usite_2[i].split('?')[0];
        if(all_usite_3.indexOf(site_short)>-1){ 
          all_usite.push(all_usite_2[i])
          all_usite_3.splice(all_usite_3.indexOf(site_short),1)
        }
     }
      
     
     console.log("all_usite length:"+all_usite.length)
     all_usite=[...new Set(all_usite)];
     console.log("shuffled all_usite length:"+all_usite.length)
     shuffle(all_usite);


     if(all_usite.length<crawl_num){
       crawl_num=all_usite.length;     
     }
     console.log("crawl length:"+ crawl_num) 

     var num=0;   
     var greets='';
     if(crawl_num>0){
       for(var i=0;i<crawl_num;i++){        
         if(i==crawl_num-1){greets=greets+ all_usite[i];}
         else{greets=greets+ all_usite[i]+" ";}
                     
        }
        chrome.runtime.sendMessage(
                        {greeting: greets}, function(response) {
                                           console.log("send "+greets);});  
     }
     else{console.log("send no links!");}
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


