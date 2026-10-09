const TEACHING=[
['Counting helps you share snacks and check how many toys you have.','You have 3 apples and get 4 more. How many apples?',7,'Count on four from 3.','3 + 4 = 7.','counting on'],
['Place value helps you read prices and count larger amounts.','There are 7 packs of ten pencils and 2 single pencils. How many pencils?',72,'Seven tens are seventy.','70 + 2 = 72.','groups of ten'],
['Equal groups help you count seats, packs, and teams.','Four tables seat 5 children each. How many children can sit?',20,'Four equal groups of five.','4 × 5 = 20.','repeated addition'],
['Area helps you plan a garden or work out how much floor to cover.','A rug is 3 metres by 4 metres. What is its area in square metres?',12,'Multiply length by width.','3 × 4 = 12 square metres.','multiplication'],
['Decimals help you add prices and measure accurately.','A notebook costs $2.40 and a pencil costs $0.85. What is the total?',3.25,'Line up the decimal points.','2.40 + 0.85 = 3.25.','decimal place value'],
['Fractions help you share food and measure recipe ingredients.','A recipe uses 3/4 of 16 cups of flour. How many cups?',12,'Find one quarter, then take three.','16 ÷ 4 × 3 = 12.','equal sharing'],
['Percentages help you understand discounts and compare amounts.','A game costs $40 and is 25% off. How many dollars is the discount?',10,'25% is one quarter.','40 ÷ 4 = 10 dollars.','division by 10'],
['Equations help you find unknown prices or amounts.','Three tickets plus a $5 fee cost $20. What is the price of one ticket?',5,'Remove the fee, then share between three tickets.','(20 − 5) ÷ 3 = 5 dollars.','inverse operations'],
['Linear rules help you predict costs that grow at a steady rate.','A ride costs $3 plus $2 per kilometre. How much for 6 kilometres?',15,'Multiply six by two, then add three.','2 × 6 + 3 = 15 dollars.','substitution'],
['Factoring helps you solve equations and work with area models.','A rectangle has area x² + 5x + 6 and one side x + 2. The other side is x plus what number?',3,'The pair must add to 5 and multiply to 6.','(x + 2)(x + 3), so the number is 3.','integer factors'],
['Functions help you calculate outcomes from changing inputs.','A square garden has side x metres. If x = 5, what is its area in square metres?',25,'Area is x².','5² = 25 square metres.','order of operations'],
['Probability helps you compare chances in games and decisions.','Two independent checks each have a 0.8 chance of success. What is the chance both succeed?',.64,'Multiply the two probabilities.','0.8 × 0.8 = 0.64.','multiplying decimals']
];
LESSONS.forEach(l=>{const t=TEACHING[l.grade-1];l.hook=t[0];l.application={q:t[1],a:t[2],h:t[3],why:t[4]};l.prerequisite=t[5];l.mastery=[...l.practice.map(q=>({...q})),{...l.application}];l.challenge={...l.application};});
const CHALLENGES=[
['You start with 2 marbles, get 3 more, then get 4 more. How many?',9,'Add all three groups.','2 + 3 + 4 = 9.'],
['Eight tens and four ones are split into two equal groups. How many in each group?',42,'Make 84, then divide by 2.','84 ÷ 2 = 42.'],
['Seven bags contain 6 counters each. How many counters?',42,'Add six seven times, or multiply.','7 × 6 = 42.'],
['A rectangle has area 56 cm² and width 7 cm. What is its length in cm?',8,'Use the inverse of multiplication.','56 ÷ 7 = 8 cm.'],
['You spend $3.75 and $2.40 from $10. How much is left?',3.85,'Add the prices, then subtract from ten.','10 − 6.15 = 3.85.'],
['What is 5/6 of 24?',20,'Find one sixth, then take five.','24 ÷ 6 × 5 = 20.'],
['A $60 game is 25% off. What is the final price?',45,'Find the discount, then subtract it.','60 − 15 = 45 dollars.'],
['Solve 3x − 4 = 14. What is x?',6,'Add four to both sides, then divide by three.','3x = 18, so x = 6.'],
['A trip costs $5 plus $3 per kilometre. It costs $26. How many kilometres?',7,'Subtract the fixed cost, then divide.','(26 − 5) ÷ 3 = 7.'],
['Factor x² + 8x + 12. One factor is x + 2. What number goes in the other factor?',6,'Find a number that adds to eight with two and multiplies to twelve.','(x + 2)(x + 6).'],
['For f(x) = x² + 2x, calculate f(6).',48,'Square six, then add twice six.','36 + 12 = 48.'],
['Independent events have probabilities 0.4 and 0.4. What is the probability both happen?',.16,'Multiply the probabilities.','0.4 × 0.4 = 0.16.']
];LESSONS.forEach(l=>{const [q,a,h,why]=CHALLENGES[l.grade-1];l.challenge={q,a,h,why};});
const NATURAL_TURNS={
count:['We have three to start with.','Two more means we count four, then five.','So three plus two makes five.'],
place:['The three is in the tens place, so it means thirty.','Add the four ones. That gives us thirty-four.'],
multiply:['Each group has four. We’re counting four three times.','Four, eight, twelve. Three groups of four make twelve.'],
area:['There are four rows, with three squares in each row.','Four times three is twelve. The area is twelve square units.'],
decimal:['First, add the decimal parts: thirty-five hundredths and forty hundredths.','That makes seventy-five hundredths. Add the three wholes and we get three point seven five.'],
fraction:['Let’s find one quarter first. Twenty shared into four equal groups gives five in each.','We need three of those groups. Three times five is fifteen.'],
percent:['Ten percent means one tenth. Eighty divided by ten gives eight.','Twenty percent is twice that amount. Eight plus eight is sixteen.'],
equation:['We want to get x on its own. First, subtract five from both sides to keep them balanced.','That leaves three x equals fifteen.','Divide both sides by three. x is five. Check it: three times five, plus five, is twenty.'],
linear:['Let’s put four in place of x. Now we have two times four, plus three.','Multiply first: two times four is eight. Add three and y is eleven.'],
quadratic:['We need two numbers that add to five and multiply to six. Two and three fit both conditions.','Put those numbers into the brackets: x plus two, times x plus three.','Let’s check by expanding. Three x and two x combine to make five x, and two times three gives six.'],
function:['Put three in both places where you see x.','Three squared is nine. Twice three is six. Add them and the output is fifteen.'],
probability:['Each toss has a one-half chance of heads. The first toss does not change the second.','Multiply one half by one half. We get one quarter, or twenty-five percent.']};
LESSONS.forEach(l=>l.narration=NATURAL_TURNS[l.id]);
