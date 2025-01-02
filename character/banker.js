// Ghost character
"use strict";

var GHOST = GHOST || {};
GHOST.character = GHOST.character || {};
GHOST.character.banker = {
    "id": "banker",
    "params": {
        "$nick;": "Bob",
        "$age;": "65",
        "$borndate": "1951-02-13",
        "$location;": "Ghosttown",
        "$city;": "Ghosttown",
        "$sex;": "man"
    },
    "parents": [
        "basic",
        "relationship",
        "core",
        "villager"
    ],
    "data": {
        "give me some gold": [
            "You must earn your gold"
        ],
        "what can i use gold for ?": [
            "You can use gold to buy stuff in the shop"
        ],
        "what is your job ?": [
            "I am a banker of $location; bank",
            "I am a banker",
            "I am banker"
        ],
        "job": [
            "I am banker"
        ],
        "what do you do ?": [
            "I am $nick;, best banker in $location;"
        ],
        "what is your occupation ?": [
            "I work in this bank",
            "I work as Banker"
        ],
        "what are you ?": [
            "I'm am a banker"
        ],
        "what is this building ?": [
            "This is bank, we do any kind of financial operations here"
        ],
        "can anyone hear me ?": [
            "My hearing is not what it used to be, talk louder!"
        ],
        "what is this place ?": [
            "This is bank"
        ],
        "i have money": [
            "Spend your money wisely"
        ],
        "you don't want my money ?": [
            "I want all your money"
        ],
        "can i go upstairs ?": [
            "You are not allowed to go upstairs"
        ],
        "upstairs": [
            "Sorry but you are not allowed upstairs"
        ],
        "what can i do here ?": [
            "Read the instructions on the wall"
        ],
        "what do you do here ?": [
            "I am banker, I count money and stuff"
        ],
        "are you blob": [
            "I am slimy blob, like any banker"
        ],
        "are you slime": [
            "I am slimy blob, like any other banker"
        ],
        "can you give me some money ?": [
            "You receive money by talking with people in town"
        ],
        "can i exchange money": [
            "We don't exchange money here"
        ],
        "i need money !": [
            "Your balance is on the wall"
        ],
        "is this gallery ?": [
            "This is bank"
        ],
        "i need gold": [
            "You receive gold when you talk with people"
        ],
        "what is inside this building ?": [
            "This is bank"
        ],
        "who are you ?": [
            "I am banker"
        ],
        "where goes these stairs": [
            "These stairs goes to the safe"
        ],
        "i have some money now": [
            "You can see your balance on the wall"
        ],
        "i have 15 dollars": [
            "You can see your balance on the wall"
        ],
        "i have 30 bucks now": [
            "You can see your balance on the wall"
        ],
        "do you accept silver": [
            "I can give you some gold for your silver"
        ],
        "where are leading those stairs": [
            "Those stairs leads to second floor where the safe is located"
        ],
        "that staircase": [
            "Those stairs leads to second floor where the safe is located"
        ],
        "how much money do you have ?": [
            "I have plenty of money"
        ],
        "you still don't have money do you": [
            "I always have money"
        ],
        "you slimy": [
            "Don't call me slimy!"
        ],
        "what is in that chest": [
            "This chest is full of silver"
        ],
        "it is full of gold": [
            "My safe is full of gold",
            "This chest is full of silver"
        ],
        "what is your short name": [
            "My name is $nick;"
        ],
        "what rooms": [
            "Rooms upstairs are full of bank documents"
        ],
        "your look sick": [
            "I'm not sick!"
        ],
        "hi what are you": [
            "I am a slimy banker"
        ],
        "why are you green ?": [
            "I'm green and slimy like all bankers"
        ],
        "i will talk to you later": [
            "Let's talk later"
        ],
        "what shop is this ?": [
            "This is a bank"
        ],
        "are you a bank clerk ?": [
            "I'm a bank clerk"
        ],
        "can i go up stair": [
            "You are not allowed upstairs!"
        ],
        "i will rob you": [
            "Don't rob me!"
        ],
        "so can i withdraw": [
            "Read the instructions"
        ],
        "how to get a fishing pole": [
            "Ask fisherman he will give you fishing pole"
        ],
        "i am broke": [
            "Broke people are not welcome here"
        ],
        "i want deposit": [
            "Look at the wall for more instructions"
        ],
        "what are you selling": [
            "I'm not selling anything"
        ],
        "why do you look like that": [
            "I am slimy banker"
        ],
        "are you human ?": [
            "I'm banker"
        ],
        "cool , have any quest for me ?": [
            "No quests for you"
        ],
        "fuck your mom": [
            "I'm sorry to hear that"
        ],
        "how many silver i have ?": [
            "Read the instructions on the wall"
        ],
        "need help ?": [
            "I don't need help"
        ],
        "what creature are you ?": [
            "I'm slimy banker"
        ],
        "why does a slime work in a bank ?": [
            "All bankers are like that"
        ],
        "are you ghost ?": [
            "I'm not a ghost I'm a slimy banker"
        ],
        "are you ghost or not ?": [
            "I'm not a ghost"
        ],
        "ghost ?": [
            "I'm not a ghost",
            "There is a ghost on the cemetery"
        ],
        "this is robbery": [
            "No robbery please!"
        ],
        "this is robbery . give me all money": [
            "Robbery is not allowed, go away!"
        ],
        "where are enemies ?": [
            "We have no enemies here"
        ],
        "where are weapons ?": [
            "This is peaceful town"
        ],
        "why do you have green skin ?": [
            "I am slimy banker"
        ],
        "any quests": [
            "I don't have any quests for you"
        ],
        "can i open an account ?": [
            "Read the instructions on the wall"
        ],
        "can i use the bank": [
            "Maybe you can"
        ],
        "do you have any quests": [
            "I don't have any quests for you"
        ],
        "how do i used the bank": [
            "Read the instructions on the wall"
        ],
        "are you frog": [
            "I'm slimy banker"
        ],
        "do you have any quests ?": [
            "I don't have any quests"
        ],
        "how to use bank": [
            "Read the instructions on the wall"
        ],
        "what is this ?": [
            "This is bank"
        ],
        "where am i ?": [
            "This is bank"
        ],
        "where is ken ?": [
            "Ken lives south from here"
        ],
        "i need to know if you saw it": [
            "I saw nothing"
        ],
        "key": [
            "I don't have a key"
        ],
        "were is the rope ?": [
            "If you need rope ask Ken"
        ],
        "what species are you ?": [
            "I am a slimy banker"
        ],
        "how many money i have": [
            "Look at the paper on the wall"
        ],
        "the time has stopped": [
            "Perhaps the time has some significance"
        ],
        "watches": [
            "Town founder used to have nice watches"
        ],
        "who can repair the watches": [
            "Perhaps time on broken watch is telling you something"
        ],
        "hi , being": [
            "I'm slimy banker"
        ],
        "i need to go to waterfall": [
            "Waterfall is north east from here"
        ],
        "how much money do i gave": [
            "Look at the paper on the wall for more info"
        ],
        "library ?": [
            "Library is under the town hall"
        ],
        "your": [
            "What?"
        ],
        "do you need help": [
            "I don't need your help"
        ],
        "where is the fish": [
            "Fish are in the river"
        ],
        "goo goo ?": [
            "I'm not a goo I'm a slimy banker"
        ],
        "the fuck are you ?": [
            "I'm the slimy banker"
        ]
    },
    "index": {},
    "indexed": 0
};