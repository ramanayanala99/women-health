// App-authored circle introductions: board examples, short narration and numeric practice.
(()=>{
 const V=(mode,labels={})=>({type:'teaching_visuals',specs:[{shape:'circle',labels:Object.fromEntries(Object.entries({mode,...labels}).map(([k,v])=>[k,String(v)]))}]}),Q=(q,a,h,why,v)=>({q,a,h,why,visual:v});
 function add(key,title,idea,hook,steps,qs,mode){const id='circles_'+key,visual=steps[0][2]||V(mode);CENTRAL_EXTRA_LESSONS[id]={name:title,goal:idea,idea,hook,simple:idea,prerequisite:'recognising a circle and its centre',visual,steps:steps.map(s=>s.slice(0,2)),narration:steps.map(s=>s[1]),exampleVisuals:steps.map(s=>s[2]||visual),guided:qs.slice(0,1),practice:qs.slice(1,3),application:qs[3],mastery:qs.slice(4,7),challenge:qs[7]};UNIVERSAL_MATHS.topics.push({id,title,grade:9,chapterId:'geometry',chapterTitle:'Geometry and measurement',source:null});const group=UNIVERSAL_MATHS.groups.find(g=>g[0]==='geometry');group[2].push([id,title,null,9]);const t=INDIA_CATALOG.courses[0].chapters.find(ch=>ch.id.endsWith('-circles')).topics.find(t=>t.id.endsWith('-'+key));if(t)t.concepts=[id];}
 const radiusQs=[3,7,9,35,6,11,14,22].map((r,i)=>i%2?Q(`A circle has diameter ${r*2} cm. What is its radius in cm?`,r,'The diameter contains two radii.',`${r*2} ÷ 2 = ${r} cm.`,V('diameter',{diameter:r*2})):Q(`A circle has radius ${r} cm. What is its diameter in cm?`,r*2,'Double the radius.',`2 × ${r} = ${r*2} cm.`,V('radius',{radius:r})));
 add('parts','Parts of a circle','Recognise the centre, radius, diameter, chord, arc, sector and segment. Use diameter = twice the radius.','A clock face, a bangle and a wheel all have a centre and a circular boundary.',[
 ['O is the centre; OA is a radius','Watch me draw the circle and mark its centre O. The line from O to A on the circle is a radius.',V('radius',{radius:5})],
 ['AB is a diameter; d = 2r = 10 cm','Now draw AB right through O. It contains two radii. With radius five centimetres, the diameter is ten.',V('diameter',{diameter:10})],
 ['A chord joins two points on the circle','Here is a new AB that does not go through O. It is a chord. Every diameter is a chord, but not every chord is a diameter.',V('chord')],
 ['An arc is part of the circular boundary','Trace just the pink part of the boundary. That part is called an arc.',V('arc')],
 ['A sector lies between two radii and an arc','Draw two radii. The region between them and the arc is a sector, like a slice of pizza.',V('sector')],
 ['A segment lies between a chord and its arc','This time use a chord instead of two radii. The shaded region between the chord and its arc is a segment. Now you try a radius question.',V('segment')]
 ],radiusQs,'radius');
 const sameRadius=(kind)=>[4,6,8,15,7,10,13,21].map(r=>Q(`O is the circumcentre of triangle ABC. OA = ${r} cm. What is OB in cm?`,r,'A, B and C lie on the same circle, so OA, OB and OC are radii.',`OB = OA = ${r} cm.`,V('circumcircle',{kind})));
 add('circumcircle','Construct a circumcircle','Use two perpendicular bisectors to locate a circumcentre, then draw a circle through the three vertices.','A circular frame can be fitted through three non-collinear corner points.',[
 ['Start with three non-collinear points A, B and C','Draw triangle ABC. Non-collinear means the three points do not lie on one straight line.',V('circumcircle',{kind:'acute'})],
 ['Perpendicular bisectors meet at O','Construct a perpendicular bisector of AB, then one of BC. Their intersection is O. Each bisector contains points equally far from its two endpoints.',V('circumcircle',{kind:'acute',construction:'yes'})],
 ['OA = OB = OC; draw with centre O and radius OA','Set the compass to OA. The same circle passes through A, B and C. If OA is six centimetres, OB and OC are also six.',V('circumcircle',{kind:'acute'})]
 ],sameRadius('acute'),'circumcircle');
 add('centre','Where is the circumcentre?','The circumcentre is inside an acute triangle, on a right triangle’s hypotenuse, and outside an obtuse triangle.','The centre of a circle fitted through three corners is not always inside the shape.',[
 ['Acute triangle: O is inside','All three angles are acute. The perpendicular bisectors meet inside the triangle.',V('circumcircle',{kind:'acute',construction:'yes'})],
 ['Right triangle: O is the hypotenuse midpoint','Here AB is the hypotenuse and also a diameter of the circumcircle. Its midpoint O is equally far from all three vertices.',V('circumcircle',{kind:'right'})],
 ['Obtuse triangle: O is outside','One angle is greater than ninety degrees. The circumcentre lies outside the triangle, but OA, OB and OC are still equal.',V('circumcircle',{kind:'obtuse'})]
 ],sameRadius('obtuse'),'circumcircle');
 const equalQs=[50,70,90,110,60,80,100,120].map(a=>Q(`AB and CD are equal chords in the same circle. Angle AOB is ${a}°. What is angle COD?`,a,'Equal chords subtend equal angles at the centre.',`Angle COD = angle AOB = ${a}°.`,V('equal_chords',{angle:a,practice:'yes'})));
 add('chord-angle','Equal chords and central angles','Equal chords in the same circle subtend equal central angles; the converse is also true.','Equal bridge supports placed around a circular ring make equal openings at its centre.',[
 ['OA = OB = OC = OD','Join each chord endpoint to O. These four lines are radii, so they have the same length.',V('equal_chords',{angle:60})],
 ['AB = CD ⇒ triangles OAB and OCD are congruent by SSS','The two triangles have three matching side lengths. SSS congruence tells us their central angles match.',V('equal_chords',{angle:60})],
 ['Angle AOB = 60° ⇒ angle COD = 60°','A sixty-degree opening at one equal chord means a sixty-degree opening at the other. The reverse implication follows by SAS.',V('equal_chords',{angle:60})]
 ],equalQs,'equal_chords');
 const halfQs=[10,14,18,24,12,20,30,36].map(c=>Q(`OM is perpendicular to chord AB. AB = ${c} cm. What is AM in cm?`,c/2,'A perpendicular from the centre bisects the chord.',`AM = MB = ${c} ÷ 2 = ${c/2} cm.`,V('chord_bisector',{practice:'yes'})));
 add('bisector','Bisecting a chord','A perpendicular from the centre to a chord bisects it. A line from the centre to the chord midpoint is perpendicular to the chord.','This helps you locate the centre of a circular lid using a chord and its midpoint.',[
 ['OA = OB; OM is shared','Draw chord AB and join its endpoints to O. OA and OB are equal radii.',V('chord_bisector')],
 ['OM ⟂ AB ⇒ triangles OMA and OMB are congruent by RHS','Both triangles have a right angle, equal hypotenuses and the shared side OM. RHS congruence gives equal chord halves.',V('chord_bisector')],
 ['AB = 6 cm ⇒ AM = MB = 3 cm','Divide the chord length by two. Conversely, joining O to a chord midpoint gives a perpendicular line.',V('chord_bisector',{radius:5,chord:6,distance:4})]
 ],halfQs,'chord_bisector');
 const triples=[[5,3,4],[13,5,12],[10,6,8],[17,8,15],[25,7,24],[15,9,12],[20,12,16],[26,10,24]];
 add('chord-distance','Chords and distance from the centre','In one circle, equal chords are equally far from the centre, and a longer chord lies nearer the centre.','A chord near the edge of a circular pond is shorter than one near its centre.',[
 ['Measure chord distance along a perpendicular','The pink lines show the shortest distances from O to each chord. AB lies nearer O than CD, so AB is longer.',V('chord_distance')],
 ['AM = AB ÷ 2; OA² = OM² + AM²','To calculate a distance, drop a perpendicular OM. It halves AB and creates a right triangle OMA.',V('chord_bisector',{radius:5,chord:6})],
 ['OM = √(5² − 3²) = √16 = 4 cm','With radius five and half-chord three, subtract nine from twenty-five. The perpendicular distance is four centimetres.',V('chord_bisector',{radius:5,chord:6,distance:4})]
 ],triples.map(([r,h,d])=>Q(`A circle has radius ${r} cm and chord AB of length ${2*h} cm. What is the perpendicular distance OM?`,d,'Halve AB, then use OM² = radius² − half-chord².',`AM = ${h}; OM = √(${r*r} − ${h*h}) = ${d} cm.`,V('chord_bisector',{radius:r,chord:2*h,practice:'yes'}))),'chord_distance');
 const angleQs=[80,100,120,140,60,90,110,150].map(a=>Q(`Angle AOB at the centre is ${a}°. C lies on the remaining arc. What is angle ACB?`,a/2,'The angle at the circumference is half the central angle on the same arc.',`${a} ÷ 2 = ${a/2}°.`,V('central_angle',{angle:a,practice:'yes'})));
 add('central-angle','Central and inscribed angles','An angle at the centre is twice an angle at the circumference standing on the same arc.','You can compare two viewing angles that look at the same curved opening.',[
 ['Angle AOB and angle ACB stand on arc AB','Draw arc AB, join A and B to O, then join A and B to C on the remaining arc. Both angles face the same arc.',V('central_angle',{angle:80})],
 ['Angle AOB = 2 × angle ACB','Joining C to O splits the figure into isosceles triangles. Their base angles and the triangle angle sum lead to the two-to-one rule.',V('central_angle',{angle:80})],
 ['Angle AOB = 80° ⇒ angle ACB = 40°','Divide eighty by two. The angle at C is forty degrees. Keep the arc and the position of C in mind.',V('central_angle',{angle:80})]
 ],angleQs,'central_angle');
 const segmentQs=[40,50,60,70,30,45,55,75].map(a=>Q(`C and D lie in the same segment of chord AB. Angle ACB is ${a}°. What is angle ADB?`,a,'Both angles stand on the same arc AB.',`Angle ADB = angle ACB = ${a}°.`,V('same_segment',{angle:a*2,practice:'yes'})));
 add('segment','Angles in a segment and semicircle','Angles in the same segment are equal. An angle subtended by a diameter is a right angle.','A semicircular arch gives a useful way to construct a right angle.',[
 ['Angle ACB = angle ADB','Choose C and D on the same side of chord AB. Both angles stand on the same arc, so both are half the same central angle.',V('same_segment',{angle:80})],
 ['AB is a diameter ⇒ angle ACB = 90°','A diameter subtends one hundred and eighty degrees at the centre. Half of that is ninety degrees at C.',V('semicircle')],
 ['Angle ACB = 40° ⇒ angle ADB = 40°','Return to the same-segment picture. Moving from C to D along this segment does not change the angle facing arc AB.',V('same_segment',{angle:80})]
 ],segmentQs,'same_segment');
 const cyclicQs=[70,80,100,110,60,90,120,130].map(a=>Q(`ABCD is a cyclic quadrilateral. Angle A is ${a}°. What is opposite angle C?`,180-a,'Opposite angles in a cyclic quadrilateral add to 180 degrees.',`Angle C = 180 − ${a} = ${180-a}°.`,V('cyclic',{angle:a,practice:'yes'})));
 add('cyclic','Cyclic quadrilaterals','Four concyclic points form a cyclic quadrilateral. Its opposite angles are supplementary.','A four-sided design inscribed in a circular frame has linked opposite angles.',[
 ['A, B, C and D all lie on one circle','Draw four points on the same circle and join them in order. This is a cyclic quadrilateral.',V('cyclic',{angle:70})],
 ['Angle A + angle C = 180°','The two angles face arcs that together make the full circle. Each inscribed angle is half its arc’s central angle, so their sum is one hundred and eighty degrees.',V('cyclic',{angle:70})],
 ['Angle A = 70° ⇒ angle C = 110°','Subtract seventy from one hundred and eighty. Also, angle B plus angle D equals one hundred and eighty. The converse gives a test for cyclicity.',V('cyclic',{angle:70})]
 ],cyclicQs,'cyclic');
 add('uses','Circles in everyday designs','A circle’s rim points are all equally far from its centre. Use this to recognise circular wheels and repeated radial designs.','Wheels, clocks and circular patterns all make use of a fixed centre and radius.',[
 ['Every spoke joins the centre to the rim','Draw the wheel first, then draw its spokes. Each spoke runs from O to the boundary and has the same radius length.',V('wheel')],
 ['A circular wheel has a constant radius','As a circular wheel turns, its rim stays the same distance from its axle. This is one reason circular wheels work well for rolling.',V('wheel')],
 ['Radius = 35 cm ⇒ diameter = 70 cm','Two radii placed end to end make a diameter. Double thirty-five to get seventy centimetres.',V('diameter',{diameter:70})]
 ],radiusQs,'wheel');
})();
