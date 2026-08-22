/* UDT Trainer 6.2.0 — legacy helpers without a second dashboard */
const UDT4_VERSION='6.2.0';

function ensureProState(){
  state.dailyGoal=Number(state.dailyGoal)||25;
  state.answerTimes=state.answerTimes||{};
  state.settings=state.settings||{autoExplain:false,compact:false};
}
function localDateKey(d=new Date()){const x=new Date(d);x.setMinutes(x.getMinutes()-x.getTimezoneOffset());return x.toISOString().slice(0,10)}
function recentAccuracy(){const vals=Object.values(state.stats||{}),a=vals.reduce((s,x)=>s+(x.attempts||0),0),c=vals.reduce((s,x)=>s+(x.correct||0),0);return a?Math.round(c/a*100):0}
function readinessScore(){
  ensureProState();
  const seen=Object.values(state.stats).filter(x=>x.attempts>0).length;
  const coverage=QUESTIONS.length?seen/QUESTIONS.length:0;
  const mastery=masteryPercent()/100;
  const accuracy=recentAccuracy()/100;
  const exams=state.history.filter(h=>h.mode==='simulator'||h.mode==='exam').slice(0,5);
  const exam=exams.length?exams.reduce((s,h)=>s+h.pct,0)/(exams.length*100):accuracy*.75;
  return Math.max(0,Math.min(99,Math.round((coverage*.25+mastery*.35+accuracy*.25+exam*.15)*100)));
}
function readinessLabel(v){if(v>=90)return 'Bardzo wysoka';if(v>=80)return 'Wysoka';if(v>=70)return 'Dobra';if(v>=55)return 'Średnia';if(v>0)return 'Budujemy';return 'Brak danych'}
function dueQuestions(){return srsDueQuestions().sort((a,b)=>(state.stats[a.id]?.due||0)-(state.stats[b.id]?.due||0))}
function unseenQuestions(){return QUESTIONS.filter(q=>(state.stats[q.id]?.attempts||0)===0)}
function smartSrsPool(n=20){ensureProState();const due=dueQuestions(),unseen=unseenQuestions();const hard=QUESTIONS.filter(q=>(state.stats[q.id]?.wrong||0)>0).sort((a,b)=>smartWeight(b)-smartWeight(a));const merged=[...due,...hard,...unseen,...QUESTIONS];const seen=new Set();return merged.filter(q=>!seen.has(q.id)&&seen.add(q.id)).slice(0,n)}
function startCoachSession(){document.getElementById('mode').value='learn';startNew(smartSrsPool(Math.max(10,Math.min(50,state.dailyGoal||25))))}
function startQuickReview(){document.getElementById('mode').value='learn';const p=smartSrsPool(10);startNew(p.length?p:shuffle([...QUESTIONS]).slice(0,10))}

// 5.3: czas odpowiedzi i opcjonalne wyjaśnienie są częścią wspólnego pipeline,
// bez kolejnego wrappera na render()/choose().
addAnswerEffect(({item,idx,isGood,elapsed})=>{
  ensureProState();
  const t=state.answerTimes[item.id]||{count:0,total:0};t.count++;t.total+=elapsed;state.answerTimes[item.id]=t;
  if(state.settings?.autoExplain&&!isGood)setTimeout(()=>showExplanation(item.id,idx),30);
});

