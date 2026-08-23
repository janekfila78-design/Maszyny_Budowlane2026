
/* UDT Trainer 5.6.0 — PWA, offline, aktualizacje, chmura, statystyki, wyjaśnienia */
const UDT_VERSION='6.3.2';
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
   const reg=await navigator.serviceWorker.register('./sw.js?v=6.3.0-smart-explanations',{updateViaCache:'none'});
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
 const fav=state.favorites.length, notes=Object.keys(state.notes||{}).length,due=srsDueQuestions().length,mastered=QUESTIONS.filter(q=>masteryFor(q)===1).length,weak=weaknessQuestions().length;
 const exams=state.history.filter(h=>h.mode==='simulator'||h.mode==='exam'),passed=exams.filter(h=>h.pct>=75).length,best=exams.length?Math.max(...exams.map(h=>h.pct)):0;
 let html=`<div class="pro-stats-head"><div><span class="small">🧠 SRS do powtórki</span><b>${due}</b><span class="small">pytania gotowe teraz</span></div><div><span class="small">✅ Opanowane</span><b>${mastered}/${QUESTIONS.length}</b><span class="small">pełny poziom opanowania</span></div><div><span class="small">🎯 Symulatory zdane</span><b>${passed}/${exams.length}</b><span class="small">najlepszy wynik ${best}%</span></div></div>`;
 html+=`<div class="row"><div class="stat"><span class="small">Łączne odpowiedzi</span><b>${attempts}</b></div><div class="stat"><span class="small">Skuteczność</span><b>${attempts?Math.round(corrects/attempts*100):0}%</b></div><div class="stat"><span class="small">Przerobione</span><b>${seen}/${QUESTIONS.length}</b></div><div class="stat"><span class="small">Słabości</span><b>${weak}</b></div><div class="stat"><span class="small">⭐ Ulubione</span><b>${fav}</b></div><div class="stat"><span class="small">📝 Notatki</span><b>${notes}</b></div></div>`;
 html+=`<div class="readiness-note recommend"><b>🏆 Status modułu</b><span class="small">Opanowanie ${masteryPercent()}% • ${masteryPercent()>=90?'moduł ukończony — puchar odblokowany':'puchar odblokuje się przy 90% opanowania'}</span></div>`;
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
window.showStats=function(){hideMainPanels();document.getElementById('stats').classList.remove('hidden');document.getElementById('statsBody').innerHTML=enhancedStatsHTML();requestAnimationFrame(()=>{const hist=[...state.history].reverse().slice(-12);drawLineChart(document.getElementById('resultsChart'),hist.map(h=>h.pct),hist.map(h=>h.date));const days=[];for(let i=13;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);days.push(calendarDayKey(d))}const counts=days.map(d=>state.studyDays.filter(x=>x===d).length);drawBars(document.getElementById('activityChart'),counts,days.map(d=>d.slice(5)))})}

// --- Asystent Nauki 5.2: wyjaśnienia błędów, wskazówki i pułapki ---
function answerText(q,index){return clean(q?.a?.[index] ?? '')}
function learningAssistantData(q,selectedIndex=null){
  const correctIndex=Number(q.correct);
  const correct=answerText(q,correctIndex)||clean(q.correctText||'');
  const selected=(selectedIndex!==null&&selectedIndex!==undefined)?answerText(q,selectedIndex):'';
  const qtxt=clean(q.q);
  const sourceExplanation=clean(q.explanation||'');
  const sourceTip=clean(q.memoryTip||q.memory_tip||'');
  const sourceMistake=clean(q.commonMistake||q.common_mistake||'');

  let short='';
  let technical=sourceExplanation;
  let expanded='';
  let tip=sourceTip;
  let mistake=sourceMistake;

  if(!technical){
    if(/lin(ia|ii|ię|ie).*elektro|przewod.*(kv|v)|napięci/i.test(qtxt)){
      short=`Po ludzku: najpierw sprawdź napięcie linii, a potem dobierz wymaganą bezpieczną odległość. Tu nie warto zgadywać — konkretna wartość decyduje o poprawnej odpowiedzi.`;
      technical=`Technicznie: dla danego zakresu napięcia obowiązuje określona minimalna odległość bezpiecznej pracy. Klucz wskazuje ${letter(correctIndex)}: „${correct}”.`;
      expanded=`Najpierw znajdź w treści napięcie linii, a dopiero potem dopasuj wartość z odpowiedzi. Nie wybieraj odległości „na wyczucie”: w takich pytaniach konkretna wartość jest częścią zasady bezpieczeństwa.`;
      tip=tip||`Napięcie → właściwa odległość. Tu: ${correct}.`;
    }else if(/klin.*odłam|wykop|nasyp|skar(p|py)|odległo/i.test(qtxt)){
      short=`Po ludzku: pytanie sprawdza, gdzie można bezpiecznie ustawić maszynę, żeby grunt lub krawędź wykopu nie stworzyły zagrożenia. Najważniejsze jest, od którego miejsca liczysz wymaganą odległość.`;
      technical=`Technicznie: trzeba zachować warunek bezpiecznego ustawienia maszyny względem wykopu, nasypu lub strefy klina odłamu. Klucz wskazuje ${letter(correctIndex)}: „${correct}”.`;
      expanded=`Przy takich zadaniach najpierw ustal, od którego punktu mierzona jest odległość i czy pytanie dotyczy dna, górnej krawędzi, klina odłamu czy innego elementu. Dopiero potem porównuj liczby z odpowiedzi.`;
      tip=tip||`Zapamiętaj dokładne sformułowanie klucza: ${correct}.`;
    }else if(/pierwsz.*pomoc|poszkod|krwaw|oparze|resuscyt|aed|oddech|tętn|padacz|kręgosłup|zatruc/i.test(qtxt)){
      short=`Po ludzku: wybierz czynność, która najpierw chroni życie poszkodowanego i nie robi mu dodatkowej krzywdy. Nie komplikuj — liczy się właściwa kolejność działania.`;
      technical=`Technicznie: priorytetem jest rozpoznanie bezpośredniego zagrożenia życia i wykonanie właściwej czynności ratunkowej. Klucz wskazuje ${letter(correctIndex)}: „${correct}”.`;
      expanded=`Czytaj pytanie jak krótką sytuację ratunkową: co zagraża bezpośrednio życiu, czego nie wolno robić i jaka czynność jest najpilniejsza. Odpowiedzi zawierające ryzykowne manipulowanie poszkodowanym lub podawanie przypadkowych środków są częstymi pułapkami.`;
      tip=tip||`Najpierw bezpieczeństwo i czynność ratująca życie.`;
    }else if(/olej|silnik|hydraul|ciśn|smar|filtr|płyn|chłodz|paliw/i.test(qtxt)){
      short=`Po ludzku: chodzi o takie obchodzenie się z maszyną, żeby jej nie przegrzać, nie zatrzeć i nie uszkodzić. Sprawdź, czy pytanie mówi o poziomie, temperaturze, ciśnieniu albo jakości płynu czy oleju.`;
      technical=`Technicznie: prawidłowa eksploatacja utrzymuje parametry układu w wymaganym zakresie i ogranicza zużycie lub uszkodzenie podzespołów. Klucz wskazuje ${letter(correctIndex)}: „${correct}”.`;
      expanded=`Zwróć uwagę, czy pytanie dotyczy poziomu, jakości, temperatury, ciśnienia lub kolejności obsługi. W technice drobna różnica w warunku często oznacza zupełnie inną czynność serwisową.`;
      tip=tip||`Eksploatacja: szukaj odpowiedzi bezpiecznej dla maszyny i układu.`;
    }else if(/zabron|dozwol|wolno|należy|powin|obowiąz|może.*prac/i.test(qtxt)){
      short=`Po ludzku: złap słowo, które mówi, czy coś MUSISZ zrobić, MOŻESZ zrobić albo czego NIE WOLNO robić. Jedno takie słowo potrafi odwrócić sens całej odpowiedzi.`;
      technical=`Technicznie: pytanie dotyczy obowiązku, zakazu lub warunku dopuszczenia do pracy. Klucz wskazuje ${letter(correctIndex)}: „${correct}”.`;
      expanded=`W pytaniach regulaminowych nie wystarczy, że odpowiedź „brzmi rozsądnie”. Porównaj dokładnie słowa „należy”, „można”, „nie wolno”, „zawsze”, „tylko gdy” — właśnie na takich różnicach budowane są odpowiedzi egzaminacyjne.`;
      tip=tip||`Czytaj słowa graniczne: należy / wolno / nie wolno / tylko gdy.`;
    }else{
      short=`Po ludzku: nie zapamiętuj, że „tu było B”. Zapamiętaj, o co pytają i jaki sens ma poprawna odpowiedź: „${correct}”.`;
      technical=`Technicznie: poprawna jest odpowiedź ${letter(correctIndex)}: „${correct}”. Powiąż treść pytania z zasadą lub pojęciem, którego dotyczy odpowiedź.`;
      expanded=`Przeczytaj jeszcze raz pytanie bez patrzenia na warianty, nazwij własnymi słowami czego ono dotyczy, a potem zestaw to z poprawną odpowiedzią. To ogranicza zgadywanie po układzie A/B/C.`;
      tip=tip||`Zapamiętaj sens: ${correct}.`;
    }
  }else{
    short=`Po ludzku: ${technical}`;
    expanded=clean(q.explanationLong||q.explanation_long||'')||technical;
  }

  if(!short) short=`Po ludzku: poprawna odpowiedź to „${correct}”. Skup się na sensie pytania i zasadzie, która prowadzi właśnie do tej odpowiedzi.`;
  if(!technical) technical=`Technicznie: klucz wskazuje ${letter(correctIndex)}: „${correct}”.`;

  if(!mistake && selectedIndex!==null && selectedIndex!==undefined && Number(selectedIndex)!==correctIndex){
    mistake=`Wybrałeś ${letter(selectedIndex)}: „${selected}”. Klucz wskazuje ${letter(correctIndex)}. Porównaj oba warianty słowo po słowie — różnica, która wygląda na drobną, często jest właśnie pułapką egzaminacyjną.`;
  }else if(!mistake){
    mistake=`Nie ucz się litery ${letter(correctIndex)}. Ucz się związku: pytanie → „${correct}”.`;
  }

  return {short,technical,expanded,tip,mistake,correct,correctIndex};
}
function learningStatusFor(q){
  const st=state.stats[q.id];
  if(!st)return '';
  const wrong=Number(st.wrong)||0;
  if(wrong>=5)return `<div class="assistant-alert high"><b>🚨 Priorytetowa słabość</b><span>To pytanie było błędne ${wrong}×. System nadaje mu wysoki priorytet w treningu słabości i inteligentnych powtórkach.</span></div>`;
  if(wrong>=3)return `<div class="assistant-alert"><b>🧠 To pytanie wraca</b><span>Błąd ${wrong}×. Po błędzie SRS ustawia je do szybkiej powtórki.</span></div>`;
  return '';
}
function explanationHTML(q,selectedIndex=null,expanded=false){
  const d=learningAssistantData(q,selectedIndex);
  const st=learningStatusFor(q);
  return `<div class="assistant-head"><span class="assistant-icon">🧠</span><div><b>Asystent Nauki</b><span class="small">Wyjaśnienie działa także offline</span></div></div>
    <div class="assistant-correct"><span>✅ Poprawna odpowiedź</span><b>${letter(d.correctIndex)}. ${escapeHtml(d.correct)}</b></div>
    <div class="assistant-section"><b>💡 Dlaczego?</b><p>${escapeHtml(d.short)}</p></div>
    <div class="assistant-section assistant-technical"><b>⚙️ Technicznie</b><p>${escapeHtml(d.technical)}</p></div>
    ${expanded?`<div class="assistant-section assistant-more"><b>📖 Rozszerzenie</b><p>${escapeHtml(d.expanded)}</p></div>
    <div class="assistant-section memory-tip"><b>🧠 Zapamiętaj</b><p>${escapeHtml(d.tip)}</p></div>
    <div class="assistant-section common-mistake"><b>⚠️ Pułapka</b><p>${escapeHtml(d.mistake)}</p></div>`:''}
    ${st}
    <div class="assistant-actions"><button class="secondary mini-btn" onclick="showExplanation(${q.id},${selectedIndex===null?'null':Number(selectedIndex)},${expanded?'false':'true'})">${expanded?'Zwiń':'📖 Więcej'}</button></div>`;
}
function showExplanation(id,selectedIndex=null,expanded=false){
  const q=QUESTIONS.find(x=>x.id===id);if(!q)return;
  const target=document.getElementById('explainBox')||document.getElementById('feedback');if(!target)return;
  target.className='feedback explain-box learning-assistant';
  target.style.display='block';
  target.innerHTML=explanationHTML(q,selectedIndex,expanded);
}
const originalOpenQuestionDetail=window.openQuestionDetail;
window.openQuestionDetail=function(id){
  originalOpenQuestionDetail(id);
  const q=QUESTIONS.find(x=>x.id===id),panel=document.getElementById('questionDetail');if(!panel||!q)return;
  const isFav=state.favorites.includes(id);
  panel.insertAdjacentHTML('beforeend',`<div id="explainBox" class="feedback explain-box learning-assistant" style="display:none"></div><div class="row" style="margin-top:10px"><button class="secondary" onclick="toggleDetailFavorite(${id})">${isFav?'★ Usuń z ulubionych':'☆ Dodaj do ulubionych'}</button><button class="secondary" onclick="showExplanation(${id})">🧠 Asystent Nauki</button></div>`);
}
function toggleDetailFavorite(id){const i=state.favorites.indexOf(id);if(i>=0)state.favorites.splice(i,1);else state.favorites.push(id);saveState();openQuestionDetail(id)}

