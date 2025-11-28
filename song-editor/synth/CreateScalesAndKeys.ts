// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { DictionaryArray, Key, toNameMap, Scale } from "./SynthConfig"

function gcd(a: number, b: number): number {
    // If one of the numbers is 0, the other number is the GCD
    if (b === 0) return a;

    // Otherwise, recursively compute the GCD
    return gcd(b, a % b);
}

function finishKeys(keys: Array<string>, edo: number): Array<string> {
    let keysFinished: boolean = false;
    
    let newKeys: Array<string>;
    while (!keysFinished) {
        keysFinished = true;
        newKeys = structuredClone(keys);
        for ( let i = 0; i < edo; i++ ) {
            if (keys[i] == "") {
                if (keys[i-1] != "") {
                    newKeys[i] = keys[i-1] + "+";
                } else if (keys[(i+1)%edo] != "") {
                    newKeys[i] = keys[(i+1)%edo] + "-";
                } else {
                    keysFinished = false;
                }
            } else {
                // do nothing
            }
        }
        keys = structuredClone(newKeys);
    }

    return keys;
}

function appendToListItems(list: Array<string>, add: string, atBack: boolean): Array<string> {
    let newList: Array<string> = []
    for (let i = 0; i < list.length; i++) {atBack ? newList.push(add+list[i]) : newList.push(list[i]+add);}
    return newList
}

function createMOS(edo: number, gen: number, modeNames: Array<string>, scaleArray: Array<Scale>, numGens: number, realScaleName: string): Array<Scale> {
    for (let gensDown=0; gensDown<numGens; gensDown++) {
        let thisFlags: Array<boolean> = Array(edo).fill(false);
        thisFlags[0] = true;
        let gensUp: number = numGens - gensDown - 1;
        for (let i = 1; i <= gensUp; i++) {
            thisFlags[(gen * i) % edo] = true;
        }
        for (let i = 1; i <= gensDown; i++) {
            thisFlags[((edo-gen) * i) % edo] = true;
        }
        scaleArray.push({ "index": scaleArray.length, "name": modeNames[gensDown], "realName": realScaleName+" "+gensUp+"|"+gensDown, "flags": thisFlags});
    }
    return scaleArray;
}

