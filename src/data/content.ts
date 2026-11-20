// Educational content: kept separate from game mechanics and UI.
import { NEW_CATS, NEW_VR, NEW_SENT, NEW_TALK, NEW_PIC, NEW_PASS, NEW_WT, NEW_MISSIONS, NEW_NPCS, NEW_PORTRAITS } from './world2.ts';
/* ===== CONTENT (separate from mechanics) ===== */
export const CFG={
  xp:{mission:30,challenge:50,region:150,correct:2,streakEvery:5,streakBonus:5,boss:60},
  coins:{mission:20,boss:40,pickup:2,correct:0},
  intervals:[0,10*60e3,864e5,3*864e5,7*864e5,14*864e5,30*864e5],
  dailyGoalMin:18, passBoss:0.7, passMission:0.6, minLearnedForGate:12,
  readiness:{vocab:.2,grammar:.2,reading:.2,listening:.15,writing:.15,independent:.1}
};
export const CATS={animals:'חיות',colors:'צבעים',numbers:'מספרים',family:'משפחה',food:'אוכל',objects:'חפצים',verbs:'פעלים',adjectives:'תארים'};
export const VR=[
['dog','dog','כלב','🐶','animals'],['cat','cat','חתול','🐱','animals'],['sheep','sheep','כבשה','🐑','animals'],['horse','horse','סוס','🐴','animals'],
['chicken','chicken','תרנגולת','🐔','animals'],['cow','cow','פרה','🐮','animals'],['bird','bird','ציפור','🐦','animals'],['fish','fish','דג','🐟','animals'],
['duck','duck','ברווז','🦆','animals'],['rabbit','rabbit','ארנב','🐰','animals'],
['red','red','אדום','🔴','colors'],['blue','blue','כחול','🔵','colors'],['green','green','ירוק','🟢','colors'],['yellow','yellow','צהוב','🟡','colors'],
['purple','purple','סגול','🟣','colors'],['black','black','שחור','⚫','colors'],['white','white','לבן','⚪','colors'],['brown','brown','חום','🟤','colors'],
['one','one','אחד','1️⃣','numbers'],['two','two','שניים','2️⃣','numbers'],['three','three','שלוש','3️⃣','numbers'],['four','four','ארבע','4️⃣','numbers'],['five','five','חמש','5️⃣','numbers'],
['six','six','שש','6️⃣','numbers'],['seven','seven','שבע','7️⃣','numbers'],['eight','eight','שמונה','8️⃣','numbers'],['nine','nine','תשע','9️⃣','numbers'],['ten','ten','עשר','🔟','numbers'],
['mother','mother','אמא','👩','family'],['father','father','אבא','👨','family'],['sister','sister','אחות','👧','family'],['brother','brother','אח','👦','family'],
['baby','baby','תינוק','👶','family'],['grandmother','grandmother','סבתא','👵','family'],['grandfather','grandfather','סבא','👴','family'],['friend','friend','חבר','🤝','family'],
['children','children','ילדים','🧒','family'],['farmer','farmer','חקלאי','🧑‍🌾','family'],['teacher','teacher','מורה','🧑‍🏫','family'],
['apple','apple','תפוח','🍎','food'],['orange','orange','תפוז','🍊','food'],['milk','milk','חלב','🥛','food'],['bread','bread','לחם','🍞','food'],['banana','banana','בננה','🍌','food'],
['egg','egg','ביצה','🥚','food'],['water','water','מים','💧','food'],['cheese','cheese','גבינה','🧀','food'],['tomato','tomato','עגבנייה','🍅','food'],['cake','cake','עוגה','🍰','food'],
['book','book','ספר','📖','objects'],['pen','pen','עט','🖊️','objects'],['bus','bus','אוטובוס','🚌','objects'],['house','house','בית','🏠','objects'],['tree','tree','עץ','🌳','objects'],
['ball','ball','כדור','⚽','objects'],['bag','bag','תיק','🎒','objects'],['flower','flower','פרח','🌸','objects'],['sun','sun','שמש','☀️','objects'],['car','car','מכונית','🚗','objects'],['door','door','דלת','🚪','objects'],
['fly','fly','לעוף','🦅','verbs'],['run','run','לרוץ','🏃','verbs'],['talk','talk','לדבר','🗣️','verbs'],['play','play','לשחק','🎮','verbs'],['swim','swim','לשחות','🏊','verbs'],
['read','read','לקרוא','👓','verbs'],['sing','sing','לשיר','🎤','verbs'],['walk','walk','ללכת ברגל','🚶','verbs'],['hear','hear','לשמוע','👂','verbs'],['listen','listen','להקשיב','🎧','verbs'],
['go','go','ללכת / לנסוע','➡️','verbs'],['say','say','לומר','💬','verbs'],['put','put','לשים','📥','verbs'],['start','start','להתחיל','▶️','verbs'],['leave','leave','לעזוב','👋','verbs'],
['getout','get out','לצאת','↗️','verbs'],['feed','feed','להאכיל','🥣','verbs'],['eat','eat','לאכול','🍽️','verbs'],['sit','sit','לשבת','🪑','verbs'],['pick','pick','לקטוף','🧺','verbs'],['takecare','take care of','לטפל ב...','🤲','verbs'],
['beautiful','beautiful','יפה','🌺','adjectives'],['big','big','גדול','🐘','adjectives'],['small','small','קטן','🐜','adjectives'],['nice','nice','נחמד','😊','adjectives'],
['sweet','sweet','מתוק','🍬','adjectives'],['happy','happy','שמח','😀','adjectives'],['sad','sad','עצוב','😢','adjectives']
];
export const VOC=VR.map(([id,en,he,e,cat])=>({id,en,he,e,cat}));
export const VM={};VOC.forEach(v=>VM[v.id]=v);