// Po odpowiedzi: przy błędzie asystent rozwija się automatycznie, przy poprawnej zostaje przycisk „Dlaczego?”.
// 5.3: efekt jest rejestrowany w jednym pipeline odpowiedzi zamiast nadpisywać choose().
addAnswerEffect(({item,idx,isGood})=>{
  const fb=document.getElementById('feedback');if(!item||!fb)return;
  if(isGood){
    if(!document.getElementById('learnExplainBtn'))fb.insertAdjacentHTML('beforeend',`<div><button id="learnExplainBtn" class="secondary mini-btn" onclick="showExplanation(${item.id},${idx})">🧠 Dlaczego?</button></div>`);
  }else{
    fb.className='feedback bad learning-assistant';
    fb.innerHTML=explanationHTML(item,idx,false);
  }
});

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

// === 6.1.0: wspólny Mentor + wyjaśnienia „O co tu chodzi?” ===
const UDT_MENTOR_VERSION='6.1.1';

function mentorCategory(text=''){
  const t=clean(text).toLowerCase();
  const rules=[
    ['Procedury awaryjne',/pożar|awari|wypad|ewaku|ratunk|zagroż|alarm|wyciek/],
    ['Pierwsza pomoc',/pierwsz.*pomoc|poszkod|krwaw|oparze|resuscyt|aed|oddech|tętn|padacz|kręgosłup/],
    ['Hydraulika i smarowanie',/hydraul|olej|smar|ciśn|siłownik|przewod.*hyd/],
    ['Silnik i chłodzenie',/silnik|chłodz|filtr.*powiet|paliw|temperatur/],
    ['Stateczność i podłoże',/statecz|podpor|grunt|skar[pb]|wykop|nasyp|klin.*odłam|przewró/],
    ['Osprzęt i zawiesia',/zawies|hak|lina|łańcuch|trawers|ładun|udźwig|osprzęt/],
    ['Energia elektryczna',/elektr|napięci|linia.*napowiet|przewod.*kv|poraż/],
    ['BHP i organizacja pracy',/bhp|zabron|dozwol|wolno|należy|powin|obowiąz|stref|sygnalist/],
    ['Podwozie i jazda',/podwoz|gąsien|opon|koł|jazd|hamul|droga/],
    ['Dokumentacja i dozór',/dokument|instrukcj|udt|wit|zaświadc|uprawn|dziennik|przegląd/]
  ];
  return (rules.find(([,r])=>r.test(t))||['Pozostałe'])[0];
}
function mentorStoredState(machineId){
  const m=MACHINE_META[machineId];if(!m)return defaultState();
  try{return migrateLegacySRS({...defaultState(),...JSON.parse(localStorage.getItem(m.key)||'{}')})}catch{return defaultState()}
}
function mentorTheorySummary(machineId=activeMachine){
  const m=MACHINE_META[machineId]||MACHINE_META[activeMachine];
  const st=mentorStoredState(machineId);const categories={};let totalAttempts=0,totalCorrect=0,totalSeen=0;
  m.questions.forEach(q=>{
    const qs=st.stats?.[q.id];if(!qs?.attempts)return;
    totalSeen++;totalAttempts+=Number(qs.attempts)||0;totalCorrect+=Number(qs.correct)||0;
    const cat=mentorCategory(q.q);const c=categories[cat]||(categories[cat]={attempts:0,correct:0,wrong:0,questions:0});
    c.attempts+=Number(qs.attempts)||0;c.correct+=Number(qs.correct)||0;c.wrong+=Number(qs.wrong)||0;c.questions++;
  });
  const cats=Object.entries(categories).map(([name,x])=>({name,...x,pct:x.attempts?Math.round(x.correct/x.attempts*100):0})).sort((a,b)=>a.pct-b.pct||b.wrong-a.wrong);
  const module={id:machineId,name:m.name,attempts:totalAttempts,correct:totalCorrect,seen:totalSeen,total:m.questions.length,pct:totalAttempts?Math.round(totalCorrect/totalAttempts*100):0};
  return {machineId,module,modules:[module],cats,totalAttempts,totalCorrect,totalSeen,totalQuestions:m.questions.length,pct:module.pct};
}
function mentorAcademySummary(machineId=activeMachine){
  if(!['excavators','backhoes'].includes(machineId))return {oralAttempts:0,oralWrong:0,oralKnown:0,techKnown:0,techRepeat:0,gamesPlayed:0,gamesPct:0,examCount:0,examPct:0};
  const st=mentorStoredState(machineId);let oralAttempts=0,oralWrong=0,oralKnown=0;
  (ORAL_TASKS[machineId]||[]).forEach(t=>{const x=st.stats?.[t.id];oralAttempts+=Number(x?.attempts)||0;oralWrong+=Number(x?.wrong)||0;if(x?.oralMastery==='known')oralKnown++});
  const data=(typeof loadAcademyDataForMachine==='function'?loadAcademyDataForMachine(machineId):academyData)||{};
  const tech=Object.values(data.tech||{}),techKnown=tech.filter(x=>x.status==='known').length,techRepeat=tech.filter(x=>x.status==='repeat').length;
  const games=data.games||{played:0,correct:0};const exams=data.history||[];
  return {oralAttempts,oralWrong,oralKnown,techKnown,techRepeat,gamesPlayed:Number(games.played)||0,gamesPct:games.played?Math.round(games.correct/games.played*100):0,examCount:exams.length,examPct:exams.length?Math.round(exams.reduce((a,x)=>a+(Number(x.score)||0),0)/exams.length):0};
}
function mentorReadiness(theory,academy){
  const theoryCoverage=theory.totalQuestions?theory.totalSeen/theory.totalQuestions*100:0;
  const theoryQuality=theory.pct;
  const practicalSignals=Math.min(100,academy.oralAttempts*2+academy.techKnown*8+academy.gamesPlayed*.7+academy.examCount*10);
  return Math.max(0,Math.min(100,Math.round(theoryCoverage*.35+theoryQuality*.35+practicalSignals*.30)));
}
function mentorPlan(theory,academy){
  const plan=[];const weakest=theory.cats.filter(x=>x.attempts>=2).slice(0,3);
  weakest.forEach((x,i)=>plan.push({icon:'📖',title:`${i===0?'Priorytet: ':''}${x.name}`,detail:`Skuteczność ${x.pct}% • ${x.wrong} błędów. Zrób 8–12 pytań z tego obszaru.`,action:`mentorStartTheory('${x.name.replace(/'/g,"\\'")}')`,label:'Rozpocznij teorię'}));
  if(academy.oralAttempts===0||academy.oralWrong>0)plan.push({icon:'🎙️',title:'Jedno zadanie obsługowe',detail:academy.oralWrong?`W odpowiedziach ustnych zapisano ${academy.oralWrong} błędów.`:'Zbuduj pierwsze dane z odpowiedzi ustnej.',action:'mentorStartOral()',label:'Trening ustny'});
  if(academy.techKnown===0||academy.techRepeat>0)plan.push({icon:'🚜',title:'Jedno zadanie technologiczne',detail:academy.techRepeat?`${academy.techRepeat} zadań oznaczono do powtórki.`:'Przejdź jeden pełny schemat technologiczny.',action:'mentorStartTechnology()',label:'Technologia'});
  if(academy.gamesPlayed<5||academy.gamesPct<75)plan.push({icon:'🎮',title:'5 rund proceduralnych',detail:`Skuteczność gier: ${academy.gamesPct}%.`,action:'mentorStartGames()',label:'Gry'});
  return plan.slice(0,5);
}
function ensureUnifiedMentorUI(){
  const dash=document.querySelector('.dashboard-actions');
  if(dash&&!document.getElementById('unifiedMentorBtn'))dash.insertAdjacentHTML('afterbegin','<button id="unifiedMentorBtn" class="mentor-primary" onclick="showUnifiedMentor()">🧠 Mentor</button>');
  if(!document.getElementById('mentorPanel')){
    const el=document.createElement('div');el.id='mentorPanel';el.className='card hidden mentor-shell';el.innerHTML='<div class="toolbar"><div><h1>🧠 Mentor</h1><div class="small">Plan wyłącznie dla aktualnie wybranego modułu.</div></div><button class="secondary" onclick="backToMenu()">Zamknij</button></div><div id="mentorBody"></div>';
    document.querySelector('.app').insertBefore(el,document.querySelector('.footer'));
  }
}
function showUnifiedMentor(){
  ensureUnifiedMentorUI();hideMainPanels();document.getElementById('mentorPanel').classList.remove('hidden');
  const theory=mentorTheorySummary(),academy=mentorAcademySummary(),ready=mentorReadiness(theory,academy),plan=mentorPlan(theory,academy),weak=theory.cats.filter(x=>x.attempts>=2).slice(0,5);
  document.getElementById('mentorBody').innerHTML=`
  <div class="mentor-readiness"><div><span>GOTOWOŚĆ DO EGZAMINU</span><b>${ready}%</b><p>${ready>=85?'Bardzo dobra baza. Teraz utrwal słabe punkty i praktykę.':ready>=60?'Jesteś w połowie drogi — największy wzrost da trening ukierunkowany.':'Najpierw zbuduj regularność i przerób większą część materiału.'}</p></div><div class="readiness-ring" style="--p:${ready}">${ready}%</div></div>
  <div class="mentor-overview"><div><b>${theory.pct}%</b><span>teoria ABC</span></div><div><b>${theory.totalSeen}/${theory.totalQuestions}</b><span>pytań poznanych</span></div><div><b>${academy.oralKnown}</b><span>obsługa: umiem</span></div><div><b>${academy.techKnown}</b><span>technologia: umiem</span></div><div><b>${academy.gamesPct}%</b><span>gry</span></div><div><b>${academy.examPct}%</b><span>egzaminy 1:1</span></div></div>
  <div class="mentor-card"><h2>Dzisiejszy plan</h2>${plan.length?plan.map((x,i)=>`<div class="mentor-action"><span>${x.icon}</span><div><b>${i+1}. ${escapeHtml(x.title)}</b><small>${escapeHtml(x.detail)}</small></div><button onclick="${x.action}">${x.label}</button></div>`).join(''):'<p>Brak danych. Rozwiąż pierwszą sesję, aby Mentor przestał wróżyć z fusów.</p>'}</div>
  <div class="mentor-card"><h2>Najsłabsze działy teorii</h2>${weak.length?weak.map(x=>`<div class="mentor-skill"><div><b>${escapeHtml(x.name)}</b><span>${x.questions} pytań • ${x.wrong} błędów</span></div><strong>${x.pct}%</strong><div class="mini-progress"><div style="width:${x.pct}%"></div></div></div>`).join(''):'<p class="small">Za mało odpowiedzi do analizy działów.</p>'}</div>
  <div class="mentor-card"><h2>Aktualny moduł</h2><div class="history-item"><span>${escapeHtml(theory.module.name)} • ${theory.module.seen}/${theory.module.total}</span><b>${theory.module.attempts?theory.module.pct+'%':'brak danych'}</b></div></div>`;
  window.scrollTo({top:0,behavior:'smooth'});
}
function mentorStartTheory(category,count=8){
  const list=mentorQuestionsForCategory(activeMachine,category);const target=Math.max(1,Number(count)||8);backToMenu();document.getElementById('mode').value='learn';document.getElementById('count').value=Math.min(target,Math.max(1,list.length));if(list.length)startNew(list.slice(0,target));else{document.getElementById('source').value='weaknesses';document.getElementById('count').value=Math.min(target,QUESTIONS.length);startNew()}
}
function mentorStartHomeTheory(){
  const target=8;
  const theory=mentorTheorySummary();
  const weak=theory.cats.filter(x=>x.attempts>=2).sort((a,b)=>a.pct-b.pct||b.wrong-a.wrong)[0];
  if(weak){mentorStartTheory(weak.name,target);return}
  backToMenu();document.getElementById('mode').value='learn';
  const list=smartSrsPool(target);
  document.getElementById('count').value=Math.min(target,Math.max(1,list.length));
  if(list.length)startNew(list.slice(0,target));else showSessionSetup();
}
function mentorStartOral(){if(!academySupported()){alert('Trening obsługowy nie jest dostępny dla tego modułu.');return}backToMenu();showOralSetup()}
function mentorStartTechnology(){if(!academySupported()){alert('Technologia nie jest dostępna dla tego modułu.');return}showAcademy();showTechnologyModule()}
function mentorStartGames(){if(!academySupported()){alert('Gry proceduralne nie są dostępne dla tego modułu.');return}showAcademy();showAcademyGames()}