export function createKeys(edo: number): DictionaryArray<Key> {
    let bestFifth: number = Math.round(Math.log2(3/2)*edo);
    let fifthRatio: number = bestFifth/edo;
    let keys: Array<string> = Array(edo).fill("");
    let keyNames_5edo: Array<string> = ["C", "D", "F", "G", "A"];
    let keyNames_diatonicFifthward: Array<string> = ["C", "G", "D", "A", "E", "B", "F♯", "C♯", "G♯", "D♯", "A♯", "E♯", "B♯"];
    let keyNames_diatonicFourthward: Array<string> = ["C", "F", "B♭", "E♭", "A♭", "D♭", "G♭", "C♭", "F♭"];
    let keyNames_mavilaFifthward: Array<string> = ["C", "G", "D♭", "A♭", "E♭", "B♭", "F♭", "C♭", "G♭"];
    let keyNames_mavilaFourthward: Array<string> = ["C", "F", "B", "E", "A", "D", "G♯", "C♯", "F♯", "B♯", "E♯", "A♯", "D♯"];
    let keyNames_oneiroSixthward: Array<string> = ["C", "H", "E♭", "B♭", "G♭", "D♭", "A♭", "F♭", "C♭", "H♭"];
    let keyNames_oneiroFourthward: Array<string> = ["C", "F", "A", "D", "G", "B", "E", "H♯", "C♯", "F♯", "A♯", "D♯", "G♯", "B♯", "E♯"];
    if (fifthRatio == 3/5) { // Fifth = 720 cents
        let fifthOctave: number = Math.round(edo/5);
        for ( let i = 0; i < 5; i++ ) {
            keys[i*fifthOctave] = keyNames_5edo[i]
        }

        keys = finishKeys(keys, edo);
    } else if (edo == 6) { // 6edo has no fifth
        keys = ["C", "D", "E", "F", "A", "B"];
    } else if (edo == 11) { // 11edo's fifth is kinda weird, orgone-based note names instead
        keys = ["C", "C♯", "D", "E", "E♯", "F", "F♯", "G", "A", "A♯", "B"];
    } else if (fifthRatio >= 4/7 && fifthRatio < 3/5) { // Diatonic fifth (and 7edo equalized diatonic)
        let baseEdo: number = edo / gcd(edo, bestFifth);
        keys[0] = "C"
        for ( let i = 1; i <= 5 + Math.min(Math.ceil((baseEdo-7)/2), 7); i++ ) {
            let thisPitch: number = (bestFifth * i) % edo;
            if (keyNames_diatonicFifthward[i] != "B♯" && keyNames_diatonicFifthward[i] != "E♯") {keys[thisPitch] = keyNames_diatonicFifthward[i]}; // B♯ and E♯ are cringe
        }
        for ( let i = 1; i <= 1 + Math.min(Math.floor((baseEdo-7)/2), 7); i++ ) {
            let thisPitch: number = ((edo - bestFifth) * i) % edo;
            keys[thisPitch] = keyNames_diatonicFourthward[i];
        }

        keys = finishKeys(keys, edo);
    } else if (fifthRatio < 4/7) { // Mavila fifth
        let baseEdo: number = edo / gcd(edo, bestFifth);
        keys[0] = "C"
        for ( let i = 1; i <= 5 + Math.min(Math.ceil((baseEdo-7)/2), 7); i++ ) {
            let thisPitch: number = ((edo - bestFifth) * i) % edo;
            keys[thisPitch] = keyNames_mavilaFourthward[i];
        }
        for ( let i = 1; i <= 1 + Math.min(Math.floor((baseEdo-7)/2), 7); i++ ) {
            let thisPitch: number = (bestFifth * i) % edo;
            keys[thisPitch] = keyNames_mavilaFifthward[i];
        }

        keys = finishKeys(keys, edo);
    } else if (fifthRatio > 3/5) { // Oneirotonic "fifth"- techically a sixth because it is the sixth degree of an eight-note scale
        let baseEdo: number = edo / gcd(edo, bestFifth);
        keys[0] = "C"
        for ( let i = 1; i <= 6 + Math.min(Math.ceil((baseEdo-8)/2), 8); i++ ) {
            let thisPitch: number = ((edo - bestFifth) * i) % edo;
            keys[thisPitch] = keyNames_oneiroFourthward[i];
        }
        for ( let i = 1; i <= 1 + Math.min(Math.floor((baseEdo-8)/2), 8); i++ ) {
            let thisPitch: number = (bestFifth * i) % edo;
            keys[thisPitch] = keyNames_oneiroSixthward[i];
        }

        keys = finishKeys(keys, edo);
    }
    let keyArray: Array<Key> = [];
    for ( let i = 0; i < edo; i++) {
        keyArray.push({ "index": i, "name": keys[i], "isWhiteKey": keys[i].length == 1 ? true : false, "basePitch": i + edo });
    }
    return toNameMap(keyArray);
}

