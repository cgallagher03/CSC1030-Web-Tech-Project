
function inputValid() {
    let validName = nameValid();
    let validDifficulty = difficultyValid();
    if (validName && validDifficulty) {
        sendDetails()
        return true;
    }
    else return false;
}

function nameValid() {
    let name = document.getElementById('name');
    let nameVal = name.value;
    let err = document.getElementById('nameErr');

    let valid = true;

    if (nameVal == '') {
        err.innerHTML = 'Please enter your name';
        valid = false;
    } else if (nameVal.length < 2) {
        err.innerHTML = 'Invalid name';
        valid = false;
    } else if (/\d/.test(nameVal)) {
        err.innerHTML = 'Name cannot contain digits';
        valid = false;
    }

    if (!valid) {
        name.classList.add('error');
        err.classList.add('error');
        return false;
    } else {
        name.classList.remove('error');
        err.classList.remove('error');
        err.innerHTML = '';
        return true;
    }
}

function difficultyValid() {
    let difficultyRds = document.getElementsByName('diff');
    let err = document.getElementById('diffErr');

    let valid = false;

    for (var i = 0; i < difficultyRds.length; i++) {
        if (difficultyRds[i].checked) {
            valid = true;
        }
    }

    if (!valid) {
        err.classList.add('error');
        err.innerHTML = 'Must select a difficulty';
        return false;
    } else {
        err.classList.remove('error');
        err.innerHTML = '';
        return true;
    }
}

function sendDetails() {
    let pName = document.getElementById('name').value;
    let pCharacter = document.getElementById('character').value;
    let pTitle;
    let pSkillName;
    switch (pCharacter) {
        case 'detective':
            pTitle = 'Detective';
            pSkillName = 'detective'
            break;
        case 'police':
            pTitle = 'Officer';
            pSkillName = 'policing';
            break;
        case 'forensic':
            pTitle = 'Forensicist';
            pSkillName = 'forensic';
            break;
    }

    let pTitledName = pTitle + ' ' + pName;

    let pDifficulty;
    let difficultyRadios = document.getElementsByName('diff');
    for (var i = 0; i < difficultyRadios.length; i++) {
        if (difficultyRadios[i].checked) {
            pDifficulty = difficultyRadios[i].value;
            break;
        }
    }

    sessionStorage.setItem('pName', pName);
    sessionStorage.setItem('pCharacter', pCharacter);
    sessionStorage.setItem('pTitle', pTitle);
    sessionStorage.setItem('pDifficulty', pDifficulty);
    sessionStorage.setItem('pTitledName', pTitledName);
    sessionStorage.setItem('pSkillName', pSkillName);


    if (!sessionStorage.getItem('sessionPlays')) {
        sessionStorage.setItem('sessionPlays', 1);
    }
    else {
        let playCount = sessionStorage.getItem('sessionPlays');
        playCount++;
        sessionStorage.setItem('sessionPlays', playCount);
    }

    window.open('intro.html', '_self');
}

function playTypeWriterSound(text) {
    let typeSound = new Audio('sounds/typewriter.mp3');
    typeSound.loop = true;
    typeSound.play();
    setTimeout(function () { typeSound.pause(); }, text.length * 45);
}

function typeWriter(id, text, typeIndex) {
    if (typeIndex >= text.length) return;
    setTimeout(function () {
        if (typeIndex < text.length) {

            if (text.charAt(typeIndex) == '*') {
                document.getElementById(id).innerHTML += '<br>';
            } else {
                document.getElementById(id).innerHTML += text.charAt(typeIndex);
            }
            typeWriter(id, text, ++typeIndex);
        }
    }, 40);
}

function typeWriterWithSound(id, text, typeIndex) {
    playTypeWriterSound(text);
    typeWriter(id, text, typeIndex);
}

function displayFontSize() {
    let textResizer = document.getElementById('textResizer');
    let display = document.getElementById('fontSize');
    display.innerHTML = textResizer.value + '%';
}

function getAppearance() {
    let value = document.getElementById('textResizer').value;
    let fontSize = (value / 100) + 'em';

    let accessibleStyleScheme = document.getElementById('accessibleSchemeCheckbox').checked;

    sessionStorage.setItem('fontSize', fontSize);
    sessionStorage.setItem('accessibleStyleScheme', accessibleStyleScheme);
}

