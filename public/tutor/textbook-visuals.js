/* Data-only textbook models. No textbook artwork is reproduced. */
function textbookDiagram(v){
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 560 340');svg.setAttribute('role','img');svg.setAttribute('aria-label',v.title||v.kind);svg.classList.add('teaching-diagram');
 const node=(tag,attrs={},text)=>{const n=document.createElementNS(ns,tag);for(const [k,x] of Object.entries(attrs))n.setAttribute(k,x);if(text!==undefined)n.textContent=String(text);svg.append(n);return n};
 const line=(d,color='currentColor',w=2)=>{const n=node('path',{d,fill:'none',stroke:color,'stroke-width':w,pathLength:1});n.classList.add('diagram-stroke');return n};
 const text=(x,y,t,color='currentColor',size=17)=>node('text',{x,y,fill:color,'font-size':size,'text-anchor':'middle'},t);
 const rect=(x,y,w,h,color='none')=>{const r=node('rect',{x,y,width:w,height:h,fill:color,stroke:'currentColor','stroke-width':1.5,pathLength:1});r.classList.add('diagram-stroke');return r};
 const dot=(x,y,color='#ffcf75')=>node('circle',{cx:x,cy:y,r:5,fill:color});
 const title=v.title||({triangle_model:'Triangle ABC',congruence_pair:'Compare the figures',circle_intersection:'Locate the third vertex',fraction_product:'Parts of one whole',fraction_groups:'Equal-sized groups',construction:'Ruler and compass',table:'Look for the relationship',decimal_grid:'Hundredths model',place_table:'Place value',dot_plot:'Data on a number line',grouped_bars:'Compare the groups'}[v.kind]||'Explore the idea');text(280,28,title,'#a6e4f0',Math.min(21,520/(title.length*.6)));

 if(v.kind==='geometry_scene'){
  svg.dataset.geometry='true';const panels=v.panels||[],pw=520/panels.length,rad=d=>d*Math.PI/180;
  const trianglePoints=p=>{const x=(p.a*p.a+p.b*p.b-p.c*p.c)/(2*p.a);return [[0,0],[p.a,0],[x,Math.sqrt(Math.max(0,p.b*p.b-x*x))]]};
  const sizes=panels.map(p=>p.shape==='rectangle'?[p.w,p.h]:p.shape==='triangle'?(()=>{const pts=trianglePoints(p);return [Math.max(...pts.map(t=>t[0]))-Math.min(...pts.map(t=>t[0])),pts[2][1]]})():p.shape==='circle'?[2*p.radius,2*p.radius]:[1,1]);
  const physicalScale=Math.min((pw-75)/Math.max(...sizes.map(s=>s[0])),160/Math.max(...sizes.map(s=>s[1])));
  const arc=(cx,cy,r,from,to,color='#ffd879')=>line(`M${cx+r*Math.cos(rad(from))} ${cy-r*Math.sin(rad(from))} A${r} ${r} 0 ${to-from>180?1:0} 0 ${cx+r*Math.cos(rad(to))} ${cy-r*Math.sin(rad(to))}`,color);
  panels.forEach((p,index)=>{
   const left=20+index*pw,cx=left+pw/2,cy=170;
   const caption=t=>text(cx,285,t,'#a6e4f0',14);
   if(p.shape==='rectangle'){
    const w=p.w*physicalScale,h=p.h*physicalScale,x=cx-w/2,y=cy-h/2;rect(x,y,w,h,'#24566b');const labels=p.sideLabelsOverride||p.sideLabels;
    text(cx,y+h+22,p.symbolic?p.variable:labels[0],'#ffd879',16);text(x+w+21,cy,p.symbolic?(p.otherVariable||labels[1]):labels[1],'#ffd879',16);
    if(p.allSides){text(cx,y-10,p.variable,'#ffd879');text(x-18,cy,p.otherVariable,'#ffd879')}
    if(p.mark){const mx=p.reflected?x+w-15:x+15;dot(mx,y+15);text(mx,y+33,'P','currentColor',12)}
    if(p.vertices){[...p.vertices].forEach((t,i)=>text([x,x+w,x+w,x][i], [y-10,y-10,y+h+16,y+h+16][i],t));if(p.diagonal){line(`M${x+w} ${y} L${x} ${y+h}`,'#ffd879',3);text(cx,cy-8,p.diagonalLabel,'#ffd879',13)}}
    if(p.caption)caption(p.caption);
   }
   if(p.shape==='circle'){
    const r=p.radius*physicalScale;node('circle',{cx,cy,r,fill:'none',stroke:'#a6e4f0','stroke-width':3});dot(cx,cy);text(cx-12,cy+20,'O');line(`M${cx} ${cy} H${cx+r}`,'#ffd879');text(cx+r/2,cy-12,p.label,'#ffd879',15);
    if(p.diameter){line(`M${cx-r} ${cy} H${cx+r}`,'#ffd879');text(cx,cy+r+24,p.diameter,'#ffd879',15)}
   }
   if(p.shape==='triangle'){
    const raw=trianglePoints(p),min=Math.min(...raw.map(t=>t[0])),max=Math.max(...raw.map(t=>t[0])),sc=physicalScale,x0=cx-(max-min)*sc/2-min*sc,baseY=255,pts=raw.map(([x,y])=>[x0+x*sc,baseY-y*sc]);
    line('M'+pts.map(t=>t.join(' ')).join(' L')+' Z','#a6e4f0',3);
    pts.forEach(([x,y],j)=>text(x+(j===0?-12:j===1?12:0),y+(j===2?-14:22),p.vertices[j]));
    [[0,1],[0,2],[1,2]].forEach(([a,b],j)=>{if(!p.sideLabels[j])return;const [P,Q]=[pts[a],pts[b]];text((P[0]+Q[0])/2+(j===1?-20:j===2?20:0),(P[1]+Q[1])/2+(j===0?22:0),p.sideLabels[j],'#ffd879',14)});
    pts.forEach((P,j)=>{const label=p.angleLabels[j];if(!label)return;const Q=pts[(j+1)%3],R=pts[(j+2)%3],a=Math.atan2(-(Q[1]-P[1]),Q[0]-P[0]),b=Math.atan2(-(R[1]-P[1]),R[0]-P[0]);let diff=((b-a)%(2*Math.PI)+2*Math.PI)%(2*Math.PI);if(diff>Math.PI)diff-=2*Math.PI;const mid=a+diff/2;
     if(label==='90°'){const u=[Math.cos(a),-Math.sin(a)],z=[Math.cos(b),-Math.sin(b)],r=12;line(`M${P[0]+r*u[0]} ${P[1]+r*u[1]} L${P[0]+r*(u[0]+z[0])} ${P[1]+r*(u[1]+z[1])} L${P[0]+r*z[0]} ${P[1]+r*z[1]}`,'#ffd879')}
     else{const r=22;line(`M${P[0]+r*Math.cos(a)} ${P[1]-r*Math.sin(a)} A${r} ${r} 0 0 ${diff>0?0:1} ${P[0]+r*Math.cos(b)} ${P[1]-r*Math.sin(b)}`,'#ffd879')}
     text(P[0]+39*Math.cos(mid),P[1]-39*Math.sin(mid),label,'#ffd879',13);
    });
    if(p.altitude){const C=pts[2],foot=C[0];line(`M${Math.min(pts[0][0],foot)-12} ${baseY} H${Math.max(pts[1][0],foot)+12}`);line(`M${C[0]} ${C[1]} V${baseY}`,'#ffd879',3);line(`M${foot} ${baseY-12} H${foot+12} V${baseY}`,'#ffd879');text(foot,baseY+22,p.footLabel||'H');text(foot+23,(C[1]+baseY)/2,p.vertices[2]+(p.footLabel||'H'),'#ffd879',13)}
    if(p.exterior){const B=pts[1],C=pts[2],a=Math.atan2(C[1]-B[1],C[0]-B[0]);line(`M${C[0]} ${C[1]} L${C[0]+55*Math.cos(a)} ${C[1]+55*Math.sin(a)}`,'#ffd879');text(C[0]+45*Math.cos(a)+15,C[1]+45*Math.sin(a),'?','#ffd879')}
    if(p.compass){const A=pts[0],B=pts[1],C=pts[2];for(const [P,r]of [[A,p.b*sc],[B,p.c*sc]]){const a=Math.atan2(-(C[1]-P[1]),C[0]-P[0])*180/Math.PI;arc(P[0],P[1],r,a-13,a+13,'#b6c1e7')}dot(C[0],C[1]);caption('Arc intersection locates C')}
   }
   if(p.shape==='hinge'||p.shape==='angle'){
    const origin=[left+35,245],theta=p.angle,r=p.shape==='hinge'?Math.min(pw-80,160)/Math.max(...p.lengths):155;
    const lengths=p.shape==='hinge'?p.lengths.map(n=>n*r):[160,160],end=[origin[0]+lengths[1]*Math.cos(rad(theta)),origin[1]-lengths[1]*Math.sin(rad(theta))];
    line(`M${origin[0]+lengths[0]} ${origin[1]} H${origin[0]} L${end[0]} ${end[1]}`,'#a6e4f0',3);text(origin[0]-13,origin[1]+20,'O');arc(...origin,35,0,theta);if(!p.bisect)text(origin[0]+65*Math.cos(rad(theta/2)),origin[1]-65*Math.sin(rad(theta/2)),p.label||theta+'°','#ffd879',14);else text(cx,70,'Whole angle: '+p.label,'#ffd879',16);
    if(p.shape==='hinge'){text(origin[0]+lengths[0]/2,origin[1]+22,p.lengths[0]+' cm','#ffd879',14);text((origin[0]+end[0])/2-15,(origin[1]+end[1])/2-10,p.lengths[1]+' cm','#ffd879',14)}
    if(p.bisect){const half=p.unequal?theta/2-5:theta/2;line(`M${origin[0]} ${origin[1]} L${origin[0]+145*Math.cos(rad(half))} ${origin[1]-145*Math.sin(rad(half))}`,'#ffd879',2);if(p.quarter)line(`M${origin[0]} ${origin[1]} L${origin[0]+145*Math.cos(rad(theta/4))} ${origin[1]-145*Math.sin(rad(theta/4))}`,'#b6c1e7');caption(p.unequal?'Compare the two parts: they are unequal':'Check for two equal angle parts');if(p.halfLabels){p.halfLabels.forEach((label,j)=>text(origin[0]+100*Math.cos(rad(theta*(j?.75:.25))),origin[1]-100*Math.sin(rad(theta*(j?.75:.25))),label,'#ffd879',14))}}
    if(p.chord){const R=100,E=[origin[0]+R*Math.cos(rad(theta)),origin[1]-R*Math.sin(rad(theta))];arc(...origin,R,0,theta,'#b6c1e7');line(`M${origin[0]+R} ${origin[1]} L${E[0]} ${E[1]}`,'#ffd879');caption('Transfer this chord length')}
   }
   if(p.shape==='lines'){
    const co=p.relation==='cointerior',alt=p.relation==='alternate',y1=p.parallel?115:178,y2=235,x0=left+30,x1=left+pw-30,xm=cx,angle=co?180-(p.angle||55):(p.angle||55);
    line(`M${x0} ${y1} H${x1}`,'#a6e4f0',3);text(x1+9,y1,'l',undefined,14);
    if(p.parallel){line(`M${x0} ${y2} L${x1} ${y2+(p.nonparallel?-22:0)}`,'#a6e4f0',3);text(x1+9,y2,'m',undefined,14);if(!p.nonparallel){for(const y of [y1,y2])line(`M${x0+40} ${y-7} L${x0+49} ${y} L${x0+40} ${y+7}`,'#ffd879')}}
    if(!p.noTransversal){const dx=120/Math.tan(rad(angle)),xAt=y=>xm+(y1-y)/Math.tan(rad(angle));line(`M${xAt(60)} 60 L${xAt(285)} 285`,'#b6c1e7',3);text(xAt(62)+15,62,'t',undefined,14);arc(xm,y1,27,co?angle+180:alt?180:0,co?360:alt?angle+180:angle);if(p.known)text(xm+(co?35:alt?-35:35),y1+(co||alt?30:-20),p.known,'#ffd879',13);
     if(p.parallel){const X=xAt(y2);arc(X,y2,27,0,angle);if(p.unknown||p.secondKnown)text(X+38,y2-17,p.secondKnown||'?','#ffd879');if(p.point){dot(X,y2);text(X-18,y2+20,'P')}}
     else if(p.unknown){text(xm+(p.relation==='vertical'?-43:-40),y1+(p.relation==='vertical'?28:-20),'?','#ffd879')}
     if(p.right)line(`M${xm+13} ${y1} V${y1-13} H${xm}`,'#ffd879');
     if(p.allAngles){for(const [j,y]of (p.parallel?[y1,y2]:[y1]).entries()){const X=xAt(y);[[25,-32],[-30,-32],[-25,40],[32,35]].forEach(([dx,dy],a)=>text(X+dx,y+dy,String(j*4+a+1),'#ffd879',13))}}
    }
   }
   if(p.shape==='segments'){const sc=(pw-75)/Math.max(...p.lengths);p.lengths.forEach((n,j)=>{const y=100+j*65;line(`M${left+35} ${y} H${left+35+n*sc}`,'#a6e4f0',4);text(cx,y-12,p.labels[j],'#ffd879')})}
   if(p.shape==='shared_triangles'){const x1=left+45,x2=left+pw-45,Y=175;line(`M${x1} ${Y} L${cx-25} 65 L${x2} ${Y} L${cx+30} 260 Z`,'#a6e4f0',3);line(`M${x1} ${Y} H${x2}`,'#ffd879',4);text(x1-12,Y,p.baseLabel[0]);text(x2+12,Y,p.baseLabel[1]);text(cx-25,52,p.apices[0]);text(cx+30,280,p.apices[1]);if(p.sideLabels){text(left+55,110,p.sideLabels[0],'#ffd879',14);text(left+pw-55,110,p.sideLabels[1],'#ffd879',14)}p.showLength!==false&&text(cx,Y+20,p.base+' cm','#ffd879',14)}
   if(p.shape==='bisector'){
    const x1=left+pw*.25,x2=left+pw*.75,Y=175;line(`M${x1} ${Y} H${x2}`,'#a6e4f0',3);line(`M${cx} 65 V270`,'#ffd879');text(x1,Y+23,'A');text(x2,Y+23,'B');text(cx+14,Y+23,'M');text(cx,53,'P');line(`M${cx} ${Y-13} H${cx+13} V${Y}`,'#ffd879');text(cx,290,'AB = '+p.length+' cm','#ffd879');
    if(p.locus){line(`M${x1} ${Y} L${cx} 90 L${x2} ${Y}`,'#b6c1e7');text(cx-45,150,'PA = PB','#ffd879',13)}else{const r=(x2-x1)*.62,d=(x2-x1)/2,hh=Math.sqrt(r*r-d*d);arc(x1,Y,r,-55,55,'#b6c1e7');arc(x2,Y,r,125,235,'#b6c1e7');dot(cx,Y-hh);dot(cx,Y+hh)}
    if(p.splitAngle){const a=p.splitAngle;line(`M${cx} ${Y} L${cx+100*Math.cos(rad(a))} ${Y-100*Math.sin(rad(a))}`,'#b6c1e7');arc(cx,Y,38,0,a);text(cx+60,Y-18,a+'°','#ffd879',13);text(cx+18,Y-66,'?','#ffd879')}
   }
   if(p.shape==='sectors'||p.shape==='polygon'){
    const count=p.shape==='polygon'?p.sides:p.angles.length,r=96,angles=p.angles||Array(count).fill(360/count);let start=0;const pts=[];
    angles.forEach((a,j)=>{const P=[cx+r*Math.cos(rad(start)),cy-r*Math.sin(rad(start))];pts.push(P);line(`M${cx} ${cy} L${P[0]} ${P[1]}`,j>=(p.sectors||count)?'#5e7070':'#a6e4f0',2);if(p.labels&&count<=8)text(cx+65*Math.cos(rad(start+a/2)),cy-65*Math.sin(rad(start+a/2)),p.labels[j],'#ffd879',12);start+=a});
    if(p.shape==='polygon'){line('M'+pts.map(t=>t.join(' ')).join(' L')+' Z','#a6e4f0',3);caption('Each side = '+p.sideLabel);text(cx+42,cy-20,p.centralLabel,'#ffd879');dot(cx,cy);if(p.interior)text(pts[0][0]-28,pts[0][1]-8,'60° + 60°','#ffd879',12)}
    else dot(cx,cy);
   }
   if(p.shape==='grid'){
    const rows=p.rows,cols=p.cols,size=Math.min((pw-80)/cols,175/rows),x=cx-cols*size/2,y=70;
    for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){if(p.removed&&((r===0&&c===0)||(r===rows-1&&c===cols-1)))continue;rect(x+c*size,y+r*size,size,size,p.checker?((r+c)%2?'#534974':'#286977'):p.regionWidth?(Math.floor(c/p.regionWidth)%2?'#534974':'#286977'):'none')}
    caption(rows+' rows × '+cols+' columns');if(p.domino){rect(left+20,260,32,16,'#d3a95f');text(left+95,273,'one domino = 2 cells','currentColor',12)}
   }
   if(p.shape==='cell_counts'){const size=Math.min(26,(pw-90)/Math.max(p.black,p.white));for(const [j,count]of [p.black,p.white].entries()){const y=110+j*85;for(let k=0;k<count;k++){rect(left+40+k*size,y,size,size,j?'#d6dee9':'#334455');if(!j&&k<p.removeBlack)line(`M${left+40+k*size} ${y} l${size} ${size} M${left+40+(k+1)*size} ${y} l-${size} ${size}`,'#ffd879')}text(cx,y+size+25,(j?'White':'Black')+': '+count+(j||!p.removeBlack?'':'; remove '+p.removeBlack),'#ffd879',14)}}
   if(p.shape==='cell_region'){const n=p.count,size=Math.min(35,(pw-70)/n),x=left+35;for(let j=0;j<n;j++)rect(x+(p.bent&&j===n-1?0:j)*size,p.bent&&j===n-1?155+size:155,size,size,'#286977');caption(n+' equal-sized cells')}
   if(p.shape==='arch'){const r=85;arc(cx,220,r,0,180,'#a6e4f0');line(`M${cx-r} 220 H${cx+r}`);line(`M${cx} 100 V240`,'#ffd879');text(cx,264,'M');text(cx-r/2,200,'r = '+p.radius,'#ffd879',14);text(cx+r/2,200,p.unknownArm?'r = ?':'r = '+p.secondRadius,'#ffd879',14);if(p.secondRadius!==p.radius){arc(cx+20,220,r+18,0,90,'#b6c1e7');caption('Compare the specified radii')};text(cx-r,244,'A');text(cx+r,244,'B')}
   if(p.shape==='tangram'){const shapes=[[[0,0],[2,0],[0,2]],[[2,0],[2,2],[0,2]],[[0,0],[1,0],[.5,.5]],[[1,1],[2,1],[1.5,1.5]],[[0,1],[.5,1],[0,1.5]],[[1.5,0],[2,0],[2,.5]],[[.5,.5],[1,.5],[1,1],[.5,1]]];shapes.forEach((ps,j)=>{const ox=left+30+(j%4)*((pw-60)/4),oy=95+Math.floor(j/4)*100,sc=28;line('M'+ps.map(([x,y])=>[ox+x*sc,oy+y*sc].join(' ')).join(' L')+' Z',j%2?'#ffd879':'#a6e4f0',2);text(ox+20,oy+75,'area '+p.areas[j],'#ffd879',12)});caption('Compare the pieces and the uncovered region')}
  });
  if(v.note){const words=v.note.split(' ');let rows=[''];for(const word of words){if((rows.at(-1)+' '+word).length>76)rows.push(word);else rows[rows.length-1]+=(rows.at(-1)?' ':'')+word;}rows.slice(0,2).forEach((t,i)=>text(280,312+i*18,t,'currentColor',13))}
  return svg;
 }

 if(v.kind==='triangle_model'||v.kind==='congruence_pair'){
  let a=Number(v.a||5),b=Number(v.b||4),c=Number(v.c||3),x,h;
  if(v.angles){const [A,B,C]=v.angles.map(n=>Number(n)*Math.PI/180);a=5;b=a*Math.sin(B)/Math.sin(C);c=a*Math.sin(A)/Math.sin(C);}
  x=(a*a+b*b-c*c)/(2*a);h=Math.sqrt(Math.max(0,b*b-x*x));
  if(!(a+b>c&&a+c>b&&b+c>a)){text(280,170,'The three lengths do not form a triangle');return svg}
  const pair=v.kind==='congruence_pair',width=pair?205:420,lo=Math.min(0,x),hi=Math.max(a,x),factor=Math.max(1,Number(v.scale||1)),scale=Math.min(width/((hi-lo)*factor),175/((h||1)*factor)),left=pair?30:70,baseY=255;
  const paint=(offset,factor=1)=>{const pts=[[left+offset+(0-lo)*scale,baseY],[left+offset+(a-lo)*scale,baseY],[left+offset+(x-lo)*scale,baseY-h*scale]].map(([X,Y])=>[left+offset+(X-left-offset)*factor,baseY+(Y-baseY)*factor]);const [A,B,C]=pts;line('M'+pts.map(p=>p.join(' ')).join(' L')+' Z','#a6e4f0',3);text(A[0]-10,A[1]+23,offset?'D':'A');text(B[0]+12,B[1]+23,offset?'E':'B');text(C[0],C[1]-12,offset?'F':'C');if(!v.angles){text((A[0]+B[0])/2,baseY+23,(v.unknownSide==='a'||v.knownSides&&!v.knownSides.includes('a'))?'?':(a*factor)+' cm','#ffd879',15);text((A[0]+C[0])/2-20,(A[1]+C[1])/2,(v.unknownSide==='b'||v.knownSides&&!v.knownSides.includes('b'))?'?':(b*factor)+' cm','#ffd879',15);text((B[0]+C[0])/2+20,(B[1]+C[1])/2,(v.unknownSide==='c'||v.knownSides&&!v.knownSides.includes('c'))?'?':(c*factor)+' cm','#ffd879',15)}else pts.forEach((p,i)=>text(p[0]+(i===0?32:i===1?-32:0),p[1]+(i<2?-15:35),(v.unknownAngle===i||v.hideAngles?.includes(i))?'?':v.angles[i]+'°','#ffd879',15));if(v.knownAngle){const r=Number(v.knownAngle)*Math.PI/180,R=36;line(`M${A[0]+R} ${A[1]} A${R} ${R} 0 0 0 ${A[0]+R*Math.cos(r)} ${A[1]-R*Math.sin(r)}`,'#ffd879');text(A[0]+60*Math.cos(r/2),A[1]-60*Math.sin(r/2),v.knownAngle+'°','#ffd879',14)}if(v.equalSides){const edges={a:[A,B],b:[A,C],c:[B,C]};for(const key of v.equalSides){const [p,q]=edges[key],mx=(p[0]+q[0])/2,my=(p[1]+q[1])/2,L=Math.hypot(q[0]-p[0],q[1]-p[1]),dx=5*(q[1]-p[1])/L,dy=5*(q[0]-p[0])/L;line(`M${mx-dx} ${my+dy} L${mx+dx} ${my-dy}`,'#ffd879',3)}}if(v.altitude){const footX=C[0];line(`M${footX} ${C[1]} V${baseY}`,'#ffd879');line(`M${footX} ${baseY-13} H${footX+13} V${baseY}`,'#ffd879');text(footX-14,baseY+23,'H');if(footX<A[0])line(`M${footX-15} ${baseY} H${A[0]}`);if(footX>B[0])line(`M${B[0]} ${baseY} H${footX+15}`);}};
  paint(0);if(pair)paint(270,Number(v.scale||1));text(280,325,v.note||'Measurements and vertex labels identify the figure', 'currentColor',14);
 }
 if(v.kind==='circle_intersection'&&v.requireRay){const d=Number(v.distance),r=Number(v.r1),ang=Number(v.rayAngle||30)*Math.PI/180,scale=450/(d+r),ax=45,by=270,bx=ax+d*scale;line(`M${ax} ${by} H${bx}`);line(`M${bx-r*scale} ${by} A${r*scale} ${r*scale} 0 0 1 ${bx+r*scale} ${by}`,'#a6e4f0');const ray=1.05*(d+r);line(`M${ax} ${by} L${ax+ray*Math.cos(ang)*scale} ${by-ray*Math.sin(ang)*scale}`,'#ffd879');dot(ax,by);dot(bx,by);text(ax,by+24,'A');text(bx,by+24,'B');text((ax+bx)/2,by+24,d+' cm');const disc=r*r-d*d*Math.sin(ang)**2;if(disc>=0){for(const [j,t]of [d*Math.cos(ang)-Math.sqrt(disc),d*Math.cos(ang)+Math.sqrt(disc)].entries()){if(t<=0)continue;const cx=ax+t*Math.cos(ang)*scale,cy=by-t*Math.sin(ang)*scale;dot(cx,cy);line(`M${bx} ${by} L${cx} ${cy}`,'#a6e4f0');text(cx+15,cy-10,'C'+(j+1));}}line(`M${ax+40} ${by} A40 40 0 0 0 ${ax+40*Math.cos(ang)} ${by-40*Math.sin(ang)}`,'#ffd879');text(ax+70*Math.cos(ang/2),by-70*Math.sin(ang/2),v.rayAngle+'°','#ffd879');text(280,55,'Circle centre B, radius '+r+' cm');text(280,325,'Same given sides and angle; two possible third vertices','currentColor',14);}
 if(v.kind==='circle_intersection'&&!v.requireRay){
  const d=Number(v.distance||5),r1=Number(v.r1||4),r2=Number(v.r2||3),s=Math.min(380/(d+r1+r2),95/Math.max(r1,r2)),ax=90+r1*s,bx=ax+d*s,cy=177;
  for(const [cx,r,color]of [[ax,r1,'#a6e4f0'],[bx,r2,'#ffd879']])node('circle',{cx,cy,r:r*s,fill:'none',stroke:color,'stroke-width':2});line(`M${ax} ${cy} H${bx}`);dot(ax,cy);dot(bx,cy);text(ax,cy+23,'A');text(bx,cy+23,'B');text((ax+bx)/2,cy+45,'AB = '+d+' cm');text(280,55,'Radii: '+r1+' cm and '+r2+' cm');text(280,315,'A shared point must be the right distance from both centres', 'currentColor',14);
 }
 if(v.kind==='place_table'){
  const digits=String(v.number||'472631').padStart(6,'0').split(''),places=v.places||['Lakh','Ten-thousand','Thousand','Hundred','Ten','One'];
  digits.slice(-6).forEach((d,i)=>{rect(16+i*88,78,88,138,i===v.highlight?'#24566b':'none');text(60+i*88,109,places[i],'#a6e4f0',12);text(60+i*88,155,d,'#ffd879',32);text(60+i*88,192,'× '+10**(5-i),'currentColor',12)});text(280,275,v.note||'Moving left multiplies place value by ten');
 }
 if(v.kind==='fraction_product'){
  const cols=v.d||4,rows=v.b||3,a=v.a||2,c=v.c||3,w=320/cols,h=180/rows;
  for(let y=0;y<rows;y++)for(let x=0;x<cols;x++)rect(120+x*w,72+y*h,w,h,y<a&&x<c?'#8296c8':y<a?'#256a79':x<c?'#5c4673':'none');
  text(280,282,v.hideResult?`${a}/${rows} of ${c}/${cols}: count the overlap`:`${a}/${rows} of ${c}/${cols}: ${a*c} overlapping parts out of ${rows*cols}`,'#ffd879');text(280,311,'Equal parts matter: the whole rectangle is one unit', 'currentColor',15);
 }
 if(v.kind==='ribbon_pieces'){
  const lengths=v.lengths,unit=420/Math.max(...lengths),piece=Number(v.piece);
  lengths.forEach((length,i)=>{const y=98+i*108;for(let k=0;k<length/piece;k++){rect(70+k*piece*unit,y,piece*unit,44,k%2?'#534974':'#286977');text(70+(k+.5)*piece*unit,y+28,piece+' cm','#ffd879',15)}text(280,y-13,length+' cm ribbon → '+length/piece+' equal pieces');});
  text(280,312,'Same piece length; no ribbon left over','currentColor',16);
 }
 if(v.kind==='fraction_groups'){
  const total=v.total||3,group=v.group||.5,unit=360/total;for(let k=0;k<Math.ceil(total/group);k++)rect(95+k*group*unit,130,group*unit,75,k%2?'#534974':'#286977');text(280,102,`Total length ${total}; each group ${group}`);text(280,247,v.hideResult?'How many equal groups fit?':`${total/group} equal groups fit`,'#ffd879');text(280,290,'Division asks: how many groups of this size?');
 }
 if(v.kind==='triangle_area'){
  rect(135,75,270,160);line('M135 235 L405 75','#ffd879',3);text(260,62,'A');text(115,251,'B');text(425,91,'C');text(270,267,'base = '+(v.base||3)+' cm','#ffd879');text(467,159,'height = '+(v.height||5)+' cm','#a6e4f0',15);line('M405 217 H387 V235','#a6e4f0');text(280,309,'Two matching triangles fill one rectangle');
 }
 if(v.kind==='balance'){
  line('M80 90 H480');line('M280 90 V250 M240 285 L280 250 L320 285 Z');line('M120 90 V140 M65 140 Q120 210 175 140 Z M440 90 V140 M385 140 Q440 210 495 140 Z');text(120,126,v.left||'x + 3','#ffd879');text(440,126,v.right||'11','#ffd879');text(280,320,v.note||'The same operation on both sides keeps equality true', 'currentColor',15);
 }
 if(v.kind==='distribute'){
  rect(90,80,380,150);const x=90+380*(v.a||3)/((v.a||3)+(v.b||2));line(`M${x} 80 V230`,'#ffd879');text(90+(x-90)/2,151,`${v.m||4} × ${v.a||3}`);text(x+(470-x)/2,151,`${v.m||4} × ${v.b||2}`);text(280,267,`${v.m||4} × (${v.a||3} + ${v.b||2})`,'#ffd879');text(280,304,'One rectangle, split into two smaller rectangles');
 }
 if(v.kind==='number_operation'){
  const a=v.a||0,b=v.b||0,lo=Math.min(-5,a,a+b)-2,hi=Math.max(5,a,a+b)+2,px=n=>45+(n-lo)/(hi-lo)*470;line('M35 215 H535');const gap=Math.max(1,Math.ceil((hi-lo)/12));for(let n=Math.ceil(lo/gap)*gap;n<=hi;n+=gap){line(`M${px(n)} 209 V221`);text(px(n),245,n,'currentColor',13)}dot(px(a),215);dot(px(a+b),215,'#a6e4f0');line(`M${px(a)} 204 Q${(px(a)+px(a+b))/2} 62 ${px(a+b)} 204`,'#ffd879',3);text(280,88,`Start ${a}; change ${b>0?'+':''}${b}`,'#ffd879');text(280,300,`End at ${a+b}`);
 }
 if(v.kind==='dot_plot'){
  const vals=v.values||[2,3,3,4,5,5,5],counts={};for(const x of vals)counts[x]=(counts[x]||0)+1;const min=Math.min(...vals),max=Math.max(...vals),px=n=>60+(n-min)/(max-min||1)*440;line('M40 240 H520');for(const [x,c]of Object.entries(counts)){for(let j=0;j<c;j++)dot(px(+x),215-j*25);text(px(+x),268,x)}text(280,310,'Each dot represents one observation');
 }
 if(v.kind==='grouped_bars'){
  const values=v.values||[[3,5],[6,4],[4,7]],max=Math.max(...values.flat()),colors=['#8dd9da','#ffcb78'];values.forEach((pair,i)=>pair.forEach((n,j)=>{rect(75+i*150+j*44,255-n/max*155,35,n/max*155,colors[j]);text(92+i*150+j*44,245-n/max*155,n)}));line('M45 255 H525');(v.labels||['Mon','Tue','Wed']).forEach((l,i)=>text(115+i*150,283,l));text(280,315,'Blue: '+(v.series?.[0]||'Group A')+' · Yellow: '+(v.series?.[1]||'Group B'));
 }
 if(v.kind==='matchsticks'){
  const n=v.n||3;for(let i=0;i<n;i++){line(`M${90+i*70} 100 H${160+i*70} V170 H${90+i*70} Z`,'#ffd879',4)}text(280,230,'First square: 4 sticks. Each new square shares one side.');text(280,275,v.hideResult?`How many sticks for ${n} connected squares?`:`For ${n} squares: 4 + 3 × (${n} − 1) = ${3*n+1}`,'#a6e4f0');
 }
 if(v.kind==='magic_square'){
  const vals=v.values||[8,1,6,3,5,7,4,9,2];vals.forEach((n,i)=>{rect(170+(i%3)*75,60+Math.floor(i/3)*75,75,75);text(207+(i%3)*75,107+Math.floor(i/3)*75,n,'#ffd879',25)});text(280,318,'Every row, column and both diagonals have the same total');
 }
 if(v.kind==='construction'){
  const stage=v.stage||'bisector';if(stage==='bisector'){line('M100 180 H460');text(100,210,'A');text(460,210,'B');line('M253.209 51.442 A200 200 0 0 1 253.209 308.558','#a6e4f0');line('M306.791 51.442 A200 200 0 0 0 306.791 308.558','#a6e4f0');line('M280 60 V305','#ffd879');dot(280,92.822);dot(280,267.178);text(420,75,'Same radius', 'currentColor',14);line('M280 162 H298 V180','#ffd879');text(280,330,'Join the two arc intersections', 'currentColor',15);}
  else {line('M90 235 H470');text(90,267,'A');text(470,267,'B');}
  if(stage!=='bisector') {const r=(parseFloat(v.angle)||60)*Math.PI/180;line(`M90 235 L${90+220*Math.cos(r)} ${235-220*Math.sin(r)}`,'#ffd879');line(`M165 235 A75 75 0 0 0 ${90+75*Math.cos(r)} ${235-75*Math.sin(r)}`,'#a6e4f0');text(198,208,v.angle||'60°','#a6e4f0');text(320,115,'Copy the arc, then copy its chord', 'currentColor',14);}

 }
 if(v.kind==='tiles'){
  const k=v.sides||6;if(k===4){for(let y=0;y<3;y++)for(let x=0;x<5;x++)rect(105+x*60,60+y*60,60,60,(x+y)%2?'#286977':'#574977')}
  else if(k===3){for(let y=0;y<3;y++)for(let x=0;x<5;x++){const h=70*Math.sqrt(3)/2,X=45+x*70+y*35,Y=55+y*h;line(`M${X} ${Y} L${X+70} ${Y} L${X+35} ${Y+h} Z`,'#a6e4f0');line(`M${X+70} ${Y} L${X+105} ${Y+h} L${X+35} ${Y+h} Z`,'#a6e4f0');}}
  else for(let y=0;y<3;y++)for(let x=0;x<4;x++){const cx=135+x*80+(y%2)*40,cy=85+y*69,r=46;const p=Array.from({length:6},(_,j)=>[cx+r*Math.cos((30+j*60)*Math.PI/180),cy+r*Math.sin((30+j*60)*Math.PI/180)]);line('M'+p.map(t=>t.join(' ')).join(' L')+' Z','#a6e4f0')}
  text(280,318,'No gaps, no overlaps: angles around each vertex total 360°');
 }
 if(v.kind==='decimal_grid'){
  const num=v.hundredths||35;for(let y=0;y<10;y++)for(let x=0;x<10;x++)rect(180+x*19,52+y*19,19,19,y*10+x<num?'#477f98':'none');text(280,278,`${num} shaded hundredths = ${num}/100 = ${(num/100).toFixed(2)}`,'#ffd879');text(280,314,'The entire hundred-square is one whole');
 }
 if(v.kind==='triangle_conditions'){
  for(const dx of [0,255]){line(`M${40+dx} 220 L${110+dx} 70 L${220+dx} 220 Z`);text(110+dx,57,dx?'D':'A');text(35+dx,245,dx?'E':'B');text(225+dx,245,dx?'F':'C');text(72+dx,145,'3 cm','#ffd879',14);text(150+dx,240,'4 cm','#ffd879',14);text(177+dx,145,'5 cm','#ffd879',14)}text(280,304,v.note||'Compare corresponding information, not how the picture is turned');
 }
 if(v.kind==='table'){
  const rows=v.rows||[['Input','Output'],[1,3],[2,5],[3,7]],cols=rows[0].length,w=480/cols,h=Math.min(45,(v.note?245:270)/rows.length);rows.forEach((row,i)=>row.forEach((t,j)=>{rect(40+j*w,55+i*h,w,h,i===0?'#24566b':'none');text(40+(j+.5)*w,55+(i+.65)*h,t,'currentColor',Math.min(16,Math.max(10,(w-12)/(String(t).length*.6))))}));if(v.note)text(280,318,v.note,'#ffd879',15);
 }
 return svg;
}
