const VERSION='udt-trainer-6.3.3-tech-plan-fix';
const CACHE=VERSION;
const ASSETS=[
  './','./index.html','./reset.html','./style.css?v=6.3.3-tech-plan-fix',
  './app.js?v=6.3.3-tech-plan-fix','./enhancements.js?v=6.3.3-tech-plan-fix','./udt4.js?v=6.3.3-tech-plan-fix',
  './manifest.webmanifest','./icon-192.png','./icon-512.png',
  './crane_questions_1.js','./crane_questions_2.js','./crane_questions_3.js','./crane_questions_4.js',
  './excavator_questions_1.js','./backhoe_questions_1.js','./loader_questions_1.js',
  './questions_init.js?v=6.3.3-tech-plan-fix','./oral_tasks.js?v=6.3.3-tech-plan-fix',
  './technology_tasks.js?v=6.3.3-tech-plan-fix','./oral_trainer.js?v=6.3.3-tech-plan-fix',
  './oral_ai.js?v=6.3.3-tech-plan-fix','./academy.js?v=6.3.3-tech-plan-fix'
];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(async cache=>{
    for(const url of ASSETS){try{await cache.add(url)}catch(e){console.warn('cache skip',url,e)}}
  }).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const req=event.request;
  const url=new URL(req.url);
  if(url.origin!==location.origin)return;
  const isNavigation=req.mode==='navigate'||req.destination==='document';
  const isCode=['script','style','worker'].includes(req.destination)||/\.(?:js|css)$/.test(url.pathname);
  if(isNavigation||isCode){
    event.respondWith(fetch(req,{cache:'no-store'}).then(res=>{
      if(res&&res.ok)caches.open(CACHE).then(c=>c.put(req,res.clone()));
      return res;
    }).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(res=>{
    if(res&&res.ok)caches.open(CACHE).then(c=>c.put(req,res.clone()));
    return res;
  })));
});
self.addEventListener('message',event=>{if(event.data==='SKIP_WAITING')self.skipWaiting();});
