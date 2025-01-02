// Quest commands
"use strict";
// globals: document, window, setTimeout, setInterval, GHOST, Android, navigator

var SC = window.SC || {}
SC.commands = SC.commands || {};

SC.commands["#quest_rocks_start"] = {
    "summary": "Start quest for finding 3 rocks",
    "hidden": true,
    "commands": [
        '#progress start rocks',
        '#quests add rocks "Find 3 piles of rocks"',
        '#inventory set tag:rocks 1'
    ]
};

SC.commands["#quest_emerald_ring_start"] = {
    "summary": "Start emerald ring quest",
    "hidden": true,
    "commands": [
        '#progress start emerald_ring',
        '#quests add ring "Find Jane\'s emerald ring"'
    ]
};

SC.commands["#quest_rocks_nothing"] = {
    "summary": "Failed to pick up rocks",
    "hidden": true,
    "commands": [
        '#inventory require tag:rocks 1',
        '#lock on',
        '#center',
        '#button Search rocks',
        '#delay 500',
        '#bubble "Nothing interesting here, maybe some other place"',
        '#clearevent',
        '#map save',
        '#lock off'
    ]
};

SC.commands["#quest_rocks_pick"] = {
    "summary": "Picking up rocks",
    "hidden": true,
    "commands": [
        '#inventory require tag:rocks 1',
        '#lock on',
        '#center',
        '#button Search here',
        '#delay 500',
        '#bubble "These rocks looks interesting"',
        '#clearevent',
        '#groundremove rocks',
        '#inventory add rocks 1',
        '#blink "+1 rocks"',
        '#quests inc rocks 30',
        '#map save',
        '#lock off'
    ]
};

SC.commands["#quest_rocks_skip"] = {
    "summary": "If player have crystals without rocks, skip the rocks and go directly to crystals quest",
    "hidden": true,
    "callback": function (aParams) {
        if (SC.inventory.amount('crystals') >= 3) {
            SC.cmd.run('#quest_crystals_give');
            return;
        }
        // run next command
        SC.cmd.run(aParams);
    }
};

SC.commands["#quest_rocks_give"] = {
    "summary": "Giving rocks to Sue, reward is pickaxe",
    "hidden": true,
    "commands": [
        '#quest_rocks_skip',
        '#inventory require rocks 3',
        '#lock on',
        '#center',
        '#givebutton rocks 3',
        '#inventory set tag:rocks 1', // picking now may not start quest
        '#inventory remove rocks 3',
        '#npcbubble sue "Very nice rocks" #delay 3000',
        '#npcbubble sue "I\'m gonna analyze them now" #delay 3000',
        '#npcbubble sue "I\'ll give you old pickaxe for them" #delay 3000',
        '#inventory add pickaxe 1',
        '#blink "+1 pickaxe"',
        '#npcbubble sue "By the way, Ken told me he saw some large crystals in his basement" #delay 5000',
        '#npcbubble sue "Can you bring me some big crystals?" #delay 3000',
        '#npcchange sue surveyor_crystals ghosttown 33 52 girl-down',
        '#progress finish rocks',
        '#map save',
        '#event ( #quest_crystals_give )',
        '#map save',
        '#reread',
        '#quests progress rocks 100',
        '#quests add crystals "Find 3 crystals"',
        '#progress start crystals',
        '#lock off'
    ]
};

SC.commands["#quest_crystals_give"] = {
    "summary": "Give crystals to Sue, reward is emerald",
    "hidden": true,
    "commands": [
        '#inventory require crystals 3',
        '#lock on',
        '#center',
        '#givebutton crystals 3',
        '#inventory remove crystals 3',
        '#npcbubble sue "Wow those are really big crystals" #delay 3000',
        '#npcbubble sue "I give you this emerald gemstone for it" #delay 3000',
        '#npcbubble sue "It\'s not very big but maybe you can put it in the ring" #delay 3000',
        '#inventory add emerald 1',
        '#blink "+1 emerald"',
        '#clearevent',
        '#npcchange sue surveyor ghosttown 33 52 girl-down',
        '#map save',
        '#quests progress crystals 100',
        '#quests add ring "Find Jane\'s emerald ring"',
        '#quests progress ring 50',
        '#quest_combine_emerald_ring',
        '#reread',
        '#progress finish crystals',
        '#lock off'
    ]
};