export function createScales(edo: number): DictionaryArray<Scale> {
    let scaleArray: Array<Scale> = [];
    let realScaleName: string;
    let modeNames: Array<string>;
    scaleArray.push({ "index": 0, "name": "Free", "realName": edo.toString()+"edo", "flags": Array(edo).fill(true) });

    let bestGen: number = Math.round(Math.log2(3/2)*edo); // diatonic
    let ratioGen: number = bestGen/edo;
    if (ratioGen >= 4/7 && ratioGen < 3/5) {
        realScaleName = "pentic";
        modeNames = ["Ionian", "Mixolydian", "Dorian", "Aeolian", "Phrygian"];
        modeNames = appendToListItems(modeNames, " Soft Pentatonic", false);
        scaleArray = createMOS(edo, bestGen, modeNames, scaleArray, 5, realScaleName);
        if (!(ratioGen == 4/7)) {
            realScaleName = "diatonic";
            modeNames = ["Lydian", "Ionian", "Mixolydian", "Dorian", "Aeolian", "Phrygian", "Locrian"];
            scaleArray = createMOS(edo, bestGen, modeNames, scaleArray, 7, realScaleName);
        }
    }

    bestGen = Math.round(Math.log2(Math.cbrt(5/2))*edo); // antidiatonic
    ratioGen = bestGen/edo;
    if (ratioGen <= 4/9 && ratioGen > 3/7) { // balzano fifths make weird scales so I'm not including them
        realScaleName = "pentic";
        modeNames = ["Ionian", "Mixolydian", "Dorian", "Aeolian", "Phrygian"];
        modeNames = appendToListItems(modeNames, " Hard Pentatonic", false);
        scaleArray = createMOS(edo, bestGen, modeNames, scaleArray, 5, realScaleName);
        realScaleName = "antidiatonic";
        modeNames = ["Lydian", "Ionian", "Mixolydian", "Dorian", "Aeolian", "Phrygian", "Locrian"].reverse();
        modeNames = appendToListItems(modeNames, "Anti-", true);
        scaleArray = createMOS(edo, bestGen, modeNames, scaleArray, 7, realScaleName);
    }

    bestGen = Math.round(Math.log2(14/9)*edo); // checkertonic
    ratioGen = bestGen/edo;
    if (ratioGen < 2/3 && ratioGen >= 5/8) {
        realScaleName = "antipentic";
        modeNames = ["Ionian", "Mixolydian", "Dorian", "Aeolian", "Phrygian"].reverse();
        modeNames = appendToListItems(appendToListItems(modeNames, " Hard Pentatonic", false),"Anti-",true);
        scaleArray = createMOS(edo, bestGen, modeNames, scaleArray, 5, realScaleName);
        if (!(ratioGen == 5/8)) {
            realScaleName = "checkertonic";
            modeNames = ["Dylathian", "Illarnekian", "Celephaïsian", "Ultharian", "Mnarian", "Kadathian", "Hlanithian", "Sarnathian"].reverse();
            modeNames = appendToListItems(modeNames, "Anti-", true);
            scaleArray = createMOS(edo, bestGen, modeNames, scaleArray, 8, realScaleName);
        }
    }

    bestGen = Math.round(Math.log2(Math.cbrt(20/9))*edo); // oneirotonic
    ratioGen = bestGen/edo;
    if (ratioGen < 2/5 && ratioGen > 3/8) {
        realScaleName = "antipentic";
        modeNames = ["Ionian", "Mixolydian", "Dorian", "Aeolian", "Phrygian"].reverse();
        modeNames = appendToListItems(appendToListItems(modeNames, " Soft Pentatonic", false),"Anti-",true);
        scaleArray = createMOS(edo, bestGen, modeNames, scaleArray, 5, realScaleName);
        realScaleName = "oneirotonic";
        modeNames = ["Dylathian", "Illarnekian", "Celephaïsian", "Ultharian", "Mnarian", "Kadathian", "Hlanithian", "Sarnathian"];
        scaleArray = createMOS(edo, bestGen, modeNames, scaleArray, 8, realScaleName);
    }

    bestGen = Math.round(Math.log2(Math.sqrt(3/2))*edo); // mosh
    ratioGen = bestGen/edo;
    if (ratioGen < 1/3 && ratioGen > 2/7) {
        realScaleName = "mosh";
        modeNames = ["Dalmatian", "Galatian", "Cilician", "Bithynian", "Pisidian", "Illyrian", "Lycian"];
        scaleArray = createMOS(edo, bestGen, modeNames, scaleArray, 7, realScaleName);
    }

    bestGen = Math.round(Math.log2(128/77)*edo); // smitonic
    ratioGen = bestGen/edo;
    if (ratioGen < 3/4 && ratioGen > 5/7) {
        realScaleName = "smitonic";
        modeNames = ["Dalmatian", "Galatian", "Cilician", "Bithynian", "Pisidian", "Illyrian", "Lycian"].reverse();
        modeNames = appendToListItems(modeNames, "Anti-", true);
        scaleArray = createMOS(edo, bestGen, modeNames, scaleArray, 7, realScaleName);
    }

    bestGen = Math.round(Math.log2(7/6)*edo); // gramitonic
    ratioGen = bestGen/edo;
    if (ratioGen >= 2/9 && ratioGen < 1/4) {
        realScaleName = "manual";
        modeNames = ["Iberian", "Alboran", "Aegean", "Eruthran", "Caspian"];
        modeNames = appendToListItems(modeNames, " Hard Pentatonic", false);
        scaleArray = createMOS(edo, bestGen, modeNames, scaleArray, 5, realScaleName);
        if (!(ratioGen == 2/9)) {
            realScaleName = "gramitonic";
            modeNames = ["Adriatic", "Tyrrhenian", "Iberian", "Alboran", "Aegean", "Eruthran", "Caspian", "Axenan", "Propontian"];
            scaleArray = createMOS(edo, bestGen, modeNames, scaleArray, 9, realScaleName);
        }
    }

    bestGen = Math.round(Math.log2(Math.sqrt(3))*edo); // semiquartal
    ratioGen = bestGen/edo;
    if (ratioGen > 7/9 && ratioGen < 4/5) {
        realScaleName = "manual";
        modeNames = ["Iberian", "Alboran", "Aegean", "Eruthran", "Caspian"];
        modeNames = appendToListItems(appendToListItems(modeNames, " Soft Pentatonic", false),"Anti-",true);
        scaleArray = createMOS(edo, bestGen, modeNames, scaleArray, 5, realScaleName);
        realScaleName = "semiquartal";
        modeNames = ["Adriatic", "Tyrrhenian", "Iberian", "Alboran", "Aegean", "Eruthran", "Caspian", "Axenan", "Propontian"].reverse();
        modeNames = appendToListItems(modeNames, "Anti-", true);
        scaleArray = createMOS(edo, bestGen, modeNames, scaleArray, 9, realScaleName);
    }

    return toNameMap(scaleArray);
}

