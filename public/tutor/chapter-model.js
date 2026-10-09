// Sample topic paths. Replace with verified curriculum chapter records later.
const SAMPLE_CHAPTERS=LESSONS.map(base=>{
 const q=base.application;
 const applied={...base,id:base.id+'-apply',name:base.name+' — real-life problems',goal:'Apply '+base.name.toLowerCase()+' to a real-life problem.',hook:base.hook,idea:'Read the situation, identify the quantities, and decide which method fits. '+base.idea,simple:q.h,visual:{type:'equation',text:q.q},steps:[[q.q,'First identify what the problem asks you to find.'],[q.why,'Connect the quantities using the method you learned.'],['Answer: '+q.a,'Check the answer against the original question.']],narration:['Let’s read this situation together. '+q.q,q.why,'The answer is '+q.a+'. Now you can try another situation.'],guided:[base.practice[0]],practice:[base.practice.at(-1),base.guided[0]],application:base.challenge||q,mastery:base.mastery};
 LESSONS.push(applied);
 return {id:'chapter-'+base.id,grade:base.grade,title:base.chapter,subject:'Mathematics',topics:[base.id,applied.id],examQuestions:[...base.guided,...base.practice,base.application,...base.mastery].slice(0,5)};
});
function chapterRecordKey(l){return ['ft-teacher-v1',practiceStudent(),practiceContext(),l.id].join(':')}
function topicCompletionKey(id){return ['ut-topic-completed-v1',practiceStudent(),practiceContext(),id].join(':')}
function topicFinished(id){return !!readSaved(topicCompletionKey(id))||readSaved(chapterRecordKey(LESSONS.find(l=>l.id===id)))?.stage===6}
function retainTopicCompletion(l){const record=readSaved(chapterRecordKey(l));if(record?.stage===6){try{tutorStorage.setItem(topicCompletionKey(l.id),JSON.stringify({completed:true,updated:record.updated}))}catch{}}}
function chapterFinished(c){return c.topics.every(topicFinished)}
function chapterExamKey(c){return ['ut-chapter-exams-v1',practiceStudent(),practiceContext(),c.id].join(':')}
function chapterExamAttempts(c){const a=readSaved(chapterExamKey(c));return Array.isArray(a)?a:[]}
function gradeChapter(){return SAMPLE_CHAPTERS.find(c=>c.grade===Number($('grade').value))}