SC.commands["#quest_crystals_pick"] = {
    "summary": "Picking up crystals with pickaxe",
    "hidden": true,
    "commands": [
        '#bubble "This crystal is stuck to the ground"',
        '#inventory require tag:rocks 1',
        '#inventory require pickaxe 1',
        '#lock on',
        '#center',
        '#usebutton pickaxe 1',
        '#inventory add crystals 1',
        '#blink "+1 crystal"',
        '#groundremove crystals',
        '#quests inc crystals 30',
        '#clearevent',
        '#bubble "Yay, crystal was freed from the ground!" #delay 3000',
        '#map save',
        '#lock off'
    ]
};

SC.commands["#quest_library_bars"] = {
    "summary": "Unlocking doors to the library",
    "hidden": true,
    "commands": [
        '#lock on',
        '#center',
        '#looking up',
        '#bubble "It\'s locked!"',
        '#usebutton key 1',
        '#bubbleclear player',
        '#delay 300',
        '#ground "floor4 bars2" 3 0 #delay 400',
        '#ground "floor4 bars3" 3 0 #delay 400',
        '#ground "floor4 bars4" 3 0 #delay 400',
        '#cleareventxy 3 1',
        '#cleareventxy 3 0',
        '#move up',
        '#event ( #goto library #delay 500 #ending )',
        '#move down',
        '#bubble "It\'s open!"',
        '#quests progress library 50',
        '#lock off',
        '#map save'
    ]
};

SC.commands["#quest_library_pick"] = {
    "summary": "Read the book of spells in the library",
    "hidden": true,
    "commands": [
        '#looking down',
        '#lock on',
        '#center',
        '#bubble "There is some book!" #delay 3000',
        '#bubble "It\'s a book of spells!" #delay 3000',
        '#event ( #looking down #help more )',
        '#help more',
        '#lock off',
        '#quests progress library 100',
        '#progress finish library',
        '#map save'
    ]
};

SC.commands["#quest_combine_emerald_ring"] = {
    "summary": "Combine ring and emerald into emerald ring",
    "hidden": true,
    "commands": [
        '#inventory require ring 1',
        '#inventory require emerald 1',
        '#lock on',
        '#center',
        '#transaction start ( #quest_combine_emerald_ring )',
        '#button "Combine" "Ring + Emerald"',
        '#inventory add emerald_ring 1',
        '#inventory remove ring 1',
        '#inventory remove emerald 1',
        '#blink "+1 Emerald ring"',
        '#bubble "Emerald fits the ring perfectly" #delay 3000',
        '#bubble "I must return it to Jane"',
        '#quests progress ring 90',
        '#transaction finish ( #quest_combine_emerald_ring )',
        '#lock off'
    ]
};

SC.commands["#quest_ring_no_emerald"] = {
    "summary": "Make Jane say her ring had emerald in it if user only have golden ring",
    "hidden": true,
    "callback": function (aParams) {
        if (SC.inventory.amount('ring') >= 1) {
            SC.cmd.run('#npcbubble Jane "My ring had emerald in it"');
        }
        // run next command
        SC.cmd.run(aParams);
    }
};

