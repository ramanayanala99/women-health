// Reply controls own the student turn, so teaching timers cannot race the reply.
(()=>{
const form=$('talkForm'),input=$('studentMessage'),answer=$('answer');
const composer=document.createElement('section');composer.id='teacherReply';composer.setAttribute('aria-label','Reply to your teacher');
$('currentTurn').after(composer);composer.append(form,$('speechStatus'));
const connection=document.createElement('button');connection.id='replyConnection';connection.type='button';connection.textContent='AI connection settings';connection.onclick=()=>{UniversalClassroom.openPanel('settings');document.querySelector('.agent-panel details').open=true;$('agentPassword').focus()};composer.append(connection);
form.querySelector('label').textContent='Your reply or question';input.placeholder='Answer or ask your teacher anything…';
const hands=document.createElement('button');hands.type='button';hands.id='handsFree';hands.textContent='Hands-free: off';hands.setAttribute('aria-pressed','false');$('mic').after(hands);
let holding=false,holdKind='',handsOn=false,retryAt=0;
function cancelTeacher(){
 cancelAdvance();clearTimeout(idleTimer);clearTimeout(agentTurnTimer);stopSpeech();
 if(agentEnabled&&agentBusy){agentGeneration++;agentController?.abort();agentBusy=false;$('agentStatus').textContent='Teacher is waiting for your reply.'}
}
function hold(kind){window.ClassroomConversation?.interrupt(kind);if(kind==='type'){permissionRun++;if(recognition)stopListening()}holding=true;holdKind=kind;cancelTeacher();paused=true;manualPause=false;$('turnStatus').textContent=kind==='voice'?'Listening to your reply…':'Take your time — the teacher is waiting for your reply.'}
window.TeacherReplyMic={hold:()=>hold('voice'),release:()=>release()};
function release(){holding=false;holdKind='';clearTimeout(idleTimer);if(!manualPause&&!agentBusy){paused=false;scheduleAdvance()}}
const priorQueue=queueAgentTurn;queueAgentTurn=function(delay){if(holding)return;return priorQueue(delay)};
const priorSchedule=scheduleAdvance;scheduleAdvance=function(){if(holding)return;return priorSchedule()};
const priorStudent=studentTurn;studentTurn=function(text){text=String(text).trim();if(!text){$('speechStatus').textContent='Type a reply or press Speak first.';return}permissionRun++;holding=false;holdKind='';cancelTeacher();$('speechStatus').textContent='Sent: '+text;return priorStudent(text)};
for(const field of [input,answer]){
 field.addEventListener('focus',()=>hold('type'));
 field.addEventListener('input',()=>hold('type'));
 field.addEventListener('blur',()=>{if(holdKind==='type'&&!input.value.trim()&&!answer.value.trim())release()});
}
form.onsubmit=e=>{e.preventDefault();const text=input.value.trim();if(!text){$('speechStatus').textContent='Type a reply or press Speak first.';input.focus();return}input.value='';studentTurn(text)};
const priorAnswer=$('answerForm').onsubmit;
$('answerForm').onsubmit=e=>{if(!agentEnabled){holding=false;holdKind='';return priorAnswer(e)}e.preventDefault();const text=answer.value.trim();if(!text){$('speechStatus').textContent='Enter an answer or ask a question.';return}answer.value='';studentTurn(text)};
const priorAsk=askAgent;askAgent=async function(text){const promise=priorAsk(text),generation=agentGeneration;try{return await promise}finally{if(agentEnabled&&generation===agentGeneration){if($('turnStatus').textContent.startsWith('You can retry'))$('speechStatus').textContent='Your teacher could not reply: '+$('agentStatus').textContent;answer.placeholder='Answer in your own words';$('answerForm').querySelector('button').textContent='Reply';$('answerLabel').textContent='Your answer to the teacher'}}};
function stopListening(){const rec=recognition;if(!rec)return;recognition=null;try{rec.stop()}catch{}$('mic').textContent='Speak';if(holdKind==='voice')release()}
function teacherSpeaking(){const v=$('teacherVideo');return speechBusy||agentBusy||(agentAudio&&!agentAudio.paused&&!agentAudio.ended)||(v&&!v.hidden&&!v.paused&&!v.ended)}
let permissionRun=0;
function startListening(manual,permitted=false){
 if(!SpeechRecognition){$('speechStatus').textContent='Voice input is unavailable with your classroom. Type your reply below.';input.focus();return}
 if(manual&&!permitted&&window.ClassroomAccess&&navigator.mediaDevices?.getUserMedia){
  const run=++permissionRun;stopListening();hold('voice');$('mic').disabled=true;
  ClassroomAccess.request().then(()=>{if(run===permissionRun)startListening(true,true)}).catch(e=>{if(run===permissionRun){$('speechStatus').textContent=e.message;release()}}).finally(()=>{$('mic').disabled=false});return;
 }
 stopListening();if(manual)hold('voice');
 const rec=new SpeechRecognition();recognition=rec;let delivered=false;
 rec.lang=$('language').value;rec.interimResults=true;rec.continuous=false;
 rec.onstart=()=>{if(recognition!==rec)return;$('mic').textContent='Stop listening';$('speechStatus').textContent='Listening… Speak your answer or question.'};
 rec.onspeechstart=()=>{if(recognition===rec)hold('voice')};
 rec.onresult=e=>{if(recognition!==rec||delivered)return;let final='',preview='';for(let i=e.resultIndex||0;i<e.results.length;i++){const r=e.results[i];if(r.isFinal!==false)final+=r[0].transcript+' ';else preview+=r[0].transcript+' '}
 $('speechStatus').textContent='Heard: '+(final||preview).trim();if(final.trim()){delivered=true;recognition=null;try{rec.stop()}catch{}$('mic').textContent='Speak';studentTurn(final.trim())}
 };
 rec.onerror=e=>{if(recognition!==rec)return;recognition=null;retryAt=Date.now()+1500;$('mic').textContent='Speak';if(['not-allowed','service-not-allowed','audio-capture'].includes(e.error)){handsOn=false;renderHands();$('speechStatus').textContent='Microphone access is unavailable. Allow microphone access for this site, or type your reply.'}else $('speechStatus').textContent='No reply heard. Press Speak again or type your answer.';if(holdKind==='voice')release()};
 rec.onend=()=>{if(recognition!==rec)return;recognition=null;$('mic').textContent='Speak';retryAt=Date.now()+400;if(!delivered&&holdKind==='voice')release()};
 try{rec.start()}catch{recognition=null;$('speechStatus').textContent='Could not start the microphone. Type your reply or try Speak again.';if(holdKind==='voice')release()}
}
function renderHands(){hands.textContent='Hands-free: '+(handsOn?'on':'off');hands.setAttribute('aria-pressed',String(handsOn))}
$('mic').onclick=()=>{if(recognition&&holdKind==='voice'){stopListening();return}startListening(true)};
function toggleHands(){if(!SpeechRecognition){startListening(true);return}handsOn=!handsOn;renderHands();if(handsOn){if(!teacherSpeaking()&&!holding){paused=false;manualPause=false;startListening(false)}else $('speechStatus').textContent='Hands-free enabled. Listening will start after the teacher finishes.'}else stopListening()}
hands.onclick=async()=>{if(!handsOn&&SpeechRecognition&&window.ClassroomAccess&&navigator.mediaDevices?.getUserMedia){hands.disabled=true;try{await ClassroomAccess.request()}catch(e){$('speechStatus').textContent=e.message;return}finally{hands.disabled=false}}toggleHands()};
setInterval(()=>{if(!handsOn)return;if(document.hidden||manualPause||!document.body.classList.contains('in-classroom')||teacherSpeaking()){if(recognition&&holdKind!=='voice')stopListening();return}if(!holding&&!recognition&&Date.now()>=retryAt)startListening(false)},300);
function stopHands(){permissionRun++;handsOn=false;renderHands();stopListening()}
window.addEventListener('pagehide',stopHands);document.addEventListener('visibilitychange',()=>{if(document.hidden)stopListening()});$('openClassWindow').addEventListener('click',stopHands);for(const b of document.querySelectorAll('.room-toolbar button'))if(b.textContent==='Exit classroom')b.addEventListener('click',stopHands);
})();
