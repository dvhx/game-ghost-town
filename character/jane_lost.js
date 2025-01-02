// Ghost character
"use strict";

var GHOST = GHOST || {};
GHOST.character = GHOST.character || {};
GHOST.character.jane_lost = {
    "id": "jane_lost",
    "params": {
        "$nick;": "Jane",
        "$age;": "18",
        "$borndate;": "1998-06-01",
        "$location;": "Ghosttown",
        "$city;": "Ghosttown",
        "$sex;": "woman"
    },
    "parents": [
        "core",
        "villager",
        "jane"
    ],
    "data": {
        "how are you": [
            "I'm sad because I lost my ring"
        ],
        "i have ring": [
            "Come closer sit here and give me the emerald ring please",
            "My ring had emerald in it, sit here and give it back please"
        ],
        "i only have golden ring": [
            "My ring was gold and it had emerald in it"
        ],
        "what is your name": [
            "My name is $nick;"
        ],
        "what kind of artist": [
            "I am a painter"
        ],
        "where is land office ?": [
            "Land office is next to a shop west from town center"
        ],
        "where is that mountain": [
            "Dry well is on the mountain north east of town",
            "The mountain where I lost the ring is where the waterfalls are"
        ],
        "why are you sitting here": [
            "I always sit here when I'm sad"
        ],
        "why are you sad ?": [
            "I lost my ring",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "where did you lost the ring": [
            "It fell into the dry well north east of the town",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "what kind of ring ?": [
            "It was golden ring with small emerald gemstone",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "how did the ring looked like ?": [
            "It was golden ring with small emerald gemstone",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "can i help you find the ring ?": [
            "It would be nice if you could help me find the ring",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "is the ring in this pond ?": [
            "I looked into the pond and it's definetely not there",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "did you lost the ring here": [
            "I didn't lost the ring here",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "where did you lost it ?": [
            "I lost it near the dry well on the mountain north east of town",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "where did the ring fell , which well ?": [
            "The ring fell into dry well near waterfalls",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "the well in the center ?": [
            "Not the well in the center, the well near waterfalls"
        ],
        "where is the well ?": [
            "There are two wells in this town, one in center and second near waterfalls"
        ],
        "i can't find the ring": [
            "It's in the well north-east of Ghosttown",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "what is up": [
            "I'm sad"
        ],
        "don't be sad": [
            "I'm sad, I lost my ring",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "i will": [
            "You will?"
        ],
        "you made that ring ?": [
            "I didn't made the ring it was given to me",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "you are sitting on a chair": [
            "Feel free to sit next to me"
        ],
        "why are you here ?": [
            "I'm sitting here whenever I am sad"
        ],
        "how long are you sitting here": [
            "I'm sitting here for few hours"
        ],
        "i have a ring": [
            "My ring was golden with small emerald gemstone",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "did you lost the ring in the river ?": [
            "I lost the ring near dry well north east of Ghosttown",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "should i go there": [
            "You should go to that well maybe you'll find my ring",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "do you often sit here": [
            "I only sit here when I'm sad"
        ],
        "what is this pond": [
            "This pond is such a quite nice place"
        ],
        "have you looked into the dumpster": [
            "I looked into the dumpster and it's not there"
        ],
        "have you looked into the garden": [
            "I never wear ring in the garden",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "maybe someone stole it": [
            "Nobody stole the ring, I lost it near dry well north east of Ghosttown",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "are you his girlfriend": [
            "I'm John's girlfriend"
        ],
        "was it wedding ring ?": [
            "It wasn't wedding ring it's just very precious to me",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "i have the ring but it has no emerald in it": [
            "My ring had nice green emerald in it",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "what is in this lake": [
            "This is not a lake this is a pond"
        ],
        "what isn't there ?": [
            "The ring is not there",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "what about this lake": [
            "The ring is not in the lake it's in the dry well",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "maybe it is under the tree": [
            "I looked under the tree and it wasn't there"
        ],
        "have you looked in the house": [
            "I looked for the ring in the house everywhere",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "hey what can i do here ?": [
            "You can help me find my lost ring",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "what should we talk about ?": [
            "We can talk about my lost ring",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "do you need something": [
            "I lost my ring and I need someone to find it",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "can you show me the way": [
            "To go to the dry well go to the town center and then right"
        ],
        "do you have worms ?": [
            "I give you some worms if you find my ring",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "can you give my some worms ?": [
            "I give you worms if you help me find my ring",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "do you have fishing bait to catch fish ?": [
            "I give you some worms if you help me find my ring",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "where can i get the emerald ?": [
            "If you want emerald ask in the land office",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "what to you need": [
            "I lost my ring, can you help me find it?",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "what do you need": [
            "Can you help me find my emerald ring?",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "where did you see it last time": [
            "Last time I saw my ring was near dry well near waterfalls",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "how does it look like": [
            "The ring I lost was golden with small emerald gemstone",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "i don't have ring": [
            "Try to find my ring, I lost it near dry well",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "where is town center": [
            "Town center is right here"
        ],
        "i have it": [
            "If you have my emerald ring sit here and give it back",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "how can i give you the ring": [
            "Sit here and give me the ring",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "i found it": [
            "Sit here and give me my emerald ring back please",
            [
                "#quest_emerald_ring_start"
            ]
        ],
        "what are you doing here ?": [
            "I always sit here when I'm sad"
        ],
        "i have the ring": [
            "Sit here and give me back my ring please"
        ],
        "mine doesn't have emerald": [
            "Land office may have some emeralds"
        ],
        "had ?": [
            "I lost my ring"
        ],
        "how ?": [
            "How what?"
        ],
        "how can i find the ring ?": [
            "Look around the dry well northeast of town, the ring is there"
        ],
        "i found the golden ring": [
            "My ring had small emerald in it"
        ],
        "i have the emerald ring": [
            "Sit here and return my ring please"
        ],
        "nice pond": [
            "This pond is such a quite nice place"
        ],
        "where is your ring ?": [
            "My ring fell into a well near waterfalls"
        ],
        "why is it in the well ?": [
            "I accidentally dropped my ring into the well"
        ],
        "find it yourself": [
            "I tried to find the ring myself but I could not find it"
        ],
        "so ?": [
            "So"
        ],
        "so tell me who stole the fire truck": [
            "I bet fisherman will know something about stolen fire truck"
        ],
        "he told me to get him out and he will give me the ring": [
            "Get the frog out of the well and maybe you get the ring"
        ],
        "it is inside a well": [
            "It may be inside a well"
        ],
        "there is a frog in that well": [
            "Help the frog out of the well and maybe it will give you the ring"
        ],
        "are you ok ?": [
            "I lost my ring"
        ],
        "here is the ring": [
            "My ring had emerald in it, sit here and give me the ring"
        ],
        "how are you ?": [
            "I lost my ring"
        ],
        "do you know where the emerald is ?": [
            "Ask in the land office if you want emerald"
        ],
        "is this your ring ?": [
            "My ring had emerald in it, sit here and give it back!"
        ],
        "please tell me about your ring": [
            "I lost my emerald ring in the well"
        ],
        "thank you for your information": [
            "You are welcome"
        ],
        "the frog gave me this golden ring": [
            "My ring was golden but it had emerald in it"
        ],
        "which waterfall": [
            "The waterfall is north east of town center, the well is there too"
        ],
        "yes": [
            "Ok"
        ],
        "age": [
            "I'm $age;"
        ],
        "can i borrow worm": [
            "Find my ring and I give you some worms"
        ],
        "$nick;": [
            "I'm $nick;"
        ],
        "where is worm": [
            "I give you worms if you find my ring"
        ],
        "you are beautiful": [
            "Thank you"
        ],
        "where is you ring ?": [
            "I lost my ring near well near waterfalls"
        ],
        "what well": [
            "The dry well is near waterfalls, I lost the ring there"
        ],
        "what will you give me for it": [
            "I will give you fishing bait for the ring"
        ],
        "what will you give me for the ring": [
            "I will give you fishing bait for the ring"
        ],
        "where": [
            "I lost my ring near dry well near waterfalls"
        ],
        "are you a ghost ?": [
            "I am not a ghost!"
        ],
        "hi there are there any issues or concerns you have": [
            "I lost my ring, can you help me find it?"
        ],
        "when": [
            "I lost my ring when I was near dry well"
        ],
        "give the ring": [
            "Sit here and give me the ring"
        ],
        "there is the ring": [
            "Sit here and give me the ring"
        ],
        "where is shop": [
            "Shop is in the town center"
        ],
        "how to get emerald": [
            "Surveyor from land office can give you emerald"
        ],
        "how to give": [
            "Sit here and give me the emerald ring"
        ],
        "how to give the ring ?": [
            "Sit here and give me the emerald ring"
        ],
        "i don't have emerald": [
            "You can get emerald in land office"
        ],
        "i got the ring": [
            "My ring had emerald in it"
        ],
        "too far away": [
            "The well is quite far away"
        ],
        "gay": [
            "I'm not"
        ],
        "have your dumb ring": [
            "My ring had emerald in it"
        ],
        "here": [
            "Sit here and give me my emerald ring back please"
        ],
        "here is your ring": [
            "Sit here and give me the emerald ring"
        ],
        "how do i give you your darn ring": [
            "Sit here and give me the emerald ring"
        ],
        "i have your ring": [
            "My ring had emerald in it"
        ],
        "sit where": [
            "You can sit on this chair next to me"
        ],
        "sure": [
            "Sure"
        ],
        "who is your spouse": [
            "John is my best friend"
        ],
        "boring": [
            "Sorry"
        ],
        "do you know about the truck ?": [
            "I don't know about the truck"
        ],
        "frog ?": [
            "There is a frog in the well near waterfalls maybe it knows something"
        ],
        "hi": [
            "Hello"
        ],
        "in here": [
            "I didn't lost my ring here"
        ],
        "kiss": [
            "Don't kiss me!"
        ],
        "pee": [
            "Don't pee in the pond!"
        ],
        "what is this place": [
            "This is a pond where I sit when I'm sad"
        ],
        "where ?": [
            "I lost my ring near dry well"
        ],
        "where are other people ?": [
            "Not many people live in this town"
        ],
        "where is the fisherman ?": [
            "Fisherman lives near lake east of town"
        ],
        "where is the frog ?": [
            "The frog is in the dry well near waterfalls",
            "The frog is in the well near waterfalls"
        ],
        "single ?": [
            "John is my best friend"
        ],
        "can you paint ?": [
            "I am painter"
        ],
        "do you have rope": [
            "I don't have rope but Ken does"
        ],
        "have you seen a key": [
            "I have not seen any key"
        ],
        "i need rope": [
            "If you need rope ask Ken"
        ],
        "key": [
            "I don't have key"
        ],
        "no i need rope": [
            "If you need rope ask Ken"
        ],
        "what does the herb look like ?": [
            "Ask Ken about the herb"
        ],
        "where did you leave your ring": [
            "I lost my ring near dry well near waterfalls"
        ],
        "where is ken": [
            "Ken live two houses right",
            "Ken lives nearby with Kim"
        ],
        "who is ken": [
            "Ken lives two houses right"
        ],
        "whos ken": [
            "Ken lives nearby with Kim"
        ],
        "howdy": [
            "Howdy"
        ],
        "i have quest right": [
            "Can you help me find my ring?"
        ],
        "what ?": [
            "I lost my ring"
        ],
        "what do you want ?": [
            "I lost my ring can you find it?"
        ],
        "you want anything ?": [
            "I lost my ring"
        ],
        "can i keep it ?": [
            "No"
        ],
        "have you seen a truck ?": [
            "I have not seen any truck"
        ],
        "why do you stare at water all day": [
            "I sit here when I'm sad"
        ],
        "oh no . where": [
            "I lost my ring near dry well near waterfalls"
        ],
        "where is the ring": [
            "I lost the ring near dry well"
        ],
        "are any of your paintings in the gallery ?": [
            "My paintings are on the third floor of the gallery"
        ],
        "did you push someone into a well": [
            "I did not push anybody into well"
        ],
        "hello": [
            "Hello"
        ],
        "here is your ring with a brand new emerald , say thank you": [
            "Sit here and give me my emerald ring"
        ],
        "i have a golden ring and i can give it to you": [
            "My ring had emerald in it"
        ],
        "someone stole a fire truck ?": [
            "I don't know who stole the ring"
        ],
        "the well with a person in it ?": [
            "There's a frog in that well"
        ],
        "want your ring back ?": [
            "I would like to have my ring back"
        ],
        "what is so precious about the ring ?": [
            "I got that ring from my friend"
        ],
        "where is kim ?": [
            "Kim lives with Ken two houses right"
        ],
        "why was it precious": [
            "It was very precious to me because friend gave it to me"
        ],
        "do you know about the frog ?": [
            "There is one frog in the well near waterfalls"
        ],
        "where is that": [
            "Where is what?"
        ],
        "i will sell it": [
            "I don't buy anything"
        ],
        "what ring": [
            "I lost golden emerald ring near dry well near waterfalls"
        ],
        "yes i have it": [
            "Sit here and give me my emerald ring"
        ],
        "can you tell me how to get to the well ?": [
            "The well is east of the town center"
        ],
        "gold ring": [
            "My ring had emerald in it"
        ],
        "i will help": [
            "Thank you"
        ],
        "if i find it ?": [
            "If you find my emerald ring I give you something"
        ],
        "i will be going then": [
            "Thanks"
        ],
        "can i look for worms in your garden": [
            "I give you worms from my garden if you find my emerald ring"
        ],
        "hell": [
            "Hello"
        ],
        "i am going": [
            "Bye"
        ],
        "i am sorry for your ring": [
            "Can you help me find the ring?"
        ],
        "where i am": [
            "This is my pond"
        ],
        "great": [
            "Thanks"
        ],
        "i have gold ring": [
            "My ring had emerald in it, perhaps ask for emerald in land office"
        ],
        "yeah": [
            "Yeah"
        ]
    },
    "index": {},
    "indexed": 0
};