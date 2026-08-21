let oralPool=[],oralIndex=0,oralRevealed=false,oralStartedAt=0;
let oralTimerHandle=null,oralTimerRemaining=0,oralTimerRunning=false,oralSessionScores=[];
function oralSupported(){return activeMachine==='excavators'||activeMachine==='backhoes'}
function oralTasks(){return ORAL_TASKS[activeMachine]||[]}
function oralStat(task){return statFor(task.id)}
function oralMastery(task){return state.stats[task.id]?.oralMastery||'practice'}
function oralPoolBySource(source){
  const all=oralTasks(),now=Date.now();
  if(source==='due')return all.filter(t=>{const s=state.stats[t.id];return s&&s.attempts>0&&(!s.due||s.due<=now)});
  if(source==='weak')return all.filter(t=>oralMastery(t)==='repeat'||(()=>{const s=state.stats[t.id];return s&&(s.wrong||0)>0&&(Number(s.weakStreak)||0)<2})());
  if(source==='unseen')return all.filter(t=>!(state.stats[t.id]?.attempts>0));
  if(source==='repeat')return all.filter(t=>oralMastery(t)==='repeat');
  return all;
}
function shuffleOral(a){const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x}
function showOralSetup(){
  stopOralTimer();
  document.getElementById('oralFinish')?.classList.add('hidden');document.getElementById('oralCore')?.classList.remove('hidden');
  if(!oralSupported()){alert('Tryb obsługowy jest obecnie dostępny dla koparki jednonaczyniowej kl. I i koparkoładowarki kl. III.');return}
  ['setup','dashboard','machinePicker','quiz','result','stats','browser','questionDetail','diagnostics','achievements'].forEach(id=>document.getElementById(id)?.classList.add('hidden'));
  document.getElementById('oralTrainer')?.classList.remove('hidden');document.getElementById('oralSession')?.classList.add('hidden');document.getElementById('oralSetup')?.classList.remove('hidden');
  const tasks=oralTasks(),seen=tasks.filter(t=>(state.stats[t.id]?.attempts||0)>0).length,due=oralPoolBySource('due').length,weak=oralPoolBySource('weak').length;
  document.getElementById('oralTitle').textContent=`Egzamin obsługowy — ${MACHINE_META[activeMachine].name}`;
  document.getElementById('oralStats').textContent=`${tasks.length} poleceń • przerobione ${seen} • do powtórki ${due} • słabe ${weak}`;
  const count=document.getElementById('oralCount');count.max=tasks.length;if(+count.value>tasks.length)count.value=tasks.length;
  window.scrollTo({top:0,behavior:'smooth'});
}
function startOralTraining(){
  const source=document.getElementById('oralSource').value;
  const count=Math.max(1,Math.min(+document.getElementById('oralCount').value||10,oralTasks().length));
  const sourcePool=oralPoolBySource(source);
  if(!sourcePool.length){document.getElementById('oralError').textContent='W tej puli nie ma jeszcze kart. Wybierz „Wszystkie polecenia”.';return}
  document.getElementById('oralError').textContent='';
  const random=document.getElementById('oralOrder').value==='random';
  oralPool=(random?shuffleOral(sourcePool):[...sourcePool]).slice(0,count);oralIndex=0;oralSessionScores=[];renderOralCard();
  document.getElementById('oralSetup').classList.add('hidden');document.getElementById('oralSession').classList.remove('hidden');
}
function renderOralCard(){
  stopOralTimer();
  const task=oralPool[oralIndex];if(!task){finishOralTraining();return}
  oralRevealed=false;oralStartedAt=Date.now();
  document.getElementById('oralPos').textContent=`Zadanie ${oralIndex+1}/${oralPool.length}`;
  document.getElementById('oralProgress').style.width=`${oralIndex/oralPool.length*100}%`;
  document.getElementById('oralCardTitle').textContent=task.title;document.getElementById('oralPrompt').textContent=task.prompt;
  document.getElementById('oralAnswer').classList.add('hidden');document.getElementById('oralRevealBtn').classList.remove('hidden');document.getElementById('oralRatings').classList.add('hidden');document.getElementById('oralSteps').innerHTML='';
  updateOralMasteryBadge();resetOralTimer();if(typeof oralVoiceResetForCard==='function')oralVoiceResetForCard();window.scrollTo({top:0,behavior:'smooth'});
}
function revealOralAnswer(){
  const task=oralPool[oralIndex];oralRevealed=true;
  document.getElementById('oralSteps').innerHTML=task.steps.map((x,i)=>`<li><b>${i+1}.</b> ${escapeHtmlOral(x)}</li>`).join('');
  document.getElementById('oralModelAnswer').textContent=task.answer;document.getElementById('oralTrap').textContent=task.trap;
  document.getElementById('oralAnswer').classList.remove('hidden');document.getElementById('oralRevealBtn').classList.add('hidden');document.getElementById('oralRatings').classList.remove('hidden');
}
function escapeHtmlOral(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function setOralMastery(status){
  const task=oralPool[oralIndex];if(!task)return;const st=oralStat(task);st.oralMastery=status;st.oralMasteryUpdated=Date.now();saveState();updateOralMasteryBadge();
}
function updateOralMasteryBadge(){
  const task=oralPool[oralIndex],el=document.getElementById('oralTaskStatus');if(!task||!el)return;
  const m=oralMastery(task),map={known:['🟢 Umiem','known'],practice:['🟡 Jeszcze ćwiczę','practice'],repeat:['🔴 Do powtórki','repeat']};el.textContent=map[m][0];el.className='oral-status-badge '+map[m][1];
}
function randomOralTask(){
  if(oralPool.length<2)return;let next=oralIndex;while(next===oralIndex)next=Math.floor(Math.random()*oralPool.length);oralIndex=next;renderOralCard();
}
function rateOral(grade){
  const task=oralPool[oralIndex],st=oralStat(task);st.attempts++;registerStudyDay();state.xp=(state.xp||0)+[1,3,7,10][grade];
  if(grade>=2){st.correct++;st.weakStreak=(st.wrong||0)>0?(Number(st.weakStreak)||0)+1:0;updateSRS(st,true);if(grade===3&&st.srsLevel<SRS_INTERVAL_DAYS.length-1){st.srsLevel++;st.due=Date.now()+SRS_INTERVAL_DAYS[st.srsLevel]*86400000}}
  else{st.wrong++;st.weakStreak=0;updateSRS(st,false)}
  st.lastOralGrade=grade;st.lastOralSeconds=Math.max(1,Math.round((Date.now()-oralStartedAt)/1000));
  if(typeof oralLastAnalysis!=='undefined'&&oralLastAnalysis){st.lastOralAiScore=oralLastAnalysis.score;st.oralAiTotal=(st.oralAiTotal||0)+oralLastAnalysis.score;st.oralAiCount=(st.oralAiCount||0)+1;oralSessionScores.push(oralLastAnalysis.score)}
  if(grade===3&&oralMastery(task)==='practice')st.oralMastery='known';if(grade===0)st.oralMastery='repeat';saveState();oralIndex++;renderOralCard();
}
function finishOralTraining(){
  stopOralTimer();document.getElementById('oralProgress').style.width='100%';document.getElementById('oralCore')?.classList.add('hidden');const f=document.getElementById('oralFinish');f?.classList.remove('hidden');
  const avg=oralSessionScores.length?Math.round(oralSessionScores.reduce((a,b)=>a+b,0)/oralSessionScores.length):null;
  document.getElementById('oralFinishText').textContent=`Oceniono ${oralPool.length} odpowiedzi.${avg!==null?' Średni wynik analizy: '+avg+'%.':''} Karty zapisano w tym samym systemie SRS.`;
}
function oralTimerSeconds(){return +(document.getElementById('oralTimerSetting')?.value||0)}
function resetOralTimer(){oralTimerRemaining=oralTimerSeconds();renderOralTimer();document.getElementById('oralTimerBtn').textContent=oralTimerRemaining?'▶ Start':'Bez limitu';document.getElementById('oralTimerBtn').disabled=!oralTimerRemaining}
function renderOralTimer(){const el=document.getElementById('oralTimer');if(!el)return;if(!oralTimerRemaining){el.textContent='∞';return}const m=Math.floor(oralTimerRemaining/60),s=oralTimerRemaining%60;el.textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;el.classList.toggle('urgent',oralTimerRemaining<=15)}
function toggleOralTimer(){oralTimerRunning?stopOralTimer():startOralTimer()}
function startOralTimer(){if(!oralTimerRemaining)return;oralTimerRunning=true;document.getElementById('oralTimerBtn').textContent='⏸ Pauza';oralTimerHandle=setInterval(()=>{oralTimerRemaining--;renderOralTimer();if(oralTimerRemaining<=0){stopOralTimer();document.getElementById('oralTimerBtn').textContent='Koniec';if(typeof oralSetVoiceStatus==='function')oralSetVoiceStatus('⏰ Czas minął. Dokończ zdanie i przejdź do analizy.','bad');}},1000)}
function stopOralTimer(){if(oralTimerHandle)clearInterval(oralTimerHandle);oralTimerHandle=null;oralTimerRunning=false;const b=document.getElementById('oralTimerBtn');if(b&&!b.disabled&&oralTimerRemaining>0)b.textContent='▶ Wznów'}
function showOralStatistics(){
  const root=document.getElementById('oralStatistics');if(!root)return;if(!root.classList.contains('hidden')){root.classList.add('hidden');return}
  const tasks=oralTasks(),stats=tasks.map(t=>({t,s:state.stats[t.id]||{},m:oralMastery(t)}));
  const seen=stats.filter(x=>(x.s.attempts||0)>0).length,known=stats.filter(x=>x.m==='known').length,practice=stats.filter(x=>x.m==='practice').length,repeat=stats.filter(x=>x.m==='repeat').length;
  const ai=stats.filter(x=>x.s.oralAiCount).map(x=>x.s.oralAiTotal/x.s.oralAiCount),avg=ai.length?Math.round(ai.reduce((a,b)=>a+b,0)/ai.length):0;
  const hardest=stats.filter(x=>(x.s.attempts||0)>0).sort((a,b)=>((b.s.wrong||0)/(b.s.attempts||1))-((a.s.wrong||0)/(a.s.attempts||1))).slice(0,5);
  root.innerHTML=`<div class="toolbar"><h3>📊 Statystyki odpowiedzi ustnych</h3><button class="secondary" onclick="showOralStatistics()">Zamknij</button></div><div class="oral-stat-grid"><div><b>${seen}/${tasks.length}</b><span>Przerobione</span></div><div><b>${known}</b><span>Umiem</span></div><div><b>${practice}</b><span>Ćwiczę</span></div><div><b>${repeat}</b><span>Do powtórki</span></div><div><b>${avg}%</b><span>Średni wynik AI</span></div></div><h4>Najtrudniejsze zadania</h4><ol>${hardest.map(x=>`<li>${escapeHtmlOral(x.t.title)} — błędy ${x.s.wrong||0}/${x.s.attempts||0}</li>`).join('')||'<li>Brak danych — najpierw rozwiąż kilka zadań.</li>'}</ol>`;root.classList.remove('hidden');
}
function cancelOral(){stopOralTimer();if(oralIndex&&oralIndex<oralPool.length&&!confirm('Zakończyć trening ustny? Zapisane oceny pozostaną.'))return;backToMenu()}
