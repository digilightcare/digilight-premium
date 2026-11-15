(function(){
 function initLegalNavigation(){
  var layout=document.querySelector('.legal-layout');
  if(!layout)return;
  var quick=document.getElementById('legalQuickNav');
  var sections=Array.prototype.slice.call(layout.querySelectorAll('.legal-wrap > .legal-section,.terms-layout > .terms-section'));
  if(quick){
   sections.forEach(function(section,index){
    var heading=section.querySelector('h2');
    if(!heading)return;
    var id='legal-section-'+(index+1);
    section.id=id;
    var link=document.createElement('a');
    link.href='#'+id;
    link.textContent=heading.textContent.trim();
    quick.appendChild(link);
   });
  }
  var links=Array.prototype.slice.call(document.querySelectorAll('#legalQuickNav a'));
  if('IntersectionObserver' in window && links.length){
   var observer=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
     if(entry.isIntersecting)links.forEach(function(link){link.classList.toggle('active',link.getAttribute('href')==='#'+entry.target.id);});
    });
   },{rootMargin:'-18% 0px -68% 0px',threshold:0});
   sections.forEach(function(section){if(section.id)observer.observe(section);});
  }
  var current=location.pathname.split('/').pop()||'legal.html';
  document.querySelectorAll('[data-policy-link]').forEach(function(link){
   var href=link.getAttribute('href');
   if(href===('/'+current)||href===current)link.classList.add('active');
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initLegalNavigation);else initLegalNavigation();
})();