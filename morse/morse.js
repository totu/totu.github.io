(function() {
    let main = document.getElementById("article");
    main.innerHTML = "";
})();

//Amazing cross browser support
if (window.AudioContext === undefined)
    var audio = new window.webkitAudioContext();
else
    var audio = new window.AudioContext();

document.addEventListener("DOMContentLoaded", function() {
    let main = document.getElementById("article");
    main.innerHTML = "";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'morse.content');
    xhr.send(null);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                main.innerHTML = xhr.responseText;
                console.log(xhr.responseText);
            }
        }
    };
});

var volctrl = audio.createGain();
var synth = audio.createOscillator();

synth.frequency.value = 500;
volctrl.connect(audio.destination);
synth.start();
volctrl.gain.value = 0.5;

var press_length = 0;
var between_time = 0;
let unit = 50;
var waitr = null;
var current_character = '';

var change_freq = function() {
    var elem = document.getElementById('freq');
    synth.frequency.value = parseInt(elem.value);
};

var change_unit_len = function() {
    var elem = document.getElementById('unit');
    unit = parseInt(elem.value);
};

var end_checker = setInterval(function() {
    if (between_time > 7*unit) {
        clearInterval(waitr);
        newChar();
        between_time = 0;
    }
}, unit);

let start = function() {
    press_length = 0;
    clearInterval(waitr);
    if (between_time > 3*unit) {newChar()}
    synth.connect(volctrl);
    waitr = setInterval(function() {press_length += unit}, unit);
    between_time = 0;
};

let stop = function() {
    synth.disconnect();
    clearInterval(waitr);
    waitr = setInterval(function() {between_time += unit}, unit);
    console.log(press_length);
    if (press_length < 3*unit)
        press = '.';
    else
        press = '-';
    current_character += press;
    press_length = 0;
    drawChar();
};

let drawChar = function() {
    var elem = document.getElementById('current-char');
    if (current_character.length > 0) {
        elem.innerHTML = current_character.slice(0, current_character.length-1) + "<span class='hilight'>" + current_character[current_character.length-1] + "</span>";
    } else {
        elem.innerText = "";
    }

};

let newChar = function() {
    var elem = document.getElementById('text');
    elem.value += morse2text(current_character);
    current_character = '';
    drawChar();
};

let volume = function() {
    var elem = document.getElementById('volume');
    var disp = document.getElementById('volume-label');
    volctrl.gain.value = elem.value/100;
};

let play = function() {
    var elem = document.getElementById('text');
    var txt = elem.value;
    morse = "";
    for (var i=0; i<txt.length; i++) {
        morse += text2morse(txt.charAt(i).toUpperCase());
    }
    var elem = document.getElementById('current-char');
    elem.innerText = morse.replace(new RegExp('@', 'g'), ' ');
    do_morse(elem, morse, 0);
};

let do_morse = function(e, s, i) {
    if (s.length > i) {
        txt = e.innerText;
        e_txt = txt.substring(0, i) + "<span class='hilight'>" + txt[i] + "</span>" + txt.slice(i+1);
        e.innerHTML = e_txt;

        if (s.charAt(i) == ".") {
            synth.connect(volctrl);
            setTimeout(function() { synth.disconnect(); }, unit);
            setTimeout(function() { do_morse(e, s, i+1); }, 3*unit);
        } else if (s.charAt(i) == "@") {
            setTimeout(function() { do_morse(e, s, i+1); }, 7*unit);
        } else {
            synth.connect(volctrl);
            setTimeout(function() { synth.disconnect(); }, 3*unit);
            setTimeout(function() { do_morse(e, s, i+1); }, 6*unit);
        }
    } else {
        setTimeout(function() {
            e.innerText = '';
        }, 3*unit);
    }
};

let morse2text = function(s) {
    switch(s) {
        case '.-':
            return 'A';
        case '-...':
            return 'B';
        case '-.-.':
            return 'C';
        case '-..':
            return 'D';
        case '.':
            return 'E';
        case '..-.':
            return 'F';
        case '--.':
            return 'G';
        case '....':
            return 'H';
        case '..':
            return 'I';
        case '.---':
            return 'J';
        case '-.-':
            return 'K';
        case '.-..':
            return 'L';
        case '--':
            return 'M';
        case '-.':
            return 'N';
        case '---':
            return 'O';
        case '.--.':
            return 'P';
        case '--.-':
            return 'Q';
        case '.-.':
            return 'R';
        case '...':
            return 'S';
        case '-':
            return 'T';
        case '..-':
            return 'U';
        case '...-':
            return 'V';
        case '.--':
            return 'W';
        case '-..-':
            return 'X';
        case '-.--':
            return 'Y';
        case '--..':
            return 'Z';
        case '.----':
            return '1';
        case '..---':
            return '2';
        case '...--':
            return '3';
        case '....-':
            return '4';
        case '.....':
            return '5';
        case '-....':
            return '6';
        case '--...':
            return '7';
        case '---..':
            return '8';
        case '----.':
            return '9';
        case '-----':
            return '0';
        default:
            return '';
    }
};

let text2morse = function(s) {
    s = s.toUpperCase();
    switch(s) {
        case 'A':
            return '.-';
        case 'B':
            return '-...';
        case 'C':
            return '-.-.';
        case 'D':
            return '-..';
        case 'E':
            return '.';
        case 'F':
            return '..-.';
        case 'G':
            return '--.';
        case 'H':
            return '....';
        case 'I':
            return '..';
        case 'J':
            return '.---';
        case 'K':
            return '-.-';
        case 'L':
            return '.-..';
        case 'M':
            return '--';
        case 'N':
            return '-.';
        case 'O':
            return '---';
        case 'P':
            return '.--.';
        case 'Q':
            return '--.-';
        case 'R':
            return '.-.';
        case 'S':
            return '...';
        case 'T':
            return '-';
        case 'U':
            return '..-';
        case 'V':
            return '...-';
        case 'W':
            return '.--';
        case 'X':
            return '-..-';
        case 'Y':
            return '-.--';
        case 'Z':
            return '--..';
        case '1':
            return '.----';
        case '2':
            return '..---';
        case '3':
            return '...--';
        case '4':
            return '....-';
        case '5':
            return '.....';
        case '6':
            return '-....';
        case '7':
            return '--...';
        case '8':
            return '---..';
        case '9':
            return '----.';
        case '0':
            return '-----';
        case ' ':
            return '@';
        default:
            return '';
    }
};

