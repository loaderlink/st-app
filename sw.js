const SHELL_V='ps2-shell-v14';
const SHELL=['./','index.html','k.json','icon-180.png','icon-192.png','icon-512.png','manifest.json','wood.jpg'];
// Always fetch the app files fresh from the host (not from the browser's own 10-minute cache), so updates show up straight away.
self.addEventListener('install',e=>{e.waitUntil(caches.open(SHELL_V).then(c=>Promise.all(SHELL.map(u=>fetch(new Request(u,{cache:'reload'})).then(r=>{if(!r.ok)throw new Error(u);return c.put(u,r)})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('ps2-shell-')&&x!==SHELL_V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// The encrypted story files under d/ are never handled here: the page reads them from the device cache itself.
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin||u.pathname.includes('/d/'))return;
  e.respondWith(caches.open(SHELL_V).then(c=>c.match(e.request,{ignoreSearch:true}).then(hit=>{
    const net=fetch(e.request,{cache:'no-cache'}).then(n=>{if(n&&n.ok)c.put(e.request,n.clone());return n}).catch(()=>hit||c.match('index.html'));
    return hit||net;})));
});
