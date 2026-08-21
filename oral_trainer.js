let oralPool=[],oralIndex=0,oralRevealed=false,oralStartedAt=0;
function oralSupported(){return activeMachine==='excavators'||activeMachine==='backhoes'}
function oralTasks(){return ORAL_TASKS[activeMachine]||[]}
function oralStat(task){return statFor(task.id)}
function oralPoolBySource(source){
  const all=oralTasks(),now=Date.now();
  if(source==='due')return all.filter(t=>{const s=state.stats[t.id];return s&&s.attempts>0&&(!s.due||s.due<=now)});
  if(source==='weak')return all.filter(t=>{const s=state.stats[t.id];return s&&(s.wrong||0)>0&&(Number(s.weakStreak)||0)<2});
  if(source==='unseen')return all.filter(t=>!(state.stats[t.id]?.attempts>0));
  return all;
}
function shuffleOral(a){const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x}
function showOralSetup(){
  document.getElementById('oralFinish')?.classList.add('hidden');document.getElementById('oralCore')?.classList.remove('hidden');
  if(!oralSupported()){alert('Tryb obsługowy jest obecnie dostępny dla koparki jednonaczyniowej kl. I i koparkoładowarki kl. III.');return}
  ['setup','dashboard','machinePicker','quiz','result','stats','browser','questionDetail','diagnostics','achievements'].forEach(id=>document.getElementById(id)?.classList.add('hidden'));
  document.getElementById('oralTrainer')?.classList.remove('hidden');
  document.getElementById('oralSession')?.classList.add('hidden');
  document.getElementById('oralSetup')?.classList.remove('hidden');
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
  oralPool=shuffleOral(sourcePool).slice(0,count);oralIndex=0;renderOralCard();
  document.getElementById('oralSetup').classList.add('hidden');document.getElementById('oralSession').classList.remove('hidden');
}
function renderOralCard(){
  const task=oralPool[oralIndex];if(!task){finishOralTraining();return}
  oralRevealed=false;oralStartedAt=Date.now();
  document.getElementById('oralPos').textContent=`${oralIndex+1}/${oralPool.length}`;
  document.getElementById('oralProgress').style.width=`${oralIndex/oralPool.length*100}%`;
  document.getElementById('oralCardTitle').textContent=task.title;
  document.getElementById('oralPrompt').textContent=task.prompt;
  document.getElementById('oralAnswer').classList.add('hidden');
  document.getElementById('oralRevealBtn').classList.remove('hidden');
  document.getElementById('oralRatings').classList.add('hidden');
  document.getElementById('oralSteps').innerHTML='';
  if(typeof oralVoiceResetForCard==='function')oralVoiceResetForCard();
  window.scrollTo({top:0,behavior:'smooth'});
}
function revealOralAnswer(){
  const task=oralPool[oralIndex];oralRevealed=true;
  document.getElementById('oralSteps').innerHTML=task.steps.map((x,i)=>`<li><b>${i+1}.</b> ${escapeHtmlOral(x)}</li>`).join('');
  document.getElementById('oralModelAnswer').textContent=task.answer;
  document.getElementById('oralTrap').textContent=task.trap;
  document.getElementById('oralAnswer').classList.remove('hidden');
  document.getElementById('oralRevealBtn').classList.add('hidden');
  document.getElementById('oralRatings').classList.remove('hidden');
}
function escapeHtmlOral(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function rateOral(grade){
  const task=oralPool[oralIndex],st=oralStat(task);st.attempts++;registerStudyDay();state.xp=(state.xp||0)+[1,3,7,10][grade];
  if(grade>=2){st.correct++;st.weakStreak=(st.wrong||0)>0?(Number(st.weakStreak)||0)+1:0;updateSRS(st,true);if(grade===3&&st.srsLevel<SRS_INTERVAL_DAYS.length-1){st.srsLevel++;st.due=Date.now()+SRS_INTERVAL_DAYS[st.srsLevel]*86400000}}
  else{st.wrong++;st.weakStreak=0;updateSRS(st,false)}
  st.lastOralGrade=grade;st.lastOralSeconds=Math.max(1,Math.round((Date.now()-oralStartedAt)/1000));saveState();oralIndex++;renderOralCard();
}
function finishOralTraining(){
  document.getElementById('oralProgress').style.width='100%';
  document.getElementById('oralCore')?.classList.add('hidden');const f=document.getElementById('oralFinish');f?.classList.remove('hidden');document.getElementById('oralFinishText').textContent=`Oceniono ${oralPool.length} odpowiedzi. Karty wróciły do tego samego systemu powtórek SRS co pytania testowe.`;
}
function cancelOral(){if(oralIndex&&oralIndex<oralPool.length&&!confirm('Zakończyć trening ustny? Zapisane oceny pozostaną.'))return;backToMenu()}
