// A portrait interface, with states driven by actual microphone/audio/request activity.
(()=>{
 const host=document.querySelector('.tutor-heading');if(!host)return;
 host.classList.add('teacher-presence');host.replaceChildren();
 const portrait=document.createElement('div');portrait.className='teacher-portrait';
 const defaultPortrait=`<svg viewBox="0 0 140 140" role="img" aria-label="Illustrated teacher"><circle cx="70" cy="70" r="70" fill="#dde8ff"/><path d="M35 66 C25 8 115 8 107 74 L112 113 H28Z" fill="#50383c"/><path d="M23 140 Q28 101 70 100 Q111 101 118 140" fill="#476cd5"/><path d="M58 90 V109 Q70 121 82 109 V90" fill="#dcaa89"/><ellipse cx="70" cy="64" rx="29" ry="37" fill="#efc2a0"/><path d="M40 55 Q45 15 77 24 Q103 25 103 55 Q85 51 77 37 Q63 52 40 55" fill="#50383c"/><circle cx="58" cy="64" r="2.5" fill="#43363a"/><circle cx="82" cy="64" r="2.5" fill="#43363a"/><path d="M59 82 Q70 92 81 82" fill="none" stroke="#a65f5f" stroke-width="3" stroke-linecap="round"/></svg>`;
 portrait.innerHTML=defaultPortrait;
 const identity=document.createElement('div');identity.className='teacher-identity';
 const title=document.createElement('b');title.textContent='Your personal teacher';
 const status=document.createElement('span');status.className='teacher-presence-status';status.setAttribute('role','status');
 const subtitle=document.createElement('small');subtitle.textContent='Learn together, one idea at a time.';
 const wave=document.createElement('div');wave.className='teacher-wave';wave.setAttribute('aria-hidden','true');for(let i=0;i<5;i++)wave.append(document.createElement('i'));
 identity.append(title,status,subtitle,wave);host.append(portrait,identity);
 const controls=document.createElement('div');controls.className='teacher-presence-actions';
 const ask=document.createElement('button');ask.textContent='Ask your teacher';ask.onclick=()=>{$('mic').click();if(!SpeechRecognition){$('studentMessage').focus()}};
 const photoLabel=document.createElement('label');photoLabel.className='teacher-photo-label';photoLabel.textContent='Choose teacher photo';
 const photo=document.createElement('input');photo.type='file';photo.accept='image/png,image/jpeg,image/webp';photo.setAttribute('aria-label','Choose teacher portrait photo');photoLabel.append(photo);
 const reset=document.createElement('button');reset.className='quiet';reset.textContent='Reset portrait';
 const notice=document.createElement('small');notice.className='teacher-photo-notice';notice.textContent='Portrait only. Your selected teaching voice stays the same.';
 let photoURL=null;
 photo.onchange=()=>{const file=photo.files[0];if(!file)return;if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>5*1024*1024){notice.textContent='Choose a PNG, JPG or WebP image under 5 MB.';photo.value='';return}if(photoURL)URL.revokeObjectURL(photoURL);photoURL=URL.createObjectURL(file);const image=document.createElement('img');image.src=photoURL;image.alt='Chosen teacher portrait';portrait.replaceChildren(image);notice.textContent='Photo selected for this session. Teaching voice is unchanged.'};
 reset.onclick=()=>{document.dispatchEvent(new Event('teacher-portrait-reset'));if(photoURL)URL.revokeObjectURL(photoURL);photoURL=null;portrait.innerHTML=defaultPortrait;photo.value='';notice.textContent='Portrait only. Your selected teaching voice stays the same.'};
 controls.append(ask,photoLabel,reset,notice);host.after(controls);
 const labels={speaking:'Speaking',listening:'Listening to you',thinking:'Thinking',paused:'Paused',waiting:'Your turn',ready:'Ready to learn'};
 function update(){
  let state='ready';
  const classroom=window.ClassroomConversation?.state().audioState;
  if(classroom&&classroom!=='idle')state=({teacher_speaking:'speaking',teacher_responding:'speaking',student_speaking:'listening',listening:'waiting',processing:'thinking',paused:'paused',resuming:'speaking'})[classroom]||'ready';
  else if(typeof recognition!=='undefined'&&recognition)state='listening';
  else if((typeof agentAudio!=='undefined'&&agentAudio&&!agentAudio.paused&&!agentAudio.ended)||speechBusy)state='speaking';
  else if(typeof agentBusy!=='undefined'&&agentBusy)state='thinking';
  else if(activeLesson||agentEnabled){if(paused)state='paused';else if(agentEnabled?!!agentQuestion:(phase>=2&&phase<=5&&!locked))state='waiting'}
  if(host.dataset.state!==state){host.dataset.state=state;status.textContent=labels[state]}
 }
 update();setInterval(update,200);
})();