SC.commands["#quest_give_ring"] = {
    "summary": "Give emerald ring to Jane",
    "hidden": true,
    "commands": [
        '#quest_ring_no_emerald',
        '#inventory require emerald_ring 1',
        '#bubbleclear Jane',
        '#lock on',
        '#center',
        '#givebutton emerald_ring 1',
        '#inventory remove emerald_ring 1',
        '#inventory add worms 3',
        '#clearevent',
        '#cleareventxy 44 64',
        '#npcbubble Jane "That\'s my ring!" #delay 3000',
        '#npcbubble Jane "Thank you very much!" #delay 3000',
        '#blink "+3 Worms"',
        '#npcbubble Jane "I give you few worms from my garden" #delay 4000',
        '#npcbubble Jane "Worms are excellent fishing bait" #delay 4000',
        '#npcbubble Jane',
        '#npcwalk Jane LULUUUURd',
        '#npcchange Jane jane_found ghosttown 43 59 girl-down',
        '#map save',
        '#reread',
        '#quests progress ring 100',
        '#quests add fishing "Help fisherman catch 3 fish"',
        '#progress finish emerald_ring',
        '#lock off'
    ]
};

SC.commands["#quest_jail_break_in"] = {
    "summary": "Break into jail from Ken's basement using pickaxe",
    "hidden": true,
    "commands": [
        '#looking up',
        '#bubble "There are some cracks on the wall"',
        '#inventory require pickaxe 1',
        '#lock on',
        '#center',
        '#usebutton pickaxe 1',
        '#bubbleclear player',
        '#delay 500',
        // dig tunnel up
        '#move up',
        '#ground "mud rocks"',
        '#move up',
        '#ground "cavewall"',
        '#move left #ground "shore6"',
        '#move up #move right #ground "shore2"',
        '#move right #move down #ground "shore4"',
        '#move left',
        '#move down',
        // define new event here that will trasfer us to jail
        '#event ( #quest_jail_ladder )',
        //'#event ( #looking up #delay 300 #goto under_hole jail2 )',
        // go back
        '#move down',
        '#clearevent',
        // save map
        '#map save',
        '#lock off',
        // say something
        '#delay 1000',
        '#bubble "The wall collapsed with one swing of pickaxe" #delay 3000',
        '#bubble "There is hole in the ceiling" #delay 3000',
        '#bubble "I\'m gonna need a ladder"',
        '#quests add prison "Prison break"',
        '#quests progress prison 50',
        // If we have ladder trigger the rest of the break in now (otherwise player needs to step there)
        "#inventory require ladder 1",
        "#quest_jail_ladder"
    ]
};

SC.commands["#quest_jail_ladder"] = {
    "summary": "Use ladder to climb up into the jail",
    "hidden": true,
    "commands": [
        // require ladder
        '#looking up',
        '#bubble "I\'m gonna need a ladder"',
        "#inventory require ladder 1",
        '#bubbleclear player',
        // move to jail
        '#lock on',
        // make sure hole is instantly visible (hack)
        '#goto hole jail2',
        '#ground "floor3 hole"',
        '#goto under_hole jail2',
        // this will prevent player going back up
        '#delay 1000',
        // get watches from peter
        '#quest_jail_watches'
    ]
};

SC.commands["#quest_jail_watches"] = {
    "summary": "Receive watches from Peter after prison break",
    "hidden": true,
    "commands": [
        // only once
        '#lock on',
        '#inventory require tag:watches 0',
        // move to jail
        '#goto hole jail2',
        '#ground "floor3 hole"',
        '#npcchange Peter mute jail2 5 1 boy-down',
        '#goto under_hole jail2',
        '#delay 1000',
        '#npcbubble Peter "Wow, you really break in to this prison!" #delay 3000',
        '#npcbubble Peter "I spent in this jail 2 years" #delay 3000',
        '#npcbubble Peter "Here are golden watches" #delay 3000',
        '#inventory add watches 1',
        '#inventory add tag:watches 1',
        '#npcbubble Peter "They belonged to the Ghosttown founder" #delay 3000',
        '#npcbubble Peter "I was hiding these watches... somewhere" #delay 3000',
        '#npcbubble Peter "Now they are yours" #delay 3000',
        '#npcbubble Peter "I\'m outta here!" #delay 3000',
        '#npcwalk Peter L',
        '#npcchange Peter mute jail2 5 0 invisible',
        '#blink "+1 watches" #delay 500',
        '#bubble "Damn, these watches are broken" #delay 3000',
        '#bubble "They stopped at exactly 8:25pm"',
        '#map save',
        '#reread',
        '#quests add prison "Prison break"',
        '#quests progress prison 100',
        '#quests add skeleton "Help skeleton find it\'s grave"',
        '#progress finish jail',
        '#lock off'
    ]
};

