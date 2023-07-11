console.log("meta_test!!!!");
var metas = document.getElementsByTagName('meta'); 
var metaArr = [];
var metaArr2="";
metaArr.push(location.href);
    for (var i=0; i<metas.length; i++) { 
	var httpequiv = metas[i].getAttribute("http-equiv");
	var content = metas[i].getAttribute("content");
	if(httpequiv != null){
	if( ('content-security-policy' === httpequiv.toLowerCase() ||  'content-security-policy-report-only' === httpequiv.toLowerCase())){
          metaArr.push([httpequiv, content]);}
     }}
if(metaArr.length<2){metaArr.push(["none_csp"])}
for(var i=0;i<metaArr.length;i++){
 if(i==0) {metaArr2=metaArr[i];} else{metaArr2=metaArr2+",,"+metaArr[i];}
} 
chrome.runtime.sendMessage(
	{metacheck: metaArr2}, function(response) {console.log("send meta");});