// Explicit topic navigation never marks skipped work as completed.
function nextTeachingTopic(){
 const id=$('topic').value;
 if(ontMatchesProfile()){
  const path=ontCourses().flatMap(course=>course.chapters.flatMap(ch=>ch.topics.map(t=>({course,ch,t}))));
  const i=path.findIndex(x=>x.t.id===id);return i>=0?path[i+1]||null:null;
 }
 const path=SAMPLE_CHAPTERS.filter(ch=>ch.grade===Number($('grade').value)).flatMap(ch=>ch.topics.map(id=>({sample:LESSONS.find(l=>l.id===id)})));
 const i=path.findIndex(x=>x.sample?.id===id);return i>=0?path[i+1]||null:null;
}
function refreshNextTopic(){const target=nextTeachingTopic(),b=$('nextTopic');b.disabled=!target;b.textContent=target?'Next topic':'No more topics in this grade';$('nextTopicNotice').textContent=target?'Up next: '+(target.t?ontTopicName(target.t):target.sample.name):'Choose another chapter or grade from Chapters & topics.';}
$('nextTopic').onclick=()=>{const target=nextTeachingTopic();if(!target)return;if(typeof saveProgress==='function'&&activeLesson&&!lesson.pending)saveProgress();if(agentEnabled)endAgent(false);cancelAdvance();stopSpeech();cancelWriting();if(target.t)ontOpenTopic(target.course,target.ch,target.t);else{$('topic').value=target.sample.id;$('start').click()}refreshNextTopic()};
const nextTopicStart=$('start').onclick;$('start').onclick=function(){nextTopicStart();refreshNextTopic()};$('restart').onclick=$('start').onclick;
for(const id of ['topic','chapter','grade','country','province','curriculum','curriculumProgram'])$(id).addEventListener('change',refreshNextTopic);
refreshNextTopic();

function refreshChapterSubtopics(){const host=$('classroomSubtopics');host.replaceChildren();if(!ontMatchesProfile())return;const current=$('topic').value,course=ontCourses().find(c=>c.chapters.some(ch=>ch.topics.some(t=>t.id===current))),ch=course?.chapters.find(ch=>ch.topics.some(t=>t.id===current));if(!ch)return;const h=document.createElement('h3');h.textContent='This chapter’s subtopics';host.append(h);ch.topics.forEach((t,i)=>{const b=document.createElement('button');b.type='button';b.textContent=(ontRecord(t.id).completed?'✓ ':'')+(i+1)+'. '+ontTopicName(t);b.setAttribute('aria-current',t.id===current?'true':'false');b.className='wide';b.onclick=()=>ontOpenTopic(course,ch,t);host.append(b)});}
const subtopicsStart=$('start').onclick;$('start').onclick=()=>{subtopicsStart();refreshChapterSubtopics()};$('restart').onclick=$('start').onclick;refreshChapterSubtopics();