/* sentences: r=region */
export const SENT=[
{id:'s1',en:'A bird can fly.',he:'ציפור יכולה לעוף.',tag:'can',r:2},
{id:'s2',en:'A fish can swim.',he:'דג יכול לשחות.',tag:'can',r:2},
{id:'s3',en:"A baby can't talk.",he:'תינוק לא יכול לדבר.',tag:'can',r:2},
{id:'s4',en:'I can read a book.',he:'אני יכול לקרוא ספר.',tag:'can',r:2},
{id:'s5',en:'The horse can run fast.',he:'הסוס יכול לרוץ מהר.',tag:'can',r:2},
{id:'s6',en:'The farmer works on the farm.',he:'החקלאי עובד בחווה.',tag:'ps',r:2},
{id:'s7',en:'The children play together.',he:'הילדים משחקים יחד.',tag:'ps',r:2},
{id:'s8',en:'My mother takes care of her baby.',he:'אמא שלי מטפלת בתינוק שלה.',tag:'ps',r:2},
{id:'s9',en:'The farmer is feeding the sheep.',he:'החקלאי מאכיל את הכבשים.',tag:'pc',r:2},
{id:'s10',en:'The men are picking oranges.',he:'הגברים קוטפים תפוזים.',tag:'pc',r:2},
{id:'s11',en:'The children are playing.',he:'הילדים משחקים עכשיו.',tag:'pc',r:2},
{id:'s12',en:'I have a red pen.',he:'יש לי עט אדום.',tag:'have',r:1},
{id:'s13',en:"She doesn't like milk.",he:'היא לא אוהבת חלב.',tag:'neg',r:1},
{id:'s14',en:'We go to school by bus.',he:'אנחנו נוסעים לבית הספר באוטובוס.',tag:'ps',r:1},
{id:'s15',en:'I live in Israel.',he:'אני גר בישראל.',tag:'ps',r:1},
{id:'s16',en:'My sister has a big dog.',he:'לאחות שלי יש כלב גדול.',tag:'have',r:1},
{id:'s17',en:'I like to play with my friends.',he:'אני אוהב לשחק עם החברים שלי.',tag:'ps',r:1},
{id:'s18',en:'The flower is beautiful.',he:'הפרח יפה.',tag:'adj',r:2},
{id:'s19',en:'The cat is sitting on the chair.',he:'החתול יושב על הכיסא.',tag:'pc',r:2},
{id:'s20',en:'Dan eats an apple every day.',he:'דן אוכל תפוח כל יום.',tag:'ps',r:1},
{id:'s21',en:'The sun is big and yellow.',he:'השמש גדולה וצהובה.',tag:'adj',r:2},
{id:'s22',en:'My father has a blue car.',he:'לאבא שלי יש מכונית כחולה.',tag:'have',r:1}
];

/* can / can't: [emoji,subject,verb,can,he] */
export const CC=[
['🐦','A bird','fly',true,'ציפור יכולה לעוף'],['👶','A baby','talk',false,'תינוק לא יכול לדבר'],['🐟','A fish','swim',true,'דג יכול לשחות'],
['🐟','A fish','walk',false,'דג לא יכול ללכת'],['🐶','A dog','run',true,'כלב יכול לרוץ'],['🐮','A cow','fly',false,'פרה לא יכולה לעוף'],
['🧒','I','read',true,'אני יכול לקרוא'],['🐴','A horse','run',true,'סוס יכול לרוץ'],['🐰','A rabbit','fly',false,'ארנב לא יכול לעוף'],
['🦆','A duck','swim',true,'ברווז יכול לשחות'],['🐱','A cat','sing',false,'חתול לא יכול לשיר'],['🐑','A sheep','read',false,'כבשה לא יכולה לקרוא'],
['🧑‍🏫','A teacher','talk',true,'מורה יכולה לדבר'],['👧','A girl','sing',true,'ילדה יכולה לשיר'],['🍎','An apple','run',false,'תפוח לא יכול לרוץ']
];