export function createBreaks(edo: number): Array<number>  {
    let breaks: Array<number> = [1];
    let bestGen: number = Math.round(Math.log2(3/2)*edo); // diatonic
    let ratioGen: number = bestGen/edo;
    if (ratioGen >= 4/7 && ratioGen < 3/5) {
        breaks.push(breaks[breaks.length-1]+5);
        if (ratioGen != 4/7) {
            breaks.push(breaks[breaks.length-1]+7);
        }
    }

    bestGen = Math.round(Math.log2(Math.cbrt(5/2))*edo); // antidiatonic
    ratioGen = bestGen/edo;
    if (ratioGen <= 4/9 && ratioGen > 3/7) { // balzano fifths make weird scales so I'm not including them
        breaks.push(breaks[breaks.length-1]+5);
        breaks.push(breaks[breaks.length-1]+7);
    }

    bestGen = Math.round(Math.log2(14/9)*edo); // checkertonic
    ratioGen = bestGen/edo;
    if (ratioGen < 2/3 && ratioGen >= 5/8) {
        breaks.push(breaks[breaks.length-1]+5);
        if (!(ratioGen == 5/8)) {
            breaks.push(breaks[breaks.length-1]+8);
        }
    }

    bestGen = Math.round(Math.log2(Math.cbrt(20/9))*edo); // oneirotonic
    ratioGen = bestGen/edo;
    if (ratioGen < 2/5 && ratioGen > 3/8) {
        breaks.push(breaks[breaks.length-1]+5);
        breaks.push(breaks[breaks.length-1]+8);
    }

    bestGen = Math.round(Math.log2(Math.sqrt(3/2))*edo); // mosh
    ratioGen = bestGen/edo;
    if (ratioGen < 1/3 && ratioGen > 2/7) {
        breaks.push(breaks[breaks.length-1]+7);
    }

    bestGen = Math.round(Math.log2(128/77)*edo); // smitonic
    ratioGen = bestGen/edo;
    if (ratioGen < 3/4 && ratioGen > 5/7) {
        breaks.push(breaks[breaks.length-1]+7);
    }

    bestGen = Math.round(Math.log2(7/6)*edo); // gramitonic
    ratioGen = bestGen/edo;
    if (ratioGen >= 2/9 && ratioGen < 1/4) {
        breaks.push(breaks[breaks.length-1]+5);
        if (!(ratioGen == 2/9)) {
            breaks.push(breaks[breaks.length-1]+9);
        }
    }

    bestGen = Math.round(Math.log2(Math.sqrt(3))*edo); // semiquartal
    ratioGen = bestGen/edo;
    if (ratioGen > 7/9 && ratioGen < 4/5) {
        breaks.push(breaks[breaks.length-1]+5);
        breaks.push(breaks[breaks.length-1]+9);
    }

    return breaks;
}