SC.commands["#quest_skeleton_barrier"] = {
    "summary": "Break into jail from Ken's basement using pickaxe",
    "hidden": true,
    "commands": [
        '#looking up',
        '#progress start tomb',
        '#bubble "There is some kind of barrier!"',
        '#quests progress skeleton 10',
        '#inventory require watches 1',
        '#lock on',
        '#center',
        '#bubble "Barrier is still there. The founder\'s watches stopped at 8:25pm, I wonder why?"',
        // enters tomb only at 8:25pm
        //'#iftime 20:25',

        // enters tomb at any hour but only 25 minute, this is to simplify testing
        '#ifminute 25',

        '#bubble "The barrier dissapeared!"',
        '#delay 3000',
        '#bubbleclear player',
        '#event ( #quest_skeleton_tomb )',
        '#map save',
        '#goto tomb2',
        '#quests progress skeleton 50',
        '#lock off',
        '#nop'
    ]
};

SC.commands["#quest_skeleton_give_watches"] = {
    "summary": "After ghost told player about watches, user will give skeleton watches, the skeleton will return to the tomb",
    "hidden": true,
    "commands": [
        '#inventory require tag:founder 1',
        '#inventory require watches 1',
        '#lock on',
        '#center',
        '#givebutton watches 1',
        '#inventory remove watches 1',
        '#npcbubble Skeleton "Oh! These are my watches" #delay 3000',
        '#npcbubble Skeleton "I remember now" #delay 3000',
        '#npcbubble Skeleton "I am the founder of Ghosttown" #delay 3000',
        '#npcbubble Skeleton "Thank you and follow me" #delay 3000 #bubbleclear Skeleton',
        '#npcwalk Skeleton RRUUU',
        '#npcchange Skeleton founder_skeleton tomb 3 3 skeleton-down',
        '#inventory add tag:skeleton 1',
        '#clearevent',
        '#map save',
        '#quests progress skeleton 70',
        '#reread',
        '#lock off',
        '#nop'
    ]
};

SC.commands["#quest_skeleton_tomb"] = {
    "summary": "Use enters the tomb and finishes the quest",
    "hidden": true,
    "commands": [
        '#goto tomb2',
        '#inventory require tag:skeleton 1',
        '#lock on',
        '#center',
        '#npcchange Skeleton mute tomb 3 3 skeleton-down',
        '#npcchange Ghost mute tomb 5 3 ghost-down',
        '#npcbubble Skeleton "Thanks for helping me" #delay 3000 #bubbleclear Skeleton',
        '#npcbubble Ghost "Thanks for helping us!" #delay 3000 #bubbleclear Ghost',
        '#npcbubble Skeleton "I can now finally rest in peace" #delay 3000 #bubbleclear Skeleton',
        '#npcbubble Ghost "I will give you special key" #delay 3000 #bubbleclear Ghost',
        '#inventory add key 1',
        '#blink "+1 key"',
        '#delay 2000',
        '#npcwalk Skeleton Rd',
        '#npcwalk Ghost Ld',
        '#npcchange Ghost mute tomb 3 3 invisible',
        '#delay 1000',
        '#npcchange Skeleton mute tomb 4 3 boy-sleep',
        '#inventory remove tag:skeleton 1',
        '#map save',
        '#reread',
        '#lock off',
        '#quests progress skeleton 100',
        '#quests add library "Open town hall library"',
        '#progress finish tomb',
        '#nop'
    ]
};

SC.commands["#quest_fish_receive_rod"] = {
    "summary": "On certain questions fisherman will give user old fishing rod",
    "hidden": true,
    "commands": [
        '#npcbubble Fred "I already gave you fishing rod"',
        '#inventory require fishing_rod 0',
        '#npcbubble Fred "I\'ll borrow you my best fishing rod"',
        '#inventory add fishing_rod 1',
        '#progress start fishing',
        '#blink "+1 fishing rod"'
    ]
};

