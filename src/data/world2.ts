// @ts-nocheck
// Regions 3-6 (School Town, Mystery Forest, Adventure Harbor, English Kingdom): content only.
// Merged into the main content tables at the bottom of content.ts (no circular imports).
const NUMW = 'one|two|three|four|five|six|seven|eight|nine|ten', COLW = 'red|blue|green|yellow|purple|black|white|brown|orange|pink|gray|grey';

export const NEW_CATS = { school: 'בית ספר', forest: 'יער וטבע', sea: 'ים ונמל', kingdom: 'ממלכה' };

export const NEW_VR = [
  // school
  ['school', 'school', 'בית ספר', '🏫', 'school'], ['pencil', 'pencil', 'עיפרון', '✏️', 'school'], ['notebook', 'notebook', 'מחברת', '📓', 'school'], ['ruler', 'ruler', 'סרגל', '📏', 'school'],
  ['scissors', 'scissors', 'מספריים', '✂️', 'school'], ['clock', 'clock', 'שעון', '🕐', 'school'], ['computer', 'computer', 'מחשב', '💻', 'school'], ['homework', 'homework', 'שיעורי בית', '📝', 'school'],
  ['sandwich', 'sandwich', 'סנדוויץ׳', '🥪', 'school'], ['library', 'library', 'ספרייה', '📚', 'school'], ['write', 'write', 'לכתוב', '✍️', 'school'], ['draw', 'draw', 'לצייר', '🖌️', 'school'],
  // forest
  ['forest', 'forest', 'יער', '🌲', 'forest'], ['mountain', 'mountain', 'הר', '⛰️', 'forest'], ['river', 'river', 'נהר', '🏞️', 'forest'], ['moon', 'moon', 'ירח', '🌙', 'forest'],
  ['star', 'star', 'כוכב', '⭐', 'forest'], ['rain', 'rain', 'גשם', '🌧️', 'forest'], ['snow', 'snow', 'שלג', '❄️', 'forest'], ['cloud', 'cloud', 'ענן', '☁️', 'forest'],
  ['mushroom', 'mushroom', 'פטרייה', '🍄', 'forest'], ['leaf', 'leaf', 'עלה', '🍃', 'forest'], ['fox', 'fox', 'שועל', '🦊', 'forest'], ['owl', 'owl', 'ינשוף', '🦉', 'forest'],
  ['bear', 'bear', 'דוב', '🐻', 'forest'], ['wolf', 'wolf', 'זאב', '🐺', 'forest'],
  // sea
  ['sea', 'sea', 'ים', '🌊', 'sea'], ['boat', 'boat', 'סירה', '⛵', 'sea'], ['ship', 'ship', 'ספינה', '🚢', 'sea'], ['whale', 'whale', 'לוויתן', '🐋', 'sea'],
  ['shark', 'shark', 'כריש', '🦈', 'sea'], ['crab', 'crab', 'סרטן', '🦀', 'sea'], ['dolphin', 'dolphin', 'דולפין', '🐬', 'sea'], ['octopus', 'octopus', 'תמנון', '🐙', 'sea'],
  ['shell', 'shell', 'צדף', '🐚', 'sea'], ['island', 'island', 'אי', '🏝️', 'sea'], ['anchor', 'anchor', 'עוגן', '⚓', 'sea'], ['map', 'map', 'מפה', '🗺️', 'sea'], ['treasure', 'treasure', 'אוצר', '💰', 'sea'],
  // kingdom
  ['king', 'king', 'מלך', '🤴', 'kingdom'], ['queen', 'queen', 'מלכה', '👸', 'kingdom'], ['castle', 'castle', 'טירה', '🏰', 'kingdom'], ['crown', 'crown', 'כתר', '👑', 'kingdom'],
  ['sword', 'sword', 'חרב', '⚔️', 'kingdom'], ['dragon', 'dragon', 'דרקון', '🐉', 'kingdom'], ['knight', 'knight', 'אביר', '🛡️', 'kingdom'], ['bridge', 'bridge', 'גשר', '🌉', 'kingdom'],
  ['tower', 'tower', 'מגדל', '🗼', 'kingdom'], ['key', 'key', 'מפתח', '🔑', 'kingdom'], ['magic', 'magic', 'קסם', '🪄', 'kingdom'], ['flag', 'flag', 'דגל', '🚩', 'kingdom'], ['gold', 'gold', 'זהב', '🥇', 'kingdom'],
];

