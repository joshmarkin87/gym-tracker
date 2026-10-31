// Offline support: the app opens instantly from this phone's copy, and picks up a new version in the background for next time.
const V='gym-cbbf653666',PV='gym-pdf-e3ecb67c75',BT=1793425549;
const SHELL=['./','index.html','manifest.webmanifest','icons/icon-180.png','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png','fonts/bc-600.woff2','fonts/bc-700.woff2'];
// the PDF reader: kept across app versions (its own cache); a hiccup fetching it never holds up an update
const PDF=['pdf/pdf.min.js','pdf/pdf.worker.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL.map(u=>new Request(u,{cache:'reload'})))).then(()=>caches.open(PV).then(c=>Promise.all(PDF.map(u=>c.match(u).then(m=>m||c.add(new Request(u,{cache:'reload'})))))).catch(()=>{})).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!==PV).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
if(r.mode==='navigate'){const net=fetch(r.url,{cache:'no-cache',credentials:'same-origin'}).then(res=>{if(res&&res.ok&&res.status===200){const cp=res.clone();return caches.open(V).then(c=>c.put('index.html',cp)).then(()=>res,()=>res)}return res}).catch(()=>null);e.waitUntil(net);
e.respondWith(caches.open(V).then(c=>c.match('index.html')).then(hit=>hit||net.then(res=>res||new Response('Offline',{status:503}))));return}
// a URL with a query string (the update check's sw.js?u=..., Update now's index.html?u=...) goes to the network and is never kept
if(u.search)return;
e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res})))});