// Mentor Akademii korzysta od teraz z tego samego silnika.
window.showAcademyMentor=function(){showUnifiedMentor()};

const _mentorBackToMenu=window.backToMenu;
window.backToMenu=function(){document.getElementById('mentorPanel')?.classList.add('hidden');_mentorBackToMenu()};

function explanationRule(q,correct){
  const t=clean(q.q).toLowerCase();
  if(/pożar|zapali|pali się/.test(t))return {human:'Najpierw zatrzymaj rozwój zagrożenia: unieruchom maszynę, opuść osprzęt, wyłącz napęd i dopiero wtedy gaś albo ewakuuj się — zależnie od sytuacji.',principle:'W awarii obowiązuje kolejność: bezpieczeństwo ludzi → bezpieczny stan maszyny → ograniczenie skutków.',practice:'Maszyna pozostawiona z pracującym silnikiem lub podniesionym osprzętem może powiększyć pożar albo stworzyć drugie zagrożenie.'};
  if(/pierwsz.*pomoc|poszkod|resuscyt|aed|krwaw|oparze/.test(t))return {human:'Wybierz działanie, które najpierw chroni życie i nie pogarsza stanu poszkodowanego.',principle:'Najpierw bezpieczeństwo miejsca, potem ocena funkcji życiowych i czynność o najwyższym priorytecie.',practice:'Nie wykonuj efektownych, ale ryzykownych czynności, zanim nie rozpoznasz bezpośredniego zagrożenia życia.'};
  if(/hydraul|olej|smar|filtr|chłodz|paliw|ciśn/.test(t))return {human:'Pytanie sprawdza, jak utrzymać układ w prawidłowych warunkach i nie doprowadzić do jego uszkodzenia.',principle:'Kontrola techniczna zawsze łączy właściwe warunki pomiaru, prawidłowy parametr i reakcję na nieprawidłowość.',practice:'Ten sam odczyt wykonany na pochyłości, gorącym układzie albo przy złym położeniu osprzętu może być fałszywy.'};
  if(/statecz|podpor|grunt|wykop|skar[pb]|klin.*odłam/.test(t))return {human:'Chodzi o takie ustawienie maszyny, żeby grunt wytrzymał obciążenie, a maszyna nie straciła stateczności.',principle:'Stateczność zależy od podłoża, położenia środka ciężkości, wysięgu, obciążenia i prawidłowego podparcia.',practice:'Nawet poprawna masa ładunku nie gwarantuje bezpieczeństwa, gdy maszyna stoi za blisko krawędzi albo na słabym gruncie.'};
  if(/linia.*elektro|napięci|poraż|przewod.*kv/.test(t))return {human:'Najpierw rozpoznaj napięcie i strefę zagrożenia, a potem dobierz wymaganą odległość.',principle:'Przy energii elektrycznej nie działa „na oko” — odległości i procedury wynikają z napięcia oraz przepisów.',practice:'Do porażenia może dojść także bez bezpośredniego dotknięcia przewodu.'};
  if(/zawies|hak|lina|łańcuch|udźwig|ładun/.test(t))return {human:'Sprawdź, czy element ma odpowiedni udźwig, jest prawidłowo dobrany i nie ma uszkodzeń wyłączających go z użycia.',principle:'Bezpieczne podnoszenie wymaga zgodności masy, konfiguracji, udźwigu i stanu wszystkich elementów drogi obciążenia.',practice:'Najsłabszy element zestawu ogranicza bezpieczeństwo całej operacji.'};
  if(/zabron|dozwol|wolno|należy|powin|obowiąz/.test(t))return {human:'Znajdź słowo rozstrzygające: „należy”, „można”, „nie wolno” albo „tylko gdy”.',principle:'W pytaniach normatywnych drobna zmiana warunku zmienia odpowiedź z poprawnej na błędną.',practice:'Nie wybieraj odpowiedzi dlatego, że brzmi rozsądnie — musi dokładnie spełniać warunek z pytania.'};
  return {human:`Sednem jest zasada zawarta w odpowiedzi: „${correct}”. Powiedz ją własnymi słowami, zamiast zapamiętywać literę.`,principle:'Poprawna odpowiedź musi jednocześnie pasować do wszystkich warunków pytania; odpowiedź częściowo prawdziwa nadal jest błędna.',practice:'Najpierw nazwij temat pytania jednym zdaniem, dopiero potem porównuj warianty.'};
}
function richerExplanationData(q,selectedIndex=null){
  const base=learningAssistantData(q,selectedIndex),r=explanationRule(q,base.correct);
  const distractors=(q.a||[]).map((a,i)=>({i,text:answerText(q,i),correct:i===base.correctIndex}));
  return {...base,human:r.human,principle:r.principle,practice:r.practice,distractors};
}
window.explanationHTML=function(q,selectedIndex=null,expanded=false){
  const d=richerExplanationData(q,selectedIndex),st=learningStatusFor(q);
  const alternatives=d.distractors.map(x=>`<li class="${x.correct?'goodText':''}"><b>${letter(x.i)}.</b> ${escapeHtml(x.text)} — ${x.correct?'spełnia warunek pytania.':'nie spełnia całego warunku albo pomija kluczową zasadę.'}</li>`).join('');
  return `<div class="assistant-head"><span class="assistant-icon">🧠</span><div><b>O co tu chodzi?</b><span class="small">Wyjaśnienie i Mentor działają offline</span></div></div>
    <div class="assistant-correct"><span>📖 Oficjalnie</span><b>${letter(d.correctIndex)}. ${escapeHtml(d.correct)}</b></div>
    <div class="assistant-section assistant-human"><b>🙂 Po ludzku</b><p>${escapeHtml(d.human)}</p></div>
    <div class="assistant-section"><b>🧠 Zasada</b><p>${escapeHtml(d.principle)}</p></div>
    <div class="assistant-section assistant-technical"><b>⚙️ Technicznie</b><p>${escapeHtml(d.technical)}</p></div>
    ${expanded?`<div class="assistant-section assistant-more"><b>🚜 Przykład z praktyki</b><p>${escapeHtml(d.practice)}</p></div>
    <div class="assistant-section"><b>❌ Dlaczego pozostałe odpadają?</b><ul class="answer-reasons">${alternatives}</ul></div>
    <div class="assistant-section memory-tip"><b>📋 Co zapamiętać</b><p>${escapeHtml(d.tip)}</p></div>
    <div class="assistant-section common-mistake"><b>⚠️ Pułapka egzaminatora</b><p>${escapeHtml(d.mistake)}</p></div>`:''}
    ${st}<div class="assistant-actions"><button class="secondary mini-btn" onclick="showExplanation(${q.id},${selectedIndex===null?'null':Number(selectedIndex)},${expanded?'false':'true'})">${expanded?'Zwiń':'📖 Pełne wyjaśnienie'}</button><button class="secondary mini-btn" onclick="showUnifiedMentor()">🧠 Mentor</button></div>`;
};