/* fix the mistake: [wrong,right,distractor,why] */
export const FX=[
['He can plays football.','He can play football.','He can playing football.','אחרי can תמיד בא פועל בצורתו הבסיסית, בלי s.'],
["She don't like milk.","She doesn't like milk.",'She not like milk.',"עם she / he / it משתמשים ב-doesn't ולא ב-don't."],
['I lives in Israel.','I live in Israel.','I living in Israel.','עם I משתמשים בפועל בלי s: I live.'],
['The children is playing.','The children are playing.','The children playing.','"The children" הם רבים, לכן are ולא is.'],
['A fish can swims.','A fish can swim.','A fish can swimming.','אחרי can – פועל בסיסי: swim.'],
['My mother take care of her baby.','My mother takes care of her baby.','My mother taking care of her baby.','עם my mother (היא) מוסיפים s לפועל: takes.'],
['He have a red pen.','He has a red pen.','He haves a red pen.','עם he / she משתמשים ב-has ולא ב-have.'],
['They is picking oranges.','They are picking oranges.','They picking oranges.','עם they משתמשים ב-are.'],
['Does she likes cats?','Does she like cats?','Do she like cats?','אחרי does הפועל חוזר לצורה בסיסית, בלי s.'],
['The farmer feed the sheep every day.','The farmer feeds the sheep every day.','The farmer feeding the sheep every day.','עם the farmer (הוא) מוסיפים s: feeds.'],
['We goes to school by bus.','We go to school by bus.','We going to school by bus.','עם we משתמשים בפועל בלי s: go.'],
['I am play football now.','I am playing football now.','I playing football now.','am + פועל עם ing: I am playing.']
];

/* dialogues: [npcLine, right, [wrong1,wrong2], why] ; {name} replaced */
export const TALK=[
['Where do you live?','I live in Israel.',["I am fine, thanks.",'Yes, I do.'],'שאלת Where שואלת על מקום, לכן עונים: I live in...'],
['Do you have a red pen?','Yes, I do.',["No, I can't.",'I live in a house.'],'שאלה עם Do you have? עונים Yes, I do / No, I don\'t.'],
['Do you need to take a bus to school?',"No, I don't. I walk to school.",['Yes, I can.','I have a bus.'],"Do you need...? עונים Yes, I do / No, I don't."],
['Do you like to play with your sisters?','Yes, I do. We play together.',['Yes, I am.','No, I can.'],'שאלת Do you like...? עונים Yes, I do.'],
['Who are your friends?','My friends are Noa and Dan.',['I like milk.','In Israel.'],'שאלת Who שואלת על אנשים.'],
['What do you do every day?','I go to school and I play football.',['I am fine.','Yes, I do.'],'שאלת What do you do? עונים עם פעולות: I go..., I play...'],
['What is your name?','My name is {name}.',['I am eleven.','I live in Israel.'],'עונים My name is...'],
['Can you swim?','Yes, I can.',['Yes, I do.','Yes, I am.'],'שאלה עם Can you...? עונים Yes, I can / No, I can\'t.'],
['How are you?',"I'm fine, thank you.",['My name is Dan.','At school.'],'How are you? עונים I\'m fine, thank you.']
];

/* picture scenes -> sentence */
export const PIC=[
{e:'🧑‍🌾➡️🐑🥣',en:'The farmer is feeding the sheep.',alt:[],he:'החקלאי מאכיל את הכבשים'},
{e:'👨👨🍊🧺',en:'The men are picking oranges.',alt:[],he:'הגברים קוטפים תפוזים'},
{e:'🧒🧒⚽',en:'The children are playing football.',alt:['The children are playing.'],he:'הילדים משחקים כדורגל'},
{e:'🐟🌊',en:'The fish is swimming.',alt:[],he:'הדג שוחה'},
{e:'👧📖',en:'The girl is reading a book.',alt:[],he:'הילדה קוראת ספר'},
{e:'🐦☁️',en:'The bird is flying.',alt:[],he:'הציפור עפה'},
{e:'👩🍼👶',en:'The mother is taking care of the baby.',alt:[],he:'האמא מטפלת בתינוק'},
{e:'🐴💨',en:'The horse is running.',alt:[],he:'הסוס רץ'},
{e:'🧒🎤',en:'The boy is singing.',alt:[],he:'הילד שר'}
];

