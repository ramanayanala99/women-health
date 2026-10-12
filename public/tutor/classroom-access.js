// Explicit classroom entry and microphone permission checks share one UI.
(()=>{
const status=document.createElement('p');status.id='classAudioStatus';status.className='context-note';status.setAttribute('role','status');
const check=document.createElement('button');check.id='checkMicrophone';check.type='button';check.textContent='Check microphone';
document.querySelector('.room-top').after(check,status);
function blocked(){
 if(window.isSecureContext===false)return 'Microphone access needs a secure HTTPS page.';
 const policy=document.permissionsPolicy||document.featurePolicy;
 if(policy?.allowsFeature&&!policy.allowsFeature('microphone'))return 'This embedded view blocks microphone access. Open classroom in new window, then press Speak there.';
 if(!navigator.mediaDevices?.getUserMedia)return 'Microphone permission cannot be requested in this view. Open classroom in new window, or type your reply.';
 return '';
}
function errorText(e){return e.name==='NotAllowedError'?'Microphone permission was blocked. Allow microphone in your browser’s site settings, or open classroom in new window.':e.name==='NotFoundError'?'No microphone found. Connect a microphone, or type your reply.':e.name==='NotReadableError'?'The microphone is busy or unavailable. Check your device settings and try again.':'Microphone could not start. Try a separate classroom window, or type your reply.'}
async function request(){const issue=blocked();if(issue){status.textContent=issue;throw Error(issue)}status.textContent='Requesting microphone access… Please choose Allow.';try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});stream.getTracks().forEach(track=>track.stop());status.textContent='Microphone permission granted. Press Speak to answer or ask a question.';return true}catch(e){status.textContent=errorText(e);throw Error(status.textContent)}}
window.ClassroomAccess={request,blocked};
check.onclick=async()=>{check.disabled=true;try{await request()}catch{}finally{check.disabled=false}};
const priorStart=$('start').onclick;
$('start').onclick=()=>{
 const selected=selectedLesson();
 if(agentEnabled)endAgent(false);
 autoVoice=!selected.pending&&'speechSynthesis' in window;$('autoVoice').textContent=selected.pending?'Tutor voice: awaiting lesson':'Tutor voice: '+(autoVoice?'on':'unavailable');$('autoVoice').setAttribute('aria-pressed',String(autoVoice));
 priorStart();
 status.textContent=lesson.pending?'This topic needs AI teaching or a reviewed lesson. Choose Teach me with AI.':autoVoice?'Teacher voice is on. Press Speak to reply, or type anytime.':'Audio playback is unavailable here. Teaching continues on the board; you can type replies.';
};$('restart').onclick=$('start').onclick;
// Explicit topic changes enter the room; changing a grade still previews its choices.
$('topic').addEventListener('change',()=>{if(!ontActiveTopic||ontActiveTopic.t.id!==$('topic').value){ontActiveTopic=null;$('start').click()}});
})();
