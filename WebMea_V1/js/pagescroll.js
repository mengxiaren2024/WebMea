var tscroll;
tscroll=setInterval(function(){
       console.log("page scroll!")
       var scrollingElement = (document.scrollingElement || document.body);
       scrollingElement.scrollTop = scrollingElement.scrollHeight;
       clearTimeout(tscroll);}   ,15000); 