/* adjectives sentence completion [prompt,answer,opts,why] */
export const ADJ=[
['🐘 The elephant is ___.','big',['big','small','sweet'],'פיל הוא גדול – big.'],
['🐜 The ant is ___.','small',['big','small','happy'],'נמלה היא קטנה – small.'],
['🍬 The candy is ___.','sweet',['sweet','sad','big'],'ממתק הוא מתוק – sweet.'],
['🌺 The flower is ___.','beautiful',['beautiful','sad','small'],'פרח הוא יפה – beautiful.'],
['😀 Dan has a new bike. He is ___.','happy',['happy','sad','small'],'מי שיש לו אופניים חדשים שמח – happy.'],
['😢 The boy lost his dog. He is ___.','sad',['happy','sad','sweet'],'כשאבד לו הכלב הוא עצוב – sad.'],
['😊 She is a ___ girl. Everybody likes her.','nice',['nice','sad','big'],'ילדה שכולם אוהבים היא נחמדה – nice.']
];
/* verbs difference [prompt,answer,opts,why] */
export const VD=[
['I ___ a noise outside.','hear',['hear','listen','say'],'hear = לשמוע צליל (זה קורה לבד). listen = להקשיב בכוונה.'],
['Please ___ to the teacher.','listen',['hear','listen','put'],'listen = להקשיב בתשומת לב.'],
['The children ___ oranges from the trees.','pick',['pick','sit','leave'],'pick = לקטוף.'],
['We ___ to school by bus.','go',['go','feed','say'],'go = ללכת / לנסוע.'],
['The farmer ___ the sheep every morning.','feeds',['feeds','sits','starts'],'feed = להאכיל; עם the farmer מוסיפים s.'],
['Dan ___ hello to everybody.','says',['says','puts','hears'],'say = לומר; עם Dan מוסיפים s.'],
['My mother ___ of her baby.','takes care',['takes care','gets out','leaves'],'take care of = לטפל ב...'],
['The class ___ at nine o\'clock.','starts',['starts','sits','feeds'],'start = להתחיל.']
];
export const WH=[
['___ do you live? — In Israel.','Where',['Where','Who','What','Why'],'Where = איפה (מקום).'],
['___ is your teacher? — Mrs. Cohen.','Who',['Who','Where','When','How'],'Who = מי (אדם).'],
['___ do you eat for breakfast? — Bread and eggs.','What',['What','Who','Where','When'],'What = מה.'],
['___ do you go to school? — At eight o\'clock.','When',['When','Where','Who','Why'],'When = מתי (זמן).'],
['___ is Dan happy? — Because he has a new dog.','Why',['Why','Who','When','How'],'Why = למה, והתשובה מתחילה ב-Because.'],
['___ are you? — I\'m fine, thank you.','How',['How','What','Where','Who'],'How are you? = מה שלומך?'],
['___ old are you? — I\'m eleven.','How',['How','What','Who','When'],'How old...? = בן כמה?']
];
export const PREP=[
['🐱📦 The cat is ___ the box.','in',['in','on','under'],'in = בתוך.'],
['🐱🪑 The cat is ___ the chair.','on',['in','on','under'],'on = על.'],
['🐶🛏️ The dog is ___ the bed.','under',['in','on','under'],'under = מתחת.'],
['🧒🏫 The boy is ___ school.','at',['at','under','on'],'at school = בבית הספר.'],
['🐦🌳 The bird is ___ the tree.','on',['on','under','at'],'on = על (העץ).']
];
export const CONJ=[
['I like milk ___ bread.','and',['and','but','because'],'and = וגם.'],
["I like cats ___ I don't like dogs.",'but',['and','but','because'],'but = אבל (ניגוד).'],
['He is sad ___ his dog is lost.','because',['and','but','because'],'because = כי (סיבה).'],
['Do you want tea ___ milk?','or',['or','but','because'],'or = או (בחירה).']
];
export const TOPICS={pcont:'Present Continuous',psimple:'Present Simple',neg:"Don't / Doesn't",dodoes:'Do / Does',havehas:'Have / Has',can:"Can / Can't",pspc:'Simple vs Continuous',wh:'WH Questions',prep:'Prepositions',conj:'Conjunctions',adj:'Adjectives',vdiff:'Verbs'};

