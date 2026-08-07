
/* UDT Trainer 3.4 — PWA, offline, aktualizacje, chmura, statystyki, wyjaśnienia */
const UDT_VERSION='3.4.0';
let deferredInstallPrompt=null;
let newWorkerWaiting=null;

function ensureEnhancementUI(){
  const actions=document.querySelector('.top-actions');
  if(actions&&!document.getElementById('installBtn')){
    actions.insertAdjacentHTML('afterbegin',`<button id="installBtn" class="secondary hidden" onclick="installPWA()" title="Zainstaluj aplikację">📲 <span>Instaluj</span></button><button id="updateBtn" class="secondary hidden" onclick="applyAppUpdate()" title="Dostępna aktualizacja">🔄 Aktualizuj</button><span id="netBadge" class="net-badge" title="Stan połączenia">●</span>`);
  }
  const dash=document.querySelector('.dashboard-actions');
  if(dash&&!document.getElementById('syncBtn')){
    const first=Array.from(dash.children).find(x=>x.tagName==='BUTTON');
    const wrap=document.createElement('span');
    wrap.innerHTML=`<button id="syncBtn" class="secondary" onclick="showSyncPanel()">☁️ Synchronizacja</button>`;
    dash.appendChild(wrap.firstElementChild);
  }
  if(!document.getElementById('syncPanel')){
    const app=document.querySelector('.app');
    const el=document.createElement('div'); el.id='syncPanel'; el.className='card hidden';
    el.innerHTML=`<div class="toolbar"><div><h1>☁️ Synchronizacja</h1><div class="small">Postęp wszystkich modułów możesz trzymać w prywatnym GitHub Gist.</div></div><button class="secondary" onclick="backToMenu()">Zamknij</button></div>
      <div class="sync-grid">
        <div class="field"><label>GitHub token z uprawnieniem <code>gist</code></label><input id="gistToken" type="password" autocomplete="off" placeholder="github_pat_…"><div class="small">Token jest zapisywany tylko w pamięci tej przeglądarki. Nie trafia do kodu repozytorium.</div></div>
        <div class="field"><label>ID Gista (opcjonalnie)</label><input id="gistId" placeholder="Zostaw puste — utworzymy prywatny Gist"></div>
      </div>
      <div class="row" style="margin-top:12px"><button onclick="cloudPush()">⬆️ Wyślij postępy</button><button class="secondary" onclick="cloudPull()">⬇️ Pobierz postępy</button><button class="secondary" onclick="saveSyncConfig()">Zapisz ustawienia</button></div>
      <div id="syncStatus" class="feedback" style="display:block;margin-top:12px">Synchronizacja jest opcjonalna. Eksport/import nadal działa bez konta.</div>`;
    const footer=document.querySelector('.footer'); app.insertBefore(el,footer);
  }
}

function updateNetworkBadge(){
  const b=document.getElementById('netBadge'); if(!b)return;
  const online=navigator.onLine; b.textContent=online?'● online':'● offline'; b.classList.toggle('offline',!online);
}
window.addEventListener('online',updateNetworkBadge); window.addEventListener('offline',updateNetworkBadge);
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstallPrompt=e;document.getElementById('installBtn')?.classList.remove('hidden')});
window.addEventListener('appinstalled',()=>{deferredInstallPrompt=null;document.getElementById('installBtn')?.classList.add('hidden')});
async function installPWA(){if(!deferredInstallPrompt){alert('Jeśli przycisk instalacji systemowej się nie pojawia, użyj menu przeglądarki → „Zainstaluj aplikację” / „Dodaj do ekranu głównego”.');return}deferredInstallPrompt.prompt();await deferredInstallPrompt.userChoice;deferredInstallPrompt=null;document.getElementById('installBtn')?.classList.add('hidden')}

