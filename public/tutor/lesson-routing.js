// Use exact reviewed plans and explicit curriculum mappings, never a guessed lesson.
(()=>{
const el=(tag,text,id)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(id)n.id=id;return n};
const panel=el('section',null,'lessonRoute');panel.className='lesson-route';panel.setAttribute('aria-label','Lesson teaching options');
const note=el('p',null,'lessonRouteStatus');note.setAttribute('role','status');
const live=el('button','Teach me with AI','routeLiveAI'),draft=el('button','Create reusable AI lesson','routeCreateLesson'),settings=el('button','Connection settings','routeConnection'),browse=el('button','Choose a prepared lesson','routePrepared');
const ask=el('button','Ask the AI teacher','routeAskAI');
panel.append(note,live,draft,settings,browse,ask);$('currentTurn').before(panel);
function connected(){try{agentBase();return !!$('agentPassword').value}catch{return false}}
function openConnection(){window.UniversalClassroom.openPanel('settings');const box=document.querySelector('.agent-panel details');box.open=true;box.scrollIntoView({block:'nearest'});$('agentPassword').focus();$('agentStatus').textContent='Enter your backend address and test password, then return to Tutor and choose Teach me with AI. Your API key stays on the backend.'}
settings.onclick=openConnection;browse.onclick=()=>{if(agentEnabled)endAgent(false);pauseAdvance(true);ontUI.show('universal')};
function renderRoute(){panel.hidden=!!lesson.oneToOne&&!lesson.pending;const missing=!!lesson.pending;live.hidden=draft.hidden=settings.hidden=browse.hidden=!missing;ask.hidden=missing;
 note.textContent=missing?(connected()?'No saved lesson yet for '+lesson.name+'. The connected AI teacher can teach it now. Live replies use API credits.':'No saved lesson yet for '+lesson.name+'. Connect the AI teacher to teach this topic, or choose a prepared lesson.'):lesson.mappedIntroduction?'Teaching a mapped introduction. It does not cover the whole curriculum expectation.':'Prepared lesson — examples, diagrams and practice can run without the Teacher Agent. Speak or type a question; the connected AI teacher answers automatically.';
 if(missing){$('currentTurn').textContent='Let’s learn '+lesson.name+'. Choose AI teaching now, or create a lesson that can be reviewed and reused.';$('turnStatus').textContent=connected()?'Ready for AI teaching.':'Waiting for an AI connection — no lesson is playing.'}}
async function beginAI(initialQuestion){if(!connected()){openConnection();note.textContent='Add the connection details first, then choose Teach me with AI.';return}if(agentBusy)return;live.disabled=ask.disabled=true;try{await $('agentBegin').onclick(typeof initialQuestion==='string'?initialQuestion:lesson.pending?undefined:'Help me with my current prepared lesson step. Explain the current question with a visual and ask me to try one small step.')}finally{live.disabled=ask.disabled=false}}
live.onclick=ask.onclick=beginAI;
draft.onclick=()=>{if(agentEnabled)endAgent(false);pauseAdvance(true);centralDraftContext=LessonSystem.context();ontUI.show('builder');};
const previousCurriculum=curriculumLesson;curriculumLesson=function(course,ch,t){let prepared=previousCurriculum(course,ch,t);if(!prepared.pending)return prepared;
 const mapping=UNIVERSAL_MATHS.mapping(t.id);if(!mapping||mapping.country!==$('country').value||mapping.province!==$('province').value||mapping.curriculum!==$('curriculum').value||mapping.course!==course.id||mapping.grade!==course.grade||mapping.objective!==t.objective)return prepared;
 // Only the first explicitly mapped concept is the introduction. Additional subskills remain separate.
 const concept=UNIVERSAL_MATHS.topics.find(c=>c.id===mapping.concepts[0]),central=concept&&UNIVERSAL_MATHS.resolve(concept);if(!central)return prepared;
 Object.assign(prepared,JSON.parse(JSON.stringify(central)),{id:t.id,name:ontTopicName(t),grade:course.grade,chapter:ch.title,goal:central.goal,imported:true,pending:false,mappedIntroduction:true,curriculumObjective:t.objective,curriculumSource:t.source});return prepared};
const priorOpenTopic=ontOpenTopic;ontOpenTopic=function(...args){centralDraftContext=null;return priorOpenTopic(...args)};
const priorCentral=openCentralLesson;openCentralLesson=function(t){const prepared=UNIVERSAL_MATHS.resolve(t);if(prepared)return priorCentral(t);if(agentEnabled)endAgent(false);pauseAdvance(true);ontActiveTopic=null;centralDraftContext=UNIVERSAL_MATHS.context(t);
 const pending={id:'central-'+t.id,name:t.title,grade:t.grade,chapter:t.chapterTitle,goal:centralDraftContext.objective,hook:'We can explore this idea together.',idea:centralDraftContext.objective,simple:'',prerequisite:'',visual:null,steps:[],narration:[],guided:[],practice:[],mastery:[],application:null,challenge:null,imported:false,pending:true};
 const index=LESSONS.findIndex(l=>l.id===pending.id);if(index<0)LESSONS.push(pending);else LESSONS[index]=pending;
 if(![...$('topic').options].some(o=>o.value===pending.id))$('topic').append(new Option(t.title,pending.id));$('topic').value=pending.id;ontUI.show('classroom');$('start').click();};
const priorStart=$('start').onclick;$('start').onclick=()=>{if(ontActiveTopic){const {course,ch,t}=ontActiveTopic;curriculumLesson(course,ch,t)}else{const t=UNIVERSAL_MATHS.topics.find(t=>'central-'+t.id===$('topic').value),prepared=t&&UNIVERSAL_MATHS.resolve(t);if(prepared){const i=LESSONS.findIndex(l=>l.id===prepared.id);if(i>=0)LESSONS[i]=prepared;else LESSONS.push(prepared)}}
 priorStart();if(lesson.pending){activeLesson=false;cancelAdvance();stopSpeech();cancelWriting();$('next').style.display='none';$('answerForm').style.display='none'}renderRoute();};$('restart').onclick=$('start').onclick;
// Do not promote a narrow mapped introduction to whole-curriculum completion.
const previousSave=saveProgress;saveProgress=function(status){if(!lesson.mappedIntroduction)return previousSave(status);const imported=lesson.imported;try{lesson.imported=false;previousSave(status)}finally{lesson.imported=imported}};
// Missing topics must offer a usable next action instead of the old dead-end message.
const priorStudent=studentTurn;studentTurn=function(text){if(!lesson.pending||agentEnabled)return priorStudent(text);msg(text,'user');if(connected()){beginAI(text);return}renderRoute();note.textContent='I’m ready to help with '+lesson.name+'. Open Connection settings, then choose Teach me with AI.'};
for(const id of ['hint','simpler','dontKnow','repeatStep','resumeLesson','languageSummary']){const previous=$(id).onclick;$(id).onclick=()=>{if(lesson.pending&&!agentEnabled){renderRoute();if(connected())beginAI();return}previous()};}
const priorEnd=endAgent;endAgent=function(restore=true){priorEnd(restore);if(restore)renderRoute()};
window.LessonRouting={refresh:renderRoute};
renderRoute();
})();
