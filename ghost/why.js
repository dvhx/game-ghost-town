// Algorithm for answering "why" questions
"use strict";

var GHOST = GHOST || {};

GHOST.why = (function () {
    var self = {};

    // previous answers for each character
    self.lastAnswer = {};

    function reversePerson(word) {
        // this will reverse you/me/i if user is asking why question
        // but it must be used with bot's previous answer
        // Q: so?     A:     I   don't know
        // Q: why --> Q: WHY YOU don't know
        switch (word) {
        case "i'm":
            return "YOU ARE";
        case "i":
            return "YOU";
        case "am":
            return "ARE";
        case "you":
            return "ME";
        case "my":
            return "YOUR";
        case "me":
            return "YOU";
        default:
            return word;
        }
    }

    self.modify = function (aCharacterName, aQuestion, aYpsilonAsWhy) {
        // modify why question using bot's previous answer
        var nq = GHOST.normalize(aQuestion).join(' '),
            la,
            q2;

        // only certain questions are supported
        if (["why",  aYpsilonAsWhy ? 'y' : 'why', "why ?", "but why", "but why ?", "tell me why", "tell me why ?", "tell me why !", "why ?", "why so ?", "wait why ?", "wait why", "why not", "why not ?"].indexOf(nq) >= 0) {
            // find last answer
            la = self.lastAnswer.hasOwnProperty(aCharacterName) ? self.lastAnswer[aCharacterName] : '';
            // is bot's previous answer available?
            if (la) {
                // reverse person
                q2 = GHOST.normalize(la);
                q2 = 'WHY ' + q2.map(reversePerson).join(' ');
                q2 = q2.replace(/ me are /ig, ' i am ');
                //console.info('why', q2);
                // return modified question
                return q2;
            }
        }
        // return original question
        return aQuestion;
    };

    self.add = function (aCharacterName, aCharacterAnswer) {
        // Remember answer for each character
        self.lastAnswer[aCharacterName] = aCharacterAnswer;
    };

    return self;
}());
