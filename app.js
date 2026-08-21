const MACHINE_META={
  cranes:{name:'Żurawie wieżowe',short:'Żurawie',emoji:'🏗️',questions:CRANE_QUESTIONS,images:309,key:'udt_zurawie_v2',session:'udt_zurawie_v2_session'},
  excavators:{name:'Koparki jednonaczyniowe kl. I',short:'Koparki',emoji:'🚜',questions:EXCAVATOR_QUESTIONS,images:50,key:'udt_koparki_kl1_v1',session:'udt_koparki_kl1_v1_session'},
  backhoes:{name:'Koparkoładowarki kl. III',short:'Koparkoład.',emoji:'🚜',questions:BACKHOE_QUESTIONS,images:50,key:'udt_koparkoladowarki_kl3_v1',session:'udt_koparkoladowarki_kl3_v1_session'},
  loaders:{name:'Ładowarki jednonaczyniowe kl. I',short:'Ładowarki',emoji:'🚜',questions:LOADER_QUESTIONS,images:50,key:'udt_ladowarki_kl1_v1',session:'udt_ladowarki_kl1_v1_session'}
};
const HAD_ACTIVE_MACHINE=!!localStorage.getItem('udt_active_machine');
let activeMachine=localStorage.getItem('udt_active_machine')||'cranes';
if(!MACHINE_META[activeMachine])activeMachine='cranes';
let QUESTIONS=MACHINE_META[activeMachine].questions;


let KEY=MACHINE_META[activeMachine].key;
let SESSION_KEY=MACHINE_META[activeMachine].session;
const defaultState=()=>({theme:'dark',stats:{},favorites:[],history:[],notes:{},studyDays:[],xp:0,totalCorrect:0,currentStreakCorrect:0,bestStreakCorrect:0});
let state=loadState(), pool=[], current=0, correct=0, answered=false, mode='learn', answersLog=[];let examSimulator=false,examDeadline=0,examStartedAt=0,examTimerHandle=null,examAnswers={},examFlags=new Set();

