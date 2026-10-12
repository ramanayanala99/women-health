// A real class waits at questions. Only explanation turns advance automatically.
(()=>{
let interactive=true;
try{interactive=tutorStorage.getItem('ut-class-autoplay-demo')!=='true'}catch{}
const label=document.createElement('label');label.className='agent-voice';
const demo=document.createElement('input');demo.type='checkbox';demo.id='autoplayDemo';demo.checked=!interactive;
label.append(demo,document.createTextNode('Automatically continue unanswered questions (demo mode)'));
const note=document.createElement('p');note.textContent='In a live class the teacher waits for your reply. Explanations continue naturally. Demo mode moves on after five seconds without an answer.';
$('room-panel-settings').append(label,note);
const help=document.createElement('button');help.type='button';help.id='showAnswerContinue';help.textContent='Show me how, then continue';help.hidden=true;$('teacherReply').append(help);
function isQuestion(){return agentEnabled?!!agentQuestion:activeLesson&&phase>=2&&phase<=5&&!locked}
function wait(){clearTimeout(autoTimer);clearTimeout(agentTurnTimer);help.hidden=false;if(!paused&&!speechBusy&&!writingJobs.size&&!agentBusy)$('turnStatus').textContent=phase===3&&!checkinDone&&!agentEnabled?'How are you feeling? The teacher is waiting for you.':'Your turn — take your time. Speak or type your reply.'}
const previousQueue=queueAgentTurn;queueAgentTurn=function(delay){if(interactive&&agentEnabled&&agentQuestion){wait();return}help.hidden=true;return previousQueue(delay)};
const previousSchedule=scheduleAdvance;scheduleAdvance=function(){if(interactive&&isQuestion()){wait();return}help.hidden=true;return previousSchedule()};
const previousContinue=continueAfterAnswerWindow;continueAfterAnswerWindow=function(){if(interactive){wait();return}return previousContinue()};
function setInteractive(value){interactive=!!value;demo.checked=!interactive;try{tutorStorage.setItem('ut-class-autoplay-demo',String(!interactive))}catch{}clearTimeout(autoTimer);clearTimeout(agentTurnTimer);scheduleAdvance()}
demo.onchange=()=>setInteractive(!demo.checked);
help.onclick=()=>{if(agentEnabled){studentTurn('Please show me the answer and explain it briefly, then continue with the next small step. Do not count this as a correct student answer.');return}clearTimeout(idleTimer);stopSpeech();cancelWriting();paused=false;manualPause=false;previousContinue()};
window.TeacherConversation={setInteractive,isInteractive:()=>interactive};
const previousAsk=askAgent;askAgent=async function(text){try{return await previousAsk(text)}finally{if(interactive&&agentEnabled&&agentQuestion)wait()}};
scheduleAdvance();
})();
