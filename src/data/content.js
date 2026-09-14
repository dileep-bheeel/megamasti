export const quizBanks = {
  quizWorld:[
    {q:"Which city spans two continents?",options:["Istanbul","Cairo","Lisbon","Seoul"],answer:0,why:"Istanbul lies on both Europe and Asia, divided by the Bosphorus."},
    {q:"Which desert is the world’s largest hot desert?",options:["Gobi","Kalahari","Sahara","Thar"],answer:2,why:"The Sahara covers much of North Africa and is the largest hot desert."},
    {q:"What causes the Northern Lights?",options:["Moonlight","Solar particles","Ocean tides","Volcanic dust"],answer:1,why:"Charged particles from the Sun interact with gases in Earth’s atmosphere."}
  ],
  quizSouthAsia:[
    {q:"The ancient city of Mohenjo-daro developed beside which river system?",options:["Indus","Ganges","Narmada","Godavari"],answer:0,why:"Mohenjo-daro was a major urban centre of the Indus civilisation."},
    {q:"Which language family includes Sindhi, Punjabi and Bengali?",options:["Dravidian","Indo-Aryan","Sino-Tibetan","Austronesian"],answer:1,why:"All three belong to the Indo-Aryan branch of Indo-European languages."},
    {q:"The Sundarbans are best known for which ecosystem?",options:["Alpine meadow","Mangrove forest","Coral atoll","Cold desert"],answer:1,why:"The Sundarbans form the world’s largest continuous mangrove forest."}
  ],
  quizHistory:[
    {q:"Which source is usually primary evidence?",options:["A modern textbook","A letter written during the event","A documentary recreation","A later biography"],answer:1,why:"A contemporary letter was created during the period being studied."},
    {q:"Why did many early cities develop near rivers?",options:["Only for defence","Water, farming and trade","Cooler winters","Fewer insects"],answer:1,why:"Rivers supported agriculture, transport, drinking water and exchange."},
    {q:"What does archaeology study most directly?",options:["Future predictions","Material remains","Only royal families","Modern elections"],answer:1,why:"Archaeologists interpret objects, structures and environmental evidence."}
  ],
  quizNature:[
    {q:"Removing a top predator often causes what?",options:["No change","A trophic cascade","Instant rainfall","New minerals"],answer:1,why:"Predator loss can alter prey numbers and affect the whole food web."},
    {q:"Why are mangroves valuable to coastal communities?",options:["They increase waves","They reduce erosion and shelter wildlife","They remove all salt","They create deserts"],answer:1,why:"Their roots stabilize shorelines and create nursery habitats."},
    {q:"Which relationship benefits both species?",options:["Mutualism","Parasitism","Predation","Competition"],answer:0,why:"In mutualism, both participating species gain a benefit."}
  ],
  quizGeneral:[
    {q:"Which invention made accurate sea navigation easier by measuring longitude?",options:["Barometer","Marine chronometer","Microscope","Telegraph"],answer:1,why:"Accurate time at sea allowed navigators to calculate longitude."},
    {q:"What is the main purpose of encryption?",options:["Compress images","Protect readable information","Increase screen brightness","Sort files"],answer:1,why:"Encryption converts information into a protected form requiring a key."},
    {q:"Which organ uses the most energy relative to its weight?",options:["Skin","Brain","Lungs","Kidneys"],answer:1,why:"The brain is energy-intensive despite representing a small share of body mass."}
  ]
};

export const prompts = {
  detective:[
    {title:"The Silent Gallery",setup:"A rare miniature vanished during a nine-minute power cut. Three people remained inside.",clues:["The curator says she used her phone torch, but her battery report shows the phone was off.","The guard logged the emergency exit at 8:14.","Fresh varnish was found on the curator’s glove."],question:"Which detail most directly contradicts a statement?",options:["The exit log","The battery report","The varnish"],answer:1,why:"The phone being off contradicts the curator’s specific claim that she used its torch."},
    {title:"The Missing Blueprint",setup:"A sealed design vanished from a studio where only three keycards worked.",clues:["Every keycard entry was logged.","The printer produced one unclaimed page.","A mirror faced the keypad from the corridor."],question:"What should investigators examine first?",options:["The weather","The printer job history","Everyone’s handwriting"],answer:1,why:"The unclaimed print may reveal whether the document was copied rather than physically removed."}
  ],
  story:{
    characters:["a retired cartographer","a fearless school debater","a musician who hears memories","a robot trained on folk tales","a chef who cannot taste"],
    worlds:["a city where shadows vote","a library aboard a night train","a floating market during a solar eclipse","a village that appears once a decade","a museum of unfinished inventions"],
    conflicts:["must return something nobody remembers losing","discovers tomorrow’s newspaper","is followed by a door that opens anywhere","must win without telling the truth","has one hour to change an old promise"],
    twists:["the rival has been protecting them","the map is drawn from a memory","the apparent prize is a warning","the narrator caused the mystery","the final choice changes the beginning"]
  },
  debate:["Homework should be replaced by independent projects.","Cities should reserve one day each week for car-free streets.","Failure should be graded as part of learning.","Museums should return important objects to their places of origin."],
  caption:["A goat standing confidently at a bus stop","A wedding photographer running through unexpected rain","Three grandparents intensely studying a smartphone","A cricket ball resting inside a teacup"],
  inventions:[
    ["an umbrella","a bicycle","help people save water"],
    ["a lunchbox","a solar panel","keep a neighbourhood cool"],
    ["a kite","a sensor","make streets safer at night"],
    ["a bookshelf","a wheel","help someone learn a language"]
  ],
  charades:["A detective who is afraid of clues","A cricket commentator at a silent match","A chef cooking during an earthquake","A tourist asking directions from a statue"],
  forbidden:[
    {word:"Internet",banned:["online","web","computer","phone"]},
    {word:"Monsoon",banned:["rain","season","cloud","water"]},
    {word:"Democracy",banned:["vote","government","people","election"]},
    {word:"Memory",banned:["remember","brain","past","forget"]}
  ],
  missions:["Make someone say the word ‘exactly’.","Get two players to copy your hand position.","Ask a question that everyone answers differently.","Convince the group to change seats without revealing why."],
  feud:[
    {q:"Name something families carry on a long train journey.",answers:[["Food",35],["Water",25],["Bedding",15],["Cards or games",10],["Chargers",8]]},
    {q:"Name a reason someone checks their phone immediately after waking.",answers:[["Messages",34],["Time",27],["Notifications",19],["Weather",8],["Alarm",7]]}
  ]
};

export const chessLessons = [
  {title:"How the board speaks",body:"Files run a–h, ranks run 1–8, and the lower-right square is always light. White moves first."},
  {title:"Control the centre",body:"Central squares give pieces more options. Develop knights and bishops before launching an attack."},
  {title:"Protect the king",body:"Castle early when safe. A material advantage means little if your king can be forced into checkmate."},
  {title:"Checks, captures, threats",body:"Before every move, examine forcing options for both players in that order."}
];
