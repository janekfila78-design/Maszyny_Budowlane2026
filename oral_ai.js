/* UDT Trainer 5.5 — lokalny trener głosowy i symulator egzaminatora */
let oralRecorder=null,oralAudioChunks=[],oralAudioUrl='',oralRecognition=null,oralListening=false;
let oralTranscriptFinal='',oralTranscriptInterim='',oralLastAnalysis=null,oralSimulationPhase=0,oralFollowupBase='';

const ORAL_STOPWORDS=new Set('oraz albo żeby przed przez przy jest są się do na w z i o po od dla jako ten ta to tej tego tym które który zgodnie należy trzeba wykonuję sprawdzam kontroluję wskazuję omówię omówić'.split(' '));
const ORAL_SYNONYMS={
  zabezpiecz:['zabezpiecz','unieruchom','hamulec','wyłącz','opuść','osprzęt','neutral','kluczyk'],
  instrukcj:['instrukcj','producent','dokumentacj','tabela','specyfikacj'],
  poziom:['poziom','min','max','wziernik','bagnet','wskaźnik'],
  wyciek:['wyciek','nieszczeln','szczelność','przeciek'],
  przewod:['przewód','przewody','wąż','węże','złącze','połączenie'],
  uszkodz:['uszkod','pęknię','zuży','odkształ','brakując'],
  zgłos:['zgłasz','nie uruchamiam','nie pracuję','wstrzymuję','serwis'],
  olej:['olej','smar','środek smarny'],
  chłod:['chłod','płyn chłodniczy','temperatur'],
  ciśnien:['ciśnien','redukuję','zeruję','rozładowuję'],
  filtr:['filtr','wkład','dolot','zabrud'],
  akumulator:['akumulator','klemy','zaciski','elektrolit','biegun'],
  opon:['opon','ogumienie','bieżnik','wentyl','ciśnienie'],
  gąsien:['gąsien','rolki','koło napędowe','napinacz','zwis'],
  świat:['świat','lampa','kierunkowskaz','oświetlen'],
  smar:['smar','kalamit','smarownic'],
  narzędz:['łyżk','narzędz','zęby','lemiesz','szybkozłącz'],
  sworzn:['sworzeń','sworznie','tulej','zawlecz','zabezpieczenie'],
  paliw:['paliw','diesel','olej napędowy','tankow'],
  transport:['transport','najazd','mocowanie','łańcuch','klin','lawet'],
  awaryjn:['awaryjn','wyjście','młotek','ewakuac'],
  bezpiecznik:['bezpiecznik','amperaż','prąd znamionowy','skrzynka'],
  gaśnic:['gaśnic','plomba','manometr','termin','przegląd'],
};
function oralNorm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9ąćęłńóśźż ]/gi,' ').replace(/\s+/g,' ').trim()}
function oralStemWords(s){return oralNorm(s).split(' ').filter(w=>w.length>=4&&!ORAL_STOPWORDS.has(w)).map(w=>w.slice(0,Math.min(w.length,7)))}
function oralCriterionKeywords(text){
  const norm=oralNorm(text),out=new Set(oralStemWords(text));
  Object.entries(ORAL_SYNONYMS).forEach(([root,words])=>{if(words.some(w=>norm.includes(oralNorm(w)))){out.add(oralNorm(root).slice(0,7));words.forEach(w=>oralStemWords(w).forEach(x=>out.add(x)))}});
  return [...out].slice(0,18);
}
function oralBuildCriteria(task){
  const raw=[...(task.steps||[]),task.answer,task.trap].filter(Boolean);
  return raw.map((text,i)=>({id:i,text,keywords:oralCriterionKeywords(text),weight:i<(task.steps||[]).length?1:0.75}));
}
function oralKeywordHit(transcript,keyword){
  const t=oralNorm(transcript),k=oralNorm(keyword);
  if(!k)return false;
  if(t.includes(k))return true;
  return t.split(' ').some(w=>w.startsWith(k)||k.startsWith(w.slice(0,Math.min(w.length,6))));
}
function analyzeOralAnswer(task,transcript){
  const criteria=oralBuildCriteria(task),words=oralNorm(transcript).split(' ').filter(Boolean);
  let earned=0,total=0;
  const details=criteria.map(c=>{
    const needed=Math.max(1,Math.min(3,Math.ceil(c.keywords.length*.22)));
    const hits=c.keywords.filter(k=>oralKeywordHit(transcript,k));
    const ratio=Math.min(1,hits.length/needed),ok=ratio>=.67;
    earned+=ratio*c.weight;total+=c.weight;
    return {...c,hits,ratio,ok};
  });
  let score=total?Math.round(earned/total*100):0;
  const lengthBonus=words.length>=35?5:words.length>=18?2:words.length<6?-15:0;
  score=Math.max(0,Math.min(100,score+lengthBonus));
  const missing=details.filter(d=>!d.ok).sort((a,b)=>a.ratio-b.ratio).slice(0,5);
  const covered=details.filter(d=>d.ok);
  const safetyWords='zabezpiecz unieruchom wyłącz opuszcz hamulec strefa niebezpieczna nie pracuję zgłaszam instrukcja'.split(' ');
  const safetyHits=safetyWords.filter(k=>oralKeywordHit(transcript,k));
  if(!safetyHits.length&&score>72)score=72;
  return {score,details,missing,covered,wordCount:words.length,safetyHits,grade:score>=88?3:score>=68?2:score>=42?1:0};
}
function oralFollowupQuestion(analysis){
  const m=analysis?.missing?.[0];
  if(!m)return 'Czy jest jeszcze coś, co powinieneś sprawdzić przed dopuszczeniem maszyny do pracy?';
  const txt=m.text.replace(/[.!?]+$/,'');
  if(/uster|nieprawid|wyciek|uszkod/i.test(txt))return 'Co zrobisz, jeżeli podczas tej kontroli stwierdzisz nieprawidłowość?';
  if(/instruk|rodzaj|poziom|wartość|specyfik/i.test(txt))return 'Skąd weźmiesz właściwy parametr lub specyfikację dla tej konkretnej maszyny?';
  if(/zabez|wyłącz|opuść|ciśnien|stref/i.test(txt))return 'Jak zabezpieczysz maszynę i miejsce przed wykonaniem tej czynności?';
  return `Proszę doprecyzować: ${txt.charAt(0).toLowerCase()+txt.slice(1)}.`;
}
function oralBrowserSpeechSupported(){return !!(window.SpeechRecognition||window.webkitSpeechRecognition)}
function oralMediaSupported(){return !!(navigator.mediaDevices?.getUserMedia&&window.MediaRecorder)}
function oralSetVoiceStatus(text,kind=''){
  const el=document.getElementById('oralVoiceStatus');if(!el)return;el.textContent=text;el.className='oral-voice-status '+kind;
}
async function startOralRecording(){
  if(oralListening)return;
  oralTranscriptInterim='';
  if(!oralFollowupBase)oralTranscriptFinal='';
  const ta=document.getElementById('oralTranscript');if(ta&&!oralFollowupBase)ta.value='';
  oralAudioChunks=[];
  try{
    if(oralMediaSupported()){
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      oralRecorder=new MediaRecorder(stream);
      oralRecorder.ondataavailable=e=>{if(e.data.size)oralAudioChunks.push(e.data)};
      oralRecorder.onstop=()=>{
        const blob=new Blob(oralAudioChunks,{type:oralRecorder.mimeType||'audio/webm'});
        if(oralAudioUrl)URL.revokeObjectURL(oralAudioUrl);oralAudioUrl=URL.createObjectURL(blob);
        const audio=document.getElementById('oralPlayback');audio.src=oralAudioUrl;audio.classList.remove('hidden');
        stream.getTracks().forEach(t=>t.stop());
      };
      oralRecorder.start();
    }
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(SR){
      oralRecognition=new SR();oralRecognition.lang='pl-PL';oralRecognition.continuous=true;oralRecognition.interimResults=true;
      oralRecognition.onresult=e=>{
        let interim='';
        for(let i=e.resultIndex;i<e.results.length;i++){
          const txt=e.results[i][0].transcript;
          if(e.results[i].isFinal)oralTranscriptFinal+=(oralTranscriptFinal?' ':'')+txt;else interim+=txt;
        }
        oralTranscriptInterim=interim;
        const prefix=oralFollowupBase?oralFollowupBase+' ':'';
        document.getElementById('oralTranscript').value=(prefix+oralTranscriptFinal+(interim?' '+interim:'')).trim();
      };
      oralRecognition.onerror=e=>oralSetVoiceStatus('Rozpoznawanie mowy: '+e.error,'bad');
      oralRecognition.onend=()=>{if(oralListening){try{oralRecognition.start()}catch(_){}}};
      oralRecognition.start();
    }
    oralListening=true;document.getElementById('oralRecordBtn').classList.add('recording');document.getElementById('oralRecordBtn').textContent='⏹ Zatrzymaj odpowiedź';
    oralSetVoiceStatus(SR?'Nagrywam i zamieniam mowę na tekst…':'Nagrywam audio. Wpisz odpowiedź ręcznie, bo ta przeglądarka nie obsługuje transkrypcji.','live');
  }catch(e){oralSetVoiceStatus('Nie udało się uruchomić mikrofonu: '+(e.message||e),'bad')}
}
function stopOralRecording(){
  oralListening=false;
  try{oralRecognition?.stop()}catch(_){}
  try{if(oralRecorder?.state!=='inactive')oralRecorder.stop()}catch(_){}
  const b=document.getElementById('oralRecordBtn');b.classList.remove('recording');b.textContent='🎤 Nagraj odpowiedź';
  oralSetVoiceStatus('Nagranie zatrzymane. Możesz poprawić transkrypcję i uruchomić analizę.','ok');
}
function toggleOralRecording(){oralListening?stopOralRecording():startOralRecording()}
function clearOralVoice(){
  if(oralListening)stopOralRecording();oralTranscriptFinal='';oralTranscriptInterim='';oralFollowupBase='';oralSimulationPhase=0;oralLastAnalysis=null;
  const ta=document.getElementById('oralTranscript');if(ta)ta.value='';
  const audio=document.getElementById('oralPlayback');if(audio){audio.pause();audio.removeAttribute('src');audio.classList.add('hidden')}
  document.getElementById('oralAnalysis')?.classList.add('hidden');document.getElementById('oralFollowup')?.classList.add('hidden');oralSetVoiceStatus('Gotowy. Odpowiedz własnymi słowami.');
}
function renderOralAnalysis(analysis){
  const root=document.getElementById('oralAnalysis');root.classList.remove('hidden');
  const score=document.getElementById('oralAiScore');score.textContent=analysis.score+'%';score.dataset.band=analysis.score>=80?'good':analysis.score>=55?'mid':'bad';
  document.getElementById('oralAiVerdict').textContent=analysis.score>=88?'Odpowiedź bardzo dobra i kompletna.':analysis.score>=68?'Dobra baza, ale egzaminator mógłby dopytać.':analysis.score>=42?'Częściowo poprawna — brakuje ważnych elementów.':'Odpowiedź zbyt krótka albo nietrafiona.';
  document.getElementById('oralCoveredList').innerHTML=analysis.covered.slice(0,5).map(x=>`<li>${escapeHtmlOral(x.text)}</li>`).join('')||'<li>Brak pewnie wykrytych elementów.</li>';
  document.getElementById('oralMissingList').innerHTML=analysis.missing.map(x=>`<li>${escapeHtmlOral(x.text)}</li>`).join('')||'<li>Nie wykryto istotnych braków.</li>';
  document.getElementById('oralAutoGrade').textContent=['Nie umiałem','Z pomocą','Prawie dobrze','Płynnie'][analysis.grade];
}
function analyzeCurrentOral(){
  if(oralListening)stopOralRecording();
  const transcript=document.getElementById('oralTranscript').value.trim();
  if(transcript.length<3){oralSetVoiceStatus('Najpierw nagraj albo wpisz odpowiedź. Czytanie w myślach jest jeszcze w backlogu.','bad');return}
  const task=oralPool[oralIndex];oralLastAnalysis=analyzeOralAnswer(task,transcript);renderOralAnalysis(oralLastAnalysis);
  if(document.getElementById('oralMode')?.value==='simulation'&&oralSimulationPhase===0){
    oralSimulationPhase=1;oralFollowupBase=transcript;
    const q=oralFollowupQuestion(oralLastAnalysis);document.getElementById('oralFollowupQuestion').textContent=q;document.getElementById('oralFollowup').classList.remove('hidden');
    oralSetVoiceStatus('Egzaminator ma pytanie uzupełniające. Odpowiedz i przeanalizuj ponownie.','live');
  }else if(oralSimulationPhase===1){oralSimulationPhase=2;document.getElementById('oralFollowup').classList.add('hidden');oralSetVoiceStatus('Symulacja zakończona. Wynik obejmuje odpowiedź główną i doprecyzowanie.','ok')}
}
function startFollowupRecording(){
  if(oralListening)return;oralTranscriptFinal='';oralTranscriptInterim='';
  const ta=document.getElementById('oralTranscript');ta.value=oralFollowupBase+'\n\nOdpowiedź uzupełniająca: ';
  startOralRecording();
}
function acceptAiGrade(){
  if(!oralLastAnalysis){analyzeCurrentOral();if(!oralLastAnalysis)return}
  if(document.getElementById('oralMode')?.value==='simulation'&&oralSimulationPhase===1){oralSetVoiceStatus('Najpierw odpowiedz na pytanie uzupełniające albo wybierz ocenę ręczną.','bad');return}
  rateOral(oralLastAnalysis.grade);
}
function oralVoiceResetForCard(){clearOralVoice();
  const note=document.getElementById('oralSpeechSupport');if(note)note.textContent=oralBrowserSpeechSupported()?'Transkrypcja mowy jest obsługiwana.':'Brak automatycznej transkrypcji — nagranie i ręczne wpisanie odpowiedzi nadal działają.';
}

function speakOralText(text){
  if(!('speechSynthesis' in window)){oralSetVoiceStatus('Ta przeglądarka nie obsługuje syntezatora mowy.','bad');return}
  speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(text||''));u.lang='pl-PL';u.rate=.92;u.pitch=1;speechSynthesis.speak(u);
}
function speakCurrentOralPrompt(){const task=oralPool[oralIndex];if(task)speakOralText(task.prompt)}
