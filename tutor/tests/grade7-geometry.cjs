const fs=require('fs'),vm=require('vm'),assert=require('assert'),{JSDOM}=require('jsdom');
const dom=new JSDOM('<html/>',{runScripts:'outside-only'}),ctx=dom.getInternalVMContext();
for(const file of ['textbook-visuals.js','grade7-class-data.js'])vm.runInContext(fs.readFileSync('public/tutor/'+file,'utf8'),ctx);
const lessons=JSON.parse(vm.runInContext('JSON.stringify(GRADE7_CLASS_LESSONS)',ctx));let topics=0,drawings=0;
function check(v,name){
 assert.equal(v.type,'textbook_visual',name+' lost its diagram');assert.notEqual(v.kind,'table',name+' has only a table');
 const svg=vm.runInContext('textbookDiagram('+JSON.stringify(v)+')',ctx);
 assert(svg.querySelector('path,polygon,rect,circle'),name+' is empty');
 for(const el of svg.querySelectorAll('*'))for(const attr of el.attributes)assert(!/NaN|Infinity|undefined/.test(attr.value),name+' invalid '+attr.name);
 if(v.kind==='geometry_scene')for(const p of v.panels){
  if(p.shape==='triangle'){
   assert(p.a+p.b>p.c&&p.a+p.c>p.b&&p.b+p.c>p.a,name+' impossible triangle');
   const angles=[Math.acos((p.a*p.a+p.b*p.b-p.c*p.c)/(2*p.a*p.b)),Math.acos((p.a*p.a+p.c*p.c-p.b*p.b)/(2*p.a*p.c))].map(a=>a*180/Math.PI);angles.push(180-angles[0]-angles[1]);
   p.angleLabels.forEach((s,j)=>{if(/^\d+(\.\d+)?°$/.test(s))assert(Math.abs(parseFloat(s)-angles[j])<1e-6,name+' angle disagrees with triangle');});
  }
 }
 drawings++;
}
for(const lesson of Object.values(lessons)){
 if(!lesson.guided[0].geometryRequired)continue;topics++;
 check(lesson.conceptVisual,lesson.name+' introduction');lesson.teachingScenes.forEach(s=>check(s.visual,lesson.name+' teaching'));
 for(const e of [...lesson.workedExamples,lesson.alternateExample]){check(e.visual,lesson.name);e.steps.forEach(s=>check(s.visual,lesson.name+' working'))}
 for(const q of [...lesson.guided,...lesson.classExercise]){assert(q.geometryRequired,lesson.name+' missing question requirement');check(q.visual,q.q)}
}
assert(topics>=61,'Missing geometry chapter skills');
const rect=lessons['g7-book-congruent_figures'].workedExamples[0].visual;
assert.equal(rect.kind,'geometry_scene');assert.deepEqual(rect.panels.map(p=>[p.w,p.h]),[[3,5],[5,3]]);
assert.deepEqual(lessons['g7-book-congruent_circle_rectangle'].workedExamples[0].visual.panels.map(p=>p.radius),[3,3]);
console.log(topics+' geometry skills; '+drawings+' introduction, example, repair and practice diagrams rendered; all numeric triangle angle labels verified.');dom.window.close();
