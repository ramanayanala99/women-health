// A classroom session joins prepared teaching, student questions and saved AI turns.
(()=>{
const connected=()=>{try{return !!agentBase()&&!!$('agentPassword').value}catch{return false}};
const key=()=>['ut-teacher-session-v1',practiceStudent(),practiceContext(),selectedLesson().id,$('language').value].join(':');
const load=()=>{try{const r=JSON.parse(tutorStorage.getItem(key())||'null');return r?.version===1&&typeof r.message==='string'&&Array.isArray(r.board_steps)&&Array.isArray(r.history)?r:null}catch{return null}};
window.TeacherSession={save(turn){try{tutorStorage.setItem(key(),JSON.stringify({version:1,message:turn.message,question:turn.question,board_steps:turn.board_steps,history:agentHistory,stage:phase,index,updated:Date.now()}))}catch{}}};
const bar=document.createElement('div');bar.className='session-actions';
const continueButton=document.createElement('button');continueButton.id='continueClass';continueButton.textContent='Continue this class';
const windowButton=document.createElement('button');windowButton.id='openClassWindow';windowButton.textContent='Open classroom in new window';
const note=document.createElement('p');note.id='sessionNotice';note.className='context-note';note.setAttribute('role','status');note.textContent='Ask your question below or press Speak. A connected AI teacher answers automatically. Lessons and conversation checkpoints save with your classroom.';
bar.append(continueButton,windowButton);document.querySelector('.room-top').after(bar,note);
function enter(){UniversalClassroom.openPanel('tutor')}
for(const b of document.querySelectorAll('[data-view="classroom"]'))b.addEventListener('click',enter);
let awaitingConnection=false;
const oldResume=$('resumeSaved').onclick;
$('resumeSaved').onclick=()=>{
 const saved=load();
 if(!saved){oldResume();enter();return}
 if(agentEnabled)endAgent(false);
 start();cancelAdvance();stopSpeech();cancelWriting();pauseAdvance(true);enter();
 phase=Number.isInteger(saved.stage)?saved.stage:0;index=Number.isInteger(saved.index)?saved.index:0;
 $('working').replaceChildren();showAgentDiagrams(saved.board_steps,saved.message+' '+saved.question);
 for(const line of saved.board_steps)if(typeof line==='string'&&!/^\s*DRAW:/i.test(line))step(line,'',false);
 agentHistory=saved.history.slice(-10);agentQuestion=saved.question||'';$('conversation').replaceChildren();for(const entry of agentHistory)if(typeof entry.content==='string')agentMessage(entry.content,entry.role==='user'?'user':'');if(!agentHistory.length)agentMessage(saved.message+(agentQuestion?' '+agentQuestion:''));
 awaitingConnection=!connected();
 if(connected()){
 agentEnabled=true;autoVoice=false;agentController=new AbortController();$('autoVoice').disabled=true;$('autoVoice').textContent='Agent voice active';$('agentBegin').hidden=true;$('agentEnd').hidden=false;
 $('answerForm').style.display=agentQuestion?'block':'none';$('answerLabel').textContent='Your reply to the teacher';$('next').style.display='none';
 $('agentStatus').textContent='Your AI conversation has been restored.';
 }else{note.textContent='Your last board and conversation are restored. Enter your backend access password in Settings to continue with the AI teacher.'}
 $('turnStatus').textContent='Welcome back. Answer the last question, ask anything, or press Resume.';
 $('resumeNotice').textContent='Continuing your saved class, '+student+'.';
};
continueButton.onclick=()=>$('resumeSaved').click();
// Keep numeric practice and simple classroom commands local. Route other questions
// directly to the connected teacher, preserving the current topic and board context.
const priorStudent=studentTurn;
studentTurn=function(text){text=String(text).trim();if(!text)return;if(awaitingConnection&&connected())$('resumeSaved').click();
 const simple=/^(?:wait|pause|stop|ready|next|yes|understood|got it|i get it|almost|my name is|call me)\b/i.test(text)||/\b(?:pronounce|say|speak)\b.*\bmy name\b/i.test(text);
 const normalized=normalizeReply(text),numeric=/^[−+-]?(\d+(\.\d*)?|\.\d+)$/.test(normalized)||normalized in wordNumbers;
 if(agentEnabled||simple||(numeric&&question()&&!locked)||!connected())return priorStudent(text);
 return $('agentBegin').onclick(text);
};
for(const [id,prompt]of [['hint','Give me a small hint for this question.'],['simpler','Please explain this more simply.'],['dontKnow','I am confused about this step.'],['repeatStep','Explain this step again.']]){
 const previous=$(id).onclick;$(id).onclick=()=>connected()?studentTurn(prompt):previous();
}
windowButton.onclick=()=>{
 pauseAdvance(true);
 const snapshot={lesson:selectedLesson(),fields:Object.fromEntries(['country','province','curriculumProgram','curriculum','grade','subject','chapter','topic','language','studentName'].map(id=>[id,$(id).value]))};
 try{sessionStorage.setItem('ut-open-classroom',JSON.stringify(snapshot))}catch{}
 const url=new URL(location.href);url.searchParams.set('classroom','1');
 const opened=window.open(url.href,'_blank');
 if(!opened){enter();note.textContent='Your browser blocked the new window. The classroom is open here; allow pop-ups to open a separate window.'}
};
if(new URL(location.href).searchParams.get('classroom')==='1'){
 try{const snapshot=JSON.parse(sessionStorage.getItem('ut-open-classroom')||'null');sessionStorage.removeItem('ut-open-classroom');if(snapshot?.lesson){
 if(!LESSONS.some(l=>l.id===snapshot.lesson.id))LESSONS.push(snapshot.lesson);
 for(const [id,value]of Object.entries(snapshot.fields)){const el=$(id);if(!el)continue;if(el.tagName==='SELECT'&&![...el.options].some(o=>o.value===value))el.add(new Option(value,value));el.value=value}
 const savedGuided=readSaved(['ft-teacher-v1',practiceStudent(),practiceContext(),selectedLesson().id].join(':'));if(load()||savedGuided)$('resumeSaved').click();else $('start').click();
 }}catch{note.textContent='Choose a lesson to start this classroom.'}enter();
}
})();
