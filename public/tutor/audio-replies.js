// Browsers without Web Speech can record a short answer for backend transcription.
(()=>{
if(SpeechRecognition)return;
const mic=$('mic'),status=$('speechStatus');let recorder=null,stream=null,controller=null,epoch=0,timer=null,starting=false;
const cancel=document.createElement('button');cancel.type='button';cancel.textContent='Cancel recording';cancel.hidden=true;mic.after(cancel);
const guide=document.createElement('p');guide.className='speech-status';guide.textContent='Recorded voice replies: press Speak, allow the microphone, then press Stop & send. Audio is sent to your connected AI backend for transcription; API usage is billed there.';$('teacherReply').append(guide);
const packageLink=document.createElement('a');packageLink.href='teacher-agent-backend.zip';packageLink.textContent='Download updated voice-reply backend';packageLink.hidden=true;$('teacherReply').append(packageLink);
function stopTracks(){stream?.getTracks().forEach(t=>t.stop());stream=null}
function reset(){clearTimeout(timer);mic.textContent='Speak';mic.disabled=false;cancel.hidden=true;starting=false;recorder=null;stopTracks()}
function abandon(){epoch++;controller?.abort();if(recorder&&recorder.state!=='inactive'){try{recorder.stop()}catch{}}reset();TeacherReplyMic.release()}
cancel.onclick=()=>{abandon();status.textContent='Recording cancelled. You can type or press Speak again.'};
mic.onclick=async()=>{
 if(recorder&&recorder.state==='recording'){recorder.stop();return}if(starting)return;
 const blocked=window.ClassroomAccess?.blocked();if(blocked){status.textContent=blocked;return}
 if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){status.textContent='Microphone recording is unavailable in this view. Open the classroom in a separate browser window, or type your reply.';return}
 const run=++epoch;starting=true;mic.disabled=true;TeacherReplyMic.hold();status.textContent='Requesting microphone access… Choose Allow if your browser asks.';packageLink.hidden=true;
 try{
 const captured=await navigator.mediaDevices.getUserMedia({audio:true});if(run!==epoch){captured.getTracks().forEach(t=>t.stop());return}stream=captured;
 const mime=['audio/webm;codecs=opus','audio/webm','audio/mp4','audio/ogg;codecs=opus'].find(t=>MediaRecorder.isTypeSupported(t));
 const rec=new MediaRecorder(stream,mime?{mimeType:mime}:{});recorder=rec;const chunks=[];let size=0;
 rec.ondataavailable=e=>{if(run!==epoch||!e.data.size)return;chunks.push(e.data);size+=e.data.size;if(size>2500000){abandon();status.textContent='Recording is too large. Please try a shorter reply.'}};
 rec.onerror=()=>{if(run===epoch){abandon();status.textContent='Microphone recording failed. Please type or try again.'}};
 rec.onstop=async()=>{
 if(run!==epoch)return;clearTimeout(timer);stopTracks();recorder=null;mic.textContent='Transcribing…';mic.disabled=true;cancel.hidden=false;controller=new AbortController();const abortTimer=setTimeout(()=>controller?.abort(),35000);
 try{
 const blob=new Blob(chunks,{type:rec.mimeType||mime||'audio/webm'});if(!blob.size)throw Error('No audio captured. Speak and try again.');
 agentBase();if(!$('agentPassword').value)throw Error('Microphone works. Enter your backend test access password in AI connection settings to transcribe your reply.');
 const health=await(await agentRequest('/health',null,controller.signal)).json();if(health.features?.transcription!==true){packageLink.hidden=false;throw Error('Microphone works, but your backend needs the updated /transcribe route. Download the backend below and deploy it to your existing Worker.')}
 const form=new FormData();form.append('file',blob,'reply.'+(blob.type.includes('mp4')?'mp4':blob.type.includes('ogg')?'ogg':'webm'));form.append('language',$('language').value.split('-')[0]);
 const response=await fetch(agentBase()+'/transcribe',{method:'POST',headers:{'X-Tutor-Token':$('agentPassword').value},body:form,signal:controller.signal});const out=await response.json();if(!response.ok)throw Error(out.error||'Could not transcribe this reply.');if(typeof out.text!=='string'||!out.text.trim())throw Error('No speech recognized. Try again or type.');if(run!==epoch)return;
 reset();TeacherReplyMic.release();status.textContent='Heard: '+out.text;studentTurn(out.text);
 }catch(e){if(run===epoch){reset();TeacherReplyMic.release();status.textContent=e.name==='AbortError'?'Voice transcription timed out. Try again or type your reply.':e.message}}
 finally{clearTimeout(abortTimer)}
 };
 rec.start(1000);starting=false;mic.disabled=false;mic.textContent='Stop & send';cancel.hidden=false;status.textContent='Microphone on. Speak your reply, then press Stop & send (maximum 30 seconds).';timer=setTimeout(()=>{if(run===epoch&&rec.state==='recording')rec.stop()},30000);
 }catch(e){if(run===epoch){reset();TeacherReplyMic.release();status.textContent=e.name==='NotAllowedError'?'Microphone access is blocked. Allow it in the browser’s site settings. If using an embedded preview, open the classroom in a separate window.':e.name==='NotFoundError'?'No microphone found. Connect one or type your reply.':'Could not start the microphone. Open the classroom in a separate window or type your reply.'}}
};
$('handsFree').onclick=()=>{status.textContent='This browser uses recorded voice replies. Press Speak, then Stop & send. Hands-free recognition is unavailable here.'};
const previousStudent=studentTurn;studentTurn=function(text){if(starting||recorder||mic.disabled)abandon();return previousStudent(text)};
window.addEventListener('pagehide',abandon);$('openClassWindow').addEventListener('click',abandon);for(const b of document.querySelectorAll('.room-toolbar button'))if(b.textContent==='Exit classroom')b.addEventListener('click',abandon);
})();