const S = (id, en, he, tag, r) => ({ id, en, he, tag, r });
export const NEW_SENT = [
  S('sc1', 'The school is big and nice.', 'בית הספר גדול ונחמד.', 'adj', 3), S('sc2', 'I write in my notebook.', 'אני כותב במחברת שלי.', 'ps', 3), S('sc3', 'The teacher has a red pencil.', 'למורה יש עיפרון אדום.', 'have', 3),
  S('sc4', 'We read books in the library.', 'אנחנו קוראים ספרים בספרייה.', 'ps', 3), S('sc5', 'The children are drawing a picture.', 'הילדים מציירים תמונה.', 'pc', 3), S('sc6', 'I can use the computer.', 'אני יכול להשתמש במחשב.', 'can', 3),
  S('sc7', "She doesn't have a ruler.", 'אין לה סרגל.', 'neg', 3), S('sc8', 'The clock is on the wall.', 'השעון על הקיר.', 'ps', 3), S('sc9', 'He is eating a sandwich now.', 'הוא אוכל סנדוויץ׳ עכשיו.', 'pc', 3),
  S('fo1', 'The fox lives in the forest.', 'השועל גר ביער.', 'ps', 4), S('fo2', 'An owl can see in the dark.', 'ינשוף יכול לראות בחושך.', 'can', 4), S('fo3', 'The bear is sleeping under a tree.', 'הדוב ישן מתחת לעץ.', 'pc', 4),
  S('fo4', "The moon is big and white tonight.", 'הירח גדול ולבן הלילה.', 'adj', 4), S('fo5', "It doesn't rain in the summer.", 'לא יורד גשם בקיץ.', 'neg', 4), S('fo6', 'The river is cold and clean.', 'הנהר קר ונקי.', 'adj', 4),
  S('fo7', 'We are walking in the forest.', 'אנחנו הולכים ביער.', 'pc', 4), S('fo8', 'A wolf can run very fast.', 'זאב יכול לרוץ מהר מאוד.', 'can', 4), S('fo9', 'The mushroom is red and small.', 'הפטרייה אדומה וקטנה.', 'adj', 4),
  S('ha1', 'The boat is on the sea.', 'הסירה על הים.', 'ps', 5), S('ha2', 'A dolphin can swim and jump.', 'דולפין יכול לשחות ולקפוץ.', 'can', 5), S('ha3', 'The captain has a big map.', 'לקפטן יש מפה גדולה.', 'have', 5),
  S('ha4', 'The fisherman is catching a fish.', 'הדייג תופס דג.', 'pc', 5), S('ha5', "The ship doesn't go to the island.", 'הספינה לא נוסעת לאי.', 'neg', 5), S('ha6', 'The treasure is under the sand.', 'האוצר מתחת לחול.', 'ps', 5),
  S('ha7', 'The crab walks on the beach.', 'הסרטן הולך על החוף.', 'ps', 5), S('ha8', 'We are sailing to a small island.', 'אנחנו מפליגים לאי קטן.', 'pc', 5), S('ha9', 'A whale is bigger than a boat.', 'לוויתן גדול יותר מסירה.', 'adj', 5),
  S('ki1', 'The king lives in a big castle.', 'המלך גר בטירה גדולה.', 'ps', 6), S('ki2', 'The queen has a golden crown.', 'למלכה יש כתר זהב.', 'have', 6), S('ki3', 'The knight is holding a sword.', 'האביר מחזיק חרב.', 'pc', 6),
  S('ki4', 'A dragon can fly and make fire.', 'דרקון יכול לעוף וליצור אש.', 'can', 6), S('ki5', "The bridge isn't open today.", 'הגשר לא פתוח היום.', 'neg', 6), S('ki6', 'The magic key is in the tower.', 'מפתח הקסם נמצא במגדל.', 'ps', 6),
  S('ki7', 'The people are waving the flags.', 'האנשים מנופפים בדגלים.', 'pc', 6), S('ki8', 'I have a small gold key.', 'יש לי מפתח זהב קטן.', 'have', 6), S('ki9', 'The castle is old and beautiful.', 'הטירה ישנה ויפה.', 'adj', 6),
];

