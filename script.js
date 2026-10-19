/* Series registry for the Reader library. Each series has its own dedicated page (href).
   Add future series here only with verified data. */
var SERIES=[{slug:"the-last-ember",href:"/the-last-ember/",title:"The Last Ember",cover:"/the-last-ember/assets/the-last-ember-cover-900.webp",alt:"Official cover of The Last Ember series"}];
/* Legacy hash links (#/reader/<slug>) are forwarded to the canonical page. "the-undead-nightmare" is the former series name. */
var LEGACY={"the-undead-nightmare":"/the-last-ember/"};

var $=function(i){return document.getElementById(i)};
var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
var seen=false;try{seen=sessionStorage.getItem("gs-intro")==="1"}catch(e){}
var timer=null;

function buildGrid(){
  $("grid").innerHTML=SERIES.map(function(s){
    return '<a class="card" href="'+s.href+'" aria-label="Open series: '+s.title+'"><div class="cover"><img src="'+s.cover+'" alt="'+s.alt+'" loading="lazy"></div><h3>'+s.title+'</h3><span class="hint">Open series →</span></a>';
  }).join("");
}
function show(id){
  document.querySelectorAll(".view").forEach(function(v){v.classList.toggle("on",v.id===id)});
  window.scrollTo(0,0);
}
function endIntro(){
  clearTimeout(timer);
  try{sessionStorage.setItem("gs-intro","1")}catch(e){}
  var i=$("intro");
  if(!i.classList.contains("on")){return}
  if(reduce){location.replace("#/select");return}
  i.classList.add("out");
  setTimeout(function(){i.classList.remove("out");location.hash="#/select"},900);
}
function route(){
  var h=location.hash.replace(/^#\/?/,"");
  clearTimeout(timer);
  if(h===""){
    if(seen||reduce){return location.replace("#/select")}
    show("intro");timer=setTimeout(endIntro,5600);return;
  }
  if(h==="select"){seen=true;return show("select")}
  if(h==="reader"){seen=true;return show("reader")}
  if(h==="player"){seen=true;return show("player")}
  var m=h.match(/^reader\/(.+)$/);
  if(m){
    var s=SERIES.filter(function(x){return x.slug===m[1]})[0];
    var dest=s?s.href:LEGACY[m[1]];
    if(dest){return location.replace(dest)}
    return location.replace("#/reader");
  }
  location.replace("#/select");
}
$("skip").addEventListener("click",endIntro);
addEventListener("hashchange",route);
buildGrid();route();
