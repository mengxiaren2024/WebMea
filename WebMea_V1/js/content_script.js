 var site;
 var crawl_num=15; 
 var all_usite=[]
 site=location.hostname;
 console.log("crawl_page:" + location.href);
 hrefnum=document.getElementsByTagName('a');
 console.log(hrefnum.length);
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
         all_usite_1[num_allu1] = a.href;
         //all_usite_1[num_allu1] = all_usite_1[num_allu1] .split('?')[0];
        num_allu1++;
       }
       all_usite_1=[...new Set(all_usite_1)];



     var n=0;
     var all_usite_2=[]
     var all_usite_3=[]
     for(var a of all_usite_1){ 
          var b=a.split("/");
          var localhos='';
          var c=location.hostname.split(".")

          if(c[0]="www."){localhos=location.hostname.replace("www.","");}
          else{localhos=location.hostname;}  
          console.log("localhost"+localhos+" !!!");
          
           var x=location.href;
            if(location.href.split("/")[0]=="http:"){x= location.href.replace("http://","https://");}
            x=x.replace("/?","?"); 
            if(x.match("#")){x=x.substring(0, x.indexOf("#"));}
            x=x.split("?")[0];
            if(x.match("@")){x=x.substring(0, x.indexOf("@"));}
            if(x[x.length-1]=="/"){x=x.substring(0, x.length - 1);}

            var xa=a;
            if(a.split("/")[0]=="http:"){xa= a.replace("http://","https://");}
            xa=xa.replace("/?","?"); 
            if(xa.match("#")){xa=xa.substring(0, xa.indexOf("#"));}
            xa=xa.split("?")[0];
            if(xa.match("@")){xa=xa.substring(0, xa.indexOf("@"));}
            if(xa[xa.length-1]=="/"){xa=xa.substring(0, xa.length - 1);}
            

       if(b[0].match("http") && (b[2].match(localhos)) && (x!=xa)){
        all_usite_2[n]=a;
        all_usite_3[n]=xa;
          n++;
       }
     }

            all_usite_3=[...new Set(all_usite_3)];

     for(i=0;i<all_usite_2.length;i++){ 
        var xa=all_usite_2[i];
            if(all_usite_2[i].split("/")[0]=="http:"){xa= all_usite_2[i].replace("http://","https://");}
            xa=xa.replace("/?","?"); 
            if(xa.match("#")){xa=xa.substring(0, xa.indexOf("#"));}
            if(xa.match("@")){xa=xa.substring(0, xa.indexOf("@"));}
            if(xa[xa.length-1]=="/"){xa=xa.substring(0, xa.length - 1);}
            var site_short= xa.split('?')[0];
        if(all_usite_3.length>0 && all_usite_3.indexOf(site_short)>-1){ 
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


