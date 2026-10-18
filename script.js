/* Add future series here. Only verified data: title, slug, cover (URL of the official cover), alt, summary. */
var SERIES=[{slug:"the-last-ember",href:"/the-last-ember/",title:"The Last Ember",cover:"/the-last-ember/assets/the-last-ember-cover-900.webp",alt:"Official cover of The Last Ember series",summary:""},{slug:"the-undead-nightmare",title:"The Undead Nightmare",cover:"",alt:"Official cover of The Undead Nightmare",summary:""}];

var $=function(i){return document.getElementById(i)};
var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
var seen=false;try{seen=sessionStorage.getItem("gs-intro")==="1"}catch(e){}
var timer=null;

function coverHTML(s){
  return s.cover?'<img src="'+s.cover+'" alt="'+s.alt+'" loading="lazy">'
  :'<small>Official cover<br>not yet supplied</small>';
}
function buildGrid(){
  $("grid").innerHTML=SERIES.map(function(s){
    return '<a class="card" href="'+(s.href||('#/reader/'+s.slug))+'" aria-label="Open series: '+s.title+'"><div class="cover">'+coverHTML(s)+'</div><h3>'+s.title+'</h3><span class="hint">Open series →</span></a>';
  }).join("");
}
function show(id){
  document.querySelectorAll(".view").forEach(function(v){v.classList.toggle("on",v.id===id)});
  window.scrollTo(0,0);
  var h=document.querySelector("#"+id+" h1, #"+id+" h2");if(h){h.setAttribute("tabindex","-1")}
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
    if(s){
      $("ser-cover").innerHTML=coverHTML(s);
      $("ser-title").textContent=s.title;
      $("ser-body").textContent=s.summary;
      return show("series");
    }
  }
  location.replace("#/select");
}
$("skip").addEventListener("click",endIntro);
addEventListener("hashchange",route);
buildGrid();route();
