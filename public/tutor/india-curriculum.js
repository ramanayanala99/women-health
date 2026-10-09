// Reuse the classroom, navigation, exam and progress services for a second catalogue.
function indiaMatchesProfile(){return $('country').value==='India'&&$('curriculumProgram').value==='NCERT / CBSE'&&$('curriculum').value==='CBSE'}
function indiaChoose(){
 if(agentEnabled)endAgent(false);pauseAdvance(true);
 $('country').value='India';countryChanged();$('province').value='Telangana';regionChanged();$('curriculumProgram').value='NCERT / CBSE';$('curriculum').value='CBSE';$('grade').value='9';ontCourseId='';ontChapterId='';gradeChanged();
 try{tutorStorage.setItem('ut-profile',JSON.stringify({country:'India',province:'Telangana',curriculum:'CBSE',curriculumProgram:'NCERT / CBSE',grade:'9'}))}catch{}
}
function indiaPrepared(t){const concept=UNIVERSAL_MATHS.topics.find(c=>c.id===t.concepts[0]);return concept&&UNIVERSAL_MATHS.resolve(concept)}
const beforeIndiaLesson=curriculumLesson;
curriculumLesson=function(course,ch,t){const l=beforeIndiaLesson(course,ch,t);if(course.id!=='IN-CBSE-MATH-9-2026'||l.reusable||!l.pending)return l;const central=indiaPrepared(t);if(!central)return l;
 Object.assign(l,JSON.parse(JSON.stringify(central)),{id:t.id,name:t.title,grade:course.grade,chapter:ch.title,imported:true,pending:false,mappedIntroduction:true,curriculumObjective:t.objective,curriculumSource:t.source,centralConcept:t.concepts[0]});return l;
};
const beforeIndiaLibrary=renderOntarioCurriculum;
renderOntarioCurriculum=function(U){if(!indiaMatchesProfile())return beforeIndiaLibrary(U);ontUI=U;const {portal,el,button,heading,profile,show}=U;
 heading('Choose your CBSE chapter','Choose a chapter, then a learning subtopic.');
 const settings=el('details',undefined,'portal-card');settings.append(el('summary','Change state, board or class'));portal.append(settings);profile();settings.append(portal.lastChild);
 const course=ontCourses()[0];if(!course){portal.append(el('p','CBSE Class 9 (2026–27) is imported. Other CBSE classes are not loaded yet.','portal-notice'),button('Use Class 9',()=>{$('grade').value='9';gradeChanged();show('library')}));return}
 ontCourseId=course.id;const topics=course.chapters.flatMap(ch=>ch.topics),ready=topics.filter(indiaPrepared).length;
 portal.append(el('p','India · '+$('province').value+' · CBSE · Class 9 · 2026–27','portal-subtitle'),el('p',course.chapters.length+' chapters · '+topics.length+' learning subtopics · '+ready+' prepared introductions. Other subtopics use your connected AI teacher or a reviewed reusable lesson.','portal-notice'));
 const list=el('div',undefined,'portal-cards');for(const ch of course.chapters){const card=el('section',undefined,'portal-card'),done=ch.topics.filter(t=>ontRecord(t.id).completed).length;
 card.append(el('span','CHAPTER '+ch.number,'eyebrow'),el('h2',ch.title),el('p',ontComplete(ch)?'✓ Chapter completed · studied':done+' / '+ch.topics.length+' subtopics studied'),el('p',ch.topics.filter(indiaPrepared).length+' prepared voice introductions · '+ch.topics.filter(t=>!indiaPrepared(t)).length+' need AI teaching'),button('View subtopics',()=>ontOpenChapter(course,ch)),button('Start chapter with tutor',()=>ontOpenTopic(course,ch,ch.topics.find(t=>!ontRecord(t.id).completed)||ch.topics[0])));list.append(card)}portal.append(list);
 const info=el('details',undefined,'portal-card');info.append(el('summary','Syllabus information for parents'),el('p',INDIA_CATALOG.notes),ontLink('Official CBSE Mathematics syllabus · 2026–27',course.source));portal.append(info);
};
const beforeIndiaChapter=ontRenderChapter;
ontRenderChapter=function(course,ch){if(course.id!=='IN-CBSE-MATH-9-2026')return beforeIndiaChapter(course,ch);const {portal,el,button}=ontUI,area=el('section',undefined,'portal-feature');area.id='ontChapterDetails';
 area.append(el('h2',ch.title),el('p',ontComplete(ch)?'✓ Chapter completed · self-reported study':'Work through one subtopic at a time. Mark a subtopic studied when you have finished practising.'),ontLink('Official syllabus',ch.source));
 const list=el('div',undefined,'ont-topics');for(const t of ch.topics){const r=ontRecord(t.id),card=el('section',undefined,'portal-card');card.append(el('span','LESSON '+t.code,'eyebrow'),el('h3',t.title),el('p',t.objective),el('p',r.completed?'✓ Studied · self-reported':indiaPrepared(t)?'Prepared introduction · voice and practice':'Connected AI teaching or reviewed lesson'),button(r.completed?'Review with tutor':'Learn with tutor',()=>ontOpenTopic(course,ch,t)));
 card.append(button(r.completed?'Mark not finished':'Mark as studied',()=>{if(!ontSave(ontKey('topic',t.id),{...r,completed:!r.completed,evidence:'self-reported study',updated:new Date().toISOString()})){card.append(el('p','Storage unavailable. This change was not saved.'));return}ontOpenChapter(course,ch)}));list.append(card)}area.append(list);
 const attempts=readSaved(ontKey('exam',ch.id))||[],exam=button(attempts.length?'Take another chapter exam':'Start chapter exam',()=>ontExam(course,ch));exam.disabled=!ontComplete(ch);area.append(el('h3','Chapter exam'),el('p','Show a worked example and your reasoning for five sampled skills. Written submissions are saved for review; no automatic mark is assigned.'),exam);if(!ontComplete(ch))area.append(el('p','Study every subtopic to unlock the chapter exam.'));if(attempts.length)area.append(el('p',attempts.length+' submission(s) saved · awaiting review'));portal.append(area);
};
const indiaNav=document.createElement('button');indiaNav.id='indiaMathsNav';indiaNav.textContent='India CBSE maths';indiaNav.onclick=()=>{indiaChoose();ontUI.show('load')};document.querySelector('.app-nav').append(indiaNav);
