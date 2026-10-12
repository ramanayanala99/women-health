const assert=require('assert'),vm=require('vm'),fs=require('fs'),{JSDOM}=require('jsdom');
(async()=>{
const html=fs.readFileSync('public/tutor/index.html','utf8'),dom=new JSDOM(html,{url:'https://example.test',runScripts:'outside-only'}),w=dom.window,ctx=dom.getInternalVMContext();let now=0,n=0,jobs=new Map(),calls=[];
w.setTimeout=(f,d=0)=>{jobs.set(++n,{f,at:now+d});return n};w.clearTimeout=id=>jobs.delete(id);w.setInterval=()=>0;w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:()=>()=>{}});w.HTMLMediaElement.prototype.pause=()=>{};w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.AbortController=AbortController;w.AbortSignal=AbortSignal;
w.SpeechSynthesisUtterance=function(text){this.text=text};w.speechSynthesis={addEventListener:()=>{},getVoices:()=>[],cancel:()=>{},speak:u=>w.setTimeout(()=>u.onend?.(),100)};
for(const m of html.matchAll(/<script(?: type="[^"]+")? src="([^"]+)"/g))vm.runInContext(fs.readFileSync('public/tutor/'+m[1].split('?')[0],'utf8'),ctx);
const run=s=>vm.runInContext(s,ctx),$=id=>w.document.getElementById(id);function tick(ms){const end=now+ms;let count=0;while(jobs.size){const [id,j]=[...jobs].sort((a,b)=>a[1].at-b[1].at)[0];if(j.at>end)break;if(++count>10000)throw Error('Timer loop');jobs.delete(id);now=j.at;j.f()}now=end}const flush=()=>new Promise(r=>setImmediate(r));
let permissionCalls=0,tracksStopped=0,deny=false,mics=[];
Object.defineProperty(w.navigator,'mediaDevices',{value:{getUserMedia:async()=>{permissionCalls++;if(deny)throw Object.assign(Error(),{name:'NotAllowedError'});return {getTracks:()=>[{stop:()=>tracksStopped++}]}}}});
// Native recognition must request permission before it tries to listen.
// Reload reply controls with a native recognizer in a fresh test separately below.
run("$('topic').value=LESSONS[0].id;autoVoice=false");$('start').click();assert.equal(run('autoVoice'),true);tick(120000);assert.equal(run('phase'),2);assert.equal(run('solved'),0);
for(let i=0;i<50&&run('phase')<6;i++){
 if(!$('checkin').hidden){$('getIt').click();tick(120000);continue}
 const q=run('question()');assert(q,'An incomplete lesson should have a question');
 $('studentMessage').value=String(q.a);$('talkForm').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));tick(120000);
}
assert.equal(run('phase'),6,'Prepared teaching must reach the lesson summary through real form replies');assert(run('masteryCorrect')>=3);
await $('checkMicrophone').onclick();assert.equal(permissionCalls,1);assert.equal(tracksStopped,1);assert($('classAudioStatus').textContent.includes('granted'));
deny=true;await $('checkMicrophone').onclick();assert($('classAudioStatus').textContent.includes('blocked'));assert.equal($('checkMicrophone').disabled,false);
w.document.permissionsPolicy={allowsFeature:()=>false};await $('checkMicrophone').onclick();assert.equal(permissionCalls,2,'Blocked iframe must be diagnosed before requesting access');assert($('classAudioStatus').textContent.includes('embedded view'));
run("autoVoice=false;$('topic').add(new Option(LESSONS[1].name,LESSONS[1].id));$('topic').value=LESSONS[1].id");$('topic').dispatchEvent(new w.Event('change'));assert.equal(run('lesson.id'),run('LESSONS[1].id'));assert.equal(run('autoVoice'),true,'Voice after topic selection');assert(w.document.body.classList.contains('in-classroom'),'Classroom after topic selection');
console.log('Voice entry, complete prepared class, topic switching, permission check, device cleanup, denial and blocked iframe passed.');dom.window.close();
})().catch(e=>{console.error(e);process.exitCode=1});