function setAppearance(divName) {
    let fontSize = sessionStorage.getItem('fontSize');
    document.getElementById(divName).style.fontSize = fontSize;

    let accessibleStyleScheme = sessionStorage.getItem('accessibleStyleScheme');
    if (accessibleStyleScheme == 'true') {
        document.getElementsByTagName('link')[0].href = 'css/accessible.css';
    }
    else {
        document.getElementsByTagName('link')[0].href = 'css/standard.css';
    }
}

// declare collected information as global variables so they can be used across several functions
var pName = sessionStorage.getItem('pName');
var pTitle = sessionStorage.getItem('pTitle');
var pTitledName = sessionStorage.getItem('pTitledName');
var pSkillName = sessionStorage.getItem('pSkillName');

function debriefText() {
    typeWriterWithSound('debrief', 'Hello there ' + pTitledName + '.*It is your responsibility to investigate a recent death in the town.*' +
        'A local millionaire, Mrs Carey, suddenly passed away this morning, however there is evidence to suggest that her death was no accident or natural cause.*' +
        ' We\'ve narrowed it down to 5 suspects and gathered them at the scene of the crime, if their questioning may be of use to you.*' +
        ' Use your ' + pSkillName + ' skills to work out who might have performed the foul act!* The case brief is attached- open it for a closer look.*', 0);

    setTimeout(function () {
        document.getElementById('file').classList.remove('hideMe');
    }, 21000);
}