/* reading passages (original, inspired by the textbook topic) */
export const PASS={
p1:{title:'Pinchas and Tzvi',he:'פנחס וצבי',s:['Pinchas and Tzvi are friends.','They live on a kibbutz.','Every morning they go to the farm.','Pinchas feeds the sheep.','Tzvi picks oranges with his father.','At noon the children eat lunch together.','In the afternoon they play football on the grass.','Pinchas is happy because he loves the animals.'],
 qs:[['Who feeds the sheep?','Pinchas',['Tzvi','The father'],3],['Where do the friends live?','On a kibbutz',['In a big city','On a boat'],1],['What does Tzvi pick?','Oranges',['Apples','Flowers'],4],
 ['When do the children play football?','In the afternoon',['In the morning','At night'],6],['Why is Pinchas happy?','Because he loves the animals',['Because he has a new ball','Because it is Friday'],7],['What do the friends do every morning?','They go to the farm',['They play football','They eat lunch'],2]]},
p2:{title:'A Sunny Day on the Farm',he:'יום שמש בחווה',s:['It is a sunny day on the farm.','The farmer is working in the garden.','Two men are picking oranges.','A girl is feeding the chickens.','The horse is running in the field.','The sheep are sleeping under a big tree.',"The farmer's wife is carrying a basket of eggs."],
 qs:[['What is the girl doing?','She is feeding the chickens',['She is picking oranges','She is running'],3],['Where are the sheep sleeping?','Under a big tree',['In the garden','In the house'],5],['How many men are picking oranges?','Two',['Three','One'],2],
 ['What is the horse doing?','Running in the field',['Sleeping','Eating eggs'],4],['Who is carrying the eggs?',"The farmer's wife",['The girl','The men'],6]]},
p3:{title:"Dana's Day",he:'היום של דנה',s:['My name is Dana.','I am eleven years old.','I live in a small house near the school.','I have two sisters and one brother.','Every day I walk to school with my friend Noa.',"We don't take the bus.",'After school I do my homework and play with my sisters.'],
 qs:[['How old is Dana?','Eleven',['Ten','Twelve'],1],['Where does Dana live?','In a small house near the school',['On a farm','In a big city'],2],['Who walks to school with Dana?','Noa',['Her brother','Her mother'],4],
 ['Does Dana take the bus?',"No, she walks to school",['Yes, every day','Yes, with Noa'],5],['How many sisters does Dana have?','Two',['One','Three'],3],['What does Dana do after school?','She does homework and plays',['She goes to the farm','She takes the bus'],6]]}
};
export const INSTR=[['Please sit down.','🪑'],['Open the door, please.','🚪'],['Read the book.','📖'],['Eat your apple.','🍎'],['Look at the sun.','☀️'],['Take your bag.','🎒'],['Feed the sheep.','🐑'],['Drink some water.','💧']];

/* writing tasks: must=[[regex,hebrew label]] */
export const NUMW='one|two|three|four|five|six|seven|eight|nine|ten', COLW='red|blue|green|yellow|purple|black|white|brown';
export const WT={
w_like:{he:'כתבו משפט על חיות שאתם אוהבים. לדוגמה:',ref:'I like dogs and cats.',must:[['\\b(like|love)\\b','like / love'],['\\b(dog|cat|sheep|horse|chicken|cow|bird|fish|duck|rabbit)s?\\b','שם של חיה']],min:3},
w_count:{he:'כתבו משפט שמתחיל ב-I have ומכיל מספר וצבע. לדוגמה:',ref:'I have three red pens.',must:[['\\bi have\\b','I have'],['\\b('+NUMW+')\\b','מספר'],['\\b('+COLW+')\\b','צבע']],min:4},
w_family:{he:'כתבו 2 משפטים על המשפחה שלכם. לדוגמה:',ref:'I have a mother and a father. I have a sister.',must:[['\\b(my|i have)\\b','my / I have'],['\\b(mother|father|sister|brother|family|baby)\\b','בן משפחה']],min:6},
w_food:{he:'כתבו מה אתם אוהבים לאכול. לדוגמה:',ref:'I like bread and milk.',must:[['\\bi (like|love)\\b','I like'],['\\b(apple|orange|milk|bread|banana|egg|cheese|tomato|cake)s?\\b','שם של אוכל']],min:4},
w_pen:{he:'כתבו משפט עם I have ושם של חפץ וצבע. לדוגמה:',ref:'I have a red pen.',must:[['\\bi have\\b','I have'],['\\b(pen|book|bag|ball|car)\\b','חפץ'],['\\b('+COLW+')\\b','צבע']],min:4},
w_farmer:{he:'תארו את התמונה 🧑‍🌾➡️🐑🥣 במשפט אחד:',ref:'The farmer is feeding the sheep.',must:[['farmer','farmer'],['feed','feeding'],['sheep','sheep']],min:5,scene:'🧑‍🌾➡️🐑🥣'},
w_ican:{he:'כתבו 2 דברים שאתם יכולים לעשות (I can...). לדוגמה:',ref:'I can swim. I can read a book.',must:[['\\bi can\\b','I can'],['\\b(fly|run|talk|play|swim|read|sing|walk)\\b','פועל']],min:5},
w_adj:{he:'כתבו משפט עם תואר (big / small / beautiful / happy...). לדוגמה:',ref:'The flower is beautiful.',must:[['\\b(beautiful|big|nice|sweet|small|happy|sad)\\b','תואר']],min:4},
w_verbs:{he:'כתבו משפט עם אחד הפעלים: hear, listen, feed, eat, sit, pick, go, say. לדוגמה:',ref:'I listen to my teacher.',must:[['\\b(hear|listen|feed|eat|sit|pick|go|say|start|leave)s?\\b','פועל מהרשימה']],min:4},
w_girl:{he:'תארו את התמונה 👧📖 במשפט אחד:',ref:'The girl is reading a book.',must:[['girl','girl'],['read','reading'],['book','book']],min:5,scene:'👧📖'},
w_daily:{he:'כתבו 2 משפטים: מה אתם עושים כל יום? לדוגמה:',ref:'I go to school. I play football.',must:[['\\bi\\b','I'],['\\b(go|play|eat|read|walk|take|do|sing|swim)s?\\b','פועל']],min:6},
w_intro:{he:'הציגו את עצמכם (שם, גיל, איפה אתם גרים). לדוגמה:',ref:'My name is Dan. I am eleven. I live in Israel.',must:[['my name is','My name is'],['\\bi am\\b','I am'],['\\bi live\\b','I live']],min:8}
};