SC.commands["#quest_fish_left"] = {
    "summary": "Catch fish on the left of where player is standing",
    "hidden": true,
    "commands": [
        '#lock on',
        '#center',
        '#bubble "I\'m gonna need fishing rod"',
        '#inventory require fishing_rod 1',
        '#bubble "I\'m gonna need some fishing bait"',
        '#inventory require worms 1',
        '#bubbleclear Player',
        '#button Try "fishing here"',
        '#quest_fish_left_move',
        '#move left',
        '#groundremove fish-up',
        '#groundremove fish-up-walk1',
        '#groundremove fish-up-walk2',
        '#move right',
        '#bubble "Yes! I cought one!"',
        '#inventory remove worms 1',
        '#inventory add fish 1',
        '#blink "+1 fish"',
        '#clearevent',
        '#quests inc fishing 20',
        '#lock off',
        '#map save'
    ]
};

SC.commands["#quest_fish_left_move"] = {
    "summary": "Shortly animate fish on the left moving tail",
    "hidden": true,
    "commands": [
        '#move left #ground "water water2 fish-up-walk1 splash1" #move right #delay 200',
        '#move left #ground "water water2 fish-up splash2" #move right #delay 200',
        '#move left #ground "water water2 fish-up-walk2" #move right #delay 200',
        '#move left #ground "water fish-up water2 splash1" #move right #delay 200',
        '#move left #ground "water fish-up-walk1 water2 splash2" #move right #delay 200',
        '#move left #ground "water fish-up water2" #move right #delay 200'
    ]
};

SC.commands["#quest_fish_left_fail"] = {
    "summary": "Failed to catch fish on the left of where player is standing",
    "hidden": true,
    "commands": [
        '#bubble "I\'m gonna need fishing rod"',
        '#inventory require fishing_rod 1',
        '#lock on',
        '#center',
        '#bubble "I\'m gonna need some fishing bait"',
        '#inventory require worms 1',
        '#bubbleclear Player',
        '#button Try "fishing here"',
        '#quest_fish_left_move',
        '#move left',
        '#groundremove fish-up',
        '#groundremove fish-up-walk1',
        '#groundremove fish-up-walk2',
        '#move right',
        '#clearevent',
        '#bubble "Oh no! The fish ran away"',
        '#lock off',
        '#map save'
    ]
};

SC.commands["#quest_fish_give"] = {
    "summary": "Give fisherman 3 fishes and receive info about firetruck",
    "hidden": true,
    "commands": [
        '#inventory require fish 3',
        '#lock on',
        '#center',
        '#givebutton fish 3',
        '#inventory remove fish 3',
        '#npcbubble Fred "Thank you very much" #delay 3000',
        '#npcbubble Fred "You can keep the fishing rod" #delay 3000',
        '#npcbubble Fred "I also have some information for you" #delay 3000',
        '#npcbubble Fred "Few days ago somebody drove fire truck into the lake" #delay 3000',
        '#npcbubble Fred "The truck is still at the bottom of the lake" #delay 3000',
        '#npcbubble Fred "Go tell the firefighter about it" #delay 3000',
        '#inventory add tag:firetruck 1',
        '#npcchange Fred fisherman ghosttown 73 62 boy-down',
        '#clearevent',
        '#progress start firetruck',
        '#map save',
        '#reread',
        '#quests progress fishing 100',
        '#quests add firetruck "Tell firefighter about the truck"',
        '#progress finish fishing',
        '#lock off'
    ]
};

