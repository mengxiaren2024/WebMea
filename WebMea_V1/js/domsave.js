
var DomArr2;
var doc=new XMLSerializer().serializeToString(document)
DomArr2 = JSON.stringify({"siteurl":location.href,
               //  "dom": document.documentElement.innerHTML
               "dom": doc
})

chrome.runtime.sendMessage(                     
                     { dom: DomArr2}, function(response) {
                                           
//console.log(document.body.innerHTML); 
console.log("dom:"+DomArr2);
//console.log(window.document); 

////write dom into a file.


console.log("send dom!");});
