const VERSION='udt-trainer-5.1.0-loaders-srs';
const CACHE=VERSION;
const ASSETS=["./", "./index.html", "./style.css", "./app.js", "./enhancements.js", "./udt4.js", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./crane_questions_1.js", "./crane_questions_2.js", "./crane_questions_3.js", "./crane_questions_4.js", "./excavator_questions_1.js", "./backhoe_questions_1.js", "./loader_questions_1.js", "./questions_init.js"];
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
  event.respondWith(caches.match(req).then(cached=>{
    const network=fetch(req).then(res=>{
      if(res&&res.ok) caches.open(CACHE).then(c=>c.put(req,res.clone()));
      return res;
    }).catch(()=>cached);
    return cached||network;
  }));
});
self.addEventListener('message',event=>{if(event.data==='SKIP_WAITING')self.skipWaiting();});