SC.commands["#quest_firefighter"] = {
    "summary": "User gives firefighter info about firetruck being in the lake",
    "hidden": true,
    "commands": [
        '#inventory require tag:firetruck 1',
        '#lock on',
        '#center',
        '#givebutton tag:firetruck 1',
        '#npcbubble Frank "Thanks for the info" #delay 3000',
        '#npcbubble Frank "I will pull out the truck from lake later" #delay 4000',
        '#npcbubble Frank "I give you this old ladder" #delay 3000',
        '#inventory add ladder 1',
        '#blink "+1 ladder"',
        '#npcchange Frank firefighter_found ghosttown 13 2 boy-down',
        '#clearevent',
        '#quests progress firetruck 100',
        '#quests add prison "Prison break"',
        '#quests inc prison 10',
        '#progress finish firetruck',
        '#map save',
        '#reread',
        '#lock off'
    ]
};

SC.commands["#quest_frog"] = {
    "summary": "Save frog from well using rope",
    "hidden": true,
    "commands": [
        '#lock on',
        '#center',
        '#usebutton rope 1',
        '#npcchange Frog frog_saved ghosttown 71 38 frog',
        '#npcbubble Frog "Thanks for saving my life" #delay 4000',
        '#npcbubble Frog "I saw something shiny down there" #delay 4000',
        '#npcbubble Frog "I thought it was delicious beetle" #delay 4000',
        '#npcbubble Frog "But it was just this useless golden ring" #delay 4000',
        '#npcbubble Frog "Here you can keep it"',
        '#inventory add ring 1',
        '#blink "+1 ring"',
        '#cleareventxy 72 37',
        '#cleareventxy 73 38',
        '#cleareventxy 72 39',
        '#cleareventxy 71 38',
        '#cleareventxy 70 35',
        '#map save',
        '#reread',
        '#progress finish frog',
        '#quests progress frog 100',
        '#quests add ring "Find Jane\'s emerald ring"',
        '#quests progress ring 50',
        '#lock off',
        '#quest_combine_emerald_ring'
    ]
};

SC.commands["#quest_cheat"] = {
    "summary": "Put every item necessary to finish all quests to the inventory, used for quest debugging.",
    "hidden": true,
    "commands": [
        '#inventory add herb 3',
        '#inventory add rope 1',
        '#inventory add fishing_rod 1',
        '#inventory add worms 3',
        '#inventory add rocks 3',
        '#inventory add crystals 3',
        '#inventory add ladder 1',
        '#inventory add watches 1',
        '#inventory add ring 1',
        '#inventory add emerald 1',
        '#inventory add tag:firetruck 1',
        '#inventory add emerald_ring 1'
    ]
};

SC.commands["#quest_ken_give"] = {
    "summary": "Give Ken 3 herbs, receive rope",
    "hidden": true,
    "commands": [
        '#lock on',
        '#center',
        '#givebutton herb 3',
        '#npcbubble Ken "Thank you for the herbs!" #delay 4000',
        '#npcbubble Ken "You saved my wife!" #delay 4000',
        '#npcbubble Ken "I\'ll give you this rope as a reward" #delay 4000',
        '#npcbubble Ken',
        '#npcwalk Ken RR',
        '#npcchange Ken ken_cured ghosttown 56 59 boy-right',
        '#npcchange Kim kim_cured ghosttown 57 59 girl-down',
        '#inventory add tag:basement 1', // in case player drops rope, this is used to let user into basement
        '#inventory add rope 1',
        '#blink "+1 rope"',
        '#npcbubble Ken',
        '#cleareventxy 55 59',
        '#cleareventxy 54 59',
        '#map save',
        '#reread',
        '#progress finish herb',
        '#quests progress herb 100',
        '#quests add frog "Save frog from well"',
        '#lock off'
    ]
};

SC.commands["#quest_library_treasure_chest"] = {
    "summary": "Opening chest with treasure in library",
    "hidden": true,
    "commands": [
        '#looking left',
        '#lock on',
        '#center',
        '#button Open chest',
        '#move left #ground "floor4 chest1" #move right #delay 200',
        '#move left #ground "floor4 chest2" #move right #delay 200',
        '#move left #ground "floor4 chest3" #move right #delay 200',
        '#move left #ground "floor4 chest4" #move right #delay 200',
        '#treasure 2000',
        '#clearevent',
        '#progress finish library_treasure',
        '#map save',
        '#lock off'
    ]
};