function todayAnswered(){const today=localDateKey();return state.history.filter(h=>localDateKey(h.date)===today).reduce((s,h)=>s+(h.count||0),0)}
function estimatedDays(){const remaining=unseenQuestions().length;return remaining?Math.max(1,Math.ceil(remaining/Math.max(1,state.dailyGoal||25))):0}
function weakQuestions(limit=3){return weaknessQuestions().slice(0,limit)}
function strongQuestions(limit=3){return QUESTIONS.filter(q=>(state.stats[q.id]?.attempts||0)>=2).sort((a,b)=>{const A=state.stats[a.id],B=state.stats[b.id];return (B.correct/B.attempts)-(A.correct/A.attempts)}).slice(0,limit)}
function coachText(){const due=dueQuestions().length,unseen=unseenQuestions().length,w=weakQuestions(3);if(due)return `Masz ${due} powtórek SRS do zrobienia. Zacznij od nich — aplikacja dobrała termin na podstawie Twoich odpowiedzi.`;if(w.length)return `Najbardziej opłaca się teraz wrócić do pytań ${w.map(q=>q.id).join(', ')}. Potem dorzuć ${Math.min(15,unseen)} nowych.`;if(unseen)return `Dzisiaj przerób ${Math.min(state.dailyGoal||25,unseen)} nowych pytań. Po pierwszych błędach inteligentne powtórki same ustawią priorytety.`;return 'Cała baza była już przerobiona. Teraz utrzymuj wynik inteligentnymi powtórkami i symulatorem egzaminu.'}
function heatmapHTML(){const study=new Set(state.studyDays||[]),hist=state.history||[];let cells='';for(let i=29;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const k=localDateKey(d);const sessions=hist.filter(h=>localDateKey(h.date)===k).length;const active=study.has(k);const lvl=Math.min(4,(active?1:0)+sessions);cells+=`<span class="heat h${lvl}" title="${k}: ${sessions} sesji"></span>`}return `<div class="heatmap">${cells}</div><div class="heat-legend small">30 dni temu <span></span> dzisiaj</div>`}
function averageAnswerTime(){ensureProState();const vals=Object.values(state.answerTimes);const c=vals.reduce((s,x)=>s+x.count,0),t=vals.reduce((s,x)=>s+x.total,0);return c?Math.round(t/c):0}

function ensureUdt4UI(){
  ensureProState();

  // 6.2.0: tylko jeden ekran Start. Starszy coachHero z 5.6.0 przykrywał
  // Centrum Dowodzenia po zakończeniu inicjalizacji.
  ['coachHero'].forEach(id=>document.getElementById(id)?.remove());
  document.querySelectorAll('#dashboard > .coach-strip, #dashboard > .activity-card').forEach(el=>el.remove());

  const version=(typeof UDT_VERSION!=='undefined'?UDT_VERSION:UDT4_VERSION);
  const title=document.getElementById('appTitle');
  if(title)title.textContent=`UDT Trainer ${version}`;
  document.title=`UDT Trainer ${version} — trener operatora`;

  const actions=document.querySelector('.dashboard-actions');
  if(actions){
    Array.from(actions.children).forEach(el=>{
      const text=el.textContent||'';
      if(/Diagnostyka|Eksport|Import|Synchronizacja/.test(text))el.classList.add('pro-hidden-action');
    });
    if(!document.getElementById('settingsDashBtn')){
      actions.insertAdjacentHTML('beforeend','<button id="settingsDashBtn" class="secondary" onclick="showSettings()">⚙️ Ustawienia</button>');
    }
  }

  if(!document.getElementById('settingsPanel')){
    const app=document.querySelector('.app'),footer=document.querySelector('.footer'),p=document.createElement('div');
    p.id='settingsPanel';p.className='card hidden';
    p.innerHTML=`<div class="toolbar"><div><h1>⚙️ Ustawienia</h1><div class="small">Kopie zapasowe, synchronizacja i narzędzia techniczne.</div></div><button class="secondary" onclick="backToMenu()">Zamknij</button></div>
      <div class="settings-grid"><div class="settings-box"><h2>🎯 Nauka</h2><label class="field"><span>Dzienny cel pytań</span><input id="dailyGoalInput" type="number" min="5" max="200" step="5"></label><label class="check"><input id="autoExplainInput" type="checkbox"> Automatycznie pokaż wyjaśnienie po błędzie</label><button onclick="saveProSettings()">Zapisz ustawienia</button></div>
      <div class="settings-box"><h2>💾 Kopia danych</h2><p class="small">Eksport zapisuje postęp bieżącego modułu. Import odtwarza go z pliku.</p><div class="row"><button class="secondary" onclick="exportData()">📤 Eksport</button><button class="secondary" onclick="document.getElementById('importFile').click()">📥 Import</button></div></div>
      <div class="settings-box"><h2>☁️ Synchronizacja</h2><p class="small">Opcjonalna synchronizacja przez prywatny GitHub Gist.</p><button class="secondary" onclick="showSyncPanel()">Otwórz synchronizację</button></div>
      <div class="settings-box"><h2>🛠 Narzędzia</h2><div class="row"><button class="secondary" onclick="showDiagnostics()">Diagnostyka</button><button class="danger" onclick="resetProgress()">Wyzeruj postęp</button></div></div></div>`;
    app.insertBefore(p,footer);
  }

  if(!document.getElementById('bottomNav')){
    document.body.insertAdjacentHTML('beforeend',`<nav id="bottomNav" class="bottom-nav"><button onclick="backToMenu()"><span>🏠</span>Start</button><button onclick="showQuestionBrowser()"><span>🔎</span>Baza</button><button class="nav-main" onclick="mentorContinueLearning()"><span>▶</span>Nauka</button><button onclick="showStats()"><span>📊</span>Postęp</button><button onclick="showSettings()"><span>⚙️</span>Więcej</button></nav>`);
  }

  const footer=document.querySelector('.footer');
  if(footer)footer.textContent=`UDT Trainer ${version} — trener operatora • PWA offline • inteligentne powtórki • dane lokalne`;
  const diag=document.querySelector('#diagnostics .version-pill');
  if(diag)diag.textContent=`Wersja ${version}`;
}
function weaknessRowsHTML(){
  const list=weaknessQuestions().slice(0,5);
  if(!list.length)return '<div class="small weakness-empty">Brak aktywnych słabości. Dobra robota.</div>';
  return list.map((q,i)=>{
    const st=state.stats[q.id],acc=Math.round((st.correct||0)/Math.max(1,st.attempts||0)*100);
    return `<button class="weak-row" onclick="openQuestionDetail(${q.id})"><span class="weak-num">${i+1}</span><span class="weak-text"><b>Pytanie ${q.id}</b><small>${escapeHtml(clean(q.q))}</small></span><span class="weak-meta">${st.wrong||0} bł. • ${acc}%</span></button>`
  }).join('')
}
function refreshCoach(){
  // Centrum Dowodzenia 6.2.0 renderuje Mentor w enhancements.js.
  // Funkcja zostaje jako kompatybilny no-op dla starszych wywołań.
  if(typeof renderHomeDashboard==='function')renderHomeDashboard();
}
function showSettings(){saveCurrentNote?.();hideMainPanels();document.getElementById('settingsPanel').classList.remove('hidden');ensureProState();document.getElementById('dailyGoalInput').value=state.dailyGoal||25;document.getElementById('autoExplainInput').checked=!!state.settings.autoExplain;window.scrollTo({top:0,behavior:'smooth'})}
function saveProSettings(){ensureProState();state.dailyGoal=Math.max(5,Math.min(200,Number(document.getElementById('dailyGoalInput').value)||25));state.settings.autoExplain=!!document.getElementById('autoExplainInput').checked;saveState();refreshCoach();alert('Ustawienia zapisane.')}

