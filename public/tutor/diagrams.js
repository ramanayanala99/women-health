// Safe geometry instructions work with the existing plain-text agent backend.
let lastAgentDiagrams=[];
const DIAGRAM_PROMPT='';
function parseDiagram(text){
 const match=/^\s*DRAW:\s*(rectangle|square|triangle|right_triangle|circle|angle|cube)\b(.*)$/i.exec(text||'');if(!match)return null;
 const labels={};for(const part of match[2].split(';')){const m=/^\s*(width|height|base|radius|angle|vertices|leg|hypotenuse|kind|mode|diameter|chord|distance|construction|angle[A-Z])\s*=\s*([^;]{1,30})\s*$/.exec(part);if(m&&!/[<>]/.test(m[2]))labels[m[1]]=m[2].trim()}
 const shape=match[1].toLowerCase();if(shape==='right_triangle')labels.kind='right';return {shape:shape==='right_triangle'?'triangle':shape,labels};
}
function diagramSVG(spec){
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 420 260');svg.setAttribute('role','img');svg.setAttribute('aria-label',spec.shape+' diagram '+Object.entries(spec.labels).map(([k,v])=>k+' '+v).join(', '));svg.classList.add('teaching-diagram');
 const add=(tag,attrs,text)=>{const n=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);if(text)n.textContent=text;svg.append(n);return n};
 let strokeIndex=0;const path=d=>{const n=add('path',{d,fill:'none',stroke:'currentColor','stroke-width':3,'stroke-linecap':'round','stroke-linejoin':'round',pathLength:1});n.classList.add('diagram-stroke');n.style.setProperty('--draw-delay',strokeIndex++*.3+'s');return n};
 const label=(x,y,text,color='currentColor',rotation=0)=>{if(!text)return;const n=add('text',{x,y,'text-anchor':'middle',fill:color,'font-size':18},text);if(rotation)n.setAttribute('transform',`rotate(${rotation} ${x} ${y})`);n.classList.add('diagram-label');n.style.setProperty('--draw-delay',strokeIndex*.3+'s');return n};
 const l=spec.labels,vertices=vertexNames(l.vertices);
 const markVertices=points=>points.forEach(([x,y],i)=>label(x,y,vertices[i]||''));
 const markAngle=(point,p1,p2,value)=>{
  const unit=p=>{const dx=p[0]-point[0],dy=p[1]-point[1],length=Math.hypot(dx,dy);return [dx/length,dy/length]};
  const u=unit(p1),v=unit(p2),r=25;
  const start=[point[0]+u[0]*r,point[1]+u[1]*r],end=[point[0]+v[0]*r,point[1]+v[1]*r];
  const cross=u[0]*v[1]-u[1]*v[0];
  path(`M${start[0]} ${start[1]} A${r} ${r} 0 0 ${cross>0?1:0} ${end[0]} ${end[1]}`).setAttribute('stroke','#ffd879');
  if(value&&value!=='mark'){const bx=u[0]+v[0],by=u[1]+v[1],length=Math.hypot(bx,by);label(point[0]+bx/length*49,point[1]+by/length*49+5,value)}
 };
 if(spec.shape==='rectangle'||spec.shape==='square'){const left=spec.shape==='square'?130:80,right=spec.shape==='square'?290:340;path(`M${left} 55 H${right}`);path(`M${right} 55 V205`);path(`M${right} 205 H${left}`);path(`M${left} 205 V55`);label(210,235,l.width||'');label(right+32,135,l.height||'');markVertices([[left-12,45],[right+12,45],[right+12,223],[left-12,223]]);}
 if(spec.shape==='triangle'){
  const rightIndex=vertices.findIndex(name=>parseFloat(l['angle'+name])===90);
  const right=l.kind==='right'||rightIndex>=0;
  if(right){
   label(210,27,'Right Triangle');
   path('M85 65 V205');path('M85 205 H345');path('M345 205 L85 65');
   path('M85 185 H105 V205').setAttribute('stroke','#ffd879');
   label(100,230,'90°','#ffd879');
   label(49,140,l.height||l.leg||'leg','#9fe5ef');
   label(220,239,l.base||'leg','#9fe5ef');
   label(229,128,l.hypotenuse||'hypotenuse','#ffb1d3',28.3);
   if(!l.hypotenuse){const note=label(247,160,'longest side','#ffcadf');note.setAttribute('font-size',12)}
   // Put the specified 90-degree vertex at the actual perpendicular corner.
   const corner=rightIndex>=0?rightIndex:1,points=[];
   points[corner]=[85,205];points[(corner+1)%3]=[345,205];points[(corner+2)%3]=[85,65];
   points.forEach(([x,y],i)=>label(x+(x===85?-15:15),y+(y===65?-8:5),vertices[i]||''));
   vertices.forEach((name,i)=>{if(i!==corner&&l['angle'+name])markAngle(points[i],points[(i+1)%3],points[(i+2)%3],l['angle'+name])});
  }else{
   const kind=l.kind||'isosceles';let points=kind==='equilateral'?[[210,45],[100,45+110*Math.sqrt(3)],[320,45+110*Math.sqrt(3)]]:kind==='scalene'?[[155,45],[85,205],[335,205]]:[[210,45],[85,205],[335,205]];
   // When two angles are supplied, construct a matching triangle with the sine rule.
   const supplied=vertices.slice(0,3).map(name=>parseFloat(l['angle'+name])),known=supplied.filter(Number.isFinite);
   if(known.length>=2){const angles=[...supplied];if(known.length===2)angles[angles.findIndex(x=>!Number.isFinite(x))]=180-known[0]-known[1];if(angles.every(x=>x>0&&x<180)&&Math.abs(angles.reduce((a,b)=>a+b,0)-180)<.01){const A=angles[0]*Math.PI/180,B=angles[1]*Math.PI/180,C=angles[2]*Math.PI/180,L=250,h=L*Math.sin(A)*Math.sin(B)/Math.sin(C),x=L*Math.sin(B)*Math.cos(A)/Math.sin(C),raw=[[0,0],[L,0],[x,-h]],xmin=Math.min(...raw.map(p=>p[0])),xmax=Math.max(...raw.map(p=>p[0])),scale=Math.min(270/(xmax-xmin),170/h);points=raw.map(p=>[75+(p[0]-xmin)*scale,230+p[1]*scale]);}}
   const [a,b,c]=points;
   path(`M${b[0]} ${b[1]} L${a[0]} ${a[1]}`);path(`M${a[0]} ${a[1]} L${c[0]} ${c[1]}`);path(`M${c[0]} ${c[1]} L${b[0]} ${b[1]}`);
   if(['equilateral','isosceles','scalene'].includes(l.kind)){
    label(210,17,l.kind[0].toUpperCase()+l.kind.slice(1)+' Triangle','#9fe5ef');
    const tick=(p,q)=>{const x=(p[0]+q[0])/2,y=(p[1]+q[1])/2,length=Math.hypot(q[0]-p[0],q[1]-p[1]),dx=-(q[1]-p[1])/length*6,dy=(q[0]-p[0])/length*6;path(`M${x-dx} ${y-dy} L${x+dx} ${y+dy}`).setAttribute('stroke','#9fe5ef')};
    if(l.kind!=='scalene'){tick(a,b);tick(a,c);if(l.kind==='equilateral')tick(b,c)}
   }
   if(l.height){path(`M${a[0]} ${a[1]} V${b[1]}`);label(a[0]+34,(a[1]+b[1])/2,l.height)}label((b[0]+c[0])/2,b[1]+24,l.base||'');
   markVertices([[a[0],a[1]-15],[b[0]-18,b[1]+11],[c[0]+18,c[1]+11]]);
   vertices.forEach((name,i)=>{if(l['angle'+name])markAngle(points[i],points[(i+1)%3],points[(i+2)%3],l['angle'+name])});
  }
 }
 if(spec.shape==='circle'&&typeof circleDiagramSVG==='function')return circleDiagramSVG(l);
 if(spec.shape==='circle'){path('M285 130 A75 75 0 1 1 135 130 A75 75 0 1 1 285 130');label(196,151,vertices[0]||'');if(l.radius){path('M210 130 H285');add('circle',{cx:210,cy:130,r:4,fill:'currentColor'});label(247,115,l.radius)}}
 if(spec.shape==='angle'){const raw=parseFloat(l.angle),degrees=Number.isFinite(raw)&&raw>0&&raw<180?raw:45;const rad=degrees*Math.PI/180,x=100+185*Math.cos(rad),y=210-185*Math.sin(rad);path('M100 210 H330');path(`M100 210 L${x} ${y}`);path(`M145 210 A45 45 0 0 0 ${100+45*Math.cos(rad)} ${210-45*Math.sin(rad)}`);label(165,190,l.angle||'Angle');markVertices([[345,215],[85,230],[x,y-12]]);}
 if(spec.shape==='cube'){path('M105 90 H260 V220 H105 Z');path('M105 90 L165 35 H320 L260 90');path('M320 35 V165 L260 220');label(185,247,l.width||'');}
 return svg;
}
function vertexNames(value){const text=String(value||'').trim();return /^(?:[A-Z](?:[ ,]*[A-Z]){0,7})$/.test(text)?text.match(/[A-Z]/g):[]}
function namedTriangleDiagrams(steps,text){
 const specs=steps.map(parseDiagram).filter(Boolean);
 const description=text+' '+steps.filter(s=>!parseDiagram(s)).join(' ');
 const names=/\btriangles?\b/i.test(description)?[...new Set(description.match(/\b[A-Z]{3}\b/g)||[])].filter(n=>!['SSS','SAS','ASA','AAS','RHS','SSA'].includes(n)):[];
 if(!specs.length&&!names.length&&/\bangle\s+[A-Z]\b/.test(description))lastAgentDiagrams.forEach(s=>specs.push({shape:s.shape,labels:{...s.labels}}));
 const triangles=specs.filter(s=>s.shape==='triangle');
 if(/\bright[- ](?:angled[- ]?)?triangle\b/i.test(description)){if(!triangles.length){const spec={shape:'triangle',labels:{kind:'right'}};specs.push(spec);triangles.push(spec)}else if(triangles.length===1)triangles[0].labels.kind='right'}
 names.slice(0,2).forEach((name,i)=>{if(triangles[i]){if(!vertexNames(triangles[i].labels.vertices).length)triangles[i].labels.vertices=name}else{const spec={shape:'triangle',labels:{vertices:name}};specs.push(spec);triangles.push(spec)}});
 const classification=specs.find(s=>s.shape==='triangle'&&s.labels.kind==='classify')||(/classif(?:y|ication).*sides|equilateral.*isosceles.*scalene/i.test(description)?{}:null);
 if(classification){specs.splice(0,specs.length,...['equilateral','isosceles','scalene'].map(kind=>({shape:'triangle',labels:{kind}})))}
 else {const match=/\b(equilateral|isosceles|scalene)\b/i.exec(description);if(match){if(!specs.some(s=>s.shape==='triangle'))specs.push({shape:'triangle',labels:{kind:match[1].toLowerCase()}});else if(specs.filter(s=>s.shape==='triangle').length===1&&!specs.find(s=>s.shape==='triangle').labels.kind)specs.find(s=>s.shape==='triangle').labels.kind=match[1].toLowerCase()}}
 for(const spec of specs.filter(s=>s.shape==='triangle')){
  const vertices=vertexNames(spec.labels.vertices);
  for(const match of description.matchAll(/\bangle\s+([A-Z])\b(?:\s*(?:is|=|measures)\s*(\d+(?:\.\d+)?)\s*(?:°|degrees?))?/g)){
   if(vertices.includes(match[1])&&!spec.labels['angle'+match[1]])spec.labels['angle'+match[1]]=match[2]?match[2]+'°':'mark';
  }
 }
 return specs;
}
function showAgentDiagrams(steps,text){
 const geometryRelevant=/\b(triangles?|rectangles?|squares?|circles?|cubes?|angles?|geometry|hypotenuse|chords?|sectors?|cyclic|circumcentre|circumcircle)\b/i.test(text+' '+lesson.name+' '+lesson.goal);const drawSteps=steps.filter(x=>!/^\s*DRAW:\s*symmetry_axis\b/i.test(x));if(steps.some(x=>/^\s*DRAW:\s*symmetry_axis\b/i.test(x))){for(let i=drawSteps.length-1;i>=0;i--)if(parseDiagram(drawSteps[i])){drawSteps[i]+='; symmetry=yes';break}}const relevantSteps=drawSteps.filter(line=>{const spec=parseDiagram(line);return !spec||geometryRelevant||!['triangle','rectangle','square','circle','cube','angle'].includes(spec.shape)});const specs=namedTriangleDiagrams(relevantSteps,text);$('visual').replaceChildren();
 // Generic illustrations only: never infer measurements from conversational text.
 if(!specs.length){const m=/\b(rectangle|square|triangle|circle|cube)\b/i.exec(text);if(m)specs.push({shape:m[1].toLowerCase(),labels:{}})}
 if(specs.length)lastAgentDiagrams=specs.map(s=>({shape:s.shape,labels:{...s.labels}}));
 else if(lastAgentDiagrams.length&&/\b(angle|side|vertex|triangle|shape|figure)\b/i.test(text))specs.push(...lastAgentDiagrams);
 specs.slice(0,3).forEach(spec=>{const figure=document.createElement('figure');figure.className='diagram-figure';figure.append(diagramSVG(spec));const caption=document.createElement('figcaption');caption.textContent=spec.shape[0].toUpperCase()+spec.shape.slice(1)+(vertexNames(spec.labels.vertices).length?' '+vertexNames(spec.labels.vertices).join(''):'')+' · diagram not to scale';figure.append(caption);$('visual').append(figure)});
}
function animateAgentDiagrams(){document.querySelectorAll('.teaching-diagram').forEach(svg=>svg.classList.add('drawing'))}
function freezeAgentDiagrams(){document.querySelectorAll('.teaching-diagram').forEach(svg=>{if(svg.dataset.independentDrawing!=='true')svg.classList.remove('drawing')})}