async function registerPWA(){
 if(!('serviceWorker' in navigator)||location.protocol==='file:')return;
 try{
   const reg=await navigator.serviceWorker.register('./sw.js');
   if(reg.waiting)showUpdate(reg.waiting);
   reg.addEventListener('updatefound',()=>{const w=reg.installing;if(!w)return;w.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller)showUpdate(w)})});
   setInterval(()=>reg.update().catch(()=>{}),15*60*1000);
   document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')reg.update().catch(()=>{})});
 }catch(e){console.warn('PWA registration failed',e)}
 navigator.serviceWorker.addEventListener('controllerchange',()=>location.reload());
}
function showUpdate(worker){newWorkerWaiting=worker;document.getElementById('updateBtn')?.classList.remove('hidden')}
function applyAppUpdate(){if(newWorkerWaiting)newWorkerWaiting.postMessage('SKIP_WAITING');else location.reload()}

// --- Better stats ---
function sessionLabel(h){return h.mode==='simulator'?'symulator':h.mode==='exam'?'egzamin':'nauka'}
function enhancedStatsHTML(){
 const vals=Object.values(state.stats),attempts=vals.reduce((a,x)=>a+x.attempts,0),corrects=vals.reduce((a,x)=>a+x.correct,0),seen=vals.filter(x=>x.attempts>0).length;
 const hard=QUESTIONS.filter(q=>(state.stats[q.id]?.attempts||0)>0).sort((a,b)=>smartWeight(b)-smartWeight(a)).slice(0,10);
 const fav=state.favorites.length, notes=Object.keys(state.notes||{}).length;
 let html=`<div class="row"><div class="stat"><span class="small">Łączne odpowiedzi</span><b>${attempts}</b></div><div class="stat"><span class="small">Skuteczność</span><b>${attempts?Math.round(corrects/attempts*100):0}%</b></div><div class="stat"><span class="small">Przerobione</span><b>${seen}/${QUESTIONS.length}</b></div><div class="stat"><span class="small">Opanowanie</span><b>${masteryPercent()}%</b></div><div class="stat"><span class="small">⭐ Ulubione</span><b>${fav}</b></div><div class="stat"><span class="small">📝 Notatki</span><b>${notes}</b></div></div>`;
 html+=`<div class="charts-grid"><div class="chart-card"><h2>📈 Ostatnie wyniki</h2><canvas id="resultsChart" width="800" height="300"></canvas></div><div class="chart-card"><h2>📅 Aktywność 14 dni</h2><canvas id="activityChart" width="800" height="300"></canvas></div></div>`;
 html+=`<h2>Najtrudniejsze pytania</h2>`+(hard.length?hard.map(q=>{const x=state.stats[q.id];return `<div class="history-item" onclick="openQuestionDetail(${q.id})" style="cursor:pointer"><span>Pytanie ${q.id}</span><b>${Math.round(x.correct/x.attempts*100)}% (${x.attempts} prób)</b></div>`}).join(''):'<p class="small">Brak danych.</p>');
 html+=`<h2>Historia testów</h2>`+(state.history.length?state.history.map(h=>`<div class="history-item"><span>${new Date(h.date).toLocaleString('pl-PL')} • ${sessionLabel(h)} • ${h.count} pytań</span><b>${h.pct}%</b></div>`).join(''):'<p class="small">Brak ukończonych testów.</p>');
 return html;
}
function drawLineChart(canvas,values,labels){
 if(!canvas)return; const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height,p=42;ctx.clearRect(0,0,w,h);const css=getComputedStyle(document.documentElement),fg=css.getPropertyValue('--text').trim()||'#fff',muted=css.getPropertyValue('--muted').trim()||'#999',accent=css.getPropertyValue('--accent').trim()||'#4b8cff';ctx.font='24px sans-serif';ctx.fillStyle=muted;ctx.strokeStyle=muted;ctx.lineWidth=1;
 [0,25,50,75,100].forEach(v=>{const y=h-p-(h-2*p)*v/100;ctx.globalAlpha=.25;ctx.beginPath();ctx.moveTo(p,y);ctx.lineTo(w-p,y);ctx.stroke();ctx.globalAlpha=1;ctx.fillText(v+'%',3,y+8)});
 if(!values.length){ctx.fillStyle=muted;ctx.fillText('Brak danych',p,h/2);return}
 ctx.strokeStyle=accent;ctx.lineWidth=5;ctx.beginPath();values.forEach((v,i)=>{const x=p+(w-2*p)*(values.length===1?.5:i/(values.length-1)),y=h-p-(h-2*p)*v/100;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke();ctx.fillStyle=accent;values.forEach((v,i)=>{const x=p+(w-2*p)*(values.length===1?.5:i/(values.length-1)),y=h-p-(h-2*p)*v/100;ctx.beginPath();ctx.arc(x,y,7,0,Math.PI*2);ctx.fill()});
}
function drawBars(canvas,values,labels){
 if(!canvas)return;const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height,p=45,max=Math.max(1,...values),css=getComputedStyle(document.documentElement),muted=css.getPropertyValue('--muted').trim()||'#999',accent=css.getPropertyValue('--accent').trim()||'#4b8cff';ctx.clearRect(0,0,w,h);const gap=8,bw=(w-2*p)/Math.max(1,values.length)-gap;ctx.fillStyle=accent;values.forEach((v,i)=>{const bh=(h-2*p)*v/max,x=p+i*(bw+gap),y=h-p-bh;ctx.fillRect(x,y,Math.max(2,bw),bh)});ctx.fillStyle=muted;ctx.font='18px sans-serif';labels.forEach((l,i)=>{if(i%2===0)ctx.fillText(l,p+i*(bw+gap),h-12)})
}
const originalUpdateMachineUI=window.updateMachineUI;
window.updateMachineUI=function(){originalUpdateMachineUI();const bh=document.querySelector('#browser h1');if(bh)bh.textContent=`Baza ${QUESTIONS.length} pytań`;__searchCacheMachine=null;}

const originalShowStats=window.showStats;
window.showStats=function(){hideMainPanels();document.getElementById('stats').classList.remove('hidden');document.getElementById('statsBody').innerHTML=enhancedStatsHTML();requestAnimationFrame(()=>{const hist=[...state.history].reverse().slice(-12);drawLineChart(document.getElementById('resultsChart'),hist.map(h=>h.pct),hist.map(h=>h.date));const days=[];for(let i=13;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);days.push(d.toISOString().slice(0,10))}const counts=days.map(d=>state.studyDays.filter(x=>x===d).length);drawBars(document.getElementById('activityChart'),counts,days.map(d=>d.slice(5)))})}

// --- Favorites in question detail + local smart explanation ---
function localExplanation(q,selectedIndex=null){
 const correct=clean(q.a[q.correct]||q.correctText||'');
 let txt=`Poprawna odpowiedź to ${letter(q.correct)}: „${correct}”. `;
 const qtxt=clean(q.q);
 if(/minimal|odległo|dopuszczal|bezpiecz/i.test(qtxt))txt+='To pytanie sprawdza konkretną wartość lub warunek bezpieczeństwa — na egzaminie zwracaj uwagę na słowa „minimalna”, „bezpieczna” i jednostki. ';
 else if(/zabron|dozwol|wolno|należy|powin/i.test(qtxt))txt+='To pytanie dotyczy zasady lub obowiązku. Najważniejsze jest rozróżnienie tego, co jest wymagane, dozwolone i zabronione. ';
 else if(/olej|silnik|hydraul|ciśn|smar/i.test(qtxt))txt+='To pytanie dotyczy eksploatacji maszyny. Szukaj odpowiedzi, która chroni układ przed zużyciem, przegrzaniem lub uszkodzeniem. ';
 else txt+='Zapamiętaj przede wszystkim związek między treścią pytania a dokładnym sformułowaniem poprawnej odpowiedzi. ';
 if(selectedIndex!==null&&selectedIndex!==undefined&&selectedIndex!==q.correct)txt+=`Wybrana przez Ciebie odpowiedź ${letter(selectedIndex)} różni się od klucza. Porównaj oba sformułowania — w testach UDT pojedyncze słowo lub wartość często przesądza o wyniku.`;
 return txt;
}
function showExplanation(id,selectedIndex=null){const q=QUESTIONS.find(x=>x.id===id);if(!q)return;const target=document.getElementById('explainBox')||document.getElementById('feedback');if(!target)return;target.className='feedback explain-box';target.style.display='block';target.innerHTML=`<b>🤖 Wyjaśnienie</b><div>${escapeHtml(localExplanation(q,selectedIndex))}</div><div class="small">Tryb lokalny — działa również offline.</div>`}
const originalOpenQuestionDetail=window.openQuestionDetail;
window.openQuestionDetail=function(id){originalOpenQuestionDetail(id);const q=QUESTIONS.find(x=>x.id===id);const panel=document.getElementById('questionDetail');if(!panel||!q)return;const isFav=state.favorites.includes(id);panel.insertAdjacentHTML('beforeend',`<div id="explainBox" class="feedback explain-box" style="display:none"></div><div class="row" style="margin-top:10px"><button class="secondary" onclick="toggleDetailFavorite(${id})">${isFav?'★ Usuń z ulubionych':'☆ Dodaj do ulubionych'}</button><button class="secondary" onclick="showExplanation(${id})">🤖 Wyjaśnij odpowiedź</button></div>`)}
function toggleDetailFavorite(id){const i=state.favorites.indexOf(id);if(i>=0)state.favorites.splice(i,1);else state.favorites.push(id);saveState();openQuestionDetail(id)}

// Add explanation button to learning feedback after answering.
const originalChoose=window.choose;
window.choose=function(idx){originalChoose(idx);if(!examSimulator&&answered){const item=pool[current];const fb=document.getElementById('feedback');if(fb&&!document.getElementById('learnExplainBtn'))fb.insertAdjacentHTML('beforeend',`<div><button id="learnExplainBtn" class="secondary mini-btn" onclick="showExplanation(${item.id},${idx})">🤖 Wyjaśnij</button></div>`)}}

// --- Cloud sync using a private GitHub Gist ---
function syncConfig(){return {token:localStorage.getItem('udt_gist_token')||'',gistId:localStorage.getItem('udt_gist_id')||''}}
function fillSyncConfig(){const c=syncConfig();const t=document.getElementById('gistToken'),g=document.getElementById('gistId');if(t)t.value=c.token;if(g)g.value=c.gistId}
function saveSyncConfig(){const t=document.getElementById('gistToken')?.value.trim()||'',g=document.getElementById('gistId')?.value.trim()||'';if(t)localStorage.setItem('udt_gist_token',t);else localStorage.removeItem('udt_gist_token');if(g)localStorage.setItem('udt_gist_id',g);else localStorage.removeItem('udt_gist_id');setSyncStatus('Ustawienia synchronizacji zapisane.','good')}
function setSyncStatus(msg,type=''){const b=document.getElementById('syncStatus');if(!b)return;b.className='feedback '+type;b.style.display='block';b.textContent=msg}
function showSyncPanel(){saveCurrentNote?.();hideMainPanels();document.getElementById('syncPanel').classList.remove('hidden');fillSyncConfig()}
function allProgressPayload(){const data={version:UDT_VERSION,exportedAt:new Date().toISOString(),activeMachine,modules:{}};for(const [id,m] of Object.entries(MACHINE_META)){try{data.modules[id]=JSON.parse(localStorage.getItem(m.key)||'null')||defaultState()}catch{data.modules[id]=defaultState()}}return data}
async function githubReq(path,opts={}){const token=document.getElementById('gistToken')?.value.trim()||syncConfig().token;if(!token)throw new Error('Najpierw wpisz token GitHub z uprawnieniem gist.');const r=await fetch('https://api.github.com'+path,{...opts,headers:{'Accept':'application/vnd.github+json','Authorization':'Bearer '+token,'X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json',...(opts.headers||{})}});if(!r.ok)throw new Error(`GitHub: ${r.status} ${await r.text()}`);return r.json()}
async function cloudPush(){try{saveSyncConfig();setSyncStatus('Wysyłam postępy…');const payload=JSON.stringify(allProgressPayload());let id=document.getElementById('gistId').value.trim();let res;if(id)res=await githubReq('/gists/'+encodeURIComponent(id),{method:'PATCH',body:JSON.stringify({files:{'udt-trainer-progress.json':{content:payload}}})});else{res=await githubReq('/gists',{method:'POST',body:JSON.stringify({description:'UDT Trainer — prywatna synchronizacja postępów',public:false,files:{'udt-trainer-progress.json':{content:payload}}})});id=res.id;document.getElementById('gistId').value=id;localStorage.setItem('udt_gist_id',id)}setSyncStatus('✅ Postępy wysłane do prywatnego Gista.','good')}catch(e){setSyncStatus('❌ '+e.message,'bad')}}
async function cloudPull(){try{saveSyncConfig();const id=document.getElementById('gistId').value.trim();if(!id)throw new Error('Brak ID Gista. Najpierw wykonaj wysyłanie albo wpisz jego ID.');setSyncStatus('Pobieram postępy…');const res=await githubReq('/gists/'+encodeURIComponent(id));const f=res.files?.['udt-trainer-progress.json'];if(!f)throw new Error('W Giście nie ma pliku udt-trainer-progress.json.');const data=JSON.parse(f.content);if(!data.modules)throw new Error('Nieprawidłowy format kopii.');for(const [mid,st] of Object.entries(data.modules)){if(MACHINE_META[mid])localStorage.setItem(MACHINE_META[mid].key,JSON.stringify(st))}if(data.activeMachine&&MACHINE_META[data.activeMachine])localStorage.setItem('udt_active_machine',data.activeMachine);state=loadState();updateDashboard();updatePoolInfo();setSyncStatus('✅ Postępy pobrane. Odświeżam aplikację…','good');setTimeout(()=>location.reload(),700)}catch(e){setSyncStatus('❌ '+e.message,'bad')}}

// preserve sync panel when hiding main panels
const originalHideMainPanels=window.hideMainPanels;
window.hideMainPanels=function(){originalHideMainPanels();document.getElementById('syncPanel')?.classList.add('hidden')}
const originalBackToMenu=window.backToMenu;
window.backToMenu=function(){document.getElementById('syncPanel')?.classList.add('hidden');originalBackToMenu()}

// Search keyboard shortcut and faster normalized cache
let __searchCacheMachine=null,__searchCache=[];
function buildSearchCache(){if(__searchCacheMachine===activeMachine&&__searchCache.length===QUESTIONS.length)return;__searchCacheMachine=activeMachine;__searchCache=QUESTIONS.map(q=>({q,text:(String(q.id)+' '+clean(q.q)+' '+q.a.map(clean).join(' ')).toLowerCase()}))}
const originalRenderQuestionBrowser=window.renderQuestionBrowser;
window.renderQuestionBrowser=function(){buildSearchCache();const inp=document.getElementById('questionSearch'),sel=document.getElementById('questionStatus');if(!inp||!sel)return;const term=clean(inp.value).toLowerCase(),status=sel.value;let list=__searchCache.filter(x=>!term||x.text.includes(term)).map(x=>x.q);if(status==='notes')list=list.filter(q=>state.notes[q.id]);else if(status==='favorites')list=list.filter(q=>state.favorites.includes(q.id));else if(status!=='all')list=list.filter(q=>questionStatus(q)===status);document.getElementById('questionList').innerHTML=list.slice(0,300).map(q=>{const st=questionStatus(q),x=state.stats[q.id],score=x?`${Math.round(x.correct/x.attempts*100)}%`:'—';return `<div class="q-row" onclick="openQuestionDetail(${q.id})"><span class="q-dot ${st}"></span><div class="q-preview"><b>${state.favorites.includes(q.id)?'★ ':''}Pytanie ${q.id}${state.notes[q.id]?' 📝':''}</b><span>${escapeHtml(clean(q.q))}</span></div><b>${score}</b></div>`}).join('')+(list.length>300?`<p class="small">Pokazano pierwsze 300 z ${list.length} wyników — zawęź wyszukiwanie.</p>`:'')}

document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();showQuestionBrowser();setTimeout(()=>document.getElementById('questionSearch')?.focus(),0)}});

window.addEventListener('DOMContentLoaded',()=>{ensureEnhancementUI();updateNetworkBadge();registerPWA();document.title=`UDT Trainer ${UDT_VERSION} Multi — trener operatora`;const h=document.getElementById('appTitle');if(h)h.textContent=`UDT Trainer ${UDT_VERSION} Multi`;const foot=document.querySelector('.footer');if(foot)foot.textContent=`UDT Trainer ${UDT_VERSION} Multi — PWA offline z automatycznymi aktualizacjami. Dane modułów są zapisywane osobno.`;});