// talk / picture items are filtered by region (5th element / r field); old items have none.
export const NEW_TALK = [
  ['What do you do in the library?', 'I read books.', ['I eat a sandwich.', 'I swim.'], 'בספרייה קוראים ספרים: I read books.', 3],
  ['Do you like your teacher?', 'Yes, I do. She is nice.', ['Yes, I can.', 'No, I am.'], 'Do you like...? עונים Yes, I do / No, I don\'t.', 3],
  ['Where is the clock?', 'It is on the wall.', ['It is a pencil.', 'Yes, it is.'], 'שאלת Where שואלת על מקום, לכן עונים עם מקום (on the wall).', 3],
  ['What is she doing?', 'She is writing in her notebook.', ['She writes every day.', 'She can write.'], 'השאלה על עכשיו, לכן עונים ב-Present Continuous: is + verb-ing.', 3],
  ['What can you see in the forest?', 'I can see a fox.', ['I see a boat.', 'Yes, I can.'], 'שאלת What can you see? עונים I can see + דבר.', 4],
  ['Is the owl sleeping now?', 'No, it is flying.', ['No, it flies every day.', 'Yes, it can.'], 'Is ... ing? עונים Yes, it is / No, it isn\'t.', 4],
  ['Does the bear live in the sea?', "No, it doesn't. It lives in the forest.", ['Yes, it is.', 'No, it can\'t.'], "Does ...? עונים Yes, it does / No, it doesn't.", 4],
  ['What is the weather like today?', 'It is rainy and cold.', ['It is a cloud.', 'I like rain.'], 'שואלים על מזג האוויר – עונים עם תיאור: rainy, cold, sunny.', 4],
  ['Where does the captain live?', 'He lives on a big ship.', ['He is living now.', 'Yes, he does.'], 'שאלת Where does ... live? עונים He lives + מקום.', 5],
  ['Can you swim?', 'Yes, I can.', ['Yes, I do.', 'Yes, I am.'], 'שאלה עם Can עונים Yes, I can / No, I can\'t.', 5],
  ['What are the fishermen doing?', 'They are catching fish.', ['They catch fish every day.', 'They can fish.'], 'השאלה על עכשיו, לכן עונים They are + verb-ing.', 5],
  ['Do you have a map?', 'Yes, I do. I have a big map.', ['Yes, I can.', 'No, I am.'], 'Do you have...? עונים Yes, I do / No, I don\'t.', 5],
  ['Who lives in the castle?', 'The king and the queen live there.', ['The castle is big.', 'Yes, they do.'], 'שאלת Who שואלת על אדם, לכן עונים עם אנשים.', 6],
  ['Can a dragon fly?', 'Yes, it can.', ['Yes, it does.', 'No, it is.'], 'Can ...? עונים Yes, it can / No, it can\'t.', 6],
  ['What does the knight have?', 'He has a sword and a shield.', ['He is a knight.', 'He can have.'], 'עם he משתמשים ב-has: He has a sword.', 6],
  ['Why is the king happy?', 'Because the dragon is gone.', ['Because he can fly.', 'In the castle.'], 'שאלת Why עונים Because...', 6],
];
export const NEW_PIC = [
  { e: '🧒📖📚', en: 'The child is reading a book in the library.', alt: ['The child is reading a book.'], he: 'הילד קורא ספר בספרייה', r: 3 },
  { e: '👩‍🏫✍️📋', en: 'The teacher is writing on the board.', alt: ['The teacher is writing.'], he: 'המורה כותבת על הלוח', r: 3 },
  { e: '🧒🖌️🎨', en: 'The girl is drawing a picture.', alt: ['The girl is painting.'], he: 'הילדה מציירת תמונה', r: 3 },
  { e: '🦊🌲🌙', en: 'The fox is walking in the forest at night.', alt: ['The fox is walking in the forest.'], he: 'השועל הולך ביער בלילה', r: 4 },
  { e: '🦉⭐🌙', en: 'The owl is sitting in the tree.', alt: ['The owl is sitting.'], he: 'הינשוף יושב על העץ', r: 4 },
  { e: '🐻🍄🌧️', en: 'The bear is looking at the mushroom.', alt: ['The bear is looking at a mushroom.'], he: 'הדוב מסתכל על הפטרייה', r: 4 },
  { e: '🧑‍✈️⛵🌊', en: 'The captain is sailing the boat.', alt: ['The captain is sailing.'], he: 'הקפטן מפליג בסירה', r: 5 },
  { e: '🧑🎣🐟', en: 'The man is catching a fish.', alt: ['The man is fishing.'], he: 'האיש תופס דג', r: 5 },
  { e: '🐬🌊☀️', en: 'The dolphin is jumping in the sea.', alt: ['The dolphin is jumping.'], he: 'הדולפין קופץ בים', r: 5 },
  { e: '🤴🏰👑', en: 'The king is standing in front of the castle.', alt: ['The king is standing.'], he: 'המלך עומד מול הטירה', r: 6 },
  { e: '🛡️⚔️🐉', en: 'The knight is fighting the dragon.', alt: ['The knight is fighting.'], he: 'האביר נלחם בדרקון', r: 6 },
  { e: '👸🌸🏰', en: 'The queen is walking in the garden.', alt: ['The queen is walking.'], he: 'המלכה מטיילת בגן', r: 6 },
];

export const NEW_PASS = {
  p4: { title: 'The School Library', he: 'ספריית בית הספר', s: ['Our school has a big library.', 'It is open every day after lunch.', 'Mrs. Levi is the librarian.', 'She helps the children find books.', 'Noa likes books about animals.', 'Dan likes books about space.', 'On Friday the children read together in the library.', 'The library is a quiet and happy place.'],
    qs: [['Who is the librarian?', 'Mrs. Levi', ['Noa', 'Dan'], 2], ['When is the library open?', 'Every day after lunch', ['Only on Friday', 'In the morning'], 1], ['What books does Noa like?', 'Books about animals', ['Books about space', 'Books about cars'], 4], ['What does Dan like?', 'Books about space', ['Books about animals', 'Books about food'], 5], ['What do the children do on Friday?', 'They read together', ['They play football', 'They go home'], 6], ['What is the library like?', 'Quiet and happy', ['Loud and big', 'Old and sad'], 7]] },
  p5: { title: 'A Night in the Forest', he: 'לילה ביער', s: ['It is night in the forest.', 'The moon is big and white.', 'An owl is sitting in a tall tree.', 'A small fox is looking for food.', 'The bear is sleeping in his cave.', 'It is raining a little, and the leaves are wet.', 'The mushrooms are red and green.', 'Soon the sun comes up, and the forest wakes up.'],
    qs: [['Where is the owl sitting?', 'In a tall tree', ['In a cave', 'On a boat'], 2], ['What is the fox looking for?', 'Food', ['A friend', 'A book'], 3], ['Where is the bear sleeping?', 'In his cave', ['In a tree', 'In the river'], 4], ['What is the weather like?', 'It is raining a little', ['It is snowing', 'It is very hot'], 5], ['What colour is the moon?', 'White', ['Red', 'Green'], 1], ['When does the forest wake up?', 'When the sun comes up', ['At night', 'On Friday'], 7]] },
  p6: { title: 'The Fishermen of the Harbor', he: 'הדייגים של הנמל', s: ['Every morning the fishermen go to the sea.', 'They sail in small blue boats.', 'The captain is an old man with a white beard.', 'He knows the sea very well.', 'The fishermen catch many fish, and they sell the fish in the harbor.', 'The children like to watch the big ships.', 'At night the lighthouse shows the way home.'],
    qs: [['When do the fishermen go to the sea?', 'Every morning', ['At night', 'On Friday'], 0], ['What colour are the boats?', 'Blue', ['Red', 'Yellow'], 1], ['Who has a white beard?', 'The captain', ['The children', 'The fish'], 2], ['Where do they sell the fish?', 'In the harbor', ['On the island', 'In the forest'], 4], ['What do the children like to watch?', 'The big ships', ['The small fish', 'The trees'], 5], ['What shows the way home at night?', 'The lighthouse', ['The moon', 'The captain'], 6]] },
  p7: { title: 'The Castle and the Dragon', he: 'הטירה והדרקון', s: ['A king and a queen live in a big castle.', 'The castle has four tall towers.', 'Every day the knight walks around the castle with his sword.', 'One day a small dragon comes to the castle.', 'The people are afraid, but the dragon is not angry.', 'He is hungry and he wants some bread.', 'The queen gives him bread and milk.', 'Now the dragon is a friend of the castle.'],
    qs: [['How many towers does the castle have?', 'Four', ['Two', 'Six'], 1], ['What does the knight have?', 'A sword', ['A boat', 'A map'], 2], ['Why does the dragon come?', 'He is hungry', ['He is angry', 'He is lost'], 5], ['Who gives the dragon bread?', 'The queen', ['The king', 'The knight'], 6], ['How do the people feel?', 'Afraid', ['Happy', 'Sleepy'], 4], ['What is the dragon now?', 'A friend of the castle', ['An enemy', 'A king'], 7]] },
};