const __udt4Hide=window.hideMainPanels;window.hideMainPanels=function(){__udt4Hide();document.getElementById('settingsPanel')?.classList.add('hidden')};
const __udt4Back=window.backToMenu;window.backToMenu=function(){document.getElementById('settingsPanel')?.classList.add('hidden');__udt4Back();refreshCoach()};
const __udt4Dash=window.updateDashboard;window.updateDashboard=function(){ensureProState();__udt4Dash();refreshCoach()};
const __udt4Machine=window.updateMachineUI;window.updateMachineUI=function(){__udt4Machine();refreshCoach()};

// Extend stats with readiness + SRS + 30-day heatmap.
const __udt4Stats=window.showStats;
window.showStats=function(){__udt4Stats();setTimeout(()=>{const b=document.getElementById('statsBody');if(!b||document.getElementById('proStatsHead'))return;const r=readinessScore();b.insertAdjacentHTML('afterbegin',`<div id="proStatsHead" class="pro-stats-head"><div><span class="small">🎯 Szansa zdania*</span><b>${r}%</b><span class="small">${readinessLabel(r)}</span></div><div><span class="small">🧠 SRS do powtórki</span><b>${dueQuestions().length}</b><span class="small">pytań na teraz</span></div><div><span class="small">⏱ Średnia odpowiedź</span><b>${averageAnswerTime()||'—'}${averageAnswerTime()?' s':''}</b><span class="small">w trybie nauki</span></div></div><div class="activity-card"><b>📅 Regularność — 30 dni</b>${heatmapHTML()}</div><p class="small readiness-note">* Wskaźnik treningowy wyliczany z pokrycia bazy, opanowania, skuteczności i ostatnich próbnych egzaminów. Nie jest gwarancją wyniku oficjalnego egzaminu.</p>`);},0)};

window.addEventListener('DOMContentLoaded',()=>{ensureUdt4UI();ensureProState();refreshCoach();});
