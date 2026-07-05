/* LAYER'D — shared behavior for sub-pages */
(function(){
  "use strict";

  /* ---------- CURSOR ---------- */
  var cur=document.getElementById('cur'),curt=document.getElementById('curt');
  var isT=matchMedia('(hover:none)').matches||'ontouchstart' in window;
  function lp(a,b,t){return a+(b-a)*t}
  if(cur&&curt&&!isT){
    var cx=innerWidth/2,cy=innerHeight/2,rx=cx,ry=cy;
    addEventListener('mousemove',function(e){cx=e.clientX;cy=e.clientY;cur.style.left=cx+'px';cur.style.top=cy+'px';});
    (function loop(){rx=lp(rx,cx,.15);ry=lp(ry,cy,.15);curt.style.left=rx+'px';curt.style.top=ry+'px';requestAnimationFrame(loop);})();
    var HS='a,button,.cell,.pcard,.mq,input,[data-nav],[data-hoverable]';
    document.addEventListener('mouseover',function(e){if(e.target.closest(HS))document.body.classList.add('ch');});
    document.addEventListener('mouseout',function(e){if(e.target.closest(HS))document.body.classList.remove('ch');});
    document.addEventListener('mousedown',function(){document.body.classList.add('cc');});
    document.addEventListener('mouseup',function(){document.body.classList.remove('cc');});
  }

  /* ---------- PAGE WIPE TRANSITIONS (keeps the site's transition motif across pages) ---------- */
  var pwipe=document.getElementById('pwipe');
  if(pwipe){
    requestAnimationFrame(function(){
      pwipe.classList.add('entering');
      setTimeout(function(){pwipe.style.display='none';},700);
    });
    document.querySelectorAll('[data-nav]').forEach(function(el){
      el.addEventListener('click',function(ev){
        var href=el.getAttribute('href')||el.dataset.nav;
        if(!href||el.target==='_blank')return;
        ev.preventDefault();
        pwipe.style.display='flex';
        pwipe.classList.remove('entering');
        pwipe.classList.add('leaving');
        setTimeout(function(){window.location.href=href;},560);
      });
    });
  }

  /* ---------- SCROLL REVEAL ---------- */
  var els=document.querySelectorAll('.reveal');
  if(els.length){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});
    },{threshold:.15,rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(el){io.observe(el);});
  }

  /* ---------- AMBIENT FLOATERS ---------- */
  var fl=document.querySelector('.floaters');
  if(fl){
    var cols=['#D94F1E','#C5D400','#BBA8D6','#4E6FD4'];
    for(var i=0;i<5;i++){
      var d=document.createElement('i');
      var s=Math.random()*260+160;
      d.style.width=s+'px';d.style.height=s+'px';
      d.style.left=(Math.random()*90)+'%';d.style.top=(Math.random()*90)+'%';
      d.style.background=cols[i%cols.length];
      d.style.animationDuration=(18+Math.random()*14)+'s';
      d.style.animationDelay=(-Math.random()*10)+'s';
      fl.appendChild(d);
    }
  }

  /* ---------- NOTIFY FORM ---------- */
  document.querySelectorAll('[data-notify-form]').forEach(function(form){
    var input=form.querySelector('input[type=email]');
    var btn=form.querySelector('button');
    var msg=form.parentElement.querySelector('.notifymsg')||form.querySelector('.notifymsg');
    if(!btn)return;
    btn.addEventListener('click',function(){
      var v=(input.value||'').trim();
      if(v&&/\S+@\S+\.\S+/.test(v)){
        msg.textContent='Anotado! Você será avisado assim que os planos abrirem.';
        msg.style.color='var(--gr)';
        input.value='';
      }else{
        msg.textContent='Digita um e-mail válido, por favor.';
        msg.style.color='var(--or)';
      }
    });
    input&&input.addEventListener('keydown',function(e){if(e.key==='Enter')btn.click();});
  });

})();
