const assert=require('assert'),vm=require('vm'),fs=require('fs'),{JSDOM}=require('jsdom');
const html=fs.readFileSync('public/tutor/index.html','utf8'),dom=new JSDOM(html,{url:'https://example.test',runScripts:'outside-only'}),w=dom.window,ctx=dom.getInternalVMContext();let now=0,n=0,jobs=new Map(),calls=0;
w.setTimeout=(f,d=0)=>{jobs.set(++n,{f,at:now+d});return n};w.clearTimeout=id=>jobs.delete(id);w.setInterval=()=>0;w.clearInterval=()=>{};w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:()=>()=>{}});w.HTMLMediaElement.prototype.pause=()=>{};w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.AbortController=AbortController;w.AbortSignal=AbortSignal;
w.SpeechSynthesisUtterance=function(text){this.text=text};w.speechSynthesis={addEventListener:()=>{},getVoices:()=>[],cancel:()=>{},speak:u=>w.setTimeout(()=>u.onend?.(),100)};w.fetch=()=>{calls++;throw Error('No provider required')};
for(const m of html.matchAll(/<script(?: type="[^"]+")? src="([^"]+)"/g))vm.runInContext(fs.readFileSync('public/tutor/'+m[1].split('?')[0],'utf8'),ctx);
const run=s=>vm.runInContext(s,ctx),$=id=>w.document.getElementById(id);
function tick(ms){const end=now+ms;let c=0;while(jobs.size){const [id,j]=[...jobs].sort((a,b)=>a[1].at-b[1].at)[0];if(j.at>end)break;if(++c>20000)throw Error('Timer loop');jobs.delete(id);now=j.at;j.f()}now=end}
$('indiaMathsNav').click();run('ontUI.show("library");const cc=INDIA_CATALOG.courses[0],ch=cc.chapters.find(ch=>ch.id.endsWith("-circles"));');
assert.equal(run('ch.topics.length'),10);
for(let i=0;i<10;i++){
 run(`ontOpenTopic(cc,ch,ch.topics[${i}])`);assert.equal(run('lesson.pending'),false);assert($('visual').querySelector('svg.drawing'),'The board begins drawing without an audio onstart event');assert.equal(run('lesson.id'),run(`ch.topics[${i}].id`));assert(!$('routeLiveAI').hidden===false,'Prepared circle lessons do not require Agent teaching');
 const stages=run('lesson.steps.length');for(let s=0;s<stages;s++){run(`phase=1;boardStep=${s};render()`);const diagram=$('visual').querySelector('svg');assert.equal(diagram.dataset.circleMode,run(`lesson.exampleVisuals[${s}].specs[0].labels.mode`));assert.equal($('working').querySelectorAll('.step').length,s+1);assert(!diagram.outerHTML.includes('NaN'));assert(!diagram.outerHTML.includes('Infinity'));assert(diagram.textContent.includes('O')||['cyclic','semicircle','same_segment'].includes(diagram.dataset.circleMode));}
 for(const group of ['guided','practice','mastery'])assert(run(`lesson.${group}.every(q=>TeachingVisuals.validate(q.visual.specs[0]).ok&&Number.isFinite(q.a))`));
}
// With no audio start event, narration and drawing still flow to a waiting question.
run('ontOpenTopic(cc,ch,ch.topics[0])');tick(120000);assert.equal(run('phase'),2);assert.equal($('answerForm').style.display,'block');tick(30000);assert.equal(run('phase'),2,'A question waits for an answer');
run('checkAnswer(String(question().a))');tick(120000);assert.equal(run('phase'),3);run('checkFeeling("get")');tick(120000);
for(let i=0;i<8&&run('phase')<6;i++){run('checkAnswer(String(question().a))');tick(120000)}assert.equal(run('phase'),6);assert.equal(run('masteryCorrect'),3);assert.equal(calls,0,'The prepared Circles teaching and mastery flow needs no paid API');
// AI command parsing uses the same renderer and preserves existing symbolic radius labels.
assert(run("parseDiagram('DRAW: circle; mode=central_angle; angle=80')"));assert.equal(run("parseDiagram('DRAW: circle; mode=not_supported')"),null);assert(run("TeachingVisuals.validate({shape:'circle',labels:{radius:'r'}}).ok"));
run("showAgentDiagrams(['DRAW: circle; mode=chord_bisector; radius=5; chord=6; distance=4'],'Let’s look at the chord.')");assert.equal($('visual').querySelector('svg').dataset.circleMode,'chord_bisector');assert($('visual').textContent.includes('AM = MB = 3'));
// The same-segment and cyclic practice figures hide the unknown answer.
run("renderTeachingVisuals([{shape:'circle',labels:{mode:'central_angle',angle:80,practice:'yes'}}],true)");assert($('visual').textContent.includes('?'));assert(!$('visual').textContent.includes('40°'));
if(process.argv.includes('--snapshots')){const path='/workspace/scratch/1bd79bffc48f/circle-qa';fs.mkdirSync(path,{recursive:true});for(const mode of ['radius','diameter','chord','sector','segment','chord_bisector','chord_distance','central_angle','same_segment','semicircle','cyclic','circumcircle','equal_chords','wheel']){run(`renderTeachingVisuals([{shape:'circle',labels:{mode:'${mode}',...( '${mode}'==='chord_bisector'?{radius:5,chord:6,distance:4}:{})}}],true)`);fs.writeFileSync(path+'/'+mode+'.svg',$('visual').querySelector('svg').outerHTML)}}
console.log('All 10 circle subtopics: labelled changing diagrams, board steps, complete guided voice flow, question waiting, numeric checks and AI renderer passed (simulated audio).');dom.window.close();