function introShowSuspects() {
    let modal = document.getElementById('introSuspectsModal');
    let closeSpan = document.getElementsByClassName('close')[0];
    modal.style.display = 'block';

    closeSpan.onclick = function () {
        modal.style.display = 'none';
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    document.getElementById('startGameBtn').classList.remove('hideMe');
    document.getElementById('startGameBtn').style.display = 'block';
}

function setTime() {
    let duration;
    let pDifficulty = sessionStorage.getItem('pDifficulty');
    switch (pDifficulty) {
        case 'easy': duration = 210; break;
        case 'medium': duration = 180; break;
        case 'hard': duration = 150; break;
    }
    sessionStorage.setItem('startingDuration', duration);
    sessionStorage.setItem('duration', duration);

}

function initialiseGame() {
    setTime();
    setTimerBar();
    startTimer();
    document.getElementById('gameLeftSide').innerHTML += '<p id="introText"><p>';
    typeWriter('introText', 'Click on suspicious items in the rooms to look for clues about the killer, or enter commands to get more information.**', 0);
    sessionStorage.setItem('cluesFound', 0);
}

function setTimerBar() {
    let duration = sessionStorage.getItem('duration');
    document.querySelector('.progress .bar').style.transitionDuration = duration + 's';
    document.querySelector('.progress').className += ' complete';
}

var timer;
function startTimer() {
    let duration = sessionStorage.getItem('duration');
    let minutes = Math.floor(duration / 60);
    let seconds = duration - (minutes * 60);
    document.getElementById('timer').innerHTML = minutes + 'm ' + seconds + 's';
    timer = setInterval('countdown()', 1000);
}

function stopTimer() {
    clearInterval(timer);
    sessionStorage.setItem('suspect', -1);
    window.open('end.html', '_self');
}

function countdown() {
    let duration = sessionStorage.getItem('duration');
    let startingDuration = sessionStorage.getItem('startingDuration');
    duration--;
    sessionStorage.setItem('duration', duration);

    let minutes = Math.floor(duration / 60);
    let seconds = duration - (minutes * 60);
    if (duration > 0) {
        if (duration > 60) {
            document.getElementById('timer').innerHTML = minutes + 'm ' + seconds + 's';
        }
        else {
            if (duration == 60) document.getElementById('timer').innerHTML = '60s';
            else document.getElementById('timer').innerHTML = seconds + 's';
        }

        if (duration == startingDuration - 30) {
            document.getElementById('gameLeftSide').innerHTML += '<p id="firstTimedEvent"><p><br>';
            typeWriter('firstTimedEvent', pTitledName + ', you need to get a move on. The longer we take, the more the scene can be tampered with.', 0);
        }
        else if (duration == startingDuration - 75) {
            document.getElementById('gameLeftSide').innerHTML += '<p id="secondTimedEvent"><p><br>';
            typeWriter('secondTimedEvent', 'We\'re not sure if you\'ve already got this information, but their solicitor\'s told us that recently, John and Polly' +
                ' were being cut from Mrs Carey\'s will.', 0);
        }
        else if (duration == startingDuration - 120) {
            document.getElementById('gameLeftSide').innerHTML += '<p id="thirdTimedEvent"><p><br>';
            typeWriter('thirdTimedEvent', pName + ', we have eyes on a woman moving rather quickly towards your location. She could be trying to neutralise you, watch out!', 0);
        }
        else if (duration == startingDuration - 165) {
            document.getElementById('gameLeftSide').innerHTML += '<p id="fourthTimedEvent"><p><br>';
            typeWriter('fourthTimedEvent', 'Someone\'s cut the lights in the building. For God\'s sake, use any force necessary to detain the suspect and get out of their!', 0);
        }
    } else {
        stopTimer();
    }
}

var imgArray = new Array();

imgArray[0] = new Image();
imgArray[0].src = 'images/bedroom.png';
imgArray[0].useMap = '#bedroomMap';
imgArray[0].alt = 'bedroom scene';

imgArray[1] = new Image();
imgArray[1].src = 'images/kitchen.png';
imgArray[1].useMap = '#kitchenMap';
imgArray[1].alt = 'kitchen scene';

imgArray[2] = new Image();
imgArray[2].src = 'images/bathroom.png';
imgArray[2].useMap = '#bathroomMap';
imgArray[2].alt = 'bathroom scene';


function nextImage(element) {
    var img = document.getElementById(element);

    for (var i = 0; i < imgArray.length; i++) {
        if (imgArray[i].src == img.src) {
            if (i === imgArray.length - 1) {
                document.getElementById(element).src = imgArray[0].src;
                document.getElementById(element).useMap = imgArray[0].useMap;
                document.getElementById(element).alt = imgArray[0].alt;
                break;
            }
            document.getElementById(element).src = imgArray[i + 1].src;
            document.getElementById(element).useMap = imgArray[i + 1].useMap;
            document.getElementById(element).alt = imgArray[i + 1].alt;

            break;
        }
    }
}

function previousImage(element) {
    var img = document.getElementById(element);

    for (var i = 0; i < imgArray.length; i++) {
        if (imgArray[i].src == img.src) {
            if (i === 0) {
                document.getElementById(element).src = imgArray[imgArray.length - 1].src;
                document.getElementById(element).useMap = imgArray[imgArray.length - 1].useMap;
                document.getElementById(element).alt = imgArray[imgArray.length - 1].alt;
                break;
            }``

            document.getElementById(element).src = imgArray[i - 1].src;
            document.getElementById(element).useMap = imgArray[i - 1].useMap;
            document.getElementById(element).alt = imgArray[i - 1].alt;
            break;
        }
    }
}

function gameShowSuspects() {
    let modal = document.getElementById('gameSuspectsModal');
    let closeSpan = document.getElementsByClassName('close')[0];
    modal.style.display = 'block';

    closeSpan.onclick = function () {
        modal.style.display = 'none';
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

function showGuide() {
    let modal = document.getElementById('guideModal');
    let closeSpan = document.getElementsByClassName('close')[1];
    modal.style.display = 'block';

    closeSpan.onclick = function () {
        modal.style.display = 'none';
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

let joanQd = false;
let johnQd = false;
let pollyQd = false;
let michaelQd = false;
let mollyQd = false;
let bedroomSwabbed = false;
let kitchenSwabbed = false;
let bathroomSwabbed = false;
let bedroomSniffed = false;
let kitchenSniffed = false;
let bathroomSniffed = false;
function processInput() {
    let input = document.getElementById('enterCmd').value.trim();

    if (input.substring(0, 9).toUpperCase() === 'QUESTION ') {
        let name = input.substring(9).toUpperCase();
        switch (name) {
            case 'JOAN':
                if (!joanQd) {
                    questionSuspect('joan');
                    joanQd = true;
                }
                break;
            case 'JOHN':
                if (!johnQd) {
                    questionSuspect('john');
                    johnQd = true;
                }
                break;
            case 'POLLY':
                if (!pollyQd) {
                    questionSuspect('polly');
                    pollyQd = true;
                }
                break;
            case 'MICHAEL':
                if (!michaelQd) {
                    questionSuspect('michael');
                    michaelQd = true;
                }
                break;
            case 'MOLLY':
                if (!mollyQd) {
                    questionSuspect('molly');
                    mollyQd = true;
                }
                break;
            default:
                document.getElementById('enterCmd').classList.add('error');
                break;
        }
    }

    else if (input.substring(0, 5).toUpperCase() === 'SWAB ' && pTitle === 'Forensicist') {
        let room = input.substring(5).toUpperCase();
        let swabSound = new Audio('sounds/swab.mp3');
        switch (room) {
            case 'BEDROOM':
                if (!bedroomSwabbed) {
                    swabSound.play();

                    document.getElementById('gameLeftSide').innerHTML += '<p id="bedroomSwab" class="characterSpecificText"><p><br>';
                    typeWriterWithSound('bedroomSwab', 'Bedroom swab: Although there are no fingerprints left on the knife murder weapon, I\'m able to detect some beads of sweat ' +
                        'from the handle. I can\'t say a person for certain, but from what I can tell, this sweat came from a woman\'s hand...', 0);
                    bedroomSwabbed = true;
                }
                document.getElementById('enterCmd').classList.remove('error');
                break;
            case 'KITCHEN':
                if (!kitchenSwabbed) {
                    swabSound.play();

                    document.getElementById('gameLeftSide').innerHTML += '<p id="kitchenSwab" class="characterSpecificText"><p><br>';
                    typeWriterWithSound('kitchenSwab', 'Kitchen swab: Polly\'s handprints are on one of the cupboard handles, and inside there\'s a pack of wipes which look to have been ' +
                        'rather frantically opened.', 0);
                    kitchenSwabbed = true;
                }
                document.getElementById('enterCmd').classList.remove('error');
                break;
            case 'BATHROOM':
                if (!bathroomSwabbed) {
                    swabSound.play();

                    document.getElementById('gameLeftSide').innerHTML += '<p id="bathroomSwab" class="characterSpecificText"><p><br>';
                    typeWriterWithSound('bathroomSwab', 'Bathroom swab: There\'s traces of Mrs Carey\'s blood smeared around the sink. Whoever committed the murder must\'ve come here ' +
                        'to rinse their hands of the heinous act. They might\'ve left other evidence in here in a rush.', 0);
                    bathroomSwabbed = true;
                }
                document.getElementById('enterCmd').classList.remove('error');
                break;
            default:
                document.getElementById('enterCmd').classList.add('error');
                break;
        }
    }
    else if (input.substring(0, 6).toUpperCase() === 'SNIFF ' && pTitle === 'Officer') {
        let room = input.substring(6).toUpperCase();
        let sniffSound = new Audio('sounds/dogSniff.mp3');
        switch (room) {
            case 'BEDROOM':
                if (!bedroomSniffed) {
                    sniffSound.play();

                    document.getElementById('gameLeftSide').innerHTML += '<p id="bedroomSniff" class="characterSpecificText"><p><br>';
                    typeWriterWithSound('bedroomSniff', 'Sniffing bedroom: Although there are no finger prints left on the knife murder weapon, your dog is able to catch a scent of sweat from the handle. ' +
                        'When presented with the suspects, he approached the females- clearly it belonged to one of them...', 0);
                    bedroomSniffed = true;
                }
                document.getElementById('enterCmd').classList.remove('error');
                break;
            case 'KITCHEN':
                if (!kitchenSniffed) {
                    sniffSound.play();

                    document.getElementById('gameLeftSide').innerHTML += '<p id="kitchenSniff" class="characterSpecificText"><p><br>';
                    typeWriterWithSound('kitchenSniff', 'Sniffing kitchen: In one of the cupboards there\'s a pack of wipes which look to have been frantically opened. ' +
                        'Your dog catches Polly\'s scent from it.', 0);
                    kitchenSniffed = true;
                }
                document.getElementById('enterCmd').classList.remove('error');
                break;
            case 'BATHROOM':
                if (!bathroomSniffed) {
                    sniffSound.play();
                    document.getElementById('gameLeftSide').innerHTML += '<p id="bathroomSniff" class="characterSpecificText"><p><br>';
                    if (kitchenSniffed) {
                        typeWriterWithSound('bathroomSniff', 'Sniffing bathroom: Your dog signals that the same scent of the wipes from the kitchen cupboard is present in here. ' +
                            'Whoever committed the murder must have been wise enough to disinfect their trail after rinsing their hands of the heinous act.', 0);
                    }
                    else {
                        typeWriterWithSound('bathroomSniff', 'Sniffing bathroom: Your dog recoils at the intense smell of disinfectant in the room. ' +
                            'Whoever committed the murder must have been wise enough to disinfect their trail after rinsing their hands of the heinous act.', 0);
                    }
                    bathroomSniffed = true;
                }
                document.getElementById('enterCmd').classList.remove('error');
                break;
            default:
                document.getElementById('enterCmd').classList.add('error');
                break;
        }
    }
    else if (input.substring(0, 7).toUpperCase() === 'ARREST ') {
        let name = input.substring(7).toUpperCase();
        switch (name) {
            case 'JOAN':
                sessionStorage.setItem('suspect', 'joan');
                window.open('end.html', '_self');
                break;
            case 'JOHN':
                sessionStorage.setItem('suspect', 'john');
                window.open('end.html', '_self');
                break;
            case 'POLLY':
                sessionStorage.setItem('suspect', 'polly');
                window.open('end.html', '_self');
                break;
            case 'MICHAEL':
                sessionStorage.setItem('suspect', 'michael');
                window.open('end.html', '_self');
                break;
            case 'MOLLY':
                sessionStorage.setItem('suspect', 'molly');
                window.open('end.html', '_self');
                break;
            default:
                document.getElementById('enterCmd').classList.add('error');
                break;
        }
    }
    else if (input.toUpperCase() === 'EXIT') {
        window.open('end.html', '_self');
    }
    else {
        document.getElementById('enterCmd').classList.add('error');
    }
}

function questionSuspect(suspect) {
    let sound = new Audio('sounds/dundundun.mp3');
    if (pTitle == 'Detective') {
        switch (suspect) {
            case 'joan':
                sound.play();
                document.getElementById('gameLeftSide').innerHTML += '<p class="suspectQuestioning" id="joanQuestion"><p><br>';
                typeWriterWithSound('joanQuestion', 'Joan says: Hello Detective. What\'s happened is just horrifying isn\'t it? Me and my mum were so close and to think she ' +
                    'was murdered by John is horrible. Yes you caught that right- I\'m nearly certain John or his wicked wife is behind this. I was always the favourite ' +
                    'and I think he wanted to get back at her. Good luck with your investigation.', 0);
                break;
            case 'john':
                sound.play();
                document.getElementById('gameLeftSide').innerHTML += '<p class="suspectQuestioning" id="johnQuestion"><p><br>';
                typeWriterWithSound('johnQuestion', 'John says: Welcome Detective, finally someone with a bit of sense around here. I just want to make clear that I had nothing to do with this- ' +
                    'don\'t let my sister feed you lies if she tries. I loved my mother. Me and my wife both did- we cared for her while Joan disappeared off for work. ' +
                    'Maybe one of the grandkids did it- Joan\'s kids and mum didn\'t get on too well.', 0);
                break;
            case 'polly':
                sound.play();
                document.getElementById('gameLeftSide').innerHTML += '<p class="suspectQuestioning" id="pollyQuestion"><p><br>';
                typeWriterWithSound('pollyQuestion', 'Polly says: It\'s a disgrace that I\'m even being questioned for such a crime. I\'d never do such a thing. For God\'s sakes, I\'ve been caring for ' +
                    'the woman for years now while her daughter fluffs off for work. And I never got a word of thanks from the old hag. What\'s your name, son? ' + pName + '? ' +
                    'Get this case wrapped up so I can get out of here.', 0);
                break;
            case 'michael':
                sound.play();
                document.getElementById('gameLeftSide').innerHTML += '<p class="suspectQuestioning" id="michaelQuestion"><p><br>';
                typeWriterWithSound('michaelQuestion', 'Michael says: ' + pName + ', you\'ve got to believe me. I\'d never do anything to hurt my own grandmother. We might not have talked much but I\'m not a ' +
                    'murderer. If anyone asks you didn\'t hear this from me, but Aunt Polly\'s been acting weird recently... Something about that woman gives me the chills.', 0);
                break;
            case 'molly':
                sound.play();
                document.getElementById('gameLeftSide').innerHTML += '<p class="suspectQuestioning" id="mollyQuestion"><p><br>';
                typeWriterWithSound('mollyQuestion', 'Molly says: It\'s not me, don\'t waste your time... My money\'s on John- Granny always treated him in second place compared to mum. How could he do such a thing though?', 0);
                break;
        }
    }
    else {
        switch (suspect) {
            case 'joan':
                sound.play();
                document.getElementById('gameLeftSide').innerHTML += '<p class="suspectQuestioning" id="joanQuestion"><p><br>';
                typeWriterWithSound('joanQuestion', 'Joan says: Hello ' + pTitledName + '. What\'s happened is just horrifying isn\'t it? I\'m nearly certain John or his wicked wife is behind this.', 0);
                break;
            case 'john':
                sound.play();
                document.getElementById('gameLeftSide').innerHTML += '<p class="suspectQuestioning" id="johnQuestion"><p><br>';
                typeWriterWithSound('johnQuestion', 'John says: Welcome ' + pName + ', finally someone with a bit of sense around here.  I loved my mother. Me and my wife both did- we cared for her while Joan disappeared off for work.', 0);
                break;
            case 'polly':
                sound.play();
                document.getElementById('gameLeftSide').innerHTML += '<p class="suspectQuestioning" id="pollyQuestion"><p><br>';
                typeWriterWithSound('pollyQuestion', 'Polly says: It\'s a disgrace that I\'m even being questioned for such a crime. You\'re not even a detective- what am I answering to you for?', 0);
                break;
            case 'michael':
                sound.play();
                document.getElementById('gameLeftSide').innerHTML += '<p class="suspectQuestioning" id="michaelQuestion"><p><br>';
                typeWriterWithSound('michaelQuestion', 'Michael says: ' + pName + ', you\'ve got to believe me. I\'d never do anything to hurt my own grandmother. All I can tell you is that Aunt Polly\'s been acting weird recently...', 0);
                break;
            case 'molly':
                sound.play();
                document.getElementById('gameLeftSide').innerHTML += '<p class="suspectQuestioning" id="mollyQuestion"><p><br>';
                typeWriterWithSound('mollyQuestion', 'Molly says: It\'s not me, don\'t waste your time... My money\'s on John- Granny always treated him in second place compared to mum. How could he do such a thing though?', 0);
                break;
        }
    }
}

function clueText(item) {
    let clueCount = sessionStorage.getItem('cluesFound');
    clueCount++;
    sessionStorage.setItem('cluesFound', clueCount);

    let sound;
    switch (item) {
        case 'letter':
            sound = new Audio('sounds/openEnvelope.mp3');
            sound.play();

            document.getElementById('gameLeftSide').innerHTML += '<p id="letterHint" class="clueText"></p><br>';
            typeWriterWithSound('letterHint', 'The letter contains some sort of official document... It looks like Mrs Carey was making an alteration to her will, leaving 90% to Joan, her beloved daughter.' +
                ' Could this have stirred the pot for other\'s looking for a share?', 0);
            break;
        case 'handbag':
            sound = new Audio('sounds/openBag.mp3');
            sound.play();

            document.getElementById('gameLeftSide').innerHTML += '<p id="handbagHint" class="clueText"></p><br>';
            let includeCardHint;
            try {
                includeCardHint = document.getElementById('creditcardHint').classList.contains('found');
            }
            catch (error) {
                includeCardHint = false;
            }
            if (includeCardHint) {
                typeWriterWithSound('handbagHint', 'This is Polly, Mrs Carey\'s daughter-in-law\'s handbag. What\'s this... a receipt in here for some medical gloves?! This seems quite suspicious don\'t you think?' +
                    ' The card details on the receipt even match the details on the credit card we found in the bedroom.', 0);
            } else {
                typeWriterWithSound('handbagHint', 'This is Polly, Mrs Carey\'s daughter-in-law\'s handbag. What\'s this... a receipt in here for some medical gloves?! This seems quite suspicious don\'t you think?', 0);
            }
            break;
        case 'creditCard':
            sound = new Audio('sounds/creditCardPickup.mp3');
            sound.play();

            document.getElementById('gameLeftSide').innerHTML += '<p id="creditcardHint" class="found clueText"></p><br>';
            typeWriterWithSound('creditcardHint', 'Mrs Carey\'s son John\'s credit card is lying on the floor beside the dresser. Why would he have been anywhere near her bedroom at night?', 0);
            break;
        case 'knife':
            sound = new Audio('sounds/knifeSound.mp3');
            sound.play();

            document.getElementById('gameLeftSide').innerHTML += '<p id="knifeHint" class="clueText"></p><br>';
            typeWriterWithSound('knifeHint', 'This knife must be the murder weapon. The fingerprints only seem to be a match for Mrs Carey though- someone must have been planning this for some time.', 0);
            break;
        case 'bin':
            sound = new Audio('sounds/binRummaging.mp3');
            sound.play();

            document.getElementById('gameLeftSide').innerHTML += '<p id="binHint" class="clueText"></p><br>';
            if (clueCount == '5') {
                typeWriterWithSound('binHint', 'The grandmother\'s medicine is in the bin, together with a pair of medical gloves covered in blood- someone is definitely doing a good job at covering their tracks.', 0);
            }
            else {
                typeWriterWithSound('binHint', 'The grandmother\'s medicine is in the bin, together with a pair of medical gloves covered in blood- someone is definitely doing a good job at covering their tracks.' +
                    ' Try looking for more clues in other rooms.', 0);
            }
            break;
    }
}

function selectSuspect(rdoId) {
    document.getElementById(rdoId).checked = true;
}

function sendSuspect() {
    let suspect;
    let suspectRds = document.getElementsByName('suspectChoice');
    for (var i = 0; i < suspectRds.length; i++) {
        if (suspectRds[i].checked) {
            suspect = suspectRds[i].value;
            break;
        }
    }

    sessionStorage.setItem('suspect', suspect);
}

function suspectValid() {
    let suspectRds = document.getElementsByName('suspectChoice');
    let err = document.getElementById('suspectErr');

    let valid = false;

    for (var i = 0; i < suspectRds.length; i++) {
        if (suspectRds[i].checked) {
            valid = true;
        }
    }

    if (!valid) {
        err.classList.add('error');
        err.innerHTML = 'Must select a suspect';
        return false;
    } else {
        err.classList.remove('error');
        err.innerHTML = '';
        return true;
    }
}

function arrestSuspectByRadio() {
    if (suspectValid()) {
        sendSuspect();
        window.open('end.html', '_self');
    }
}

function winOrLose() {
    let suspect = sessionStorage.getItem('suspect');
    let win = (suspect == 'polly');
    if (win) {
        document.getElementById('solve').innerHTML = 'solved';
        document.getElementById('murdererName').innerHTML = 'Polly!';
        document.getElementById('murdererImg').src = 'images/bigpolly.png';
        document.getElementById('murdererImg').alt = 'Polly photo';
        document.getElementById('showMurdererBtn').onclick = null;
    } else {
        document.getElementById('solve').innerHTML = 'did not solve';
    }
}

function insertStats() {
    insertTime();
    insertPlays();
    insertClues();
}

function insertTime() {
    let startingDuration = sessionStorage.getItem('startingDuration');
    let remainingDuration = sessionStorage.getItem('duration');
    let timeUsed = startingDuration - remainingDuration;

    let minutes = Math.floor(timeUsed / 60);
    let seconds = timeUsed - (minutes * 60);

    if (minutes == 0) {
        document.getElementById('timeTaken').innerHTML = seconds + ' seconds';
    }
    else if (minutes == 1) {
        document.getElementById('timeTaken').innerHTML = minutes + ' minute, ' + seconds + ' seconds';
    }
    else {
        document.getElementById('timeTaken').innerHTML = minutes + ' minutes, ' + seconds + ' seconds';
    }
}

function insertPlays() {
    let currentPlayNum = sessionStorage.getItem('sessionPlays');
    document.getElementById('playCount').innerHTML = currentPlayNum;
}

function insertClues() {
    let clueCount = sessionStorage.getItem('cluesFound');
    document.getElementById('clueCount').innerHTML = clueCount;
}

function revealMurderer() {
    let sound = new Audio('sounds/dundundun.mp3');
    sound.play();

    document.getElementById('murdererName').innerHTML = 'Polly!';
    document.getElementById('murdererImg').src = 'images/bigpolly.png';
    document.getElementById('murdererImg').alt = 'Polly photo';

}

function playAgain() {
    window.open('start.html', '_self');
}