function updateMachineUI(){
  const m=MACHINE_META[activeMachine];
  QUESTIONS=m.questions;KEY=m.key;SESSION_KEY=m.session;
  const sub=document.getElementById('appSubtitle');if(sub)sub.textContent=`${m.emoji} ${m.name} • ${QUESTIONS.length} pytań • ${m.images} ilustracji • nauka offline`;
  const lab=document.getElementById('moduleButtonLabel');if(lab)lab.textContent=m.short;
  const c=document.getElementById('count');if(c){c.max=QUESTIONS.length;if(Number(c.value)>QUESTIONS.length)c.value=Math.min(20,QUESTIONS.length)}
  const rf=document.getElementById('rangeFrom');if(rf)rf.max=QUESTIONS.length;
  const rt=document.getElementById('rangeTo');if(rt){rt.max=QUESTIONS.length;rt.value=QUESTIONS.length}
  document.getElementById('machineCranes')?.classList.toggle('active',activeMachine==='cranes');
  document.getElementById('machineExcavators')?.classList.toggle('active',activeMachine==='excavators');
  document.getElementById('machineBackhoes')?.classList.toggle('active',activeMachine==='backhoes');
  document.getElementById('machineLoaders')?.classList.toggle('active',activeMachine==='loaders');
  updateModuleBadges();
}
function setMachine(id){
  if(!MACHINE_META[id])return false;
  clearInterval(examTimerHandle);
  activeMachine=id;
  localStorage.setItem('udt_active_machine',id);
  QUESTIONS=MACHINE_META[id].questions;KEY=MACHINE_META[id].key;SESSION_KEY=MACHINE_META[id].session;
  state=loadState();pool=[];current=0;correct=0;answered=false;answersLog=[];examSimulator=false;examAnswers={};examFlags=new Set();
  updateMachineUI();updateDashboard();updatePoolInfo();
  return true;
}
function showMachinePicker(addHistory=true){
  clearInterval(examTimerHandle);examSimulator=false;
  document.getElementById('quiz')?.classList.add('hidden');
  document.getElementById('result')?.classList.add('hidden');
  document.getElementById('stats')?.classList.add('hidden');
  document.getElementById('setup')?.classList.add('hidden');
  document.getElementById('dashboard')?.classList.add('hidden');
  document.getElementById('oralTrainer')?.classList.add('hidden');
  document.getElementById('machinePicker')?.classList.remove('hidden');
  if(addHistory && history.state?.udtView!=='modules')history.pushState({udtView:'modules'},'');
  window.scrollTo({top:0,behavior:'smooth'});
}
function hideMachinePicker(){document.getElementById('machinePicker')?.classList.add('hidden')}
function enterMachine(id,addHistory=true){
  if(!setMachine(id))return;
  hideMachinePicker();backToMenu();
  if(addHistory && (history.state?.udtView!=='module' || history.state?.machine!==id))history.pushState({udtView:'module',machine:id},'');
}
function selectMachine(id){enterMachine(id,true)}
function migrateLegacySRS(x){
  x=x&&typeof x==='object'?x:{};
  x.stats=x.stats&&typeof x.stats==='object'?x.stats:{};
  // 5.3: state.stats jest jedynym źródłem prawdy dla SRS.
  // Starsze 5.2 zapisywało równolegle state.srs; migrujemy tylko brakujące dane,
  // a następnie usuwamy duplikat, żeby dashboard i sesje liczyły dokładnie to samo.
  const legacy=x.srs&&typeof x.srs==='object'?x.srs:null;
  if(!legacy)return x;
  for(const [id,old] of Object.entries(legacy)){
    const st=x.stats[id];
    if(!st||!old)continue;
    const hasCanonical=Number(st.lastAttempt)>0||Number(st.due)>0||Number(st.srsLevel)>0;
    if(!hasCanonical){
      st.srsLevel=Math.max(0,Math.min(6,Number(old.box)||0));
      st.due=Number(old.due)||0;
      st.lastAttempt=Number(old.last)||0;
    }
  }
  delete x.srs;
  return x;
}
function loadState(){try{const raw=JSON.parse(localStorage.getItem(KEY)||'{}');const x={...defaultState(),...raw};x.stats=x.stats||{};x.favorites=Array.isArray(x.favorites)?x.favorites:[];x.history=Array.isArray(x.history)?x.history:[];x.notes=x.notes||{};x.studyDays=Array.isArray(x.studyDays)?x.studyDays:[];return migrateLegacySRS(x)}catch(e){return defaultState()}}
function saveState(){localStorage.setItem(KEY,JSON.stringify(state));updateDashboard();updateModuleBadges()}
function statFor(id){
  const k=String(id);
  const st=state.stats[k]||(state.stats[k]={attempts:0,correct:0,wrong:0,weakStreak:0});
  st.attempts=Number(st.attempts)||0;
  st.correct=Number(st.correct)||0;
  st.wrong=Number(st.wrong)||0;
  st.weakStreak=Number(st.weakStreak)||0;
  st.srsLevel=Number(st.srsLevel)||0;
  st.due=Number(st.due)||0;
  st.lastAttempt=Number(st.lastAttempt)||0;
  return st
}
const SRS_INTERVAL_DAYS=[0,1,3,7,14,30,60];
function migrateAllStoredSRS(){
  for(const m of Object.values(MACHINE_META)){
    try{
      const raw=localStorage.getItem(m.key);if(!raw)continue;
      const parsed=JSON.parse(raw);if(!parsed?.srs)continue;
      localStorage.setItem(m.key,JSON.stringify(migrateLegacySRS(parsed)));
    }catch(e){console.warn('SRS migration skipped for',m.key,e)}
  }
}
migrateAllStoredSRS();
function updateSRS(st,isGood){
  const now=Date.now();
  st.lastAttempt=now;
  if(isGood)st.srsLevel=Math.min(SRS_INTERVAL_DAYS.length-1,(Number(st.srsLevel)||0)+1);else st.srsLevel=0;
  const days=isGood?SRS_INTERVAL_DAYS[st.srsLevel]:0;
  st.due=now+days*86400000;
}
function srsDueQuestions(){const now=Date.now();return QUESTIONS.filter(q=>{const st=state.stats[q.id];return st&&st.attempts>0&&(!st.due||st.due<=now)})}
function moduleMasteryPercent(id){
  const m=MACHINE_META[id];if(!m)return 0;let st;try{st=JSON.parse(localStorage.getItem(m.key)||'{}').stats||{}}catch{st={}}
  const sum=m.questions.reduce((a,q)=>{const x=st[q.id];if(!x||x.attempts<2)return a;const r=x.correct/Math.max(1,x.attempts);return a+(x.attempts>=3&&r>=.8?1:r>=.5?.5:.15)},0);
  return Math.round(sum/Math.max(1,m.questions.length)*100)
}
function updateModuleBadges(){
  const map={cranes:'badgeCranes',excavators:'badgeExcavators',backhoes:'badgeBackhoes',loaders:'badgeLoaders'};
  for(const [id,elid] of Object.entries(map)){const el=document.getElementById(elid);if(!el)continue;const pct=id===activeMachine?masteryPercent():moduleMasteryPercent(id);el.classList.toggle('hidden',pct<90);el.title=`Opanowanie: ${pct}%`}
}
function isWeakQuestion(q){
  const st=state.stats[q.id];
  return !!st && (st.wrong||0)>0 && (Number(st.weakStreak)||0)<2
}
function weaknessWeight(q){
  const st=state.stats[q.id];
  if(!st)return -1;
  const rate=(st.correct||0)/Math.max(1,st.attempts||0);
  return (st.wrong||0)*35+(1-rate)*100-Math.min(st.weakStreak||0,2)*30+Math.min(st.attempts||0,10)
}
function weaknessQuestions(){
  return QUESTIONS.filter(isWeakQuestion).sort((a,b)=>weaknessWeight(b)-weaknessWeight(a))
}
function startWeaknessTraining(){
  const list=weaknessQuestions();
  if(!list.length){
    const msg='Brak aktywnych słabości. Pytanie trafia tutaj po błędzie i wypada po 2 kolejnych poprawnych odpowiedziach.';
    const err=document.getElementById('setupError');if(err)err.textContent=msg;else alert(msg);
    return
  }
  document.getElementById('mode').value='learn';
  const count=Math.min(Math.max(1,Number(document.getElementById('count').value)||20),list.length);
  startNew(list.slice(0,count))
}
function todayKey(){return new Date().toISOString().slice(0,10)}
function registerStudyDay(){const d=todayKey();if(!state.studyDays.includes(d)){state.studyDays.push(d);state.studyDays=state.studyDays.slice(-400)}}
function studyStreak(){const set=new Set(state.studyDays);let d=new Date(),n=0;for(;;){const k=d.toISOString().slice(0,10);if(!set.has(k))break;n++;d.setDate(d.getDate()-1)}return n}
function masteryFor(q){const s=state.stats[q.id];if(!s||s.attempts<2)return 0;const rate=s.correct/s.attempts;if(s.attempts>=3&&rate>=.8)return 1;if(rate>=.5)return .5;return .15}
function masteryPercent(){return Math.round(QUESTIONS.reduce((a,q)=>a+masteryFor(q),0)/QUESTIONS.length*100)}
function xpLevel(){const xp=state.xp||0,level=Math.floor(Math.sqrt(xp/100))+1,start=(level-1)**2*100,end=level**2*100;return {level,start,end,pct:Math.round((xp-start)/Math.max(1,end-start)*100)}}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function clean(t){return String(t||'').replace(/\s+/g,' ').trim()}
function smartWeight(q){const st=state.stats[q.id];if(!st||!st.attempts)return 65+Math.random()*18;const rate=st.correct/st.attempts,now=Date.now(),dueBoost=(!st.due||st.due<=now)?140:Math.max(0,50-(st.due-now)/86400000);return dueBoost+(1-rate)*100+Math.min(st.wrong,5)*14-Math.min(st.srsLevel||0,6)*4+Math.random()*8}
function filteredQuestions(){const source=document.getElementById('source').value;let list=[...QUESTIONS];if(source==='smart'){list.sort((a,b)=>smartWeight(b)-smartWeight(a));return list}if(source==='weaknesses'){return weaknessQuestions()}if(source==='images')list=list.filter(q=>q.img);if(source==='noimages')list=list.filter(q=>!q.img);if(source==='wrong')list=list.filter(q=>(state.stats[q.id]?.wrong||0)>0);if(source==='unseen')list=list.filter(q=>(state.stats[q.id]?.attempts||0)===0);if(source==='favorites')list=list.filter(q=>state.favorites.includes(q.id));if(source==='range'){const a=+document.getElementById('rangeFrom').value||1,b=+document.getElementById('rangeTo').value||949;list=list.filter(q=>q.id>=Math.min(a,b)&&q.id<=Math.max(a,b))}if(source==='hard')list=list.filter(q=>(state.stats[q.id]?.attempts||0)>0).sort((a,b)=>{const sa=state.stats[a.id],sb=state.stats[b.id];return (sa.correct/sa.attempts)-(sb.correct/sb.attempts)||(sb.attempts-sa.attempts)});else shuffle(list);return list}
function updatePoolInfo(){const list=filteredQuestions();document.getElementById('poolInfo').textContent=`Dostępnych w tej puli: ${list.length}.`}
function seededShuffle(list,seed){let a=[...list],x=seed>>>0;for(let i=a.length-1;i>0;i--){x=(x*1664525+1013904223)>>>0;const j=x%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function startDailyChallenge(){const d=new Date(),seed=Number(`${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`);document.getElementById('mode').value='learn';examSimulator=false;startNew(seededShuffle(QUESTIONS,seed).slice(0,20))}
function startExamSimulator(){if(!confirm('Uruchomić symulację PRO: 30 pytań, 30 minut, próg treningowy 75%? Odpowiedzi poznasz dopiero na końcu.'))return;document.getElementById('mode').value='exam';examSimulator=true;examAnswers={};examFlags=new Set();examStartedAt=Date.now();examDeadline=examStartedAt+30*60*1000;startNew(shuffle([...QUESTIONS]).slice(0,30));startExamTimer()}
function startExamTimer(){clearInterval(examTimerHandle);const stat=document.getElementById('timerStat'),out=document.getElementById('examTimer');if(!examSimulator){stat.classList.add('hidden');out.classList.remove('timer-danger');return}stat.classList.remove('hidden');const tick=()=>{const left=Math.max(0,examDeadline-Date.now()),sec=Math.ceil(left/1000),m=Math.floor(sec/60),s=sec%60;out.textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;out.classList.toggle('timer-danger',sec<=300);if(left<=0){clearInterval(examTimerHandle);alert('Czas minął. Test zostanie zakończony.');finish(true)}};tick();examTimerHandle=setInterval(tick,1000)}
function startNew(customPool=null){document.getElementById('setupError').textContent='';if(!customPool)examSimulator=false;mode=document.getElementById('mode').value;let list=customPool||filteredQuestions();let n=Math.max(1,Math.min(parseInt(document.getElementById('count').value||20,10),list.length));if(!list.length){document.getElementById('setupError').textContent='Ta pula jest pusta. Najpierw przerób kilka pytań albo dodaj ulubione.';return}pool=customPool?[...customPool]:list.slice(0,n);current=0;correct=0;answered=false;answersLog=[];showQuiz();saveSession();render()}
function showQuiz(){document.getElementById('setup').classList.add('hidden');document.getElementById('dashboard').classList.add('hidden');document.getElementById('result').classList.add('hidden');document.getElementById('stats').classList.add('hidden');const q=document.getElementById('quiz');q.classList.remove('hidden');q.classList.toggle('exam-mode',examSimulator)}
let answerStartedAt=Date.now();
const answerEffects=[];
function addAnswerEffect(fn){if(typeof fn==='function'&&!answerEffects.includes(fn))answerEffects.push(fn)}
function runAnswerEffects(ctx){for(const fn of answerEffects){try{fn(ctx)}catch(e){console.warn('Answer effect failed',e)}}}
function render(){answerStartedAt=Date.now();answered=false;const item=pool[current],saved=examAnswers[current];if(examSimulator&&saved)answered=true;document.getElementById('qid').textContent=`Pytanie ${item.id}`;document.getElementById('q').textContent=clean(item.q);document.getElementById('pos').textContent=`${current+1}/${pool.length}`;document.getElementById('ok').textContent=correct;document.getElementById('pct').textContent=`${Math.round(correct/Math.max(1,answersLog.length)*100)||0}%`;document.getElementById('bar').style.width=`${(examSimulator?(current+1):current)/pool.length*100}%`;document.getElementById('feedback').className='feedback';document.getElementById('feedback').textContent='';document.getElementById('next').classList.add('hidden');document.getElementById('favBtn').textContent=state.favorites.includes(item.id)?'★':'☆';document.getElementById('noteText').value=state.notes[item.id]||'';const imageBox=document.getElementById('imageBox');imageBox.innerHTML='';if(item.img){const img=document.createElement('img');img.className='qimg';img.src=item.img;img.alt='Rysunek do pytania';img.onclick=()=>openImage(item.img);imageBox.appendChild(img)}const box=document.getElementById('answers');box.innerHTML='';item.a.forEach((ans,idx)=>{const b=document.createElement('button');b.className='answer';b.textContent=`${String.fromCharCode(65+idx)}. ${clean(ans)}`;if(saved&&saved.chosen===idx)b.classList.add('selected');b.onclick=()=>choose(idx);box.appendChild(b)});renderExamNavigator();window.scrollTo({top:0,behavior:'smooth'})}
function renderExamNavigator(){const nav=document.getElementById('examNavigator');if(!nav)return;if(!examSimulator){nav.innerHTML='';return}nav.innerHTML=pool.map((q,i)=>`<button aria-label="Pytanie ${i+1}${examAnswers[i]?', odpowiedziane':', bez odpowiedzi'}${examFlags.has(i)?', oznaczone':''}" class="${i===current?'current ':''}${examAnswers[i]?'done ':'unanswered '}${examFlags.has(i)?'flagged':''}" onclick="goToExamQuestion(${i})">${i+1}</button>`).join('');const f=document.getElementById('flagBtn');if(f)f.textContent=examFlags.has(current)?'🚩 Oznaczone':'🚩 Oznacz';updateExamStatus()}
function updateExamStatus(){if(!examSimulator)return;const answered=Object.keys(examAnswers).length;document.getElementById('examAnswered').textContent=answered;document.getElementById('examUnanswered').textContent=pool.length-answered;document.getElementById('examFlagged').textContent=examFlags.size}
function goToExamQuestion(i){if(!examSimulator||i<0||i>=pool.length)return;current=i;render();saveSession()}
function examPrev(){goToExamQuestion(Math.max(0,current-1))}
function examNext(){goToExamQuestion(Math.min(pool.length-1,current+1))}
function toggleExamFlag(){if(examFlags.has(current))examFlags.delete(current);else examFlags.add(current);renderExamNavigator();saveSession()}
function choose(idx){if(answered&&!examSimulator)return;const item=pool[current],buttons=[...document.querySelectorAll('.answer')],isGood=idx===item.correct;if(examSimulator){const old=examAnswers[current];if(old){correct-=old.isGood?1:0;answersLog=answersLog.filter(x=>x.index!==current)}examAnswers[current]={chosen:idx,correct:item.correct,isGood};correct+=isGood?1:0;answersLog.push({index:current,id:item.id,chosen:idx,correct:item.correct,isGood});answered=true;buttons.forEach((b,i)=>b.classList.toggle('selected',i===idx));document.getElementById('ok').textContent=correct;document.getElementById('pct').textContent=`${Math.round(correct/Math.max(1,answersLog.length)*100)}%`;renderExamNavigator();saveSession();return}answered=true;buttons.forEach(b=>b.disabled=true);if(isGood)correct++;const st=statFor(item.id);st.attempts++;registerStudyDay();state.xp=(state.xp||0)+(isGood?10:3);if(isGood){st.correct++;st.weakStreak=(st.wrong||0)>0?(Number(st.weakStreak)||0)+1:0;updateSRS(st,true);state.totalCorrect=(state.totalCorrect||0)+1;state.currentStreakCorrect=(state.currentStreakCorrect||0)+1;state.bestStreakCorrect=Math.max(state.bestStreakCorrect||0,state.currentStreakCorrect)}else{st.wrong++;st.weakStreak=0;updateSRS(st,false);state.currentStreakCorrect=0}answersLog.push({id:item.id,chosen:idx,correct:item.correct,isGood});buttons[item.correct]?.classList.add('good');if(!isGood)buttons[idx]?.classList.add('bad');const fb=document.getElementById('feedback');fb.className=`feedback ${isGood?'good':'bad'}`;fb.textContent=isGood?'Dobrze. Jedziemy dalej.':`Źle. Poprawna: ${String.fromCharCode(65+item.correct)}. ${clean(item.correctText)}`;document.getElementById('ok').textContent=correct;document.getElementById('pct').textContent=`${Math.round(correct/(current+1)*100)}%`;document.getElementById('bar').style.width=`${(current+1)/pool.length*100}%`;document.getElementById('next').classList.remove('hidden');const elapsed=Math.max(1,Math.round((Date.now()-answerStartedAt)/1000));runAnswerEffects({item,idx,isGood,elapsed});saveState();saveSession()}
function nextQuestion(){if(!answered)return;if(examSimulator){examNext();return}current++;if(current>=pool.length)finish(true);else{saveSession();render()}}
function launchConfetti(){
  const layer=document.createElement('div');layer.className='confetti-layer';document.body.appendChild(layer);
  const chars=['🎉','✨','⭐','🏆','🎊'];
  for(let i=0;i<70;i++){const e=document.createElement('span');e.textContent=chars[i%chars.length];e.style.left=(Math.random()*100)+'vw';e.style.animationDelay=(Math.random()*.7)+'s';e.style.animationDuration=(1.8+Math.random()*1.8)+'s';e.style.fontSize=(14+Math.random()*18)+'px';layer.appendChild(e)}
  setTimeout(()=>layer.remove(),4200)
}
function finish(completed=false){if(examSimulator){const unanswered=pool.length-Object.keys(examAnswers).length;if(unanswered&&!confirm(`Pozostało ${unanswered} pytań bez odpowiedzi. Na pewno zakończyć?`))return}else if(!completed&&!confirm('Zakończyć test teraz? Wynik zostanie policzony tylko z udzielonych odpowiedzi.'))return;clearInterval(examTimerHandle);const wasSimulator=examSimulator;const endedAt=Date.now();const elapsedSec=wasSimulator?Math.max(0,Math.round((endedAt-(examStartedAt||endedAt))/1000)):0;if(wasSimulator){answersLog.forEach(x=>{const st=statFor(x.id);st.attempts++;if(x.isGood){st.correct++;st.weakStreak=(st.wrong||0)>0?(Number(st.weakStreak)||0)+1:0;updateSRS(st,true)}else{st.wrong++;st.weakStreak=0;updateSRS(st,false)}});registerStudyDay();state.xp=(state.xp||0)+correct*10+(answersLog.length-correct)*3;state.totalCorrect=(state.totalCorrect||0)+correct}examSimulator=false;document.getElementById('timerStat').classList.add('hidden');const answeredCount=answersLog.length;if(!answeredCount){backToMenu();return}localStorage.removeItem(SESSION_KEY);document.getElementById('quiz').classList.add('hidden');document.getElementById('result').classList.remove('hidden');const pct=Math.round(correct/answeredCount*100),wrong=answersLog.filter(x=>!x.isGood),unansweredItems=wasSimulator?pool.filter((q,i)=>!examAnswers[i]):[];document.getElementById('resultText').textContent=`${correct}/${answeredCount} poprawnych — ${pct}%.`;const timeText=wasSimulator?`${String(Math.floor(elapsedSec/60)).padStart(2,'0')}:${String(elapsedSec%60).padStart(2,'0')}`:'';document.getElementById('resultMeta').innerHTML=(completed?`Ukończono ${answeredCount} pytań.`:`Odpowiedziano na ${answeredCount} z ${pool.length} pytań.`)+(wasSimulator?`<div class="${pct>=75?'exam-pass':'exam-fail'}">${pct>=75?'✅ SYMULACJA ZALICZONA':'❌ SYMULACJA NIEZALICZONA'} — próg treningowy 75%</div><div class="exam-summary"><div><span class="small">Poprawne</span><b>${correct}</b></div><div><span class="small">Błędne</span><b>${wrong.length}</b></div><div><span class="small">Pominięte</span><b>${unansweredItems.length}</b></div></div><div class="result-time">⏱️ Czas rozwiązania: <b>${timeText}</b></div>`:'');state.history.unshift({date:new Date().toISOString(),mode:wasSimulator?'simulator':mode,count:answeredCount,correct,pct,completed,elapsedSec,unanswered:unansweredItems.length});state.history=state.history.slice(0,30);saveState();if(wasSimulator&&pct>=75)setTimeout(launchConfetti,120);renderReview(wrong,unansweredItems);document.getElementById('retryWrongBtn').classList.toggle('hidden',wrong.length===0);window.__lastWrong=wrong.map(x=>QUESTIONS.find(q=>q.id===x.id))}

function renderReview(wrong,unansweredItems=[]){const box=document.getElementById('reviewBox');box.innerHTML='';if(!wrong.length&&!unansweredItems.length){box.innerHTML='<div class="feedback good" style="display:block">Bez błędów. No i tak ma być.</div>';return}if(wrong.length){const title=document.createElement('h2');title.textContent=`Błędne odpowiedzi (${wrong.length})`;box.appendChild(title);wrong.forEach(x=>{const q=QUESTIONS.find(z=>z.id===x.id),d=document.createElement('div');d.className='review';d.innerHTML=`<b>Pytanie ${q.id}: ${escapeHtml(clean(q.q))}</b><div class="badText">Twoja: ${letter(x.chosen)}. ${escapeHtml(clean(q.a[x.chosen]))}</div><div class="goodText">Poprawna: ${letter(q.correct)}. ${escapeHtml(clean(q.correctText))}</div>`;box.appendChild(d)})}if(unansweredItems.length){const title=document.createElement('h2');title.textContent=`Pominięte pytania (${unansweredItems.length})`;box.appendChild(title);unansweredItems.forEach(q=>{const d=document.createElement('div');d.className='review';d.innerHTML=`<b>Pytanie ${q.id}: ${escapeHtml(clean(q.q))}</b><div class="goodText">Poprawna: ${letter(q.correct)}. ${escapeHtml(clean(q.correctText))}</div>`;box.appendChild(d)})}}

function retryWrong(){const p=(window.__lastWrong||[]).filter(Boolean);if(p.length)startNew(shuffle(p))}
function backToMenu(){document.getElementById('oralTrainer')?.classList.add('hidden');clearInterval(examTimerHandle);examSimulator=false;document.getElementById('timerStat').classList.add('hidden');document.getElementById('quiz').classList.add('hidden');document.getElementById('result').classList.add('hidden');document.getElementById('stats').classList.add('hidden');document.getElementById('setup').classList.remove('hidden');document.getElementById('dashboard').classList.remove('hidden');updatePoolInfo();updateDashboard();checkResume()}
function toggleFavorite(){const id=pool[current].id,i=state.favorites.indexOf(id);if(i>=0)state.favorites.splice(i,1);else state.favorites.push(id);saveState();document.getElementById('favBtn').textContent=state.favorites.includes(id)?'★':'☆'}
function saveSession(){localStorage.setItem(SESSION_KEY,JSON.stringify({poolIds:pool.map(q=>q.id),current,correct,answered,mode,answersLog,examSimulator,examDeadline,examStartedAt,examAnswers,examFlags:[...examFlags]}))}
function checkResume(){try{const s=JSON.parse(localStorage.getItem(SESSION_KEY)||'null');document.getElementById('resumeBtn').classList.toggle('hidden',!s||!s.poolIds?.length)}catch(e){document.getElementById('resumeBtn').classList.add('hidden')}}
function resumeSession(){try{const s=JSON.parse(localStorage.getItem(SESSION_KEY));pool=s.poolIds.map(id=>QUESTIONS.find(q=>q.id===id)).filter(Boolean);current=s.current||0;correct=s.correct||0;answered=false;mode=s.mode||'learn';answersLog=s.answersLog||[];examSimulator=!!s.examSimulator;examDeadline=s.examDeadline||0;examStartedAt=s.examStartedAt||Date.now();examAnswers=s.examAnswers||{};examFlags=new Set(s.examFlags||[]);showQuiz();render();startExamTimer()}catch(e){localStorage.removeItem(SESSION_KEY);backToMenu()}}
function updateDashboard(){const vals=Object.values(state.stats),attempts=vals.reduce((a,x)=>a+x.attempts,0),corrects=vals.reduce((a,x)=>a+x.correct,0),wrong=vals.filter(x=>x.wrong>0).length,seen=vals.filter(x=>x.attempts>0).length,mastery=masteryPercent(),lv=xpLevel();document.getElementById('dAccuracy').textContent=`${attempts?Math.round(corrects/attempts*100):0}%`;document.getElementById('dSeen').textContent=`${seen}/${QUESTIONS.length}`;document.getElementById('dWrong').textContent=wrong;document.getElementById('dStreak').textContent=`${studyStreak()} dni`;document.getElementById('dMastery').textContent=`${mastery}%`;document.getElementById('masteryBar').style.width=`${mastery}%`;document.getElementById('dLevel').textContent=`Poziom ${lv.level}`;document.getElementById('dXpText').textContent=`${state.xp||0} XP • do kolejnego: ${Math.max(0,lv.end-(state.xp||0))}`;document.getElementById('xpBar').style.width=`${lv.pct}%`;const due=srsDueQuestions(),hard=QUESTIONS.filter(q=>(state.stats[q.id]?.wrong||0)>0).sort((a,b)=>smartWeight(b)-smartWeight(a)).slice(0,3);document.getElementById('recommendText').textContent=due.length?`SRS czeka: ${due.length} pytań jest już do powtórki. Uruchom Inteligentne powtórki.`:hard.length?`Powtórz pytania ${hard.map(q=>q.id).join(', ')} — to obecnie Twoje najsłabsze punkty.`:seen?`Dobra robota. SRS sam przypomni pytania, gdy przyjdzie pora na utrwalenie.`:'Rozwiąż pierwszą sesję, a aplikacja wskaże słabe punkty.'}
function showStats(){hideMainPanels();document.getElementById('stats').classList.remove('hidden');const vals=Object.values(state.stats),attempts=vals.reduce((a,x)=>a+x.attempts,0),corrects=vals.reduce((a,x)=>a+x.correct,0);const hard=QUESTIONS.filter(q=>(state.stats[q.id]?.attempts||0)>0).sort((a,b)=>smartWeight(b)-smartWeight(a)).slice(0,12);let html=`<div class="row"><div class="stat"><span class="small">Łączne odpowiedzi</span><b>${attempts}</b></div><div class="stat"><span class="small">Poprawne</span><b>${corrects}</b></div><div class="stat"><span class="small">Najlepsza seria</span><b>${state.bestStreakCorrect||0}</b></div><div class="stat"><span class="small">Opanowanie</span><b>${masteryPercent()}%</b></div></div><h2 style="margin-top:18px">Najtrudniejsze pytania</h2>`;html+=hard.length?hard.map(q=>{const x=state.stats[q.id];return `<div class="history-item" onclick="openQuestionDetail(${q.id})" style="cursor:pointer"><span>Pytanie ${q.id}</span><b>${Math.round(x.correct/x.attempts*100)}% (${x.attempts} prób)</b></div>`}).join(''):'<p class="small">Brak danych.</p>';html+='<h2 style="margin-top:18px">Historia testów</h2>';html+=state.history.length?state.history.map(h=>`<div class="history-item"><span>${new Date(h.date).toLocaleString('pl-PL')} • ${h.mode==='exam'?'egzamin':'nauka'} • ${h.count} pytań</span><b>${h.pct}%</b></div>`).join(''):'<p class="small">Brak ukończonych testów.</p>';document.getElementById('statsBody').innerHTML=html}
function hideMainPanels(){['setup','dashboard','quiz','result','stats','browser','questionDetail','achievements','diagnostics'].forEach(id=>document.getElementById(id).classList.add('hidden'))}
function hideStats(){backToMenu()}
function saveCurrentNote(){if(!pool.length)return;const id=pool[current].id,t=document.getElementById('noteText').value.trim();if(t)state.notes[id]=t;else delete state.notes[id];saveState();alert(t?'Notatka zapisana.':'Notatka usunięta.')}
function questionStatus(q){const x=state.stats[q.id];if(!x||!x.attempts)return 'unseen';const r=x.correct/x.attempts;if(x.attempts>=3&&r>=.8)return 'mastered';if(r<.5||x.wrong>=3)return 'hard';return 'learning'}
function showQuestionBrowser(){hideMainPanels();document.getElementById('browser').classList.remove('hidden');renderQuestionBrowser()}
function renderQuestionBrowser(){const inp=document.getElementById('questionSearch'),sel=document.getElementById('questionStatus');if(!inp||!sel)return;const term=clean(inp.value).toLowerCase(),status=sel.value;let list=QUESTIONS.filter(q=>!term||String(q.id).includes(term)||clean(q.q).toLowerCase().includes(term));if(status==='notes')list=list.filter(q=>state.notes[q.id]);else if(status==='favorites')list=list.filter(q=>state.favorites.includes(q.id));else if(status!=='all')list=list.filter(q=>questionStatus(q)===status);document.getElementById('questionList').innerHTML=list.slice(0,300).map(q=>{const st=questionStatus(q),x=state.stats[q.id],score=x?`${Math.round(x.correct/x.attempts*100)}%`:'—';return `<div class="q-row" onclick="openQuestionDetail(${q.id})"><span class="q-dot ${st}"></span><div class="q-preview"><b>${state.favorites.includes(q.id)?'★ ':''}Pytanie ${q.id}${state.notes[q.id]?' 📝':''}</b><span>${escapeHtml(clean(q.q))}</span></div><b>${score}</b></div>`}).join('')+(list.length>300?`<p class="small">Pokazano pierwsze 300 z ${list.length} wyników — zawęź wyszukiwanie.</p>`:'')}
function openQuestionDetail(id){const q=QUESTIONS.find(x=>x.id===id);if(!q)return;hideMainPanels();const x=state.stats[id],note=state.notes[id]||'';let html=`<div class="toolbar"><h1>Pytanie ${id}</h1><button class="secondary" onclick="showQuestionBrowser()">Wróć</button></div><div class="question">${escapeHtml(clean(q.q))}</div>`;if(q.img)html+=`<img class="qimg" src="${q.img}" onclick="openImage(this.src)">`;html+=q.a.map((a,i)=>`<div class="detail-answer ${i===q.correct?'goodText':''}"><b>${letter(i)}.</b> ${escapeHtml(clean(a))}${i===q.correct?' ✓':''}</div>`).join('');html+=`<p class="small">Statystyka: ${x?`${x.correct}/${x.attempts} poprawnych • ${x.wrong} błędów`:'jeszcze nieprzerobione'}</p><div class="note-box"><b>📝 Notatka</b><textarea id="detailNote">${escapeHtml(note)}</textarea><div class="row" style="margin-top:8px"><button onclick="saveDetailNote(${id})">Zapisz notatkę</button><button class="secondary" onclick="startSingleQuestion(${id})">Rozwiąż to pytanie</button></div></div>`;document.getElementById('questionDetail').innerHTML=html;document.getElementById('questionDetail').classList.remove('hidden')}
function saveDetailNote(id){const t=document.getElementById('detailNote').value.trim();if(t)state.notes[id]=t;else delete state.notes[id];saveState();openQuestionDetail(id)}
function startSingleQuestion(id){document.getElementById('mode').value='learn';startNew([QUESTIONS.find(q=>q.id===id)])}
const ACHIEVEMENTS=[
{id:'first',e:'🎬',n:'Pierwszy krok',d:'Udziel pierwszej odpowiedzi',ok:()=>Object.values(state.stats).some(x=>x.attempts)},
{id:'hundred',e:'💯',n:'Setka',d:'Udziel 100 poprawnych odpowiedzi',ok:()=>state.totalCorrect>=100},
{id:'fivehundred',e:'🚜',n:'Ciężki sprzęt',d:'Udziel 500 poprawnych odpowiedzi',ok:()=>state.totalCorrect>=500},
{id:'streak100',e:'🥇',n:'Bez pudła',d:'100 poprawnych odpowiedzi z rzędu',ok:()=>state.bestStreakCorrect>=100},
{id:'images',e:'🏗️',n:'Mistrz ilustracji',d:'Opanuj 100 pytań z ilustracjami',ok:()=>QUESTIONS.filter(q=>q.img&&masteryFor(q)===1).length>=100},
{id:'exams',e:'🎯',n:'Egzaminator',d:'Zdaj 10 egzaminów wynikiem co najmniej 75%',ok:()=>state.history.filter(h=>h.mode==='exam'&&h.pct>=75).length>=10},
{id:'week',e:'🔥',n:'Tydzień nauki',d:'Ucz się 7 dni z rzędu',ok:()=>studyStreak()>=7},
{id:'quarter',e:'📚',n:'Ćwierć bazy',d:'Opanuj 25% całej bazy',ok:()=>masteryPercent()>=25},
{id:'half',e:'🧠',n:'Połowa drogi',d:'Opanuj 50% całej bazy',ok:()=>masteryPercent()>=50},
{id:'srs30',e:'🧠',n:'Pamięć długoterminowa',d:'Doprowadź 30 pytań do poziomu SRS 4+',ok:()=>Object.values(state.stats).filter(x=>(x.srsLevel||0)>=4).length>=30},
{id:'master',e:'👑',n:'Operator kompletny',d:'Opanuj 90% całej bazy — moduł otrzyma puchar',ok:()=>masteryPercent()>=90}
];
function showAchievements(){hideMainPanels();document.getElementById('achievements').classList.remove('hidden');const unlocked=ACHIEVEMENTS.filter(a=>a.ok()).length;document.getElementById('achievementSummary').textContent=`Odblokowane: ${unlocked}/${ACHIEVEMENTS.length}`;document.getElementById('badgeGrid').innerHTML=ACHIEVEMENTS.map(a=>`<div class="badge ${a.ok()?'unlocked':''}"><span class="emoji">${a.ok()?a.e:'🔒'}</span><b>${a.n}</b><span class="small">${a.d}</span></div>`).join('')}
function exportData(){const payload={machine:activeMachine,machineName:MACHINE_META[activeMachine].name,exportedAt:new Date().toISOString(),state};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`udt-${activeMachine}-postepy.json`;a.click();URL.revokeObjectURL(a.href)}
function importData(ev){const f=ev.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const x=JSON.parse(r.result),payload=x.state?x.state:x;if(x.machine&&x.machine!==activeMachine){alert(`Ten plik należy do modułu: ${x.machineName||x.machine}. Najpierw przełącz moduł.`);return}if(!payload.stats||!Array.isArray(payload.favorites))throw 0;state=migrateLegacySRS({...defaultState(),...payload});saveState();applyTheme();alert('Postępy zaimportowane.')}catch(e){alert('Nieprawidłowy plik postępów.')}};r.readAsText(f);ev.target.value=''}
function resetProgress(){if(confirm('Na pewno usunąć wszystkie statystyki, historię i ulubione?')){state=defaultState();saveState();localStorage.removeItem(SESSION_KEY);hideStats()}}