export const NEW_WT = {
  w_school: { he: 'כתבו משפט על בית הספר שלכם. לדוגמה:', ref: 'My school is big and nice.', must: [['\\b(school|class|classroom)\\b', 'school / class'], ['\\b(is|has|have|are)\\b', 'is / has / have']], min: 4 },
  w_lunch: { he: 'כתבו מה אתם אוכלים בהפסקה. לדוגמה:', ref: 'I eat a sandwich and an apple.', must: [['\\bi (eat|like|love|have)\\b', 'I eat / like / have'], ['\\b(sandwich|apple|banana|bread|cheese|milk|egg|cake|water|orange|tomato)s?\\b', 'שם של אוכל']], min: 4 },
  w_sport: { he: 'כתבו משפט על מה שהילדים עושים עכשיו בספורט. לדוגמה:', ref: 'The children are running on the field.', must: [['\\b(is|are)\\b', 'is / are'], ['\\b\\w+ing\\b', 'פועל עם ing']], min: 4 },
  w_art: { he: 'כתבו משפט עם צבע וחפץ בכיתה. לדוגמה:', ref: 'I have a red pencil and a blue ruler.', must: [['\\bi have\\b', 'I have'], ['\\b(' + COLW + ')\\b', 'צבע']], min: 5 },
  w_lib: { he: 'כתבו 2 משפטים על הספרייה. לדוגמה:', ref: 'I like the library. I read books there.', must: [['\\b(library|book|books|read)\\b', 'library / book / read'], ['\\bi (like|love|read|can|have)\\b', 'I like / read / can']], min: 6 },
  w_forest: { he: 'כתבו משפט על חיה ביער. לדוגמה:', ref: 'The fox lives in the forest.', must: [['\\b(fox|owl|bear|wolf|rabbit|bird)s?\\b', 'חיה'], ['\\b(forest|tree|trees|cave|river)\\b', 'מקום ביער']], min: 4 },
  w_weather: { he: 'כתבו משפט על מזג האוויר היום. לדוגמה:', ref: 'It is rainy and cold today.', must: [['\\b(it is|it\'s|it)\\b', 'It is'], ['\\b(rain|rainy|sunny|cold|hot|cloudy|snow|windy|warm)\\b', 'מזג אוויר']], min: 4 },
  w_night: { he: 'כתבו משפט על מה שקורה ביער בלילה. לדוגמה:', ref: 'The owl is sitting in the tree.', must: [['\\b(is|are)\\b', 'is / are'], ['\\b\\w+ing\\b', 'פועל עם ing']], min: 5 },
  w_can4: { he: 'כתבו מה חיה אחת יכולה לעשות. לדוגמה:', ref: 'An owl can see in the dark.', must: [['\\bcan\\b', 'can'], ['\\b(fox|owl|bear|wolf|rabbit|bird|fish|dog|cat|horse)s?\\b', 'חיה']], min: 4 },
  w_sea: { he: 'כתבו משפט על הים. לדוגמה:', ref: 'The sea is big and blue.', must: [['\\b(sea|boat|ship|beach|island|fish|whale|dolphin|shark|crab)s?\\b', 'מילה מהים'], ['\\b(is|are|has|have|can)\\b', 'is / are / can']], min: 4 },
  w_boat: { he: 'כתבו משפט על סירה או ספינה עכשיו. לדוגמה:', ref: 'The boat is sailing to the island.', must: [['\\b(boat|ship)\\b', 'boat / ship'], ['\\b\\w+ing\\b', 'פועל עם ing']], min: 5 },
  w_fish: { he: 'כתבו מה אתם יכולים לעשות בים. לדוגמה:', ref: 'I can swim and I can sail a boat.', must: [['\\bi can\\b', 'I can'], ['\\b(swim|sail|fish|jump|run|walk|play)\\b', 'פועל']], min: 5 },
  w_map: { he: 'כתבו משפט עם have וחפץ מהנמל. לדוגמה:', ref: 'I have a map and a key.', must: [['\\bi have\\b', 'I have'], ['\\b(map|key|treasure|boat|ship|anchor|shell|crown|sword)s?\\b', 'חפץ']], min: 5 },
  w_king: { he: 'כתבו משפט על המלך או המלכה. לדוגמה:', ref: 'The king lives in a big castle.', must: [['\\b(king|queen|knight|prince|princess)\\b', 'king / queen'], ['\\b(lives|has|is|can)\\b', 'lives / has / is']], min: 5 },
  w_castle: { he: 'תארו את הטירה. לדוגמה:', ref: 'The castle is old and beautiful.', must: [['\\bcastle\\b', 'castle'], ['\\b(big|small|old|beautiful|nice|tall|sad|happy)\\b', 'תואר']], min: 4 },
  w_magic: { he: 'כתבו מה הקוסם עושה. לדוגמה:', ref: 'The wizard is making magic.', must: [['\\b(wizard|magic)\\b', 'wizard / magic'], ['\\b(is|are|has|can|makes|make|likes)\\b', 'is / can / has']], min: 4 },
  w_dragon: { he: 'כתבו משפט על הדרקון. לדוגמה:', ref: 'The dragon can fly and it is big.', must: [['\\bdragon\\b', 'dragon'], ['\\b(can|is|has|likes)\\b', 'can / is / has']], min: 5 },
  w_flag: { he: 'כתבו 2 משפטים על חג בממלכה. לדוגמה:', ref: 'The people are happy. They are waving the flags.', must: [['\\b(people|children|king|queen|knight)\\b', 'מי'], ['\\b(is|are)\\b', 'is / are']], min: 7 },
  w_end: { he: 'כתבו 2 משפטים על ההרפתקה שלכם. לדוגמה:', ref: 'I like the island. I have many new friends.', must: [['\\bi (like|love|have|can|am)\\b', 'I like / have / can'], ['\\b(island|friend|friends|adventure|word|words|english)\\b', 'מילה על ההרפתקה']], min: 7 },
};