export function createBreakNames(edo: number): Array<string>  {
    let breaks: Array<string> = ["aaa"];
    let bestGen: number = Math.round(Math.log2(3/2)*edo); // diatonic
    let ratioGen: number = bestGen/edo;
    if (ratioGen >= 4/7 && ratioGen < 3/5) {
        breaks.push("Diatonic-oid pentatonic");
        if (ratioGen != 4/7) {
            breaks.push("Diatonic");
        }
    }

    bestGen = Math.round(Math.log2(Math.cbrt(5/2))*edo); // antidiatonic
    ratioGen = bestGen/edo;
    if (ratioGen <= 4/9 && ratioGen > 3/7) { // balzano fifths make weird scales so I'm not including them
        breaks.push("Antidiatonic-oid pentatonic");
        breaks.push("Antidiatonic");
    }

    bestGen = Math.round(Math.log2(14/9)*edo); // checkertonic
    ratioGen = bestGen/edo;
    if (ratioGen < 2/3 && ratioGen >= 5/8) {
        breaks.push("Checkertonic-oid pentatonic");
        if (!(ratioGen == 5/8)) {
            breaks.push("Checkertonic");
        }
    }

    bestGen = Math.round(Math.log2(Math.cbrt(20/9))*edo); // oneirotonic
    ratioGen = bestGen/edo;
    if (ratioGen < 2/5 && ratioGen > 3/8) {
        breaks.push("Oneirotonic-oid pentatonic");
        breaks.push("Oneirotonic");
    }

    bestGen = Math.round(Math.log2(Math.sqrt(3/2))*edo); // mosh
    ratioGen = bestGen/edo;
    if (ratioGen < 1/3 && ratioGen > 2/7) {
        breaks.push("Mohajira-ish");
    }

    bestGen = Math.round(Math.log2(128/77)*edo); // smitonic
    ratioGen = bestGen/edo;
    if (ratioGen < 3/4 && ratioGen > 5/7) {
        breaks.push("Smitonic");
    }

    bestGen = Math.round(Math.log2(7/6)*edo); // gramitonic
    ratioGen = bestGen/edo;
    if (ratioGen >= 2/9 && ratioGen < 1/4) {
        breaks.push("Gramitonic-oid pentatonic");
        if (!(ratioGen == 2/9)) {
            breaks.push("Gramitonic");
        }
    }

    bestGen = Math.round(Math.log2(Math.sqrt(3))*edo); // semiquartal
    ratioGen = bestGen/edo;
    if (ratioGen > 7/9 && ratioGen < 4/5) {
        breaks.push("Semiquartal-oid pentatonic");
        breaks.push("Semiquartal");
    }

    return breaks;
}