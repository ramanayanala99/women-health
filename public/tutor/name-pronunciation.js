// Basic classroom requests can be answered locally without an AI conversation.
(()=>{
const label=document.createElement('label');label.textContent='How to pronounce your name (optional)';const input=document.createElement('input');input.id='namePronunciation';input.maxLength=80;input.placeholder='For example: Ra-ma-na';input.setAttribute('aria-describedby','namePronunciationNote');label.append(input);
const note=document.createElement('small');note.id='namePronunciationNote';note.textContent='Write the sounds if the voice says your name incorrectly. Voice pronunciation can vary.';const box=document.createElement('div');box.append(label,note);$('room-panel-settings').append(box);
const key='ut-name-pronunciations';function saved(){try{const all=JSON.parse(tutorStorage.getItem(key)||'{}');return all&&typeof all==='object'&&!Array.isArray(all)?all:{}}catch{return {}}}
function currentName(){return $('studentName').value.trim()||student}
let fieldName='';function load(){fieldName=currentName();input.value=typeof saved()[fieldName]==='string'?saved()[fieldName]:''}load();
input.onchange=()=>{const all=saved(),name=currentName();if(input.value.trim())all[name]=input.value.trim();else delete all[name];try{tutorStorage.setItem(key,JSON.stringify(all))}catch{}fieldName=name};$('studentName').addEventListener('change',load);
let waitingForName=false;const priorStudent=studentTurn;
studentTurn=function(text){if(agentEnabled)return priorStudent(text);text=String(text).trim();const request=/\b(?:pronounce|say|speak)\b.*\bmy name\b|\bhow (?:do|would) you (?:say|pronounce) my name\b/i.test(text)&&! /\b(?:do not|don't|dont|stop)\b/i.test(text);
const introduced=/^(?:my name is|call me)\s+(.{1,80})[.!?]?$/i.exec(text);if(!request&&!(waitingForName&&introduced))return priorStudent(text);
const stayPaused=manualPause;clearTimeout(idleTimer);cancelAdvance();stopSpeech();paused=stayPaused;manualPause=stayPaused;msg(text,'user');
if(introduced){const name=introduced[1].replace(/[.!?]+$/,'').trim();$('studentName').value=name;student=name;try{tutorStorage.setItem('ut-student-name',name)}catch{}load()}
const name=currentName();if(!name||name==='Learner'){waitingForName=true;msg('What name would you like me to say? You can type or say “My name is …”.');return}
waitingForName=false;if(fieldName!==name)load();const phonetic=input.value.trim()||name;const voice=autoVoice;autoVoice=false;msg('Your name is '+name+'. You can adjust its pronunciation in Settings.');autoVoice=voice;speak(phonetic+'.');
};
})();