const M = (id, r, npc, title, story, obj, lesson, steps, chal, item, itemName, boss) => ({ id, r, npc, title, story, obj, lesson, steps, chal, item, itemName, ...(boss ? { boss: 1 } : {}) });
const rt = (r) => `<span class=en>`;
export const NEW_MISSIONS = [
  // ---------- School Town ----------
  M('s1', 3, 'noa', 'הכיתה של נועה', 'המורה נועה מכינה את הכיתה ליום הראשון ומחפשת עזרה בשמות החפצים בכיתה.', 'ללמוד מילים של בית הספר ולבנות משפטים.',
    '<b>School – בית ספר</b><br><span class=en>pencil ✏️ · notebook 📓 · ruler 📏 · scissors ✂️ · clock 🕐 · computer 💻</span><br>משפט: <span class=en>I write in my notebook.</span>',
    [{ m: 'hunter', cat: 'school', n: 5 }, { m: 'builder', r: 3, n: 3 }, { m: 'listen', kind: 'word', cat: 'school', n: 3 }], 'w_school', '📓', 'מחברת הכיתה'),
  M('s2', 3, 'liat', 'הקפיטריה של ליאת', 'ליאת מכינה סנדוויצ׳ים להפסקה ושואלת כל ילד מה הוא אוהב.', 'לשאול ולענות על אוכל עם Do / Does.',
    '<b>Do / Does</b><br>I / you / we / they → <span class=en>Do you like bread?</span><br>he / she / it → <span class=en>Does she like milk?</span><br>עונים: <span class=en>Yes, I do. / No, she doesn\'t.</span>',
    [{ m: 'hunter', cat: 'food', n: 3 }, { m: 'hunter', ids: ['sandwich', 'homework', 'library'], n: 3 }, { m: 'grammar', topics: ['dodoes'], n: 4 }, { m: 'talk', r: 3, n: 2 }], 'w_lunch', '🥪', 'סנדוויץ׳ מיוחד'),
  M('s3', 3, 'rami', 'שיעור ספורט עם רמי', 'רמי המאמן צועק: "מה כולם עושים עכשיו?" הילדים רצים, קופצים ומשחקים.', 'לתאר מה קורה עכשיו (Present Continuous).',
    '<b>Present Continuous</b><br><span class=en>am / is / are + verb-ing</span><br><span class=en>The children are running.</span><br>מתארים מה קורה ברגע הזה.',
    [{ m: 'grammar', topics: ['pcont'], n: 5 }, { m: 'picture', r: 3, n: 3 }, { m: 'builder', tag: 'pc', r: 3, n: 2 }], 'w_sport', '🏅', 'מדליית ספורט'),
  M('s4', 3, 'nofar', 'שיעור אמנות', 'נופר מורת האמנות צריכה עזרה: איזה צבעים וחפצים יש לכל ילד?', 'להשתמש ב-have / has, בצבעים ובתארים.',
    '<b>Have / Has + תארים</b><br><span class=en>I have a red pencil. She has a big notebook.</span><br>תואר בא לפני שם העצם.',
    [{ m: 'hunter', cat: 'colors', n: 3 }, { m: 'grammar', topics: ['havehas'], n: 3 }, { m: 'grammar', topics: ['adj'], n: 3 }, { m: 'builder', tag: 'have', r: 3, n: 2 }], 'w_art', '🎨', 'לוח צבעים'),
  M('s5', 3, 'tomer', 'הספרייה של תומר', 'תומר הספרן מספר על הספרייה של בית הספר ושואל שאלות על מה שקראתם.', 'לקרוא קטע, להקשיב ולהשתתף בשיחה.',
    '<b>קריאה</b><br>קראו לאט. חפשו את התשובה בטקסט – אם צריך, יודגש לכם משפט עם רמז.',
    [{ m: 'reading', pid: 'p4', n: 6 }, { m: 'listen', kind: 'passage', pid: 'p4', n: 2 }, { m: 'talk', r: 3, n: 2 }], 'w_lib', '📚', 'ספר הזהב'),
  M('s6', 3, 'principal', 'קרב מול מנהל הבית ספר', 'המנהל מארגן "חידון גדול" כדי לבדוק שאתם מוכנים לצאת אל היער המסתורי.', 'לענות נכון על לפחות 70% מהשאלות, בלי רמזים.',
    '<b>מבחן מסכם</b><br>מילים של בית הספר, Do/Does, Present Continuous, have/has וקריאה. בהצלחה!', [], 'w_school', '🏆', 'גביע בית הספר', true),
  // ---------- Mystery Forest ----------
  M('h1', 4, 'hila', 'הילה שומרת היער', 'הילה שומרת היער רוצה שתכירו את חיות היער ואת הטבע לפני שנכנסים פנימה.', 'ללמוד שמות של חיות ושל הטבע.',
    '<b>Forest – יער</b><br><span class=en>fox 🦊 · owl 🦉 · bear 🐻 · wolf 🐺 · mushroom 🍄 · river 🏞️</span><br><span class=en>The fox lives in the forest.</span>',
    [{ m: 'hunter', cat: 'forest', n: 6 }, { m: 'listen', kind: 'word', cat: 'forest', n: 3 }, { m: 'builder', r: 4, n: 2 }], 'w_forest', '🦊', 'שועל קטן'),
  M('h2', 4, 'ofir', 'מזג האוויר של אופיר', 'אופיר חוזה מזג אוויר ביער לפי העננים והירח.', 'לתאר מזג אוויר ולהשתמש בתארים.',
    '<b>Weather – מזג אוויר</b><br><span class=en>rain 🌧️ · snow ❄️ · cloud ☁️ · moon 🌙 · star ⭐</span><br><span class=en>It is rainy and cold.</span>',
    [{ m: 'hunter', ids: ['rain', 'snow', 'cloud', 'moon', 'star', 'leaf'], n: 5 }, { m: 'grammar', topics: ['adj'], n: 4 }, { m: 'talk', r: 4, n: 3 }], 'w_weather', '🌙', 'אבן הירח'),
  M('h3', 4, 'shai', 'המטייל שי', 'שי הולך לאיבוד ושואל "איפה?" ו"מה?". עזרו לו להבין שאלות עם Wh.', 'לענות על שאלות Wh ולהשתמש במילות מקום.',
    '<b>WH + מילות מקום</b><br><span class=en>Where? What? Who? Why? When?</span><br><span class=en>in · on · under · next to · behind</span>',
    [{ m: 'grammar', topics: ['wh'], n: 4 }, { m: 'grammar', topics: ['prep'], n: 4 }, { m: 'talk', r: 4, n: 3 }], 'w_night', '🧭', 'מצפן'),
  M('h4', 4, 'yarden', 'ירדן וחיות הלילה', 'ירדן צופה בחיות הלילה ורוצה לדעת מה כל אחת יכולה ולא יכולה לעשות.', 'להשתמש ב-can / can\'t וב-Present Simple.',
    '<b>Can + Present Simple</b><br><span class=en>An owl can see in the dark.</span><br><span class=en>The fox lives in the forest.</span> (הוא גר, כל יום)',
    [{ m: 'cancant', n: 4 }, { m: 'grammar', topics: ['can'], n: 3 }, { m: 'grammar', topics: ['psimple'], n: 3 }, { m: 'builder', tag: 'can', r: 4, n: 2 }], 'w_can4', '🌟', 'כוכב ביער'),
  M('h5', 4, 'dror', 'דרור והלילה ביער', 'דרור מספר סיפור על לילה אחד ביער ומבקש שתקשיבו בזהירות.', 'לקרוא ולהקשיב לקטעים על היער.',
    '<b>קריאה והאזנה</b><br>חפשו מילים שאתם מכירים: owl, fox, bear, moon, rain.',
    [{ m: 'reading', pid: 'p5', n: 6 }, { m: 'listen', kind: 'passage', pid: 'p5', n: 3 }, { m: 'picture', r: 4, n: 2 }], 'w_night', '📜', 'מגילת היער'),
  M('h6', 4, 'owl', 'קרב מול הינשוף החכם', 'הינשוף החכם שומר על סוד היער ושואל חידות באנגלית. רק מי שמצליח יעבור אל הנמל!', 'לענות נכון על לפחות 70% מהשאלות, בלי רמזים.',
    '<b>מבחן מסכם</b><br>חיות ויער, מזג אוויר, שאלות Wh, מילות מקום, can וקריאה.', [], 'w_forest', '🦉', 'נוצת הינשוף', true),
  // ---------- Adventure Harbor ----------
  M('w1', 5, 'ran', 'הקפטן רן', 'הקפטן רן מכין את הספינה להפלגה ומחפש מישהו שיודע את שמות הים.', 'ללמוד מילים של ים ונמל.',
    '<b>Sea – ים</b><br><span class=en>sea 🌊 · boat ⛵ · ship 🚢 · whale 🐋 · crab 🦀 · island 🏝️</span><br><span class=en>The boat is on the sea.</span>',
    [{ m: 'hunter', cat: 'sea', n: 6 }, { m: 'missing', cat: 'sea', n: 1 }, { m: 'builder', r: 5, n: 2 }], 'w_sea', '⛵', 'סירת נייר'),
  M('w2', 5, 'dvora', 'הדייגת דבורה', 'דבורה תופסת דגים בכל בוקר ומבקשת שתתארו מה קורה עכשיו בנמל.', 'לתאר פעולות עכשיו ולהבדיל מ-Present Simple.',
    '<b>Simple או Continuous?</b><br><span class=en>She fishes every day.</span> (כל יום)<br><span class=en>She is fishing now.</span> (עכשיו)',
    [{ m: 'grammar', topics: ['pspc'], n: 4 }, { m: 'picture', r: 5, n: 3 }, { m: 'builder', tag: 'pc', r: 5, n: 2 }], 'w_boat', '🎣', 'חכה'),
  M('w3', 5, 'yoav', 'הסוחר יואב', 'יואב מוכר מפות וקונכיות בשוק של הנמל ושואל "יש לך...?".', 'לנהל שיחה בשוק ולהשתמש ב-and / but / because.',
    '<b>מילות קישור</b><br><span class=en>and · but · because · or</span><br><span class=en>I like fish, but I don\'t like crabs.</span>',
    [{ m: 'grammar', topics: ['conj'], n: 4 }, { m: 'hunter', ids: ['map', 'shell', 'treasure', 'anchor'], n: 4 }, { m: 'talk', r: 5, n: 3 }], 'w_map', '🗺️', 'מפת האוצר'),
  M('w4', 5, 'maya', 'מאיה והצלילה', 'מאיה מדריכת הצלילה רוצה לדעת מה כל חיית ים יכולה לעשות.', 'להשתמש ב-can ובשאלות עם Do / Does.',
    '<b>Can + Do/Does</b><br><span class=en>A dolphin can jump. Can a crab swim?</span><br><span class=en>Does the whale live in the sea? Yes, it does.</span>',
    [{ m: 'cancant', n: 4 }, { m: 'grammar', topics: ['dodoes'], n: 3 }, { m: 'grammar', topics: ['can'], n: 3 }, { m: 'talk', r: 5, n: 2 }], 'w_fish', '🐬', 'דולפין קטן'),
  M('w5', 5, 'tamir', 'הקריאה של תמיר', 'תמיר הדייג מספר על הדייגים ועל המגדלור, ושואל אתכם שאלות.', 'לקרוא ולהקשיב לסיפור על הנמל.',
    '<b>קריאה והאזנה</b><br>חפשו: when, where, who – ותענו לפי הטקסט.',
    [{ m: 'reading', pid: 'p6', n: 6 }, { m: 'listen', kind: 'passage', pid: 'p6', n: 3 }, { m: 'picture', r: 5, n: 2 }], 'w_sea', '🏮', 'פנס המגדלור'),
  M('w6', 5, 'pirate', 'קרב מול קפטן הפיראטים', 'קפטן הפיראטים חוסם את הדרך אל הממלכה ושואל חידות באנגלית. תנצחו אותו – והדרך תיפתח!', 'לענות נכון על לפחות 70% מהשאלות, בלי רמזים.',
    '<b>מבחן מסכם</b><br>מילים של הים, Simple/Continuous, מילות קישור, can וקריאה.', [], 'w_boat', '🏴‍☠️', 'דגל הפיראטים', true),
  // ---------- English Kingdom ----------
  M('k1', 6, 'ido', 'האביר עידו', 'האביר עידו שומר על שער הטירה ומלמד אתכם את שפת הממלכה.', 'ללמוד מילים של הממלכה ולבנות משפטים.',
    '<b>Kingdom – ממלכה</b><br><span class=en>king 🤴 · queen 👸 · castle 🏰 · crown 👑 · sword ⚔️ · dragon 🐉</span><br><span class=en>The king lives in a big castle.</span>',
    [{ m: 'hunter', cat: 'kingdom', n: 6 }, { m: 'builder', r: 6, n: 3 }, { m: 'listen', kind: 'word', cat: 'kingdom', n: 3 }], 'w_king', '🛡️', 'מגן האביר'),
  M('k2', 6, 'shira', 'שירה והמנגינות', 'שירה המשוררת של הממלכה שרה על כל מה שקורה בטירה. עזרו לה להשלים את השיר.', 'לחזור על Present Continuous ועל תארים.',
    '<b>חזרה</b><br><span class=en>The knight is holding a sword.</span><br><span class=en>The castle is old and beautiful.</span>',
    [{ m: 'grammar', topics: ['pcont'], n: 3 }, { m: 'grammar', topics: ['adj'], n: 3 }, { m: 'picture', r: 6, n: 3 }, { m: 'builder', tag: 'pc', r: 6, n: 2 }], 'w_castle', '🎵', 'נבל זהב'),
  M('k3', 6, 'alon', 'הקוסם אלון', 'הקוסם אלון מבלבל בין משפטים. תקנו את הטעויות כדי שהקסם יעבוד!', 'לתקן טעויות ולחזור על have / has ו-Simple / Continuous.',
    '<b>תיקון טעויות</b><br><span class=en>He can plays → He can play.</span><br><span class=en>She have → She has.</span>',
    [{ m: 'fix', n: 4 }, { m: 'grammar', topics: ['havehas'], n: 3 }, { m: 'grammar', topics: ['pspc'], n: 3 }, { m: 'builder', tag: 'have', r: 6, n: 2 }], 'w_magic', '🪄', 'שרביט הקסם'),
  M('k4', 6, 'queen', 'המלכה והגן', 'המלכה מטיילת בגן הטירה ושואלת שאלות Wh על הממלכה.', 'לענות על שאלות Wh ולהשתמש במילות מקום.',
    '<b>Wh + מקום</b><br><span class=en>Who lives in the castle? Where is the key?</span><br><span class=en>in · on · under · behind</span>',
    [{ m: 'grammar', topics: ['wh'], n: 4 }, { m: 'grammar', topics: ['prep'], n: 3 }, { m: 'talk', r: 6, n: 3 }, { m: 'cancant', n: 2 }], 'w_flag', '🌹', 'ורד המלכה'),
  M('k5', 6, 'king', 'המלך והסיפור הגדול', 'המלך מזמין אתכם לשמוע את סיפור הדרקון הקטן ולענות על שאלות.', 'לקרוא ולהקשיב לסיפור שלם.',
    '<b>קריאה והאזנה</b><br>קראו לאט. כל תשובה מופיעה בטקסט.',
    [{ m: 'reading', pid: 'p7', n: 6 }, { m: 'listen', kind: 'passage', pid: 'p7', n: 3 }, { m: 'reading', pid: 'p3', n: 2 }], 'w_castle', '📖', 'ספר הממלכה'),
  M('k6', 6, 'dragon', 'הקרב הגדול מול הדרקון', 'הדרקון הקטן שומר על אוצר הממלכה. רק מי ששולט באנגלית באמת יכול להתיידד איתו!', 'לענות נכון על לפחות 70% מהשאלות, בלי רמזים.',
    '<b>מבחן הגמר</b><br>כל מה שלמדתם: מילים, דקדוק, קריאה והאזנה. אתם יכולים!', [], 'w_end', '🐲', 'ביצת הדרקון', true),
];