setTimeout(ensureUnifiedMentorUI,0);

// === 6.1.1: aktywny Mentor, historia gotowości i trening jednym kliknięciem ===
function mentorHistoryKey(machineId=activeMachine){return `udt_mentor_readiness_history_v2_${machineId}`} 
function mentorDayKey(date=new Date()){return calendarDayKey(date)}
function mentorReadinessHistory(current){
  let history=[];try{history=JSON.parse(localStorage.getItem(mentorHistoryKey())||'[]')}catch{}
  if(!Array.isArray(history))history=[];
  const day=mentorDayKey();const last=history[history.length-1];
  if(last?.day===day){last.value=current}else history.push({day,value:current});
  history=history.slice(-90);localStorage.setItem(mentorHistoryKey(),JSON.stringify(history));
  const previous=[...history].reverse().find(x=>x.day!==day);
  return {history,previous:previous?.value??null,delta:previous==null?null:current-previous.value};
}
function mentorReadinessTone(value){return value>=85?{emoji:'🟢',label:'Bardzo dobra gotowość',cls:'ready-good'}:value>=60?{emoji:'🟡',label:'Gotowość średnia',cls:'ready-mid'}:{emoji:'🔴',label:'Gotowość wymaga pracy',cls:'ready-low'}}
function mentorQuestionsForCategory(machineId,category){
  const m=MACHINE_META[machineId];if(!m)return [];
  const st=mentorStoredState(machineId);
  return m.questions.filter(q=>mentorCategory(q.q)===category).sort((a,b)=>{
    const sa=st.stats?.[a.id]||{},sb=st.stats?.[b.id]||{};
    const wa=(Number(sa.wrong)||0)*5-(Number(sa.correct)||0)+(sa.attempts?0:2);
    const wb=(Number(sb.wrong)||0)*5-(Number(sb.correct)||0)+(sb.attempts?0:2);
    return wb-wa;
  });
}
window.mentorStartTheory=function(category,count=8){
  const list=mentorQuestionsForCategory(activeMachine,category);
  const target=Math.max(1,Number(count)||8);
  backToMenu();document.getElementById('mode').value='learn';
  if(!list.length){document.getElementById('source').value='weaknesses';document.getElementById('count').value=Math.min(target,QUESTIONS.length);startNew();return}
  document.getElementById('count').value=Math.min(target,list.length);startNew(list.slice(0,target));
}
function mentorPrimaryAction(theory,academy){
  const weak=theory.cats.filter(x=>x.attempts>=2).sort((a,b)=>a.pct-b.pct||b.wrong-a.wrong)[0];
  if(weak)return {label:`Kontynuuj: ${weak.name}`,run:()=>mentorStartTheory(weak.name)};
  if(academy.oralAttempts===0||academy.oralWrong>0)return {label:'Kontynuuj: zadanie obsługowe',run:()=>mentorStartOral()};
  if(academy.techKnown===0||academy.techRepeat>0)return {label:'Kontynuuj: technologia',run:()=>mentorStartTechnology()};
  return {label:'Kontynuuj: trening mieszany',run:()=>mentorStartGames()};
}
function mentorHardReviewPool(limit=8){
  const attempted=QUESTIONS.filter(q=>(state.stats[q.id]?.attempts||0)>0);
  const ranked=attempted.sort((a,b)=>smartWeight(b)-smartWeight(a));
  const fallback=smartSrsPool(limit);
  const merged=[...ranked,...fallback,...QUESTIONS];
  const seen=new Set();
  return merged.filter(q=>!seen.has(q.id)&&seen.add(q.id)).slice(0,limit);
}
function mentorStartHardReview(){
  const target=8,list=mentorHardReviewPool(target);
  backToMenu();document.getElementById('mode').value='learn';
  document.getElementById('count').value=Math.min(target,Math.max(1,list.length));
  if(list.length)startNew(list);else showSessionSetup();
}
function isHomePlanComplete(){
  const x=homePlanState();return !!(x.theory&&x.oral&&x.tech&&(Number(x.games)||0)>=5);
}
window.mentorContinueLearning=function(){
  if(isHomePlanComplete()){mentorStartHardReview();return}
  const t=mentorTheorySummary(),a=mentorAcademySummary();mentorPrimaryAction(t,a).run();
}
function mentorPlanDetailed(theory,academy){
  const plan=[];const weakest=theory.cats.filter(x=>x.attempts>=2).slice(0,2);
  weakest.forEach((x,i)=>plan.push({icon:'📖',title:`${i===0?'Najpierw: ':''}${x.name}`,detail:`${i===0?8:5} pytań • skuteczność ${x.pct}% • ${x.wrong} błędów`,action:`mentorStartTheory('${x.name.replace(/'/g,"\\'")}',${i===0?8:5})`,label:`${i===0?8:5} pytań`}));
  plan.push({icon:'🎙️',title:'Część obsługowa',detail:'1 zadanie ustne z oceną brakujących elementów',action:'mentorStartOral()',label:'1 zadanie'});
  plan.push({icon:'🚜',title:'Technologia',detail:'1 pełna procedura technologiczna',action:'mentorStartTechnology()',label:'1 zadanie'});
  if(academy.gamesPlayed<10||academy.gamesPct<80)plan.push({icon:'🎮',title:'Utrwalenie kolejności',detail:'5 krótkich rund proceduralnych',action:'mentorStartGames()',label:'5 rund'});
  return plan.slice(0,5);
}
const _ensureUnifiedMentorUI611=window.ensureUnifiedMentorUI||ensureUnifiedMentorUI;
window.ensureUnifiedMentorUI=function(){
  _ensureUnifiedMentorUI611();
  const recommend=document.getElementById('recommendBox');
  if(recommend&&!document.getElementById('mentorDashboardCard'))recommend.insertAdjacentHTML('beforebegin','<div id="mentorDashboardCard" class="mentor-dashboard-card"><div><span>🧠 MENTOR</span><b id="mentorDashReady">0%</b><small id="mentorDashDelta">Gotowość do egzaminu</small></div><button class="mentor-continue" onclick="mentorContinueLearning()">▶ Kontynuuj naukę</button></div>');
  updateMentorDashboard();
}
function updateMentorDashboard(){
  const el=document.getElementById('mentorDashboardCard');if(!el)return;
  const theory=mentorTheorySummary(),academy=mentorAcademySummary(),ready=mentorReadiness(theory,academy),hist=mentorReadinessHistory(ready),tone=mentorReadinessTone(ready);
  el.classList.remove('ready-good','ready-mid','ready-low');el.classList.add(tone.cls);
  document.getElementById('mentorDashReady').textContent=`${tone.emoji} ${ready}%`;
  document.getElementById('mentorDashDelta').textContent=hist.delta===null?'Pierwszy zapis gotowości':`${hist.delta>=0?'↑':'↓'} ${Math.abs(hist.delta)} pkt od poprzedniego dnia`;
}
const _updateDashboard611=window.updateDashboard;
window.updateDashboard=function(){_updateDashboard611();updateMentorDashboard()}
window.showUnifiedMentor=function(){
  ensureUnifiedMentorUI();hideMainPanels();document.getElementById('mentorPanel').classList.remove('hidden');
  const theory=mentorTheorySummary(),academy=mentorAcademySummary(),ready=mentorReadiness(theory,academy),hist=mentorReadinessHistory(ready),tone=mentorReadinessTone(ready),plan=mentorPlanDetailed(theory,academy),weak=theory.cats.filter(x=>x.attempts>=2).slice(0,6);
  const deltaText=hist.delta===null?'To pierwszy zapis — jutro zobaczysz porównanie.':`${hist.delta>=0?'⬆':'⬇'} ${Math.abs(hist.delta)} punktów względem poprzedniego dnia (${hist.previous}% → ${ready}%).`;
  document.getElementById('mentorBody').innerHTML=`
  <div class="mentor-readiness mentor-readiness-big ${tone.cls}"><div><span>GOTOWOŚĆ DO EGZAMINU</span><b>${tone.emoji} ${ready}%</b><h3>${tone.label}</h3><p>${deltaText}</p><button class="mentor-continue" onclick="mentorContinueLearning()">▶ Kontynuuj naukę</button></div><div class="readiness-ring" style="--p:${ready}">${ready}%</div></div>
  <div class="mentor-card mentor-today"><h2>📋 Dzisiaj zrób</h2>${plan.map((x,i)=>`<button class="mentor-plan-row" onclick="${x.action}"><span>${x.icon}</span><div><b>${i+1}. ${escapeHtml(x.title)}</b><small>${escapeHtml(x.detail)}</small></div><strong>${escapeHtml(x.label)} ›</strong></button>`).join('')}</div>
  <div class="mentor-overview"><div><b>${theory.pct}%</b><span>teoria ABC</span></div><div><b>${theory.totalSeen}/${theory.totalQuestions}</b><span>pytań poznanych</span></div><div><b>${academy.oralKnown}</b><span>obsługa: umiem</span></div><div><b>${academy.techKnown}</b><span>technologia: umiem</span></div><div><b>${academy.gamesPct}%</b><span>gry</span></div><div><b>${academy.examPct}%</b><span>egzaminy 1:1</span></div></div>
  <div class="mentor-card"><h2>🎯 Kliknij słaby dział i ćwicz</h2>${weak.length?weak.map(x=>`<button class="mentor-skill mentor-skill-button" onclick="mentorStartTheory('${x.name.replace(/'/g,"\\'")}')"><div><b>${escapeHtml(x.name)}</b><span>${x.questions} pytań • ${x.wrong} błędów</span></div><strong>${x.pct}% ›</strong><div class="mini-progress"><div style="width:${x.pct}%"></div></div></button>`).join(''):'<p class="small">Za mało odpowiedzi do analizy działów.</p>'}</div>
  <div class="mentor-card"><h2>Historia gotowości</h2>${hist.history.slice(-7).map(x=>`<div class="history-item"><span>${new Date(x.day+'T12:00:00').toLocaleDateString('pl-PL',{weekday:'short',day:'2-digit',month:'2-digit'})}</span><b>${x.value}%</b></div>`).join('')}</div>`;
  window.scrollTo({top:0,behavior:'smooth'});
}
function mentorDistractorReason(q,index,data){
  const text=answerText(q,index).toLowerCase(),question=clean(q.q).toLowerCase();
  if(index===data.correctIndex)return 'realizuje właściwą zasadę i zachowuje bezpieczną kolejność działania.';
  if(/pożar|zapali|pali się/.test(question)){
    if(/ucie|oddal|opuści/.test(text))return 'pomija bezpieczne zatrzymanie maszyny; pozostawiony napęd lub podniesiony osprzęt mogą zwiększyć zagrożenie.';
    if(/gasi|gaśnic/.test(text)&&!/zatrzym|poło|opuś/.test(text))return 'zaczyna gaszenie przed unieruchomieniem i zabezpieczeniem maszyny.';
    if(/jecha|przemiesz|kontynu/.test(text))return 'przemieszczanie płonącej maszyny może rozwinąć pożar i zagrozić kolejnym osobom.';
  }
  if(/pierwsz.*pomoc|poszkod|resuscyt|aed|krwaw|oparze/.test(question))return 'nie zachowuje priorytetu ratowania życia albo może pogorszyć stan poszkodowanego.';
  if(/hydraul|olej|smar|filtr|chłodz|paliw|ciśn/.test(question))return 'pomija właściwe warunki kontroli, wymagany parametr albo bezpieczną reakcję na nieprawidłowość.';
  if(/statecz|podpor|grunt|wykop|skar[pb]|klin.*odłam/.test(question))return 'nie zapewnia wymaganej stateczności lub ignoruje wpływ podłoża, krawędzi i położenia maszyny.';
  if(/linia.*elektro|napięci|poraż|przewod.*kv/.test(question))return 'nie odpowiada wymaganej strefie bezpieczeństwa dla podanego napięcia.';
  return 'jest częściowo prawdziwa albo brzmi rozsądnie, ale nie spełnia wszystkich warunków zapisanych w pytaniu.';
}
window.explanationHTML=function(q,selectedIndex=null,expanded=false){
  const d=richerExplanationData(q,selectedIndex),st=learningStatusFor(q),r=explanationRule(q,d.correct);
  const alternatives=d.distractors.map(x=>`<li class="${x.correct?'goodText':''}"><b>${letter(x.i)}.</b> ${escapeHtml(x.text)} — ${escapeHtml(mentorDistractorReason(q,x.i,d))}</li>`).join('');
  const trap=r.principle.includes('kolejność')?'Nie pomijaj pierwszego kroku bezpieczeństwa tylko dlatego, że dalsza czynność brzmi bardziej „aktywnie”.':(d.mistake||'Uważaj na odpowiedzi częściowo prawdziwe — komisja ocenia pełny warunek, nie ogólny sens.');
  return `<div class="assistant-head"><span class="assistant-icon">🧠</span><div><b>O co tu chodzi?</b><span class="small">Zasada, przykład i pułapka — bez zapamiętywania litery</span></div></div>
    <div class="assistant-correct"><span>📖 Poprawna odpowiedź</span><b>${letter(d.correctIndex)}. ${escapeHtml(d.correct)}</b></div>
    <div class="assistant-section assistant-human"><b>🙂 Po ludzku</b><p>${escapeHtml(r.human)}</p></div>
    <div class="assistant-section"><b>🧠 Zasada</b><p>${escapeHtml(r.principle)}</p></div>
    <div class="assistant-section assistant-more"><b>🚜 Przykład z praktyki</b><p>${escapeHtml(r.practice)}</p></div>
    <div class="assistant-section common-mistake"><b>⚠️ Pułapka egzaminatora</b><p>${escapeHtml(trap)}</p></div>
    ${expanded?`<div class="assistant-section assistant-technical"><b>⚙️ Technicznie</b><p>${escapeHtml(d.technical)}</p></div><div class="assistant-section"><b>❌ Dlaczego pozostałe odpadają?</b><ul class="answer-reasons">${alternatives}</ul></div><div class="assistant-section memory-tip"><b>📋 Co zapamiętać</b><p>${escapeHtml(d.tip||r.principle)}</p></div>`:''}
    ${st}<div class="assistant-actions"><button class="secondary mini-btn" onclick="showExplanation(${q.id},${selectedIndex===null?'null':Number(selectedIndex)},${expanded?'false':'true'})">${expanded?'Zwiń':'📖 Dlaczego inne są złe?'}</button><button class="secondary mini-btn" onclick="showUnifiedMentor()">🧠 Mentor</button></div>`;
};
setTimeout(()=>{ensureUnifiedMentorUI();updateMentorDashboard()},0);


// === 6.2.0: ekran Start jako centrum dowodzenia ===
function homePlanKey(machineId=activeMachine){return `udt_home_plan_v621_${machineId}`} 
function homeDayKey(){return calendarDayKey()}
function homePlanState(){
  let x={};try{x=JSON.parse(localStorage.getItem(homePlanKey())||'{}')}catch{}
  const day=homeDayKey();if(x.day!==day)x={day,theory:false,oral:false,tech:false,games:0};return x;
}
function saveHomePlan(x){localStorage.setItem(homePlanKey(),JSON.stringify(x));renderHomeDashboard()}
function markHomePlan(kind,amount=1){const x=homePlanState();if(kind==='games')x.games=Math.max(0,(x.games||0)+amount);else x[kind]=true;saveHomePlan(x)}
function homePlanItems(theory,academy){
  const weak=theory.cats.filter(x=>x.attempts>=2).sort((a,b)=>a.pct-b.pct||b.wrong-a.wrong)[0];
  return [
    {id:'theory',icon:'📖',title:weak?`8 pytań: ${weak.name}`:'8 pytań ABC',done:homePlanState().theory,run:'mentorStartHomeTheory()'},
    {id:'oral',icon:'🎙️',title:'1 zadanie obsługowe',done:homePlanState().oral,run:'mentorStartOral()'},
    {id:'tech',icon:'🚜',title:'1 zadanie technologiczne',done:homePlanState().tech,run:'mentorStartTechnology()'},
    {id:'games',icon:'🎮',title:'5 rund proceduralnych',done:(homePlanState().games||0)>=5,run:'mentorStartGames()'}
  ];
}
function bestStudyStreak(){
  const days=[...new Set(state.studyDays||[])].sort();let best=0,current=0,last=null;
  days.forEach(k=>{const d=new Date(k+'T12:00:00');if(last&&Math.round((d-last)/86400000)===1)current++;else current=1;best=Math.max(best,current);last=d});return best;
}
function latestUnlockedAchievement(){
  const all=[];
  try{ACHIEVEMENTS.forEach(a=>{if(a.ok())all.push({e:a.e,n:a.n,d:a.d})})}catch{}
  try{ACADEMY_BADGES.forEach(a=>{if(a[3]())all.push({e:a[1],n:a[2],d:'Osiągnięcie Akademii Operatora'})})}catch{}
  return all[all.length-1]||null;
}
function showSessionSetup(){
  hideMainPanels();document.getElementById('setup').classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});
}
function renderHomeDashboard(){
  const dash=document.getElementById('dashboard');if(!dash||dash.classList.contains('hidden'))return;
  const theory=mentorTheorySummary(),academy=mentorAcademySummary(),ready=mentorReadiness(theory,academy),hist=mentorReadinessHistory(ready),tone=mentorReadinessTone(ready),items=homePlanItems(theory,academy);
  const done=items.filter(x=>x.done).length;
  const readiness=document.getElementById('homeReadiness');readiness?.classList.remove('ready-good','ready-mid','ready-low');readiness?.classList.add(tone.cls);
  const val=document.getElementById('homeReadyValue');if(val)val.textContent=`${tone.emoji} ${ready}%`;
  const ring=document.getElementById('homeReadyRing');if(ring){ring.style.setProperty('--p',ready);ring.textContent=`${ready}%`}
  const weakest=theory.cats.filter(x=>x.attempts>=2).sort((a,b)=>a.pct-b.pct||b.wrong-a.wrong)[0];
  const text=document.getElementById('homeReadyText');if(text)text.textContent=weakest?`Najbardziej obniża wynik: ${weakest.name} (${weakest.pct}%). Kliknij, aby zobaczyć rozbicie.`:'Rozwiąż kilka pytań, aby Mentor mógł rzetelnie rozbić wynik.';
  const list=document.getElementById('homePlanList');if(list)list.innerHTML=items.map(x=>`<button class="home-plan-item ${x.done?'done':''}" onclick="${x.run}"><span>${x.done?'✅':x.icon}</span><b>${escapeHtml(x.title)}</b><small>${x.done?'ukończone':'rozpocznij ›'}</small></button>`).join('');
  const label=document.getElementById('homePlanLabel');if(label)label.textContent=`${done}/${items.length} ukończone`;
  const bar=document.getElementById('homePlanBar');if(bar)bar.style.width=`${Math.round(done/items.length*100)}%`;
  const cont=document.getElementById('homeContinueBtn');if(cont)cont.textContent=done===0?'▶ Rozpocznij plan dnia':done===items.length?'🎉 Powtórz trudne pytania':done===items.length-1?'🏁 Dokończ plan dnia':'▶ Kontynuuj trening';
  document.getElementById('homeStreak').textContent=`${studyStreak()} dni`;
  document.getElementById('homeBestStreak').textContent=`Rekord: ${bestStudyStreak()} dni`;
  const delta=hist.delta;document.getElementById('homeProgressDelta').textContent=delta==null?'—':`${delta>=0?'⬆':'⬇'} ${Math.abs(delta)} pkt`;
  document.getElementById('homeProgressText').textContent=delta==null?'Pierwszy pomiar gotowości':`${hist.previous}% → ${ready}% względem poprzedniego dnia`;
  const ach=latestUnlockedAchievement();document.getElementById('homeAchievement').textContent=ach?`${ach.e} ${ach.n}`:'Jeszcze czeka';document.getElementById('homeAchievementText').textContent=ach?ach.d:'Pierwsze odblokujesz już po jednej odpowiedzi.';
  document.getElementById('homeMentorTitle').textContent=weakest?`Dzisiaj: ${weakest.name}`:'Zbuduj pierwsze dane';
  document.getElementById('homeMentorText').textContent=weakest?`Masz tu ${weakest.pct}% skuteczności i ${weakest.wrong} błędów. Zacznij plan od teorii, potem zrób obsługę i technologię.`:'Zrób krótką sesję ABC. Potem Mentor przestanie zgadywać i poda konkretny priorytet.';
}
const _backToMenu620=window.backToMenu;
window.backToMenu=function(){_backToMenu620();document.getElementById('setup')?.classList.add('hidden');document.getElementById('dashboard')?.classList.remove('hidden');renderHomeDashboard()};
const _updateDashboard620=window.updateDashboard;
window.updateDashboard=function(){_updateDashboard620();renderHomeDashboard()};
const _finish620=window.finish;
window.finish=function(completed=false){const before=(state.history||[]).length;_finish620(completed);if((state.history||[]).length>before){const latest=state.history[0];if(latest?.completed&&(Number(latest.count)||0)>=8)markHomePlan('theory')}};
const _rateOral620=window.rateOral;
window.rateOral=function(grade){_rateOral620(grade);markHomePlan('oral')};
const _setTechStatus620=window.setTechStatus;
window.setTechStatus=function(status){_setTechStatus620(status);markHomePlan('tech')};
const _recordGame620=window.recordGame;
window.recordGame=function(ok,xp){_recordGame620(ok,xp);markHomePlan('games',1)};
setTimeout(()=>{document.getElementById('setup')?.classList.add('hidden');renderHomeDashboard()},0);

// === 6.3.0: wyjaśnienia zależne od typu pytania ===
const EXPLANATION_ENGINE_VERSION='6.3.0';

function detectQuestionType(q){
  const question=clean(q?.q||'').toLowerCase();
  const answers=(q?.a||[]).map(a=>clean(typeof a==='string'?a:(a?.text||a?.answer||''))).join(' ').toLowerCase();
  const all=`${question} ${answers}`;
  if(/bhp|bezpiecz|zagroż|nie wolno|zabron|poraż|pożar|wypad|poszkod|pierwsz.*pomoc|strefa niebezpieczna|klin odłamu|przewróc|stateczno/.test(all))return 'safety';
  if(/kolejno|technolog|wykop|nasyp|plantow|profilow|załad|urobek|skar[pb]|zagęszcz|odspaj|zasyp|równan|wykonanie robót/.test(all))return 'technology';
  if(/obsług|eksploat|kontrol|sprawd|uzupeł|wymian|smarow|poziom oleju|filtr|przegląd|uruchom|wyłącz|temperatur|ciśnienie/.test(all))return 'operation';
  if(/jak działa|zasad.*dział|powoduje|w wyniku|dlaczego|mechanizm|przekazuje|zmniejsza|zwiększa|wytwarza|kieruje przepływ/.test(all))return 'principle';
  if(/który.*element|co to jest|służy do|odpowiada za|znajduje się|nazywa się|jest częścią|zwolnic|rozdzielacz|hamulce|pompa|siłownik|przekładnia|akumulator|alternator|rozrusznik|sworzeń|tuleja/.test(all))return 'machine_part';
  return 'principle';
}

const MACHINE_PART_KNOWLEDGE=[
  [/zwolnic.{0,20}planetar/i,{name:'zwolnice planetarne',fn:'redukują prędkość obrotową i zwiększają moment obrotowy przekazywany na koła lub gąsienice',where:'są umieszczone w końcowej części układu napędowego, przy kołach lub kołach napędowych gąsienic',failure:'ich zużycie może powodować hałas, luzy, przegrzewanie i utratę siły napędowej',memory:'Zwolnica = wolniej na wyjściu, ale z większym momentem.'}],
  [/rozdzielacz.{0,20}hydraul/i,{name:'rozdzielacz hydrauliczny',fn:'kieruje strumień oleju hydraulicznego do wybranego odbiornika, np. siłownika lub silnika hydraulicznego',where:'znajduje się w układzie hydraulicznym pomiędzy pompą a odbiornikami',failure:'usterka powoduje brak, opóźnienie lub niekontrolowany ruch funkcji roboczej',memory:'Rozdzielacz rozdziela olej — nie przenosi napędu mechanicznego na koła.'}],
  [/hamulc.{0,15}mokr/i,{name:'hamulce mokre',fn:'wyhamowują maszynę, a ich tarcze pracują w kąpieli olejowej, co poprawia chłodzenie i trwałość',where:'są zabudowane w moście lub piaście układu jezdnego',failure:'zużycie może wydłużyć drogę hamowania lub osłabić skuteczność hamulca',memory:'Hamulce mokre = hamowanie; olej je chłodzi i smaruje.'}],
  [/pompa.{0,20}hydraul/i,{name:'pompa hydrauliczna',fn:'wytwarza przepływ oleju; ciśnienie pojawia się, gdy przepływ napotyka opór',where:'jest napędzana przez silnik i zasila układ hydrauliczny',failure:'uszkodzenie powoduje spadek wydajności, hałas, przegrzewanie lub brak ruchów roboczych',memory:'Pompa daje przepływ, obciążenie tworzy ciśnienie.'}],
  [/siłownik.{0,20}hydraul/i,{name:'siłownik hydrauliczny',fn:'zamienia energię ciśnienia oleju na ruch liniowy i siłę',where:'łączy układ hydrauliczny z elementem roboczym maszyny',failure:'nieszczelność powoduje opadanie osprzętu, słabą siłę lub nierówny ruch',memory:'Siłownik = ruch prostoliniowy.'}],
  [/silnik.{0,20}hydraul/i,{name:'silnik hydrauliczny',fn:'zamienia energię hydrauliczną na ruch obrotowy',where:'napędza elementy wymagające obrotu, np. jazdę, obrót nadwozia lub osprzęt',failure:'usterka objawia się spadkiem momentu, nierówną pracą lub brakiem obrotu',memory:'Silnik hydrauliczny = obrót.'}],
  [/akumulator/i,{name:'akumulator',fn:'magazynuje energię elektryczną i zasila rozrusznik oraz odbiorniki przy wyłączonym silniku',where:'jest częścią instalacji elektrycznej maszyny',failure:'słaby akumulator utrudnia rozruch i powoduje spadki napięcia',memory:'Akumulator magazynuje energię; alternator ją uzupełnia.'}],
  [/alternator/i,{name:'alternator',fn:'wytwarza energię elektryczną podczas pracy silnika i ładuje akumulator',where:'jest napędzany mechanicznie przez silnik',failure:'awaria powoduje rozładowywanie akumulatora i zapalenie kontrolki ładowania',memory:'Alternator ładuje podczas pracy silnika.'}],
  [/rozrusznik/i,{name:'rozrusznik',fn:'obraca wałem silnika podczas uruchamiania',where:'jest połączony z kołem zamachowym silnika',failure:'awaria uniemożliwia rozruch mimo sprawnego akumulatora',memory:'Rozrusznik uruchamia, ale nie ładuje.'}],
  [/filtr.{0,20}powiet/i,{name:'filtr powietrza',fn:'zatrzymuje pył przed dostaniem się do silnika',where:'znajduje się w układzie dolotowym',failure:'zabrudzenie ogranicza dopływ powietrza, zwiększa zużycie paliwa i może obniżyć moc',memory:'Czyste powietrze chroni cylindry i turbosprężarkę.'}],
  [/filtr.{0,20}olej/i,{name:'filtr oleju',fn:'usuwa zanieczyszczenia z oleju krążącego w układzie smarowania',where:'jest w obiegu oleju silnikowego lub hydraulicznego — zależnie od pytania',failure:'zatkanie lub uszkodzenie pogarsza smarowanie i przyspiesza zużycie podzespołów',memory:'Filtr chroni układ, ale nie zastępuje wymiany oleju.'}],
  [/chłodnic/i,{name:'chłodnica',fn:'oddaje ciepło z cieczy chłodzącej lub oleju do otoczenia',where:'jest w przepływie powietrza przedziału silnikowego',failure:'zabrudzenie lub nieszczelność prowadzi do przegrzewania',memory:'Chłodnica usuwa ciepło; zabrudzone lamele ograniczają chłodzenie.'}],
  [/mechanizm.{0,20}różnic/i,{name:'mechanizm różnicowy',fn:'umożliwia kołom jednej osi obracanie się z różnymi prędkościami podczas skrętu',where:'znajduje się w moście napędowym',failure:'usterka powoduje hałas, szarpanie lub problemy z przeniesieniem napędu',memory:'Mechanizm różnicowy pozwala kołom różnić się prędkością.'}],
  [/przekładni/i,{name:'przekładnia',fn:'zmienia prędkość obrotową, moment lub kierunek przenoszenia napędu',where:'jest elementem układu napędowego',failure:'zużycie objawia się hałasem, luzem, przegrzewaniem lub utratą napędu',memory:'Przekładnia zmienia parametry ruchu.'}],
  [/sworz/i,{name:'sworzeń',fn:'tworzy ruchome połączenie przegubowe elementów osprzętu',where:'występuje w połączeniach wysięgnika, ramienia, łyżki i siłowników',failure:'brak smarowania lub zabezpieczenia powoduje luzy, zużycie i ryzyko rozłączenia',memory:'Sworzeń łączy, tuleja prowadzi i przyjmuje zużycie.'}],
  [/tulej/i,{name:'tuleja',fn:'prowadzi sworzeń i stanowi wymienną powierzchnię współpracującą w przegubie',where:'jest osadzona w otworach połączeń ruchomych',failure:'zużycie zwiększa luzy i pogarsza precyzję pracy osprzętu',memory:'Tuleja zużywa się zamiast droższego elementu konstrukcyjnego.'}],
  [/zawór.{0,20}przelew|zawór.{0,20}bezpiecz/i,{name:'zawór przelewowy',fn:'ogranicza maksymalne ciśnienie i chroni układ hydrauliczny przed przeciążeniem',where:'łączy linię ciśnieniową ze zbiornikiem po przekroczeniu nastawy',failure:'zacięcie może powodować zbyt wysokie ciśnienie albo brak siły układu',memory:'Zawór przelewowy jest bezpiecznikiem ciśnienia.'}]
];

function machinePartInfo(text=''){
  return (MACHINE_PART_KNOWLEDGE.find(([rx])=>rx.test(text))||[])[1]||null;
}

function domainMechanism(text=''){
  const t=text.toLowerCase();
  if(/hydraul|olej|pompa|rozdzielacz|siłownik/.test(t))return 'Pompa wytwarza przepływ oleju, rozdzielacz kieruje go do odbiornika, a opór obciążenia powoduje wzrost ciśnienia. Odbiornik zamienia energię oleju na ruch.';
  if(/napęd|przekład|zwolnic|moment|obrot/.test(t))return 'Układ napędowy przekazuje moment od silnika przez kolejne przekładnie. Zmniejszenie prędkości obrotowej pozwala zwiększyć moment dostępny na kołach lub gąsienicach.';
  if(/chłodz|temperatur|termostat/.test(t))return 'Ciepło jest odbierane od silnika przez ciecz lub powietrze, a następnie oddawane do otoczenia. Prawidłowy przepływ i czysta chłodnica utrzymują temperaturę roboczą.';
  if(/elektr|akumulator|alternator|rozrusznik/.test(t))return 'Akumulator dostarcza energię przy rozruchu, rozrusznik obraca silnikiem, a alternator po uruchomieniu zasila instalację i doładowuje akumulator.';
  if(/hamul/.test(t))return 'Układ hamulcowy zamienia energię ruchu maszyny na ciepło i wytwarza siłę przeciwną do ruchu. Skuteczność zależy od stanu elementów, ciśnienia i regulacji.';
  return 'Prawidłowa odpowiedź opisuje zależność przyczyna → działanie elementu lub układu → skutek. Pozostałe warianty dotyczą innej funkcji albo odwracają tę zależność.';
}

function safetyExplanation(q,correct){
  const t=`${clean(q.q)} ${correct}`.toLowerCase();
  let hazard='uraz człowieka, niekontrolowany ruch maszyny lub uszkodzenie sprzętu';
  let rule='Najpierw usuń albo ogranicz bezpośrednie zagrożenie, następnie zabezpiecz maszynę i dopiero wykonuj dalsze czynności.';
  let practice='Operator przed ruchem sprawdza strefę, stabilność maszyny i możliwość bezpiecznego zatrzymania.';
  if(/podniesion|osprzęt|łyżk/.test(t)){hazard='nagłe opadnięcie osprzętu po awarii hydrauliki lub błędzie sterowania';rule='Nie wchodź pod podniesiony osprzęt bez przewidzianego zabezpieczenia mechanicznego.';practice='Samo wyłączenie silnika nie gwarantuje, że osprzęt nie opadnie.'}
  else if(/prąd|napięci|linia|poraż/.test(t)){hazard='porażenie lub przeskok łuku elektrycznego nawet bez dotknięcia przewodu';rule='Zachowaj odległość wynikającą z napięcia i procedur, a pracę uzgodnij z zarządcą sieci.';practice='Wysięgnik może wejść w strefę niebezpieczną mimo że kabina pozostaje daleko.'}
  else if(/pożar|pali się/.test(t)){hazard='rozprzestrzenienie pożaru, wybuch paliwa lub oleju i niekontrolowany ruch';rule='Zatrzymaj maszynę, opuść osprzęt, wyłącz silnik, ewakuuj ludzi i gaś tylko wtedy, gdy jest to bezpieczne.';practice='Gaszenie przed wyłączeniem napędu może zostawić dodatkowe źródło paliwa i ruchu.'}
  else if(/skar[pb]|wykop|klin odłamu|krawęd/.test(t)){hazard='załamanie gruntu i zsunięcie lub przewrócenie maszyny';rule='Zachowaj bezpieczną odległość od krawędzi wynikającą z rodzaju gruntu i geometrii wykopu.';practice='Grunt przy krawędzi może wyglądać stabilnie, ale być podcięty lub nawodniony.'}
  return {human:`Ta odpowiedź chroni przed zagrożeniem: ${hazard}.`,principle:rule,technical:`Zasada BHP nie jest formalnością — usuwa konkretną drogę powstania wypadku: ${hazard}.`,practice,tip:`Zapamiętaj: rozpoznaj zagrożenie → zabezpiecz ludzi i maszynę → dopiero działaj.`,trap:'Odpowiedź brzmiąca „szybko” lub „aktywnie” może być błędna, jeżeli pomija zabezpieczenie miejsca i maszyny.'};
}

function technologyExplanation(q,correct){
  const t=`${clean(q.q)} ${correct}`.toLowerCase();
  let sequence='ocena miejsca → ustawienie i zabezpieczenie maszyny → wykonanie ruchów roboczych → kontrola efektu → bezpieczne zakończenie';
  if(/załad/.test(t))sequence='ustaw maszynę i środek transportu → nabierz materiał → unieś tylko na potrzebną wysokość → obróć bez przechodzenia nad kabiną → wysyp kontrolowanie → wróć po kolejny cykl';
  else if(/wykop/.test(t))sequence='wyznacz obrys i sprawdź uzbrojenie → ustaw maszynę poza strefą utraty stateczności → odspajaj warstwami → odkładaj urobek bez przeciążania krawędzi → kontroluj wymiary i skarpę';
  else if(/zasyp/.test(t))sequence='sprawdź gotowość wykopu i instalacji → dobierz materiał → zasypuj warstwami → rozkładaj równomiernie → zagęszczaj zgodnie z wymaganiami → kontroluj poziom';
  else if(/plantow|równan|profilow/.test(t))sequence='wyznacz poziom lub spadek → wykonuj długie, płynne przejścia → zdejmuj niewielkie warstwy → kontroluj rzędne → popraw nierówności bez nadmiernego rozluźniania gruntu';
  return {human:`To pytanie sprawdza właściwą kolejność robót. Najprościej: ${sequence}.`,principle:'Najpierw przygotowanie i bezpieczeństwo, potem właściwa praca, na końcu kontrola efektu i zabezpieczenie maszyny.',technical:`Technologia robót wymaga zachowania kolejności: ${sequence}. Zmiana kolejności może pogorszyć stateczność, dokładność albo bezpieczeństwo.`,practice:'Egzaminator patrzy nie tylko na wynik końcowy, ale także na ustawienie maszyny, płynność, obserwację otoczenia i zbędne ruchy.',tip:`Kolejność: przygotuj → wykonaj → kontroluj → zakończ.`,trap:'Nie zaczynaj ruchu roboczego, zanim nie sprawdzisz otoczenia, podłoża i strefy pracy.'};
}

function operationExplanation(q,correct){
  const t=`${clean(q.q)} ${correct}`.toLowerCase();
  let consequence='przyspieszone zużycie, awarię podzespołu albo stworzenie zagrożenia podczas pracy';
  let action='wykonaj kontrolę w warunkach podanych przez producenta, porównaj wynik z zakresem dopuszczalnym i zareaguj na odchylenie';
  if(/olej/.test(t))consequence='brak smarowania, przegrzewanie, kawitację lub uszkodzenie pompy i elementów współpracujących';
  if(/filtr/.test(t))consequence='ograniczenie przepływu, spadek mocy, wzrost temperatury lub przedostanie się zanieczyszczeń do układu';
  if(/chłodz|temperatur/.test(t))consequence='przegrzanie silnika, utratę właściwości oleju i kosztowne uszkodzenie';
  if(/opon|gąsien/.test(t))consequence='pogorszenie stateczności, sterowności, nadmierne zużycie i ryzyko uszkodzenia układu jezdnego';
  return {human:`Chodzi o to, żeby wykryć problem przed rozpoczęciem pracy. Pominięcie tej czynności może spowodować ${consequence}.`,principle:'Obsługa codzienna ma trzy części: prawidłowe warunki kontroli, ocena wyniku i właściwa reakcja na nieprawidłowość.',technical:`Prawidłowo: ${action}. Nieprawidłowy wynik oznacza uzupełnienie właściwym środkiem, wyłączenie maszyny z pracy albo zgłoszenie usterki — zależnie od instrukcji.`,practice:'Drobny wyciek lub nietypowy hałas zauważony przed zmianą może zapobiec awarii w środku zadania.',tip:'Sprawdź → oceń → zareaguj. Samo spojrzenie bez decyzji nie jest obsługą.',trap:'Najczęstszy błąd to prawidłowo wskazać element, ale pominąć warunki pomiaru lub reakcję na zły wynik.'};
}

function principleExplanation(q,correct){
  const text=`${clean(q.q)} ${correct}`;
  const part=machinePartInfo(correct);
  if(part)return {human:`${part.name} ${part.fn}.`,principle:`Element rozpoznajesz po funkcji: ${part.fn}.`,technical:`${part.name}: ${part.fn}; ${part.where}.`,practice:`Gdy ten element nie działa prawidłowo, ${part.failure}.`,tip:part.memory,trap:'Nie wybieraj elementu tylko dlatego, że występuje w tej samej maszynie — musi wykonywać dokładnie funkcję opisaną w pytaniu.'};
  return {human:domainMechanism(text),principle:'Rozłóż mechanizm na trzy pytania: co dostarcza energię, co nią steruje i jaki element wykonuje pracę.',technical:domainMechanism(text),practice:'Na maszynie objaw usterki często wskazuje, na którym etapie łańcucha przekazywania energii wystąpił problem.',tip:'Źródło energii → sterowanie → odbiornik → efekt.',trap:'Odpowiedzi mogą nazywać elementy tego samego układu, ale każdy z nich ma inną rolę.'};
}

function machinePartExplanation(q,correct){
  const part=machinePartInfo(correct)||machinePartInfo(clean(q.q));
  if(part)return {human:`${part.name} służy do tego, że ${part.fn}.`,principle:`Pytanie rozpoznajesz po funkcji elementu: ${part.fn}.`,technical:`${part.name} ${part.where} i ${part.fn}.`,practice:`Objaw uszkodzenia: ${part.failure}.`,tip:part.memory,trap:'Nie myl elementów znajdujących się w tej samej okolicy maszyny — porównuj ich funkcje, nie nazwy.'};
  return {human:`Pytanie wymaga dopasowania nazwy elementu do funkcji opisanej w treści. Poprawny element to „${correct}”.`,principle:'Element maszyny identyfikuje się przez funkcję, miejsce w układzie i skutek jego działania.',technical:`„${correct}” jest poprawne, ponieważ jako jedyne odpowiada funkcji opisanej w pytaniu.`,practice:'Na maszynie wskaż element, powiedz co do niego dopływa, co z niego wychodzi i jaki ruch lub efekt powoduje.',tip:`Nazwa elementu → funkcja → miejsce w układzie → objaw awarii.`,trap:'Odpowiedź z tej samej grupy podzespołów nie jest automatycznie poprawna.'};
}

function typedExplanation(q,correct){
  const type=detectQuestionType(q);
  const data=type==='machine_part'?machinePartExplanation(q,correct):type==='safety'?safetyExplanation(q,correct):type==='technology'?technologyExplanation(q,correct):type==='operation'?operationExplanation(q,correct):principleExplanation(q,correct);
  const meta={machine_part:['🔧','Element maszyny'],principle:['⚙️','Zasada działania'],safety:['🦺','BHP i zagrożenie'],technology:['📏','Technologia robót'],operation:['🚜','Eksploatacja']}[type];
  return {...data,type,typeIcon:meta[0],typeLabel:meta[1]};
}

function typedDistractorReason(q,index,d){
  if(index===d.correctIndex)return 'to odpowiedź poprawna — pasuje do funkcji lub zasady opisanej w pytaniu.';
  const answer=answerText(q,index),part=machinePartInfo(answer),type=d.questionType;
  if(part)return `${part.name} ${part.fn}, więc nie realizuje funkcji wymaganej w tym pytaniu.`;
  if(type==='safety')return 'pomija wskazane zagrożenie, właściwe zabezpieczenie albo bezpieczną kolejność działania.';
  if(type==='technology')return 'ustawia czynności w złej kolejności albo pomija przygotowanie, kontrolę efektu lub bezpieczne zakończenie.';
  if(type==='operation')return 'nie zapewnia prawidłowych warunków kontroli, właściwej reakcji na wynik albo może doprowadzić do uszkodzenia.';
  if(type==='principle')return 'opisuje inny etap mechanizmu, inny kierunek przepływu energii albo myli przyczynę ze skutkiem.';
  return 'dotyczy innego elementu lub funkcji niż ta opisana w pytaniu.';
}

window.explanationHTML=function(q,selectedIndex=null,expanded=false){
  const d=richerExplanationData(q,selectedIndex),st=learningStatusFor(q),r=typedExplanation(q,d.correct);
  d.questionType=r.type;
  const alternatives=d.distractors.map(x=>`<li class="${x.correct?'goodText':''}"><b>${letter(x.i)}.</b> ${escapeHtml(x.text)} — ${escapeHtml(typedDistractorReason(q,x.i,d))}</li>`).join('');
  return `<div class="assistant-head"><span class="assistant-icon">🧠</span><div><b>O co tu chodzi?</b><span class="small">${r.typeIcon} ${escapeHtml(r.typeLabel)} • wyjaśnienie dopasowane do pytania</span></div></div>
    <div class="assistant-correct"><span>📖 Poprawna odpowiedź</span><b>${letter(d.correctIndex)}. ${escapeHtml(d.correct)}</b></div>
    <div class="assistant-section assistant-human"><b>🙂 Po ludzku</b><p>${escapeHtml(r.human)}</p></div>
    <div class="assistant-section"><b>${r.typeIcon} ${escapeHtml(r.typeLabel)}</b><p>${escapeHtml(r.principle)}</p></div>
    <div class="assistant-section assistant-more"><b>🚜 Przykład / skutek w praktyce</b><p>${escapeHtml(r.practice)}</p></div>
    <div class="assistant-section common-mistake"><b>⚠️ Pułapka egzaminatora</b><p>${escapeHtml(r.trap)}</p></div>
    ${expanded?`<div class="assistant-section assistant-technical"><b>⚙️ Technicznie</b><p>${escapeHtml(r.technical)}</p></div><div class="assistant-section"><b>❌ Dlaczego pozostałe odpadają?</b><ul class="answer-reasons">${alternatives}</ul></div><div class="assistant-section memory-tip"><b>📋 Co zapamiętać</b><p>${escapeHtml(r.tip)}</p></div>`:''}
    ${st}<div class="assistant-actions"><button class="secondary mini-btn" onclick="showExplanation(${q.id},${selectedIndex===null?'null':Number(selectedIndex)},${expanded?'false':'true'})">${expanded?'Zwiń':'📖 Dlaczego inne są złe?'}</button><button class="secondary mini-btn" onclick="showUnifiedMentor()">🧠 Mentor</button></div>`;
};
