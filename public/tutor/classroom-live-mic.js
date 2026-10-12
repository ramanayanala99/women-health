// Opt-in open microphone. Browser speech events or local VAD can interrupt audio.
(()=>{
const button=$('handsFree'),status=$('speechStatus');let enabled=false,run=0,rec=null,restart=null,stream=null,context=null,analyser=null,poll=null,recorder=null,controller=null,voiceStarted=0,lastSound=0,noise=0.006,busy=false,delivering=false;
const top=document.createElement('div');top.className='room-microphone';
const micToggle=document.createElement('button');micToggle.id='classMicrophone';micToggle.type='button';micToggle.textContent='Microphone: off';
const transcript=document.createElement('p');transcript.id='classTranscript';transcript.setAttribute('role','status');transcript.textContent='Your spoken words will appear here.';
const activity=document.createElement('p');activity.id='classMicActivity';activity.setAttribute('role','status');activity.textContent='Turn the microphone on to speak naturally.';
new MutationObserver(()=>activity.textContent=$('classConversationStatus').textContent).observe($('classConversationStatus'),{childList:true,characterData:true,subtree:true});
const sendVoice=document.createElement('button');sendVoice.id='sendSpokenReply';sendVoice.type='button';sendVoice.textContent='Send spoken reply';sendVoice.hidden=true;
const type=document.createElement('button');type.type='button';type.textContent='Type a reply';type.onclick=()=>{UniversalClassroom.openPanel('tutor');$('studentMessage').focus();$('studentMessage').scrollIntoView({block:'center'})};
top.append(micToggle,type,sendVoice,transcript,activity);document.querySelector('.room-toolbar').append(top);
new MutationObserver(()=>{if(!rec?.pendingTranscript)transcript.textContent=status.textContent}).observe(status,{childList:true,characterData:true,subtree:true});
const note=document.createElement('p');note.className='speech-status';note.id='liveMicNotice';note.textContent='Live listening lets you interrupt without pressing Speak. Use headphones so the microphone does not hear the teacher. Browser recognition may use a browser speech service; recorded fallback sends spoken turns to your AI backend. Turn it off when finished.';$('teacherReply').append(note);
function render(){button.textContent='Live listening: '+(enabled?'on':'off');button.setAttribute('aria-pressed',String(enabled));micToggle.textContent='Microphone: '+(enabled?'on':'off');micToggle.setAttribute('aria-pressed',String(enabled))}
function stop(){enabled=false;run++;clearTimeout(restart);clearInterval(poll);controller?.abort();const r=rec;clearTimeout(r?.flushTimer);sendVoice.hidden=true;rec=null;if(recognition===r)recognition=null;try{r?.abort?.();r?.stop?.()}catch{}try{if(recorder?.state==='recording')recorder.stop()}catch{}recorder=null;stream?.getTracks().forEach(t=>t.stop());stream=null;context?.close?.();context=null;voiceStarted=0;busy=false;render()}
function heardStart(){ClassroomConversation.interrupt('voice');ClassroomConversation.setAudio('student_speaking');status.textContent='I’m listening. Finish your question or answer.'}
const tutorLines=[];function rememberTutor(text){tutorLines.push({text,at:Date.now()});if(tutorLines.length>8)tutorLines.shift();}function echoSources(r){return [lastTutor,r?.teacherAtSpeechStart,...tutorLines.filter(line=>Date.now()-line.at<30000).map(line=>line.text)].filter(Boolean)}
function unfinishedReply(text){return /(?:\b(?:answer(?: is)?|equals|point|dot|over|divided by|minus|negative|and)|\/)\s*$/i.test(text.trim())}
function mathsReply(text){return typeof OneToOneClass!=='undefined'&&OneToOneClass.active()&&OneToOneClass.value(text)!==null}
function replyPoint(){const s=typeof OneToOneClass!=='undefined'&&OneToOneClass.active()?OneToOneClass.state():null;return s?s.topicId+':'+s.stage+':'+s.cursor+':'+s.focus:String(index)+':'+String(phase)}
function tutorEcho(text,source=lastTutor){
 if(mathsReply(text))return false;
 const words=s=>String(s||'').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9\s]/g,' ').trim().split(/\s+/).map(w=>w.length>4?w.replace(/s$/,''):w);
 const heard=words(text),tutor=words(source);if(heard.length<5||tutor.length<5){if((!speechBusy&&!tutorLines.some(line=>line.text===source&&Date.now()-line.at<2500))||heard.length<2||/^[\d\s.,/%+\-]+$/.test(text.trim())||/^(?:i|yes|no|yeah|ok|okay|good|fine|ready|answer|option)\b/i.test(text.trim()))return false;return heard.every((word,i)=>word===tutor[i]);}
 if(tutor.join(' ').includes(heard.join(' ')))return true;
 // Recognition may trim the end of a spoken line or lose a plural ending.
 return heard.slice(0,4).every((w,i)=>w===tutor[i])&&heard.filter((w,i)=>w===tutor[i]).length/heard.length>=.8;
}
function deliver(text){if(!text.trim())return;UniversalClassroom.openPanel('tutor');status.textContent='Heard: '+text;transcript.textContent='Sent to teacher: '+text;sendVoice.hidden=true;$('studentMessage').value='';delivering=true;try{studentTurn(text.trim())}finally{delivering=false}}
function startNative(id){if(!enabled||id!==run)return;const r=new SpeechRecognition();rec=r;recognition=r;r.lang=$('language').value;r.continuous=true;r.interimResults=true;let speech=false,lastSent='',lastSentAt=0,lastSentPoint='';const receivedFinals=new Map();
 const submit=text=>{text=text.trim();if(!text||id!==run||rec!==r)return;if(unfinishedReply(text)){r.finalFragment=text;r.pendingTranscript=text;transcript.textContent='Hearing: '+text;status.textContent='Finish your answer — I’m still listening.';sendVoice.hidden=false;return;}if(echoSources(r).some(source=>tutorEcho(text,source))){clearTimeout(r.flushTimer);r.pendingTranscript='';speech=false;r.studentSpeaking=false;sendVoice.hidden=true;status.textContent='I heard the tutor’s audio. Waiting for your reply.';if(r.pausedBeforeSpeech===false&&typeof OneToOneClass!=='undefined'&&OneToOneClass.active())TeacherReplyMic.release();return}if(text===lastSent&&replyPoint()===lastSentPoint&&Date.now()-lastSentAt<2000)return;lastSent=text;lastSentAt=Date.now();r.finalFragment='';clearTimeout(r.flushTimer);r.pendingTranscript='';speech=false;r.studentSpeaking=false;deliver(text);lastSentPoint=replyPoint()};
 r.flushPending=()=>submit(r.pendingTranscript||'');
 r.onspeechstart=()=>{if(id!==run||rec!==r)return;clearTimeout(r.flushTimer);if(!speech)r.pausedBeforeSpeech=paused;r.teacherAtSpeechStart=lastTutor;status.textContent='Microphone is listening for your words.';};
 r.onspeechend=()=>{if(id!==run||rec!==r)return;clearTimeout(r.flushTimer);r.flushTimer=setTimeout(()=>{if(id!==run||rec!==r)return;if(r.pendingTranscript)submit(r.pendingTranscript);else if(speech){r.studentSpeaking=false;speech=false;status.textContent='I didn’t catch your words. Press Speak again, or Type a reply.';if(r.pausedBeforeSpeech===false&&!manualPause)TeacherReplyMic.release()}},1200)};
 r.onresult=e=>{if(id!==run||rec!==r)return;let final='',preview='';for(let i=e.resultIndex||0;i<e.results.length;i++){const x=e.results[i];if(x.isFinal!==false){const text=x[0].transcript.trim();if(receivedFinals.get(i)!==text){receivedFinals.set(i,text);final+=text+' ';}}else preview+=x[0].transcript+' '}
  if(final.trim()===lastSent&&replyPoint()===lastSentPoint&&Date.now()-lastSentAt<2000&&!preview.trim())return;
  if(r.finalFragment){if(final.trim())final=r.finalFragment+' '+final;else if(preview.trim())preview=r.finalFragment+' '+preview;}
  if(echoSources(r).some(source=>tutorEcho((final||preview).trim(),source))){if(final.trim())submit(final);return;}
  if(!final.trim()&&preview.trim()&&!mathsReply(preview)&&(speechBusy||preview.trim().split(/\s+/).length>=2)){const clean=s=>String(s||'').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();if(echoSources(r).some(s=>clean(s).startsWith(clean(preview))))return;}
  if((final||preview).trim()&&!speech){r.pausedBeforeSpeech=paused;speech=true;r.studentSpeaking=true;heardStart()}if(preview){r.pendingTranscript=preview.trim();transcript.textContent='Hearing: '+r.pendingTranscript;status.textContent='Hearing: '+r.pendingTranscript;sendVoice.hidden=false}if(final.trim())submit(final);
 };
 function reconnect(){if(rec!==r)return;clearTimeout(r.flushTimer);if(enabled&&id===run&&r.pendingTranscript)submit(r.pendingTranscript);else if(speech&&r.pausedBeforeSpeech===false&&!manualPause)TeacherReplyMic.release();rec=null;if(recognition===r)recognition=null;if(enabled&&id===run&&!document.hidden){clearTimeout(restart);restart=setTimeout(()=>startNative(id),r.restartDelay||500)}}
 r.onerror=e=>{if(id!==run||rec!==r)return;clearTimeout(r.flushTimer);if(['not-allowed','service-not-allowed','audio-capture'].includes(e.error)){stop();status.textContent='Microphone unavailable: '+e.error+'. Allow microphone access or check your device, then press Microphone.'}else{r.restartDelay=e.error==='network'?1500:500;status.textContent='Speech listening was interrupted. Reconnecting automatically…';reconnect();try{r.abort()}catch{}}};
 r.onend=reconnect;
 try{r.start();status.textContent='Microphone on. Speak your reply or question; your words will appear above.'}catch{stop();status.textContent='Live recognition could not start. Press Speak or type your reply.'}
}
async function transcribe(chunks,mime,id){busy=true;controller=new AbortController();const timeout=setTimeout(()=>controller?.abort(),35000);try{
 const blob=new Blob(chunks,{type:mime});if(!blob.size)throw Error('No speech captured');if(blob.size>2500000)throw Error('Try a shorter spoken reply');
 const health=await(await agentRequest('/health',null,controller.signal)).json();if(!health.features?.transcription)throw Error('Update your Worker with the /transcribe route to use live recorded replies.');
 const form=new FormData();form.append('file',blob,'reply.'+(mime.includes('mp4')?'mp4':mime.includes('ogg')?'ogg':'webm'));form.append('language',$('language').value.split('-')[0]);
 ClassroomConversation.setAudio('processing');status.textContent='Transcribing your spoken reply…';const r=await fetch(agentBase()+'/transcribe',{method:'POST',headers:{'X-Tutor-Token':$('agentPassword').value},body:form,signal:controller.signal});const out=await r.json();if(!r.ok||!out.text)throw Error(out.error||'I didn’t catch that. Can you say it again?');if(enabled&&id===run)deliver(out.text);
 }catch(e){if(enabled&&id===run){status.textContent=e.name==='AbortError'?'Voice reply timed out. You can type or press Speak.':e.message;stop()}}finally{clearTimeout(timeout);busy=false}
}
function warmRecord(id){
 if(!enabled||id!==run||!stream)return;
 const mime=['audio/webm;codecs=opus','audio/webm','audio/mp4','audio/ogg;codecs=opus'].find(x=>MediaRecorder.isTypeSupported(x));const r=new MediaRecorder(stream,mime?{mimeType:mime}:{}),data=[];let header=null;recorder=r;
 r.ondataavailable=e=>{if(!e.data.size)return;if(!header)header=e.data;data.push(e.data);if(!voiceStarted&&data.length>4)data.shift()};
 r.onstop=async()=>{const spoke=!!voiceStarted;voiceStarted=0;recorder=null;if(enabled&&id===run&&spoke){await transcribe(header&&data[0]!==header?[header,...data]:data,r.mimeType||mime||'audio/webm',id);if(enabled&&id===run)warmRecord(id)}};
 r.onerror=()=>{stop();status.textContent='Recording failed. Please type your reply.'};r.start(250);
}
function record(id){if(!enabled||busy||voiceStarted)return;heardStart();voiceStarted=Date.now();lastSound=voiceStarted;}
async function startRecorded(id){const AudioContext=window.AudioContext||window.webkitAudioContext;if(!AudioContext||!window.MediaRecorder)throw Error('Live recorded listening is unavailable. Press Speak or type.');agentBase();if(!$('agentPassword').value)throw Error('Enter the backend access password before enabling live recorded replies.');
 const captured=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});if(!enabled||id!==run){captured.getTracks().forEach(t=>t.stop());return}stream=captured;context=new AudioContext();await context.resume();if(!enabled||id!==run)return;analyser=context.createAnalyser();analyser.fftSize=1024;context.createMediaStreamSource(stream).connect(analyser);const samples=new Float32Array(analyser.fftSize);
 status.textContent='Live recorded microphone on. Use headphones; spoken replies finish after a short silence.';
 warmRecord(id);let loud=0;
 poll=setInterval(()=>{if(!enabled||id!==run||busy||document.hidden)return;analyser.getFloatTimeDomainData(samples);const rms=Math.sqrt(samples.reduce((s,x)=>s+x*x,0)/samples.length);const now=Date.now(),threshold=Math.max(.022,noise*3.5);
  if(!voiceStarted){if(rms>threshold){loud++;if(loud>=2){loud=0;record(id)}}else{loud=0;noise=noise*.97+rms*.03}}
  else {if(rms>threshold)lastSound=now;if((now-lastSound>1100&&now-voiceStarted>600)||now-voiceStarted>28000){if(recorder?.state==='recording')recorder.stop()}}
 },50);
}
button.onclick=async()=>{if(enabled){stop();status.textContent='Live microphone off. Press Speak or type whenever you like.';return}const issue=ClassroomAccess.blocked();if(issue){status.textContent=issue;return}enabled=true;const id=++run;button.disabled=true;render();try{if(SpeechRecognition){await ClassroomAccess.request();if(enabled&&id===run)startNative(id)}else await startRecorded(id)}catch(e){if(id===run){stop();status.textContent=e.message}}finally{button.disabled=false}};
micToggle.onclick=()=>button.onclick();sendVoice.onclick=()=>rec?.flushPending?.();
// Speak remains an explicit fallback; it stops the open-mic recognizer first.
const oldMic=$('mic').onclick;$('mic').onclick=()=>{if(enabled){UniversalClassroom.openPanel('tutor');status.textContent='Microphone is on. Say your answer or question now.';return}return oldMic()};
const priorStudent=studentTurn;studentTurn=function(text){if(enabled&&!delivering&&rec?.studentSpeaking){const r=rec;r.pendingTranscript='';r.studentSpeaking=false;try{r.abort()}catch{}}else if(enabled&&!delivering&&(voiceStarted||busy))stop();return priorStudent(text)};
window.ClassroomLiveMic={rememberTutor,stop,isEnabled:()=>enabled};
window.addEventListener('pagehide',stop);document.addEventListener('visibilitychange',()=>{if(!enabled)return;if(!SpeechRecognition){if(document.hidden)stop();return}if(document.hidden){clearTimeout(restart);const r=rec;rec=null;if(recognition===r)recognition=null;try{r?.abort()}catch{}status.textContent='Microphone paused while this tab is inactive.'}else if(!rec)startNative(run)});$('openClassWindow').addEventListener('click',stop);for(const b of document.querySelectorAll('.room-toolbar button'))if(b.textContent==='Exit classroom')b.addEventListener('click',stop);
const oldStart=start;start=function(...args){const reopen=enabled&&!!SpeechRecognition;stop();const result=oldStart(...args);if(reopen){enabled=true;render();startNative(run)}return result};
render();
})();
