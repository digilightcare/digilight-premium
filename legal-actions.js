(function(){
  'use strict';
  function init(){
    var root=document.querySelector('.legal-wrap,.terms-layout');
    if(!root || root.querySelector('.legal-actions')) return;
    var title=(document.querySelector('.legal-hero h1,.terms-hero h1,h1')||{}).textContent||document.title;
    title=title.trim();
    var actions=document.createElement('div');
    actions.className='legal-actions';
    actions.setAttribute('aria-label','Document actions');
    actions.innerHTML='<span class="legal-actions-label">Digilight India · Official policy copy</span><button type="button" class="legal-action-btn" data-action="print">Print / Save PDF</button><button type="button" class="legal-action-btn" data-action="share">Share policy</button>';
    root.insertBefore(actions,root.firstChild);
    var note=root.querySelector('.legal-note,.terms-intro');
    var version=note?note.innerText.replace(/\s+/g,' ').trim():'';
    var footer=document.createElement('div');
    footer.className='legal-copyright';
    footer.textContent='© '+new Date().getFullYear()+' Digilight India. All rights reserved. · '+title+' · '+(version.match(/Version\s+[\d.]+/i)||['Current published version'])[0];
    root.appendChild(footer);
    actions.addEventListener('click',function(e){
      var btn=e.target.closest('button[data-action]');
      if(!btn)return;
      if(btn.dataset.action==='print'){window.print();return;}
      if(btn.dataset.action==='share'){
        var payload={title:title,text:'Read '+title+' published by Digilight India.',url:window.location.href};
        if(navigator.share){navigator.share(payload).catch(function(){});}
        else if(navigator.clipboard&&navigator.clipboard.writeText){
          navigator.clipboard.writeText(window.location.href).then(function(){btn.textContent='Link copied';setTimeout(function(){btn.textContent='Share policy';},1800);}).catch(function(){window.prompt('Copy this policy link:',window.location.href);});
        }else{window.prompt('Copy this policy link:',window.location.href);}
      }
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();