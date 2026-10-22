// Offline support: the app opens instantly from this phone's copy, and picks up a new version in the background for next time.
const V='gym-f0eb9e8e08';
const SHELL=['./','index.html','manifest.webmanifest','icons/icon-180.png','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png','fonts/bc-600.woff2','fonts/bc-700.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
if(r.mode==='navigate'){e.respondWith(caches.open(V).then(async c=>{const hit=await c.match('index.html');const net=fetch(r).then(res=>{if(res&&res.ok)c.put('index.html',res.clone());return res}).catch(()=>null);return hit||(await net)||new Response('Offline',{status:503})}));return}
e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res})))});