export const NEW_NPCS = {
  // School Town (island centre x≈72)
  noa: { n: 'נועה', x: 70, z: -4.5, c: '#e0568a', h: '#3a2418' }, liat: { n: 'ליאת', x: 82, z: -3, c: '#f08a3a', h: '#a55a2a' }, rami: { n: 'רמי', x: 64, z: 8.5, c: '#2f8fd6', h: '#222' },
  nofar: { n: 'נופר', x: 81, z: 6, c: '#9b5cd6', h: '#7a3a2a' }, tomer: { n: 'תומר', x: 62, z: -4, c: '#4a9a6a', h: '#4a2f1b' }, principal: { n: 'המנהל', x: 76, z: 4, c: '#3b4a6b', h: '#aaa' },
  // Mystery Forest (centre x≈116)
  hila: { n: 'הילה', x: 106, z: -5, c: '#3f9a5a', h: '#6b3a22' }, ofir: { n: 'אופיר', x: 125, z: -8, c: '#6f5ad6', h: '#222' }, shai: { n: 'שי', x: 110, z: 8, c: '#d6803a', h: '#3a2418' },
  yarden: { n: 'ירדן', x: 124, z: 7, c: '#2fa6b8', h: '#d9a441' }, dror: { n: 'דרור', x: 117, z: -11, c: '#8a6a3a', h: '#4a2f1b' }, owl: { n: 'הינשוף החכם', x: 122, z: -4, c: '#8a6a4a', h: '#c9a070' },
  // Adventure Harbor (centre x≈160)
  ran: { n: 'הקפטן רן', x: 150, z: -5, c: '#2a4a8a', h: '#ddd' }, dvora: { n: 'דבורה', x: 155, z: 7, c: '#e0b13a', h: '#8a4a2a' }, yoav: { n: 'יואב', x: 168, z: 5, c: '#d66a3a', h: '#222' },
  maya: { n: 'מאיה', x: 165, z: -6, c: '#2fb8c0', h: '#3a2418' }, tamir: { n: 'תמיר', x: 160, z: -11, c: '#8a8a3a', h: '#6b4a2b' }, pirate: { n: 'קפטן הפיראטים', x: 160, z: 22, c: '#7a1f2a', h: '#222' },
  // English Kingdom (centre x≈204)
  ido: { n: 'האביר עידו', x: 194, z: -6, c: '#8a96a6', h: '#4a2f1b' }, shira: { n: 'שירה', x: 196, z: 7, c: '#e07ab0', h: '#d9a441' }, alon: { n: 'הקוסם אלון', x: 208, z: 8, c: '#4a3aa0', h: '#ccc' },
  queen: { n: 'המלכה', x: 214, z: -6, c: '#c0305a', h: '#d9a441' }, king: { n: 'המלך', x: 204, z: -5.5, c: '#d6a21f', h: '#aaa' }, dragon: { n: 'הדרקון הקטן', x: 214, z: 7, c: '#3aa05a', h: '#2a7a3a' },
};

export const NEW_REGIONS_FIX = [3, 4, 5, 6];
export const NEW_PORTRAITS = { noa: '👩‍🏫', liat: '👩‍🍳', rami: '🏃', nofar: '🎨', tomer: '👨‍🏫', principal: '🧑‍💼', hila: '🧝‍♀️', ofir: '🧙', shai: '🥾', yarden: '👩‍🔬', dror: '🧔', owl: '🦉', ran: '🧑‍✈️', dvora: '🎣', yoav: '🧑‍💼', maya: '🤿', tamir: '🧓', pirate: '🏴‍☠️', ido: '🛡️', shira: '🎵', alon: '🧙‍♂️', queen: '👸', king: '🤴', dragon: '🐲' };
