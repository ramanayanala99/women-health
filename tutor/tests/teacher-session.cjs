// Focused regressions for the existing controllers. Full overlay integration is tested in natural-classroom.cjs and live-recorded-classroom.cjs.
const assert=require('assert'),vm=require('vm'),fs=require('fs'),{JSDOM}=require('jsdom');
(async()=>{
const html=fs.readFileSync('public/tutor/index.html','utf8'),dom=new JSDOM(html,{url:'https://example.test',runScripts:'outside-only'}),w=dom.window,ctx=dom.getInternalVMContext();let interval;Object.defineProperty(w.document,'hidden',{value:false});
w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:()=>()=>{}});w.HTMLMediaElement.prototype.pause=()=>{};w.setInterval=f=>{interval=f;return 0};w.setTimeout=()=>0;w.clearTimeout=()=>{};w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.AbortController=AbortController;w.AbortSignal=AbortSignal;
let micStarts=0;w.SpeechRecognition=function(){this.start=()=>{micStarts++;this.onstart?.()};this.stop=()=>this.onend?.()};
for(const m of html.matchAll(/<script(?: type="[^"]+")? src="([^"]+)"/g)){if(!/classroom-(conversation|live-mic)\.js/.test(m[1]))vm.runInContext(fs.readFileSync('public/tutor/'+m[1].split('?')[0],'utf8'),ctx)};
const run=s=>vm.runInContext(s,ctx),$=id=>w.document.getElementById(id);run("$('topic').value=LESSONS[0].id");$('studentName').value='Maya';$('start').click();assert(w.document.body.classList.contains('in-classroom'));assert(!$('classroomPage').hidden);
$('agentEndpoint').value='https://backend.test';$('agentPassword').value='private-test-password';$('agentVoice').checked=false;
let requests=[];w.fetch=(url,opts)=>new Promise(resolve=>requests.push({resolve,opts,body:JSON.parse(opts.body)}));
const first=run("studentTurn('Why does this method work?')");assert.equal(requests.length,1,'Question activates AI without extra button');assert.equal(run('agentEnabled'),true);
const second=run("studentTurn('Please explain the diagram instead')");assert.equal(requests.length,2,'An interruption must be accepted while busy');assert(requests[0].opts.signal.aborted);
const turn={message:'Look at these three equal groups.',question:'How many in total?',board_steps:['DRAW: array; rows=3; columns=4','3 × 4 = 12'],understanding:'unknown'};
requests[1].resolve(Response.json(turn));await new Promise(resolve=>setImmediate(resolve));requests[0].resolve(Response.json({...turn,message:'Obsolete reply'}));await first;await second;await new Promise(resolve=>setImmediate(resolve));
assert(!$('currentTurn').textContent.includes('Obsolete'));assert(run('agentHistory').some(x=>x.content.includes('diagram instead')));
const stored=[...Array(w.tutorStorage.length)].map((_,i)=>w.tutorStorage.key(i)).find(k=>k.startsWith('ut-teacher-session-v1'));assert(stored);assert(!w.tutorStorage.getItem(stored).includes('private-test-password'));
run('endAgent(false)');$('continueClass').click();assert.equal(requests.length,2,'Resume restores board without another AI request');assert.equal(run('agentEnabled'),true);assert.equal(run('agentQuestion'),turn.question);assert($('working').textContent.includes('12'));assert.equal(run('agentHistory').length,2);
$('studentName').value='Other student';$('continueClass').click();assert($('resumeNotice').textContent.includes('No saved lesson'),'Student checkpoints must remain separate');
w.open=()=>null;$('openClassWindow').click();assert($('sessionNotice').textContent.includes('blocked'));assert(w.document.body.classList.contains('in-classroom'));
run('manualPause=false;agentBusy=false;speechBusy=false');$('handsFree').click();assert.equal(micStarts,1);assert.equal($('handsFree').getAttribute('aria-pressed'),'true');$('handsFree').click();assert.equal(run('recognition'),null);
console.log('Direct AI questions, busy interruption, stale reply protection, board/history resume, student isolation, blocked-window fallback and hands-free toggle passed.');dom.window.close();
})().catch(e=>{console.error(e);process.exitCode=1});
