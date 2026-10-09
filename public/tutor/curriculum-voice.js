// Imported chapters use the same voice classroom as the original lessons.
const originalChapterChanged=chapterChanged,originalGradeChanged=gradeChanged;
const originalClearCurriculum=ontClearClassroom;
function curriculumLesson(course,ch,t){
 let prepared=LESSONS.find(l=>l.id===t.id);if(prepared)return prepared;
 const base=LESSONS.find(l=>l.grade===course.grade&&!l.id.endsWith('-apply'))||LESSONS[0];
 prepared={...base,id:t.id,name:ontTopicName(t),grade:course.grade,chapter:ch.title,goal:t.objective,curriculumSource:t.source,imported:true,pending:true,visual:null,hook:'We will work through this idea together, one small step at a time.',idea:t.objective,steps:[],guided:[],practice:[],mastery:[],application:null,challenge:null};
 if(course.id.startsWith('IN-')===false&&course.grade===7&&t.code==='B2.3'){
 const q=(text,a,h,why)=>({q:text,a,h,why});
 Object.assign(prepared,{pending:false,goal:'Mentally increase and decrease amounts by 1%, 5%, 10%, 25%, 50%, and 100%.',hook:'You can use these shortcuts to check a discount or a price increase without a calculator.',idea:'Find the percentage part first. Add it for an increase, or subtract it for a decrease.',simple:'10% is one tenth, 25% is one quarter, and 50% is one half. Find that part, then add or subtract it.',prerequisite:'finding simple percentages',visual:{type:'fraction',parts:4,filled:1},steps:[['80 ÷ 4 = 20','A quarter of 80 is 20.'],['80 + 20 = 100','For a 25% increase, add the quarter.'],['80 − 20 = 60','For a 25% decrease, subtract the quarter.']],narration:['See the shaded quarter? Twenty-five percent means one quarter. A quarter of eighty is twenty.','An increase makes the amount bigger. Add twenty to eighty: one hundred.','A decrease makes it smaller. Subtract twenty from eighty: sixty. Now you try.'],guided:[q('Increase 60 by 10%. What is the new amount?',66,'One tenth of 60 is 6. Add that part.','60 ÷ 10 = 6; 60 + 6 = 66.')],practice:[q('Decrease 80 by 25%. What is the new amount?',60,'Find a quarter of 80, then subtract it.','80 ÷ 4 = 20; 80 − 20 = 60.'),q('Increase 120 by 5%. What is the new amount?',126,'Find 10%, then halve it to find 5%.','10% of 120 is 12; 5% is 6; 120 + 6 = 126.')],application:q('A $40 game is 25% off. What is the sale price?',30,'Find a quarter of $40, then subtract the discount.','$40 ÷ 4 = $10; $40 − $10 = $30.'),mastery:[q('Increase 200 by 1%. What is the new amount?',202,'Divide by 100 to find 1%, then add it.','200 ÷ 100 = 2; 200 + 2 = 202.'),q('Decrease 90 by 50%. What is the new amount?',45,'50% is one half.','Half of 90 is 45; 90 − 45 = 45.'),q('Increase 35 by 100%. What is the new amount?',70,'100% is the whole original amount.','35 + 35 = 70.')],challenge:q('Decrease 240 by 5%. What is the new amount?',228,'10% is 24, so 5% is 12. Subtract it.','240 − 12 = 228.')});
 }
 LESSONS.push(prepared);return prepared;
}
function curriculumFields(course,ch,t){
 $('grade').value=String(course.grade);
 const courses=ontCourses();
 options($('chapter'),courses.flatMap(c=>c.chapters.map(chapter=>[chapter.id,(courses.length>1?c.code+' · ':'')+chapter.title])));$('chapter').value=ch.id;
 ch.topics.forEach(topic=>curriculumLesson(course,ch,topic));
 options($('topic'),ch.topics.map(topic=>[topic.id,ontTopicName(topic)]));$('topic').value=t.id;
 $('lessonContext').textContent=curriculumLabel()+' · Grade '+course.grade+' · '+ch.title+' · '+t.code;
}
ontOpenTopic=function(course,ch,t){
 if(agentEnabled)endAgent(false);
 originalClearCurriculum();lastAgentDiagrams=[];$('visual').replaceChildren();ontActiveTopic={course,ch,t};ontCourseId=course.id;ontChapterId=ch.id;
 curriculumFields(course,ch,t);ontUI.show('classroom');
 document.querySelector('#classroomPage .settings:not(.agent-panel)').open=true;
 autoVoice=true;$('autoVoice').textContent='Tutor voice: on';$('autoVoice').setAttribute('aria-pressed','true');
 $('start').click();
};
chapterChanged=function(){
 if(!ontMatchesProfile())return originalChapterChanged();
 const course=ontCourses().find(c=>c.chapters.some(ch=>ch.id===$('chapter').value));
 const ch=course?.chapters.find(c=>c.id===$('chapter').value);
 if(ch)ontOpenChapter(course,ch);else originalChapterChanged();
};
$('chapter').onchange=chapterChanged;
$('topic').addEventListener('change',()=>{if(!ontActiveTopic)return;const {course,ch}=ontActiveTopic,t=ch.topics.find(t=>t.id===$('topic').value);if(t)ontOpenTopic(course,ch,t)});
gradeChanged=function(){
 if(agentEnabled)endAgent(false);
 originalClearCurriculum();
 if(!ontMatchesProfile())return originalGradeChanged();
 const courses=ontCourses();
 const course=courses.find(c=>c.id===ontCourseId)||courses[0];
 if(!course||!course.chapters.length)return originalGradeChanged();
 const ch=course.chapters.find(c=>c.id===ontChapterId)||course.chapters[0];
 const t=ch.topics.find(t=>!ontRecord(t.id).completed)||ch.topics[0];
 ontActiveTopic={course,ch,t};ontCourseId=course.id;ontChapterId=ch.id;
 curriculumFields(course,ch,t);previewSelectedLesson();
 $('meta').textContent='Grade '+course.grade+' · '+courses.reduce((n,c)=>n+c.chapters.length,0)+' curriculum chapters · '+ch.topics.length+' topics in this chapter';
 $('lessonContext').textContent=curriculumLabel()+' · Grade '+course.grade+' · '+ch.title+' · Choose a chapter or press Start voice lesson.';
};$('grade').onchange=gradeChanged;
ontClearClassroom=function(){const imported=!!ontActiveTopic;originalClearCurriculum();if(imported)originalGradeChanged()};
const curriculumStart=$('start').onclick;
$('start').onclick=()=>{
 const chosen=LESSONS.find(l=>l.id===$('topic').value);
 if(chosen?.pending){const voice=autoVoice;autoVoice=false;start(false);autoVoice=voice;$('conversation').replaceChildren();$('currentTurn').textContent='This topic needs the Teacher Agent for examples and practice. Choose a prepared lesson to learn without the Agent.'}else curriculumStart();
 for(const id of ['openWorksheet','reviewWorksheet','printWorksheet','printKey','resumeSaved'])$(id).disabled=!!lesson.pending;
 if(!lesson.imported&&!lesson.pending)return;
 $('lessonContext').textContent=curriculumLabel()+' · Grade '+lesson.grade+' · '+lesson.chapter+(lesson.pending?' · AI connection needed for full teaching.':' · Guided introduction to '+lesson.name+'.');
 if(lesson.pending){activeLesson=false;cancelAdvance();cancelWriting();$('next').style.display='none';$('turnStatus').textContent='Topic selected. Connect the Teacher Agent for examples and practice.';$('agentStatus').textContent='This curriculum topic needs the connected Teacher Agent. The selected topic and learning goal will be sent to it.';
 // AI teaching starts from the explicit Teach me with AI control.
 }
};$('restart').onclick=$('start').onclick;
const curriculumNext=nextTurn;nextTurn=function(){if(lesson.pending&&!agentEnabled){$('agentStatus').textContent='Connect the Teacher Agent to teach this selected curriculum topic.';return}curriculumNext()};
for(const id of ['hint','simpler','dontKnow','repeatStep','resumeLesson','languageSummary']){const previous=$(id).onclick;$(id).onclick=()=>{if(lesson.pending&&!agentEnabled){msg('This topic needs the connected Teacher Agent for a worked example. Open Connection settings, then choose Try Teacher Agent.');return}previous()}}
const curriculumStudentTurn=studentTurn;studentTurn=function(text){if(lesson.pending&&!agentEnabled){msg(text,'user');msg('I have your question. Connect the Teacher Agent so I can help with this curriculum topic.');return}curriculumStudentTurn(text)};
const curriculumCheckAnswer=checkAnswer;checkAnswer=function(text){if(lesson.pending&&!agentEnabled)return studentTurn(text);return curriculumCheckAnswer(text)};
// Verified mastery updates the selected catalogue topic, without counting an intro as completion.
const curriculumSaveProgress=saveProgress;saveProgress=function(status){curriculumSaveProgress(status);if(lesson.imported&&!lesson.pending&&phase===6&&masteryCorrect===3){const r=ontRecord(lesson.id);ontSave(ontKey('topic',lesson.id),{...r,completed:true,evidence:'guided mastery',updated:new Date().toISOString()})}};
for(const id of ['country','province','curriculum','curriculumProgram']){const previous=$(id).onchange;$(id).onchange=()=>{if(ontActiveTopic)ontClearClassroom();previous();gradeChanged()}}