/* regions & missions */
export const REGIONS=[
{id:1,he:'כפר ההתחלה',en:'Starter Village',emoji:'🏘️'},{id:2,he:'חוות החיות',en:'Animal Farm',emoji:'🐑'},
{id:3,he:'עיירת בית הספר',en:'School Town',emoji:'🏫',lock:1},{id:4,he:'היער המסתורי',en:'Mystery Forest',emoji:'🌲',lock:1},
{id:5,he:'נמל ההרפתקאות',en:'Adventure Harbor',emoji:'⚓',lock:1},{id:6,he:'ממלכת האנגלית',en:'English Kingdom',emoji:'🏰',lock:1}
];
export const MISSIONS=[
{id:'v1',r:1,npc:'dana',title:'ברוכים הבאים לכפר',story:'דנה, ראש הכפר, מחפשת עוזר חדש שמכיר את חיות הכפר.',obj:'ללמוד שמות של חיות ולכתוב משפט באנגלית.',
 lesson:'<b>Animals – חיות</b><br><span class=en>dog 🐶 · cat 🐱 · sheep 🐑 · horse 🐴 · chicken 🐔</span><br>לחצו על 🔊 כדי לשמוע, וחזרו על המילה בקול.',
 steps:[{m:'hunter',cat:'animals',n:5},{m:'missing',cat:'animals',n:1},{m:'factory',cat:'animals',n:3,kind:'order'}],chal:'w_like',item:'🐕',itemName:'פעמון הכפר'},
{id:'v2',r:1,npc:'yuval',title:'הנחתום והצבעים',story:'יובל האופה צריך עזרה בספירת לחמים ובבחירת צבעי הקופסאות.',obj:'ללמוד צבעים ומספרים ולהשתמש בהם במשפט.',
 lesson:'<b>Colors & Numbers</b><br><span class=en>red · blue · green · yellow<br>one · two · three · four · five</span>',
 steps:[{m:'hunter',cat:'colors',n:3},{m:'hunter',cat:'numbers',n:3},{m:'listen',kind:'word',cats:['colors','numbers'],n:4},{m:'factory',cat:'numbers',n:2,kind:'missing'}],chal:'w_count',item:'🥖',itemName:'לחם הכפר'},
{id:'v3',r:1,npc:'mira',title:'המשפחה של מירה',story:'מירה מכינה אלבום משפחה ומבקשת עזרה במילים באנגלית.',obj:'ללמוד מילות משפחה ולבנות משפטים פשוטים.',
 lesson:'<b>Family – משפחה</b><br><span class=en>mother · father · sister · brother · baby</span><br>משפט: <span class=en>My sister has a big dog.</span>',
 steps:[{m:'hunter',cat:'family',n:5},{m:'builder',r:1,n:3},{m:'listen',kind:'sent',r:1,n:3}],chal:'w_family',item:'📸',itemName:'אלבום משפחתי'},
{id:'v4',r:1,npc:'sami',title:'החנות של סמי',story:'סמי בעל החנות רוצה לדעת מה הלקוחות אוהבים לאכול.',obj:'ללמוד שמות אוכל ולנהל שיחה קצרה בחנות.',
 lesson:'<b>Food – אוכל</b><br><span class=en>apple · milk · bread · cheese · cake</span><br>שאלה: <span class=en>What do you like?</span> תשובה: <span class=en>I like bread.</span>',
 steps:[{m:'hunter',cat:'food',n:5},{m:'listen',kind:'word',cat:'food',n:3},{m:'talk',n:3}],chal:'w_food',item:'🧺',itemName:'סל קניות'},
{id:'v5',r:1,npc:'ruth',title:'העט האדום של רות',story:'המורה רות איבדה את העט האדום שלה. אולי יש לכם אחד?',obj:'להשתמש ב-have / has ולענות על שאלות.',
 lesson:'<b>Have / Has</b><br>I / you / we / they → <span class=en>have</span><br>he / she / my sister → <span class=en>has</span><br><span class=en>I have a red pen. She has a red pen.</span>',
 steps:[{m:'hunter',cat:'objects',n:4},{m:'grammar',topics:['havehas'],n:3},{m:'talk',n:2},{m:'builder',r:1,n:2}],chal:'w_pen',item:'🖊️',itemName:'העט האדום'},
{id:'v6',r:1,npc:'guard',boss:1,title:'קרב מול שומר השער',story:'שומר השער בודק שאתם מוכנים לצאת אל החווה. עברו את המבחן כדי לפתוח את השער!',obj:'לענות נכון על לפחות 70% מהשאלות, בלי רמזים.',
 lesson:'<b>מבחן מסכם</b><br>חזרה על כל מה שלמדתם בכפר: מילים, have/has ומשפטים. קדימה!',steps:[],item:'🗝️',itemName:'מפתח השער'},
{id:'f1',r:2,npc:'gil',title:'עזרו לחקלאי',story:'גיל החקלאי צריך עזרה בהאכלת החיות.',obj:'ללמוד חיות ופעלים של החווה ולתאר מה קורה.',
 lesson:'<b>Farm words</b><br><span class=en>feed 🥣 · eat 🍽️ · pick 🧺 · play 🎮</span><br>תיאור: <span class=en>The farmer is feeding the sheep.</span>',
 steps:[{m:'hunter',cat:'animals',n:3},{m:'hunter',ids:['feed','eat','pick','play'],n:4},{m:'picture',n:3}],chal:'w_farmer',item:'🥛',itemName:'דלי חלב'},
{id:'f2',r:2,npc:'tali',title:"Can או Can't?",story:'תלי הרועה משחקת במשחק ניחושים: מי יכול ומי לא יכול?',obj:'להבין can / can\'t ולבנות משפטים.',
 lesson:"<b>Can / Can't</b><br><span class=en>A bird can fly. A baby can't talk.</span><br>אחרי can בא פועל בסיסי: <span class=en>I can swim.</span>",
 steps:[{m:'cancant',n:5},{m:'grammar',topics:['can'],n:3},{m:'builder',tag:'can',n:2}],chal:'w_ican',item:'🪶',itemName:'נוצה'},
{id:'f3',r:2,npc:'omer',title:'פרדס התפוזים',story:'עומר מתאר את הפרדס שלו, אבל חסרות לו מילים.',obj:'ללמוד תארים: big, small, beautiful, happy...',
 lesson:'<b>Adjectives – תארים</b><br><span class=en>big · small · beautiful · nice · sweet · happy · sad</span>',
 steps:[{m:'hunter',cat:'adjectives',n:5},{m:'grammar',topics:['adj'],n:4},{m:'builder',tag:'adj',n:2}],chal:'w_adj',item:'🍊',itemName:'תפוז זהב'},
{id:'f4',r:2,npc:'avi',title:'האסם של אבי',story:'אבי מבלבל בין פעלים דומים. עזרו לו!',obj:'להבדיל בין hear / listen ולתקן טעויות.',
 lesson:'<b>hear או listen?</b><br><span class=en>HEAR</span> = לשמוע צליל (קורה לבד)<br><span class=en>LISTEN</span> = להקשיב בכוונה',
 steps:[{m:'hunter',cat:'verbs',n:5},{m:'grammar',topics:['vdiff'],n:4},{m:'fix',n:3}],chal:'w_verbs',item:'🔔',itemName:'פעמון האסם'},
{id:'f5',r:2,npc:'dalia',title:'מה קורה עכשיו?',story:'דליה מנהלת את החווה ורוצה להבדיל בין "כל יום" ל"עכשיו".',obj:'להבדיל בין Present Simple ל-Present Continuous.',
 lesson:'<b>Present Simple</b>: כל יום – <span class=en>The farmer works.</span><br><b>Present Continuous</b>: עכשיו – <span class=en>The farmer is working.</span><br>נוסחה: <span class=en>am / is / are + verb-ing</span>',
 steps:[{m:'grammar',topics:['psimple'],n:3},{m:'grammar',topics:['pcont'],n:3},{m:'grammar',topics:['pspc'],n:3},{m:'picture',n:2}],chal:'w_girl',item:'🧺',itemName:'סל ביצים'},
{id:'f6',r:2,npc:'kids',title:'פנחס וצבי',story:'פנחס וצבי כתבו סיפור על החיים בקיבוץ. קראו אותו והבינו אותו.',obj:'לקרוא קטע, להקשיב לקטע נוסף ולענות על שאלות.',
 lesson:'<b>קריאה</b><br>קראו לאט. כשיש רמז – יודגש במשפט המתאים בטקסט.',
 steps:[{m:'reading',pid:'p1',n:6},{m:'listen',kind:'passage',pid:'p2',n:3},{m:'talk',n:2}],chal:'w_daily',item:'📜',itemName:'מגילת הסיפור'},
{id:'f7',r:2,npc:'oldgil',boss:1,title:'קרב מול הסקרקרו',story:'הסקרקרו של החווה מאתגר אתכם בחידות באנגלית!',obj:'ענו נכון על לפחות 70% מהשאלות, בלי רמזים.',
 lesson:'<b>מבחן מסכם</b><br>can/can\'t, Present Simple ו-Continuous, תארים, פעלים וקריאה.',steps:[],item:'👑',itemName:'כתר החווה'}
];
export const NPCS={
dana:{n:'דנה',x:-28,z:2,c:'#e85d75',h:'#8a4b2a'},yuval:{n:'יובל',x:-16,z:-6,c:'#f2a33a',h:'#2b2b2b'},mira:{n:'מירה',x:-18,z:6,c:'#a56cd6',h:'#d9a441'},
sami:{n:'סמי',x:-10,z:9.5,c:'#3aa57a',h:'#4a2f1b'},ruth:{n:'רות',x:-22,z:-9,c:'#4a7ad6',h:'#c9c9c9'},guard:{n:'שומר השער',x:-2,z:-3,c:'#7d8793',h:'#222'},
gil:{n:'גיל',x:12,z:-6,c:'#4e8a3a',h:'#6b4a2b'},tali:{n:'תלי',x:18,z:9,c:'#e0b13a',h:'#3a2a1a'},omer:{n:'עומר',x:30,z:-9,c:'#d9792b',h:'#2b2b2b'},
avi:{n:'אבי',x:12,z:10,c:'#b8433a',h:'#5a3a22'},dalia:{n:'דליה',x:24,z:0,c:'#3a9ad6',h:'#7a3a2a'},kids:{n:'פנחס וצבי',x:34,z:6,c:'#4ac0a0',h:'#2b2b2b'},oldgil:{n:'הסקרקרו',x:38,z:-4,c:'#9a7a3a',h:'#c9a03a'}
};
export const SHOP={
shirt:[['blue','כחול','#3b82f6',0],['red','אדום','#e5484d',0],['green','ירוק','#30a46c',20],['purple','סגול','#8e4ec6',20],['orange','כתום','#f76b15',30],['pink','ורוד','#e93d82',30],['gold','זהב','#f5c542',60]],
hair:[['brown','חום','#5b3a1e',0],['black','שחור','#1f1f1f',0],['blond','בלונד','#e3b84f',15],['red','ג׳ינג׳י','#c2410c',15],['blue','כחול','#2563eb',40]],
hat:[['none','בלי',null,0],['cap','כובע מצחייה','#ef4444',25],['party','כובע מסיבה','#a855f7',30],['crown','כתר','#facc15',80],['wizard','כובע קוסם','#3730a3',60]],
pack:[['none','בלי',null,0],['red','תיק אדום','#dc2626',20],['green','תיק ירוק','#16a34a',20],['gold','תיק זהב','#eab308',70]],
pet:[['none','בלי',null,0],['dog','כלבלב','#b9824f',40],['cat','חתלתול','#8b8b8b',40],['chick','אפרוח','#fde047',30]]
};

/* ===== regions 3-6 (content lives in world2.ts) ===== */
Object.assign(CATS, NEW_CATS);
NEW_VR.forEach((r) => { const v = { id: r[0], en: r[1], he: r[2], e: r[3], cat: r[4] }; VOC.push(v); VM[v.id] = v; });
SENT.push(...NEW_SENT); TALK.push(...NEW_TALK); PIC.push(...NEW_PIC);
Object.assign(PASS, NEW_PASS); Object.assign(WT, NEW_WT); Object.assign(NPCS, NEW_NPCS);
REGIONS.forEach((r) => { delete r.lock; });
MISSIONS.push(...NEW_MISSIONS);
export const PORTRAITS = NEW_PORTRAITS;
/** vocabulary categories belonging to each region (used to keep exams/practice to what the child has reached) */
export const REGION_CATS = { 3: ['school'], 4: ['forest'], 5: ['sea'], 6: ['kingdom'] };
/** previous-region boss that must be beaten, and how many words must be genuinely learned, to enter region r */
export const GATES = { 2: { boss: 'v6', need: 12 }, 3: { boss: 'f7', need: 20 }, 4: { boss: 's6', need: 30 }, 5: { boss: 'h6', need: 40 }, 6: { boss: 'w6', need: 50 } };
