// Conversation is an overlay: reviewed lessons and mastery remain the authority.
(()=>{
const STAGES=['Meet the Idea','See an Example','Try It With Me','Your Turn','Use It','Quick Check','Summary'];
let resumePoint=null,detour=false,gate='',epoch=0,requestController=null,replyAudio=null,replyURL=null,processing=false,narration=null,launching=false,agentSegments=null;
let confidence='unsure',recentMistakes=[],recentAnswers=[],history=[],smallTalkTurns=0,sessionFacts=[],audioState='idle';
const section=document.createElement('section');section.className='classroom-conversation';section.setAttribute('aria-label','Class conversation');
const indicator=document.createElement('p');indicator.id='classConversationStatus';indicator.setAttribute('role','status');
const raise=document.createElement('button');raise.id='raiseHand';raise.textContent='Raise hand';raise.type='button';
const resume=document.createElement('button');resume.id='returnToLesson';resume.textContent='Back to our lesson';resume.hidden=true;resume.type='button';
const example=document.createElement('button');example.id='conversationExample';example.textContent='Show another example';example.type='button';
section.append(indicator,raise,example,resume);$('teacherReply').append(section);
const timedLabel=document.createElement('label');timedLabel.className='agent-voice';const timed=document.createElement('input');timed.type='checkbox';timed.id='quickNumericWindow';timedLabel.append(timed,document.createTextNode('Optional quick numeric practice: offer help after 5 seconds'));$('room-panel-settings').append(timedLabel);
let numericTimer=null;timed.onchange=()=>scheduleAdvance();
function state(){const p=resumePoint;return {currentCourse:ontActiveTopic?.course?.id||'general',currentGrade:lesson.grade,currentCurriculum:$('curriculum').value,currentChapter:lesson.chapter,currentTopic:lesson.name,currentObjective:lesson.goal,currentLessonStage:STAGES[phase],currentExample:phase===1?boardStep:null,currentStep:boardStep,currentQuestion:agentEnabled?agentQuestion:question()?.q||'',currentNarrationIndex:narration?.index??p?.narrationIndex??0,currentVisual:$('visual').textContent.slice(0,500),currentBoard:[...$('working').querySelectorAll('.step')].map(n=>n.textContent).slice(-8),studentLastAnswer:recentAnswers.at(-1)||'',recentMistakes:[...recentMistakes],confidenceState:confidence,pausedForConversation:!!resumePoint,resumePoint:p?{stage:p.phase,example:p.boardStep,step:p.index,narrationIndex:p.narrationIndex,question:p.agentQuestion||p.question}:null,conversationHistory:history.slice(-6),audioState};}
function classify(text){const t=text.toLowerCase().trim();
 if(/\b(suicid\w*|want to die|not safe|(?:hurt|hit|touch)(?:ing|ed)? me|kill myself|hurt myself|self.harm|someone.*(?:hurt|hit|touch)|abuse|unsafe|bully|sexual)\b/.test(t))return 'safety_or_sensitive';
 if(/^(?:pause(?: the)?(?: lesson)?|stop(?: the)?(?: lesson)?|wait(?: a moment)?|hold on)[.!]*$/.test(t))return 'pause_request';
 if(/^(?:continue|resume(?: the)?(?: lesson)?|back to (?:the|our) lesson|let'?s continue|keep teaching)[.!]*$/.test(t))return 'resume_request';
 if(/(?:don'?t|do not|can'?t) understand|(?:don'?t|do not) get it|confused|lost me/.test(t))return 'confused';
 if(/don'?t know|do not know|no idea|not sure/.test(t))return 'student_does_not_know';
 if(/\bhint\b/.test(t))return 'hint_request';
 if(/another example|different example|show.*example/.test(t))return 'example_request';
 if(/repeat|say.*again|explain.*again/.test(t))return 'repeat_request';
 if(/weather|temperature|rain(?:ing)?|snow(?:ing)?/.test(t))return 'weather';
 if(/how are you|how (?:was|is) your day|do you like math|favou?rite|are you (?:a )?real|\bhello\b|^hi\b/.test(t))return 'small_talk';
 if(/\b(?:my (?:dog|cat|family|friend)|i like|i love|i feel (?:sad|happy|tired))\b/.test(t))return 'personal_chat';
 if(/\b(?:why|how|what|which|when|explain|mean)\b/.test(t))return /\b(?:movie|football|politic|celebrity|game cheats)\b/.test(t)?'off_topic':'lesson_question';
 if(/\b(?:football|movie|politic|celebrity|game cheats)\b/.test(t))return 'off_topic';
 const n=normalizeReply(t);if(/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(n)||((agentEnabled?agentQuestion:question()&&!locked)&&!detour))return 'lesson_answer';
 // Unrecognised speech is usually a classroom question or a reply, not misbehaviour.
 return detour&&gate==='chat'?'personal_chat':'lesson_question';
}
function connected(){try{return !!agentBase()&&!!$('agentPassword').value}catch{return false}}
function capture(){return {lessonId:lesson.id,student:sessionName,context:lessonContextKey,phase,index,boardStep,introBeat,locked,attempts,solved,masteryCorrect,masteryAttempts,checkinDone,pace,needs:[...needs],challenging,activeLesson,autoVoice,agentEnabled,agentQuestion,agentHistory:agentHistory.map(x=>({...x})),diagrams:JSON.parse(JSON.stringify(lastAgentDiagrams)),lastTutor,question:question()?.q||'',narrationIndex:narration?.index??agentSegments?.index??0,narrationChunks:narration?.chunks.slice()||agentSegments?.chunks.slice()||[lastTutor],board:Object.fromEntries(['visual','working','studentWork','boardnote'].map(id=>[id,$(id).innerHTML])),controls:Object.fromEntries(['answerForm','next','checkin','refresherChoices','finishChoices'].map(id=>[id,{display:$(id).style.display,hidden:$(id).hidden}])),nextText:$('next').textContent,stage:$('stage').textContent};}
function same(p){return p&&p.lessonId===lesson.id&&p.student===sessionName&&p.context===lessonContextKey}
function setAudio(s){audioState=s;indicator.textContent={idle:'Ready for class.',teacher_speaking:'Your teacher is speaking — you can interrupt.',listening:'Microphone listening.',student_speaking:'I’m listening to you.',processing:'Thinking about your question…',teacher_responding:'Answering you.',paused:'Lesson paused. Continue when you’re ready.',resuming:'Returning to our lesson.'}[s]||s;}
function interrupt(kind='voice'){
 if((!activeLesson&&!agentEnabled)||(!same(resumePoint)&&resumePoint))return;
 if(!resumePoint)resumePoint=capture();
 if(requestController){epoch++;requestController.abort();requestController=null;processing=false}
 cancelAdvance();clearTimeout(idleTimer);clearTimeout(agentTurnTimer);clearTimeout(numericTimer);cancelWriting();stopSpeech();
 if(agentBusy){agentGeneration++;agentController?.abort();agentBusy=false}
 paused=true;manualPause=false;resume.hidden=false;setAudio(kind==='voice'?'student_speaking':'paused');
}
function restore(p){phase=p.phase;index=p.index;boardStep=p.boardStep;introBeat=p.introBeat;locked=p.locked;attempts=p.attempts;solved=p.solved;masteryCorrect=p.masteryCorrect;masteryAttempts=p.masteryAttempts;checkinDone=p.checkinDone;pace=p.pace;needs=new Set(p.needs);challenging=p.challenging;activeLesson=p.activeLesson;autoVoice=p.autoVoice;agentEnabled=p.agentEnabled;agentQuestion=p.agentQuestion;agentHistory=p.agentHistory.map(x=>({...x}));lastAgentDiagrams=JSON.parse(JSON.stringify(p.diagrams));lastTutor=p.lastTutor;for(const [id,html]of Object.entries(p.board))$(id).innerHTML=html;for(const [id,c]of Object.entries(p.controls)){$(id).style.display=c.display;$(id).hidden=c.hidden}$('next').textContent=p.nextText;$('stage').textContent=p.stage;$('currentTurn').textContent=p.lastTutor;}
function releaseForAnswer(){const p=resumePoint;cancelDetour();if(same(p))restore(p);resumePoint=null;detour=false;gate='';smallTalkTurns=0;resume.hidden=true;paused=false;manualPause=false;}
function cancelDetour(){epoch++;requestController?.abort();requestController=null;processing=false;if(replyAudio){replyAudio.pause();replyAudio=null}if(replyURL){URL.revokeObjectURL(replyURL);replyURL=null}stopSpeech();}
function clear(){agentSegments=null;cancelDetour();resumePoint=null;detour=false;gate='';confidence='unsure';recentMistakes=[];recentAnswers=[];history=[];sessionFacts=[];smallTalkTurns=0;resume.hidden=true;setAudio('idle')}
function resumeLesson(){smallTalkTurns=0;const p=resumePoint;if(!same(p)){resumePoint=null;detour=false;gate='';resume.hidden=true;return}cancelDetour();restore(p);resumePoint=null;detour=false;gate='';resume.hidden=true;paused=false;manualPause=false;setAudio('resuming');
 $('speechStatus').textContent='Back to the same lesson step. Unfinished questions still wait for your answer.';
 // Replay only the interrupted spoken chunk and following chunks, never the lesson.
 for(const node of document.querySelectorAll('.board [data-board-text]')){const full=node.dataset.boardText;if(!full.startsWith(node.textContent)||full===node.textContent)continue;const words=full.slice(node.textContent.length).match(/\S+\s*/g)||[];let i=0;const tick=()=>{if(i<words.length){node.textContent+=words[i++];writingJobs.set(node,setTimeout(tick,120))}else{writingJobs.delete(node);scheduleAdvance()}};writingJobs.set(node,setTimeout(tick,120))}
 const remaining=p.narrationChunks.slice(p.narrationIndex).join(' ');if(agentEnabled){agentController=new AbortController();agentMessage('Okay, let’s go back to where we were. '+p.lastTutor);playAgentVoice('Okay, let’s go back to where we were. '+remaining,agentGeneration)}else if(autoVoice){speak('Okay, let’s go back to where we were. '+remaining)}else scheduleAdvance();
}
resume.onclick=resumeLesson;
function chunks(text){const sentences=String(text).match(/[^.!?]+[.!?]*\s*/g)||[String(text)];const out=[];for(const s of sentences){const words=s.trim().split(/\s+/);for(let i=0;i<words.length;i+=42)out.push(words.slice(i,i+42).join(' '))}return out.filter(Boolean)}
const oldStop=stopSpeech;stopSpeech=function(){if(!launching)narration=null;if(replyAudio){replyAudio.pause();replyAudio=null}if(replyURL){URL.revokeObjectURL(replyURL);replyURL=null}oldStop()};
const oldSpeak=speak;
const oldAgentPlay=playAgentVoice;playAgentVoice=function(text,generation){agentSegments={chunks:chunks(text),index:0,generation};return oldAgentPlay(agentSegments.chunks[0]||text,generation)};
function launch(){if(!narration)return;launching=true;const rate=$('speechRate').value;if(confidence==='confused'||confidence==='needs_prerequisite_review')$('speechRate').value='0.75';try{setAudio(detour?'teacher_responding':'teacher_speaking');(agentEnabled?guidedSpeak:oldSpeak)(narration.chunks[narration.index])}finally{$('speechRate').value=rate;launching=false}}
speak=function(text){narration={chunks:chunks(text),index:0};if(!narration.chunks.length)return;launch()};
const oldSchedule=scheduleAdvance;scheduleAdvance=function(){clearTimeout(numericTimer);
 if(narration&&!speechBusy&&!writingJobs.size){if(narration.index<narration.chunks.length-1){narration.index++;launch();return}narration=null}
 if(resumePoint||processing||detour){clearTimeout(autoTimer);clearTimeout(agentTurnTimer);if(!speechBusy&&!processing)setAudio(manualPause?'paused':'listening');return}
 oldSchedule();
 if(timed.checked&&!agentEnabled&&activeLesson&&!paused&&!speechBusy&&!writingJobs.size&&question()&&!locked&&!(phase===3&&!checkinDone))numericTimer=setTimeout(()=>{if(paused||detour||locked)return;$('speechStatus').textContent='Take your time. You can ask for a hint.';},5000);
};
const oldQueue=queueAgentTurn;queueAgentTurn=function(delay){if(resumePoint||detour||processing)return;if(agentSegments&&agentSegments.generation===agentGeneration){if(agentSegments.index<agentSegments.chunks.length-1){agentSegments.index++;oldAgentPlay(agentSegments.chunks[agentSegments.index],agentSegments.generation);return}agentSegments=null}oldQueue(delay)};
function local(text,intent){
 const q=question(),name=student==='Learner'?'':', '+student;
 if(intent==='weather')return {message:'I don’t have live weather information in this classroom, so I can’t check it right now. We can still talk about how weather uses numbers.',question:'Ready to return to our lesson?',gate:'resume'};
 if(intent==='safety_or_sensitive')return {message:'Thank you for telling me. If you feel unsafe, please tell a trusted adult, such as a parent or teacher, right now. If there is immediate danger, ask them to contact emergency services. You don’t need to share private details here.',question:'',gate:'safety'};
 if(intent==='small_talk'||intent==='personal_chat'||intent==='off_topic'){
  smallTalkTurns++;if(smallTalkTurns>2)return {message:'Let’s return to '+lesson.name.toLowerCase()+'. You can still ask me questions as we learn.',question:'Ready to go back to the same step?',gate:'resume'};const t=text.toLowerCase();let message=/real/.test(t)?'I’m an AI tutor, so I’m not a human teacher. I can help you learn and practise.':/food/.test(t)?'I don’t eat, but pizza gives us a fun way to explore fractions.':/color|colour/.test(t)?'I don’t have personal favourites. Which board colour helps you see best?':/how are|day/.test(t)?'I’m ready to learn with you! How are you feeling today?':/like math/.test(t)?'Maths is full of patterns we can explore together.':/tired/.test(t)?'Thanks for telling me. We can take it slowly, or you can ask for a break.':/^(?:i(?: am|.?m)? )?(?:fine|good|okay|ok|happy)[.!]*$/.test(t)?'Glad to hear that. Let’s learn together.':'Thanks for sharing. A little chat is welcome during class.';
  if(intent==='off_topic')return {message:message+' Let’s bring that back to '+lesson.name.toLowerCase()+'.',question:'Ready to return to the same step?',gate:'resume'};
  if(smallTalkTurns>=2)message+=' Let’s bring our attention back to '+lesson.name.toLowerCase()+'.';
  return {message,question:smallTalkTurns>=2?'Ready to get back to our lesson?':'You can tell me, or say “continue” when you’re ready.',gate:smallTalkTurns>=2?'resume':'chat'};
 }
 if(intent==='repeat_request')return {message:'Let’s focus on this one part'+name+'. '+(resumePoint?.lastTutor||lastTutor),question:'Does that make more sense?',gate:'understanding'};
 if(intent==='hint_request'||intent==='student_does_not_know')return {message:'Let’s try one small part'+name+'. '+(q?.h||lesson.simple),question:q?'Would you like to return and try the question?':'Does that idea make sense?',gate:'understanding'};
 if(intent==='example_request')return {message:'Here is a prepared example'+name+'. '+(lesson.steps?.map(s=>s[1]||s[0]).slice(0,2).join(' ')||lesson.simple),question:'Does this example help?',gate:'understanding'};
 if(intent==='lesson_answer')return {message:'Thanks for explaining your thinking. Try saying or typing just your final number when we return to the question, so I can check it fairly.',question:'Ready to try that?',gate:'understanding'};
 return {message:'Let’s use a simpler picture'+name+'. '+(lesson.simple||lesson.idea)+(q?' Start with this hint: '+q.h:''),question:'Does that help, or should we try another example?',gate:'understanding'};
}
async function sayReply(text,run){
 if(!autoVoice&&!agentEnabled)return;
 const parts=chunks(text);let i=0;
 if($('agentVoice').checked&&connected())try{for(;i<parts.length;i++){
  const r=await agentRequest('/voice',{text:parts[i]},requestController?.signal);const blob=await r.blob();if(run!==epoch)return;
  replyURL=URL.createObjectURL(blob);replyAudio=new Audio(replyURL);setAudio('teacher_responding');
  await new Promise((resolve,reject)=>{const audio=replyAudio,signal=requestController?.signal;const finish=()=>{signal?.removeEventListener('abort',finish);resolve()};audio.onended=finish;audio.onerror=()=>{signal?.removeEventListener('abort',finish);reject(Error('Voice playback failed'))};signal?.addEventListener('abort',finish,{once:true});audio.play().catch(reject)});
  if(run!==epoch)return;replyAudio=null;URL.revokeObjectURL(replyURL);replyURL=null;
 }setAudio('listening');return}catch(e){if(run!==epoch)return;stopSpeech();$('speechStatus').textContent='Provider voice unavailable. Using browser voice.'}
 if(run===epoch)speak(parts.slice(i).join(' '));
}
async function respond(text,intent){if(!['small_talk','personal_chat','off_topic','weather','safety_or_sensitive'].includes(intent))smallTalkTurns=0;interrupt('type');cancelDetour();detour=true;paused=true;manualPause=false;setAudio('processing');processing=true;const run=epoch;requestController=new AbortController();const timeout=setTimeout(()=>requestController?.abort(),35000);let reply=local(text,intent);
 // Small talk and sensitive conversations stay session-only and local.
 try{if(!['small_talk','personal_chat','off_topic','weather','safety_or_sensitive'].includes(intent)&&connected()){
  const ctx={...agentContext(),...state(),purpose:'classroom_detour',intent,confidence_state:confidence,lesson_stage:STAGES[phase],current_board_steps:state().currentBoard,current_visual:state().currentVisual,current_example:lesson.steps?.[boardStep]?.slice(0,2)||[],recent_answers:recentAnswers.slice(-5),recent_mistakes:recentMistakes.slice(-5),resume_point:state().resumePoint};
  const r=await agentRequest('/teacher',{message:text.slice(0,1000-DIAGRAM_PROMPT.length)+DIAGRAM_PROMPT,context:ctx,history:history.slice(-6)},requestController.signal);const out=await r.json();if(typeof out.message!=='string'||typeof out.question!=='string'||!Array.isArray(out.board_steps)||out.board_steps.some(x=>typeof x!=='string'))throw Error('Incomplete teacher reply');reply={...out,gate:out.question?'understanding':'resume'};
  if(out.understanding==='confused')confidence='confused';if(out.understanding==='almost')confidence='unsure';if(out.understanding==='prerequisite')confidence='needs_prerequisite_review';
 }}catch(e){if(run!==epoch)return;$('speechStatus').textContent='AI reply unavailable. We’ll use the prepared explanation and keep your place.'}
 finally{clearTimeout(timeout);if(run===epoch)processing=false}
 if(run!==epoch)return;
 gate=reply.gate;history.push({role:'user',content:text},{role:'assistant',content:reply.message+' '+reply.question});history=history.slice(-8);
 const label={hint_request:'hint_voice',confused:'mistake_voice',small_talk:'smalltalk_voice',personal_chat:'smalltalk_voice'}[intent]||'explanation_voice';
 const voice=autoVoice;autoVoice=false;msg(text,'user');msg(reply.message+(reply.question?' '+reply.question:''),'',label);autoVoice=voice;
 if(reply.board_steps?.length){cancelWriting();$('working').replaceChildren();showAgentDiagrams(reply.board_steps,reply.message);for(const line of reply.board_steps)if(!/^\s*DRAW:/i.test(line))step(line,'',false)}else if(['confused','student_does_not_know','example_request'].includes(intent)){visual(lesson.visual);cancelWriting();step(lesson.simple,'',false)}
 paused=true;manualPause=gate==='safety';resume.hidden=false;$('turnStatus').textContent=gate==='safety'?'Please speak with a trusted adult. Your lesson is paused.':'Your turn — answer, ask another question, or say “continue”.';$('answerForm').style.display='none';$('next').style.display='none';setAudio('teacher_responding');await sayReply(reply.message+(reply.question?' '+reply.question:''),run);
}
const oldStudent=studentTurn;studentTurn=function(text){text=String(text).trim();if(!text)return;if(agentEnabled&&window.NetlifyOneToOne?.isActive())return oldStudent(text);const intent=classify(text);
 if(intent==='pause_request'){interrupt('type');cancelDetour();paused=true;manualPause=true;setAudio('paused');$('speechStatus').textContent='Of course. Your place is saved. Say “continue” or press Resume.';return}
 if(intent==='resume_request'){if(resumePoint)resumeLesson();else $('resumeLesson').click();return}
 if(resumePoint&&detour&&/^(?:yes|yeah|i get it|got it|that helps|understood|ready)[.!]*$/i.test(text)){if(gate==='understanding')confidence='confident';if(gate==='understanding'||gate==='resume'||gate==='chat'){resumeLesson();return}}
 if(detour&&gate==='understanding'&&/^(?:no|almost|not yet)[.!]*$/i.test(text)){confidence='confused';return respond('I am still confused. Please explain differently using one smaller visual example.','confused')}
 if(/\b(?:pronounce|say|speak)\b.*\bmy name\b/i.test(text)||/^(my name is|call me)\b/i.test(text)){return oldStudent(text)}
 if(phase===3&&!checkinDone&&!detour&&/^(i get it|almost|i.?m confused|yes|ready)$/i.test(text)){releaseForAnswer();return oldStudent(text)}
 if(intent==='lesson_answer'&&!detour){if(/\b(?:guess|maybe)\b/i.test(text))confidence='guessing';if(!agentEnabled&&!/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(normalizeReply(text)))return respond(text,'lesson_answer');releaseForAnswer();recentAnswers.push(text);recentAnswers=recentAnswers.slice(-5);return oldStudent(text)}
 if(intent==='confused'||intent==='student_does_not_know'){confidence='confused';pace='confused';}
 if(intent==='personal_chat')sessionFacts=[...sessionFacts,text.slice(0,100)].slice(-2);
 if(!activeLesson&&!agentEnabled&&!lesson.pending)return oldStudent(text);
 return respond(text,intent);
};
const oldCheck=checkAnswer;checkAnswer=function(raw){if(!agentEnabled){if(resumePoint)releaseForAnswer();const q=question(),before=attempts;if(recentAnswers.at(-1)!==String(raw))recentAnswers=[...recentAnswers,String(raw).slice(0,100)].slice(-5);oldCheck(raw);if(attempts>before){recentMistakes.push({question:q?.q||'',answer:String(raw).slice(0,100),prerequisite:lesson.prerequisite});recentMistakes=recentMistakes.slice(-5);confidence=attempts>=2?'needs_prerequisite_review':'unsure'}else if(locked)confidence='confident';return}oldCheck(raw)};
for(const [id,text]of [['hint','Give me a hint'],['simpler','I am confused'],['dontKnow','I do not understand'],['repeatStep','Explain again'],['conversationExample','Show another example']])$(id).onclick=()=>studentTurn(text);
raise.onclick=()=>{interrupt('type');$('studentMessage').focus();$('speechStatus').textContent='I’m listening. Type your question or press Speak.'};
$('pauseLesson').onclick=()=>studentTurn('Pause lesson');const oldResume=$('resumeLesson').onclick;$('resumeLesson').onclick=()=>resumePoint?resumeLesson():oldResume();
const oldHelp=$('showAnswerContinue').onclick;$('showAnswerContinue').onclick=()=>detour?resumeLesson():oldHelp();
const oldNext=$('next').onclick;$('next').onclick=()=>resumePoint?resumeLesson():oldNext();
const oldStart=start;start=function(...args){clear();return oldStart(...args)};
const oldSave=saveProgress;saveProgress=function(...args){if(detour)return;return oldSave(...args)};
// Keep casual detours out of persistent AI checkpoints and grading.
const oldSessionSave=TeacherSession.save;TeacherSession.save=function(turn){if(!detour)return oldSessionSave(turn)};
const oldFeeling=checkFeeling;checkFeeling=function(feeling){confidence=feeling==='get'?'confident':feeling==='almost'?'unsure':'confused';return oldFeeling(feeling)};
const oldContext=agentContext;agentContext=function(){return {...oldContext(),course:state().currentCourse,current_visual:state().currentVisual,current_example:lesson.steps?.[boardStep]?.slice(0,2)||[],recent_answers:recentAnswers.slice(-5),recent_mistakes:recentMistakes.slice(-5),confidence_state:confidence,resume_point:state().resumePoint}};
window.ClassroomConversation={memory:()=>({studentName:student,mood:confidence,currentTopic:lesson.name,knownStrengths:confidence==='confident'?[lesson.name]:[],recentConfusions:recentMistakes.slice(-5),smallTalkFactsFromThisSession:[...sessionFacts]}),classify,interrupt,resume:resumeLesson,state,clear,setAudio,isDetour:()=>detour,hasResume:()=>!!resumePoint,agentVoiceFallback:(text,generation)=>{if(generation===agentGeneration&&agentEnabled)speak(text)}};
window.addEventListener('pagehide',clear);
setInterval(()=>{if(processing){setAudio('processing');return}if(speechBusy||(replyAudio&&!replyAudio.paused)||agentAudio&&!agentAudio.paused&&!agentAudio.ended){setAudio(detour?'teacher_responding':'teacher_speaking');return}if(manualPause)setAudio('paused');else if(!resumePoint&&!recognition)setAudio('idle')},250);
setAudio('idle');
})();