let __lastDiagnosticText='';
function showRuntimeError(message,source,line,col,error){
 const box=document.getElementById('runtimeError');if(!box)return;
 const details=[String(message||'Nieznany błąd'),source?`Plik: ${source}`:'',line?`Linia: ${line}:${col||0}`:'',error&&error.stack?error.stack:''].filter(Boolean).join('\n');
 box.textContent='⚠️ Wykryto błąd aplikacji\n'+details;box.classList.add('show');
}
window.addEventListener('error',e=>showRuntimeError(e.message,e.filename,e.lineno,e.colno,e.error));
window.addEventListener('unhandledrejection',e=>showRuntimeError('Nieobsłużony błąd Promise: '+(e.reason?.message||e.reason||'brak szczegółów'),'','','',e.reason));
function diagnosticChecks(){
 const ids=['setup','dashboard','quiz','result','stats','browser','achievements','source','mode','count','dSeen','dAccuracy','q','answers','next','timerStat','examTimer','examNavigator','flagBtn'];
 const funcs=['startNew','render','choose','nextQuestion','finish','backToMenu','showStats','showQuestionBrowser','showAchievements','exportData','importData','startExamSimulator','startDailyChallenge','startWeaknessTraining','goToExamQuestion','toggleExamFlag'];
 const checks=[
  ['Baza pytań',Array.isArray(QUESTIONS)&&QUESTIONS.length===MACHINE_META[activeMachine].questions.length,Array.isArray(QUESTIONS)?`${QUESTIONS.length} pytań (${MACHINE_META[activeMachine].short})`:'brak tablicy'],
  ['Identyfikatory pytań',Array.isArray(QUESTIONS)&&new Set(QUESTIONS.map(q=>q.id)).size===QUESTIONS.length,'brak duplikatów ID'],
  ['Poprawne odpowiedzi',Array.isArray(QUESTIONS)&&QUESTIONS.every(q=>Number.isInteger(q.correct)&&q.correct>=0&&q.correct<q.a.length),'indeksy odpowiedzi'],
  ['Elementy interfejsu',ids.every(id=>document.getElementById(id)),ids.filter(id=>!document.getElementById(id)).join(', ')||'komplet'],
  ['Funkcje silnika',funcs.every(n=>typeof window[n]==='function'),funcs.filter(n=>typeof window[n]!=='function').join(', ')||'komplet'],
  ['Pamięć lokalna',(()=>{try{const k='__udt_test__';localStorage.setItem(k,'1');localStorage.removeItem(k);return true}catch(e){return false}})(),'localStorage'],
  ['Obrazki w bazie',QUESTIONS.filter(q=>q.img).length===MACHINE_META[activeMachine].images,`${QUESTIONS.filter(q=>q.img).length} / ${MACHINE_META[activeMachine].images} ilustracji`],
  ['Spójność wersji',document.title.includes('5.6.0')&&document.querySelector('h1')?.textContent.includes('5.6.0')&&document.querySelector('.footer')?.textContent.includes('5.6.0'),'tytuł, nagłówek i stopka']
 ];
 return checks;
}
function runDiagnostics(){
 const checks=diagnosticChecks();
 const body=document.getElementById('diagnosticsBody');
 body.innerHTML=checks.map(([name,ok,detail])=>`<div class="diag-item"><span><b>${escapeHtml(name)}</b><br><span class="small">${escapeHtml(String(detail))}</span></span><span class="${ok?'diag-ok':'diag-bad'}">${ok?'OK':'BŁĄD'}</span></div>`).join('');
 const passed=checks.filter(x=>x[1]).length;
 __lastDiagnosticText=`UDT Trainer 5.6.0 — diagnostyka\n${checks.map(([n,o,d])=>`${o?'OK':'BŁĄD'} | ${n} | ${d}`).join('\n')}\nWynik: ${passed}/${checks.length}`;
}
function showDiagnostics(){hideMainPanels();document.getElementById('diagnostics').classList.remove('hidden');runDiagnostics()}
async function copyDiagnostics(){
 if(!__lastDiagnosticText)runDiagnostics();
 try{await navigator.clipboard.writeText(__lastDiagnosticText);alert('Wynik diagnostyki skopiowany.')}catch(e){prompt('Skopiuj wynik:',__lastDiagnosticText)}
}
function toggleTheme(){state.theme=state.theme==='light'?'dark':'light';saveState();applyTheme()}
function applyTheme(){document.documentElement.classList.toggle('light',state.theme==='light');document.getElementById('themeBtn').textContent=state.theme==='light'?'🌙':'☀️'}
function openImage(src){document.getElementById('modalImg').src=src;document.getElementById('imageModal').classList.remove('hidden')}
function closeImage(){document.getElementById('imageModal').classList.add('hidden')}
function letter(i){return i>=0?String.fromCharCode(65+i):'—'}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
document.getElementById('source').addEventListener('change',()=>{document.querySelectorAll('.rangeField').forEach(e=>e.classList.toggle('hidden',document.getElementById('source').value!=='range'));updatePoolInfo()});['rangeFrom','rangeTo'].forEach(id=>document.getElementById(id).addEventListener('input',updatePoolInfo));
applyTheme();updateDashboard();updatePoolInfo();checkResume();


window.addEventListener('popstate',ev=>{
  const view=ev.state?.udtView;
  if(view==='modules'){showMachinePicker(false);return}
  if(view==='module'&&MACHINE_META[ev.state.machine]){enterMachine(ev.state.machine,false);return}
});
window.addEventListener('DOMContentLoaded',()=>{
  updateMachineUI();updateDashboard();updatePoolInfo();
  // Bazowy wpis historii to ekran wyboru modułu. Dzięki temu systemowe „Wstecz”
  // z Koparek/Żurawi wraca do głównego wyboru zamiast zamykać stronę.
  history.replaceState({udtView:'modules'},'',location.href);
  if(HAD_ACTIVE_MACHINE){
    hideMachinePicker();backToMenu();history.pushState({udtView:'module',machine:activeMachine},'');
  }else showMachinePicker(false);
});

