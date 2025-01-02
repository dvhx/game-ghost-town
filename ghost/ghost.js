// simple chatbot (using inverted index and ranked document retrieval)
"use strict";

var GHOST = (function () {
    // simple chatbot
    var self = {};
    self.log = {};
    self.laterCharactersMoreImportant = true;
    self.maxWordLength = 20;
    self.globalCharacterScore = {basic: 1};

    self.tokenizer = function (aSentence, aMath) {
        // split sentences into words
        var s = aSentence;
        s = s.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ');
        s = s.replace(/\\/g, ' \\ ').replace(/\*/g, ' * ');
        s = s.replace(/\,/g, ' , ');
        s = s.replace(/\~/g, ' ~ ');
        s = s.replace(/\`/g, ' ` '); // '
        s = s.replace(/\[/g, ' [ ');
        s = s.replace(/\]/g, ' ] ');
        if (!aMath) {
            s = s.replace(/>/g, ' > ');
            s = s.replace(/</g, ' < ');
        }
        s = s.replace(/\=/g, ' = ');
        s = s.replace(/\:/g, ' : ');
        s = s.replace(/\?/g, ' ? ').replace(/\!/g, ' ! ');
        s = s.replace(/\//g, ' / ').replace(/\\/g, ' \\ ');
        s = s.replace(/\+/g, ' + ');
        s = s.replace(/\×/g, ' * ');
        s = s.replace(/´/g, "\'");
        s = s.replace(/’/g, "\'");
        s = s.replace(/\"/g, ' " ');    // '
        s = s.replace(/@/g, ' @ ');
        if (aMath) {
            s = s.replace(/\-/g, ' - ');
        } else {
            s = s.replace(/\./g, ' . ');
        }
        s = s.trim().split(/\s+/);
        return s;
    };

    self.stemmer = function (aWord, aMath) {
        // simplify/normalize/shorten words
        var s = aWord.toString().toLowerCase().trim().substr(0, self.maxWordLength), table, i, c, n, o1, o2;
        // remove slovak, czech diacritics
        table = {
            'á': 'a',
            'ä': 'a',
            'â': 'a',
            'ã': 'a',
            'à': 'a',
            'č': 'c',
            'ç': 'c',
            'ď': 'd',
            'é': 'e',
            'ě': 'e',
            'ê': 'e',
            'è': 'e',
            'í': 'i',
            'ĺ': 'l',
            'ľ': 'l',
            'ň': 'n',
            'ó': 'o',
            'ô': 'o',
            'õ': 'o',
            'ŕ': 'r',
            'ř': 'r',
            'š': 's',
            'ť': 't',
            'ú': 'u',
            'ů': 'u',
            'ý': 'y',
            'ñ': 'n',
            'ž': 'z'
        };
        //console.log(Object.keys(table).sort().join(''));
        s = s.replace(/[àáâãäçèéêíñóôõúýčďěĺľňŕřšťůž]/g, function (aChar) {
            return table[aChar];
        });
        // replace more than 2 characters with 2 characters (fuuuuck --> fuuck)
        if (!aMath) {
            n = [];
            s = s.split('');
            for (i = 0; i < s.length; i++) {
                c = s[i];
                if ((c !== o1) || (c !== o2)) {
                    n.push(s[i]);
                }
                o2 = o1;
                o1 = c;
            }
            s = n.join('');
        }
        // remove apostrophes if they are on both 'sides' of word
        if (s.charAt(0) === "'" && s.charAt(s.length - 1) === "'") {
            s = s.substr(1, s.length - 2);
        }
        // remove trailin' apostrophe
        if (s.charAt(s.length - 1) === "'") {
            s = s.substr(0, s.length - 1);
        }
        // apply slang dictionary
        if (self.slang && self.slang.hasOwnProperty(s)) {
            s = self.slang[s];
        }
        // apply local slang dictionary
        if (self.localSlang && self.localSlang.hasOwnProperty(s)) {
            s = self.localSlang[s];
        }
        return s;
    };

    self.appendQuestionMark = function (aQuestion) {
        // guess if there should be question mark, if so add it
        if (aQuestion.indexOf("?") < 0) {
            if (!aQuestion.match(/\b(you are|it is)\b/i)) {
                if (aQuestion.match(/\b(am i|aren't you|are you|can i|can we|can you|could you|did you|do i|do you|have you|how about|how are|how does|how do|how is|how long|how many|how old|how to|how was|is it|is there|is this|should i|what about|what are|what color|what does|what do|what happened|what if|what is|what kind|what should|what was|what year|what your|what you|when is|when was|when were|when you|where are|where do|where is|who are|who is|why can't|why did|why don't|why do|why is|why should|why would|why you|will i|will you|would you)\b/i)) { //'
                    return aQuestion + ' ?';
                }
            }
        }
        return aQuestion;
    };

    self.handleMultiWordParams = function (aParams, aTokens) {
        // handle cases as $nick = John Smith
        try {
            var mwp = {}, t, p, tokens = aTokens.slice();
            // find multiword params
            for (p in aParams) {
                if (aParams.hasOwnProperty(p)) {
                    t = self.normalize(aParams[p]);
                    if (t.length > 1) {
                        mwp[p] = t.join(' ');
                    }
                }
            }
            //console.log(mwp);
            // replace them in tokens
            for (p in mwp) {
                if (mwp.hasOwnProperty(p)) {
                    //console.warn('t1', tokens, p, mwp[p]);
                    tokens = (' ' + tokens.join(' ') + ' ').replace(' ' + mwp[p] + ' ', ' ' + p + ' ').trim().split(' ');
                    //console.warn('t2', tokens);
                }
            }
            return tokens;
        } catch (e) {
            console.error('GHOST.hmp error ' + e + ' for ' + aTokens.join(','));
        }
        return aTokens;
    };

    self.normalize = function (aSentence, aMath) {
        // tokenize sentence and stem all words
        var i, w, rem, change, n, ww, j, s, ow;
        // remove multiple ! and ?
        if (!aSentence) {
            aSentence = '';
        }
        if (typeof aSentence !== 'string') {
            aSentence = aSentence.toString();
        }
        aSentence = aSentence.replace(/[\!]+/g, '!');
        aSentence = aSentence.replace(/[\?]+/g, '?');
        // remove trailing and leading \ (very common on chromebook keyboards)
        aSentence = aSentence.replace(/[\\]+$/g, '');
        aSentence = aSentence.replace(/^[\\]+/g, '');
        // tokenize
        w = self.tokenizer((aSentence || "").toString(), aMath);
        // stem words
        n = [];
        for (i = 0; i < w.length; i++) {
            ww = self.stemmer(w[i], aMath);
            if (ww) { // words may get removed by slang: null
                ww = ww.split(' '); // slang may split word in two: "what's" --> "what is"
                for (j = 0; j < ww.length; j++) {
                    if (ww[j]) {
                        n.push(ww[j]);
                    }
                }
            }
        }
        w = n;
        // remove sentence enclosed in asterisk (e.g. *blushing*) or double quote ("ghost") or ellipsis (why...)
        rem = {
            '"': true,
            '*': true,
            '.': true
        };
        do {
            change = false;
            if (rem.hasOwnProperty(w[0])) {
                w.splice(0, 1);
                change = true;
            }
            if (rem.hasOwnProperty(w[w.length - 1])) {
                w.splice(-1, 1);
                change = true;
            }
        } while (change);
        // convert shortcuts (e.g. "a . i ." to "ai", "you . s . a ." to "usa")
        w = w ? ' ' + w.join(' ') + ' ' : '';
        if (self.shortcuts) {
            for (s in self.shortcuts) {
                if (self.shortcuts.hasOwnProperty(s)) {
                    do {
                        ow = w;
                        w = w.replace(' ' + s + ' ', ' ' + self.shortcuts[s] + ' ');
                    } while (w !== ow);
                }
            }
        }
        w = w.trim().split(' ');
        // done
        return w;
    };

    self.indexRebuild = function (aCharacter) {
        // rebuild entire index (~1288 questions in 27ms, it took 10s in PHP!)
        var t1 = new Date(), t2, q, document_index = 0, t, tokens;
        aCharacter.index = {};

        for (q in aCharacter.data) {
            if (aCharacter.data.hasOwnProperty(q)) {
                // normalize question
                tokens = self.normalize(q);
                // add tokens to index
                for (t = 0; t < tokens.length; t++) {
                    if (aCharacter.index.hasOwnProperty(tokens[t])) {
                        // existing token
                        aCharacter.index[tokens[t]].push(document_index);
                    } else {
                        // new token
                        aCharacter.index[tokens[t]] = [document_index];
                    }
                }
                // calculate next document index (this is faster than indexOf)
                document_index++;
            }
        }
        t2 = new Date();
        if (document_index > 0) {
            console.log('rebuilt index for ' + aCharacter.id + ' in ' + (t2 - t1) + 'ms');
        }
    };

    self.addQuestionAnswer = function (aCharacter, aQuestion, aAnswer) {
        // add pair of question+answer to the character
        var q = self.normalize(aQuestion).join(' '), t;
        // add question+answer to data
        if (!aCharacter.data.hasOwnProperty(q)) {
            aCharacter.data[q] = [];
        }
        if (aCharacter.data[q].indexOf(aAnswer) < 0) {
            // if answer is array (tag) and last answer is already tag add it to array
            if (Array.isArray(aAnswer) && Array.isArray(aCharacter.data[q].slice(-1)[0])) {
                for (t = 0; t < aAnswer.length; t++) {
                    aCharacter.data[q][aCharacter.data[q].length - 1].push(aAnswer[t]);
                }
            } else {
                aCharacter.data[q].push(aAnswer);
            }
        }
        // invalidate index
        aCharacter.index = {};
    };

    self.globalTermFrequency = function (aWord, aCharacters, aNotFoundCount) {
        // find term frequency in all characters combined
        var c, r = 0, koef = {'!': 3, '?': 1, ',': 5, '.': 10};
        for (c = 0; c < aCharacters.length; c++) {
            if (!aCharacters[c]) {
                continue;
            }
            if (aCharacters[c].index.hasOwnProperty(aWord)) {
                r += aCharacters[c].index[aWord].length;
            }
        }
        r = r > 0 ? r : aNotFoundCount;
        if (koef.hasOwnProperty(aWord)) {
            r = Math.floor(r * koef[aWord]);
        }
        return r;
    };

    self.sentenceDifference = function (aSentence1, aSentence2, aCharacters) {
        // return score how much is aSentence1 different than aSentence2
        // argument order matters, you should call it twice (with swapped arguments, then sum score)
        var score = 0, w;
        aSentence1 = typeof aSentence1 === 'string' ? self.normalize(aSentence1) : aSentence1;
        aSentence2 = typeof aSentence2 === 'string' ? self.normalize(aSentence2) : aSentence2;
        // words in aSentence1 but not in aSentence1
        for (w in aSentence1) {
            if (aSentence1.hasOwnProperty(w)) {
                if (aSentence2.indexOf(aSentence1[w]) < 0) {
                    score += 1 / self.globalTermFrequency(aSentence1[w], aCharacters, 1);
                    //console.log(w, aSentence1[w], self.globalTermFrequency(aSentence1[w], aCharacters, 1), score);
                }
            }
        }
        //console.log(score, aSentence1.length, aSentence2.length);
        return score / aSentence1.length;
    };

    self.sentenceDifference2 = function (a, b, aCharacters) {
        // bidirectional sentence difference with normalization to 0-1
        a = typeof a === 'string' ? self.normalize(a) : a;
        b = typeof b === 'string' ? self.normalize(b) : b;
        return (self.sentenceDifference(a, b, aCharacters) + self.sentenceDifference(b, a, aCharacters)) / (a.length + b.length);
    };

    self.documentIndexToQuestion = function (aCharacter, aDocument) {
        // convert document index to question string (123 --> "how are you ?")
        return Object.keys(aCharacter.data)[aDocument];
    };

    self.askSingle = function (aCharacters, aCharacter, aCharacterId, aTokens, aCombinedCandidates, aCharacterOrder) {
        // ask single character
        var t, token, docs, tf, d, candidates, doc, seen, score_modifier;

        // find all candidates (document id ==> score) with at least one matching token)
        candidates = {};
        for (t = 0; t < aTokens.length; t++) {
            token = aTokens[t];
            docs = aCharacter.index[token];
            if (docs) {
                tf = self.globalTermFrequency(token, aCharacters, 1);
                seen = {};
                for (d = 0; d < docs.length; d++) {
                    if (!seen.hasOwnProperty(docs[d])) {
                        if (candidates.hasOwnProperty(docs[d])) {
                            candidates[docs[d]] += 1 / tf;
                        } else {
                            candidates[docs[d]] = 1 / tf;
                        }
                    }
                    // uncomment next line if you want 2 words in data question to be counted twice
                    seen[docs[d]] = true;
                }
            }
        }

        // flatten candidates into array so that we can sort it, add original question and character name
        for (d in candidates) {
            if (candidates.hasOwnProperty(d)) {
                doc = parseInt(d, 10);
                score_modifier = 1;
                if (GHOST.globalCharacterScore && GHOST.globalCharacterScore.hasOwnProperty(aCharacterId)) {
                    score_modifier = GHOST.globalCharacterScore[aCharacterId];
                }
                aCombinedCandidates.push({
                    id: aCharacterId,
                    order: aCharacterOrder,
                    doc: doc,
                    score: candidates[d] * score_modifier
                });
            }
        }
    };

    self.mergeParams = function (aCharacters) {
        // merge parameters from multiple characters, last character is most important
        var i, p, params = {};
        for (i = 0; i < aCharacters.length; i++) {
            if (!aCharacters[i]) {
                continue;
            }
            for (p in aCharacters[i].params) {
                if (aCharacters[i].params.hasOwnProperty(p)) {
                    params[p] = aCharacters[i].params[p];
                }
            }
        }
        return params;
    };

    self.normalizeArrayOfObjects = function (aArray, aParam, aParamWrite) {
        // normalize array of objects by selected parameter
        var min, max, i, d;
        aParamWrite = aParamWrite || aParam;
        min = Number.MAX_VALUE;
        max = -Number.MAX_VALUE;
        for (i = 0; i < aArray.length; i++) {
            min = Math.min(min, aArray[i][aParam]);
            max = Math.max(max, aArray[i][aParam]);
        }
        if (min > 0) {
            min = 0;
        }
        d = max - min;
        for (i = 0; i < aArray.length; i++) {
            if (d === 0) {
                aArray[i][aParamWrite] = 1;
            } else {
                aArray[i][aParamWrite] = (aArray[i][aParam] - min) / d;
            }
        }
    };

    self.ask = function (aCharacters, aQuestion, aSpliceKoef, aSpliceSize, aMaxDiff, aBalanceKoef) {
        // Find best answer for given question
        var i, j, tokens, id, candidates = [], best_score, cut_count, cut_score, chosen,
            d, answer, tags, strings, p, t, idToIndex, params;

        // default attributes
        aSpliceKoef = aSpliceKoef || 0.80;
        aMaxDiff = aMaxDiff || 0.2;
        aBalanceKoef = aBalanceKoef || 3;
        aSpliceSize = aSpliceSize || 20;

        self.log = {
            characters: aCharacters,
            question: aQuestion,
            spliceKoef: aSpliceKoef,
            spliceSize: aSpliceSize,
            maxDiff: aMaxDiff,
            balanceKoef: aBalanceKoef
        };

        // merge params
        params = self.mergeParams(aCharacters);

        // normalize question
        tokens = self.normalize(aQuestion, undefined, false);
        self.log.tokens = tokens;

        // handle multiword params, like "John Smith"
        tokens = self.handleMultiWordParams(params, tokens);
        self.log.mwp = tokens;

        // Characters with empty index will have index rebuild now!
        // NOTE: this MUST be run first, do not combine this FOR with next FOR, do not refactor!
        idToIndex = {};
        for (i = 0; i < aCharacters.length; i++) {
            id = aCharacters[i].id;
            if (idToIndex.hasOwnProperty(id)) {
                console.error('Character id not unique: ' + id);
            }
            idToIndex[id] = i;
            if ((!aCharacters[i].hasOwnProperty('index')) || (Object.keys(aCharacters[i].index).length === 0)) {
                self.indexRebuild(aCharacters[i]);
            }
        }
        self.log.idToIndex = idToIndex;

        // convert input parameters (this is like normal params but converts "ghost" to "$nick;")
        for (p in params) {
            if (params.hasOwnProperty(p)) {
                for (t = 0; t < tokens.length; t++) {
                    if (tokens[t] === self.stemmer(params[p])) {
                        tokens[t] = p;
                    }
                }
            }
        }

        // ask all characters
        for (i = 0; i < aCharacters.length; i++) {
            id = aCharacters[i].id;
            self.askSingle(aCharacters, aCharacters[i], id, tokens, candidates, i);
        }
        if (candidates.length === 0) {
            return;
        }

        // sort candidates by score
        candidates.sort(function (a, b) { return b.score - a.score; });

        // Because of words like "the, is, of" usually most documents will make
        // it into candidates, but sentence difference function is slow and it
        // is also unlikely for low score candidates to move to the top just
        // because of the low sentence diff. Therefore we will keep only few
        // best answers (e.g. with score higher than 0.9 * best score)
        best_score = candidates[0].score;
        cut_score = aSpliceKoef * best_score;
        cut_count = aSpliceSize;
        for (i = 0; i < candidates.length; i++) {
            if ((candidates[i].score <= aSpliceKoef * best_score) || (i >= aSpliceSize)) {
                cut_score = candidates[i].score;
                cut_count = i;
                break;
            }
        }
        self.log.cutCount = cut_count;
        self.log.cutScore = cut_score;
        self.log.bestScore = best_score;
        //console.log('splicing first ' + cut_count + ' (instead of ' + aSpliceSize + ') at ' + (100 * cut_score / best_score).toFixed(0) + '% of best score ', best_score);
        //self.log.beforeSplice = candidates.slice(0, 30);
        candidates.splice(cut_count);

        // add original question to candidates (it is a bit slow to be done before splice)
        for (i = 0; i < candidates.length; i++) {
            id = candidates[i].id;
            candidates[i].question = self.documentIndexToQuestion(aCharacters[idToIndex[id]], candidates[i].doc);
        }
        //self.log.spliced = JSON.parse(JSON.stringify(candidates));

        // normalize score to 0-1 range
        self.normalizeArrayOfObjects(candidates, 'score', 'scoreNormal');
        //self.log.splicedNormal = JSON.parse(JSON.stringify(candidates));

        // because we no longer merge characters, we must remove duplicates that
        // are also in earlier characters
        if (self.laterCharactersMoreImportant) {
            for (i = 0; i < candidates.length; i++) {
                for (j = i + 1; j < candidates.length; j++) {
                    if (candidates[i].question === candidates[j].question) {
                        if (candidates[i].order > candidates[j].order) {
                            candidates[j].overwrite = true;
                        } else {
                            candidates[i].overwrite = true;
                        }
                    }
                }
            }
            // splice those overwritten out
            for (i = candidates.length - 1; i >= 0; i--) {
                if (candidates[i].overwrite) {
                    candidates.splice(i, 1);
                }
            }
            //console.log('overwrite', JSON.stringify(candidates, undefined, 4));
        }

        // calculate sentence difference
        for (i = 0; i < candidates.length; i++) {
            d = self.sentenceDifference2(tokens, candidates[i].question, aCharacters);
            candidates[i].diff = d;
            candidates[i].scoreNormal = candidates[i].scoreNormal - aBalanceKoef * d;
        }
        candidates.sort(function (a, b) { return b.scoreNormal - a.scoreNormal; });

        // again normalize score to 0-1
        self.normalizeArrayOfObjects(candidates, 'scoreNormal', 'scoreNormal');
        //self.log.balancedNormal = JSON.parse(JSON.stringify(candidates));
        self.recentCandidates = candidates;

        // keep only those above desired threshold (relative to best answer)
        // This is to remove those that are significantly worse that best answer
        for (i = candidates.length - 1; i >= 0; i--) {
            // remove those that have scoreNormal significantly worse relative to best answer (this will remove matches with only "the" "of" "is" etc...)
            // remove those that under desired absolute score
            if ((candidates[i].scoreNormal < aSpliceKoef) || (candidates[i].diff > aMaxDiff)) {
                candidates.splice(i);
            }
        }
        if (candidates.length <= 0) {
            return;
        }
        self.log.choice = candidates;

        // choose random
        chosen = candidates[Math.floor(Math.random() * candidates.length)];
        // if there is exact match use it now
        d = tokens.join(' ');
        for (i = 0; i < aCharacters.length; i++) {
            if (aCharacters[i].data.hasOwnProperty(d)) {
                chosen = {
                    id: aCharacters[i].id,
                    nick: aCharacters[i].params ? aCharacters[i].params['$nick;'] : '',
                    question: d
                };
                // break; - we prefer later characters
            }
        }

        // get answer
        answer = aCharacters[idToIndex[chosen.id]].data[chosen.question];

        // answer may contain tags, remove them
        tags = null;
        strings = [];
        for (i = 0; i < answer.length; i++) {
            if (typeof answer[i] === 'string') {
                strings.push(answer[i]);
            } else {
                tags = answer[i];
            }
        }

        // choose random answer
        self.log.strings = strings;
        answer = strings[Math.floor(Math.random() * strings.length)];

        // return final data
        return {
            question: chosen.question,
            normalized: tokens.join(' '),
            answer: self.replaceParams(answer, params),
            tags: tags
        };
    };

    self.askChain = function (aCharacters, aQuestion, aChain) {
        // use gradual increase of allowed diff to achieve more accurate results
        if (!aCharacters.slice(-1)[0]) {
            console.warn('no dumb character', aCharacters, aQuestion, aChain);
            return { question: null, answer: '', tags: null };
        }
        var i, a = '', dumb = aCharacters.slice(-1)[0].dumb;
        try {
            if (!dumb || (dumb.length === 0)) {
                dumb = aCharacters[0].dumb;
            }
        } catch (e) {
            dumb = ['What?'];
        }
        aChain = aChain || [0.001, 0.01, 0.02, 0.05, 0.1, 0.5, 0.9, 1];
        for (i = 0; i < aChain.length; i++) {
            a = self.ask(aCharacters, aQuestion, null, null, aChain[i], null);
            if (a) {
                a.stage = i;
                return a;
            }
        }
        return { question: null, answer: dumb ? dumb[Math.floor(Math.random() * dumb.length)] : '', tags: null };
    };

    self.createCharacter = function (aNick, aId) {
        // create new empty character
        return {
            id: aId || aNick || 'Nobody',
            params: {
                '$nick;': aNick || 'Nobody'
            },
            data: {},
            dumb: [],
            index: {}
        };
    };

    self.replaceParams = function (aText, aParams) {
        // replace params in text
        var p, s = aText, d = new Date(),
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        if (!s) {
            return s;
        }
        try {
            aParams['$time;'] = d.toLocaleTimeString();
        } catch (e) {
            aParams['$time;'] = 'now';
        }
        try {
            aParams['$date;'] = d.toLocaleDateString();
        } catch (e) {
            aParams['$date;'] = 'today';
        }
        aParams['$year;'] = d.getFullYear().toString();
        aParams['$month;'] = months[d.getMonth()];
        aParams['$day;'] = days[d.getDay()];
        for (p in aParams) {
            if (aParams.hasOwnProperty(p)) {
                while (s.match('\\' + p)) {
                    s = s.replace(p, aParams[p]);
                }
            }
        }
        return s;
    };

    self.changeParam = function (aParam, aOldValue, aNewValue) {
        // Change single parameter in all characters, e.g. $nick; John to Mary
        var c;
        for (c in GHOST.character) {
            if (GHOST.character.hasOwnProperty(c)) {
                if (GHOST.character[c].params[aParam] === aOldValue) {
                    GHOST.character[c].params[aParam] = aNewValue;
                }
            }
        }
    };

    self.multichar = function (aCharacter) {
        // Create array of characters according to "parent" array of aCharacter, including character itself
        console.log('multichar', aCharacter);
        var all = [], c, i;
        c = typeof aCharacter === 'string' ? GHOST.character[aCharacter] : aCharacter;
        if (c.parents) {
            for (i = 0; i < c.parents.length; i++) {
                if (!GHOST.character.hasOwnProperty(c.parents[i])) {
                    console.error('Character ' + c.id + ' has missing parent ' + c.parents[i]);
                }
                all.push(GHOST.character[c.parents[i]]);
            }
        }
        all.push(c);
        return all;
    };

    return self;
}());

// Node.js support
if (typeof module === 'object' && module.exports) {
    module.exports = GHOST;
}
