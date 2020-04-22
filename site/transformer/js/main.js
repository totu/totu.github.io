/* I'm sorry this is such bloat */
(function() {
    $('#main').html('');
})();

var INPUT = '';
const formats = ['plain', 'reverse', 'hex', 'binary', 'base32', 'base64', 'morse', 'caesar', 'rotate', 'rot13', 'rot47'];
const hashes = ['MD5', 'SHA1', 'SHA256', 'alphabet', 'capitals'];
const ALPHABET = 'abcdefghijklmnopqrstuvwxyzåäö';

$(document).ready(function() {
    $('#main').html('');
    var main_html = '';
    var fields = formats.concat(hashes);
    for (var i=0; i<fields.length; i++) {
        var field = fields[i];
        var label = `<label for=${field}>${field}</label>`
        if (formats.indexOf(field) != -1) {
            var input = `<input name=${field} id=${field} class='field_input'>`
        } else {
            var input = `<input disabled=true name=${field} id=${field} class='disabled_field_input'>`
        }
        main_html += `<div class='field'>${label} ${input}</div>`;

    }
    $('#main').html(main_html);
    $('.field').each(function(iter, elem) {
        $(elem).keyup(function(sender) {
            var id = sender.target.id;
            update_input(id);
        });
    });
    let get_param = window.location.search.substr(1);
    if (get_param != "") {
        param = get_param.split("=");
        console.log(param)
        $('.field').each(function(iter, elem) {
            if (elem.lastChild.id == param[0]) {
                elem.lastChild.value = param[1];
                update_input(param[0]);
            }
        });
    }
});

const update_input = function(id) {
    $('.field').each(function(iter, elem) {
        var value = $(`#${id}`).val();
        if (id == 'plain') {
            INPUT = value;
        } else {
            if (id == 'reverse')
                INPUT = reverse(value);
            if (id == 'hex')
                INPUT = from_hex(value);
            if (id == 'binary')
                INPUT = from_binary(value);
            if (id == 'base32')
                INPUT = from_b32(value);
            if (id == 'base64')
                INPUT = from_b64(value);
            if (id == 'morse')
                INPUT = from_morse(value);
            if (id == 'caesar')
                INPUT = from_caesar(value, int=1);
            if (id == 'rotate')
                INPUT = from_caesar(value, int=1, rotate=1);
            if (id == 'rot13')
                INPUT = from_rot(value.toLowerCase(), from=26, to=122, amount=13);
            if (id == 'rot47')
                INPUT = from_rot(value, from=33, to=126, amount=47);
        }
        update_fields(id);
    });
};

const update_fields = function(edited_field) {
    $('.field').each(function(iter, elem) {
        var id = $($(elem).children()[1]).prop('id');
        if (id != edited_field) {
            var output = INPUT;
            if (id == 'reverse')
                output = reverse(output);
            if (id == 'hex')
                output = to_hex(output);
            if (id == 'binary')
                output = to_binary(output);
            if (id == 'base32')
                output = to_b32(output);
            if (id == 'base64')
                output = to_b64(output);
            if (id == 'SHA256') {
                if (output != '')
                    output = CryptoJS.SHA256(output).toString();
            }
            if (id == 'SHA1') {
                if (output != '')
                    output = CryptoJS.SHA1(output).toString();
            }
            if (id == 'MD5') {
                if (output != '')
                    output = CryptoJS.MD5(output).toString();
            }
            if (id == 'alphabet')
                output = to_alphabet_indecies(output);
            if (id == 'morse')
                output = to_morse(output);
            if (id == 'capitals')
                output = only_capital_words(output);
            if (id == 'caesar')
                output = to_caesar(output, int=1);
            if (id == 'rotate')
                output = to_caesar(output, int=1, rotate=1);
            if (id == 'rot13')
                output = to_rot(output.toLowerCase(), from=97, to=122, amount=13);
            if (id == 'rot47')
                output = to_rot(output, from=33, to=126, amount=47);
            $($(elem).children()[1]).val(output);
        }
    });
};

const to_rot = (input, from, to, amount) => {
    var result = "";
    for (i=0; i<input.length; i++) {
        let chrCode = input.charCodeAt(i) + amount;
        while (chrCode > to) {
            chrCode -= (to-from+1)
        }
        result += String.fromCharCode(chrCode);
    }
    return result
}

const from_rot = (input, from, to, amount) => {
    var result = "";
    for (i=0; i<input.length; i++) {
        let chrCode = input.charCodeAt(i) - amount;
        while (chrCode < to ) {
            chrCode += (to-from+1)
        }
        result += String.fromCharCode(chrCode);
    }
    return result
}

const to_hex = function(input){
    var result = "";
    for (i=0; i<input.length; i++) {
        result += input.charCodeAt(i).toString(16);
    }
    return result
};

const from_hex = function(input){
    var hexes = input.match(/.{1,2}/g) || [];
    var plain = "";
    for(i = 0; i<hexes.length; i++) {
        plain += String.fromCharCode(parseInt(hexes[i], 16));
    }
    return plain;
};

const to_binary = function(input){
    return ABC.toBinary(input, 0);
};

const from_binary = function(input){
    return ABC.toAscii(input);
};

const reverse = function(input) {
    return input.split('').reverse().join('')
};

// ABC - a generic, native JS (A)scii(B)inary(C)onverter.
// (c) 2013 Stephan Schmitz <eyecatchup@gmail.com>
// License: MIT, http://eyecatchup.mit-license.org
// URL: https://gist.github.com/eyecatchup/6742657
const ABC = {
  toAscii: function(bin) {
    return bin.replace(/\s*[01]{8}\s*/g, function(bin) {
      return String.fromCharCode(parseInt(bin, 2))
    })
  },
  toBinary: function(str, spaceSeparatedOctets) {
    return str.replace(/[\s\S]/g, function(str) {
      str = ABC.zeroPad(str.charCodeAt().toString(2));
      return !1 == spaceSeparatedOctets ? str : str + " "
    })
  },
  zeroPad: function(num) {
    return "00000000".slice(String(num).length) + num
  }
};

const to_b32 = function(str) {
    return base32.encode(str);
};

const from_b32 = function(str) {
    return base32.decode(str);
};

const to_b64 = function(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
};

const from_b64 = function(str) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
};

const to_alphabet_indecies = function(str) {
    list = str.split("");
    output = [];
    list.forEach(function(letter) {
        let index = ALPHABET.indexOf(letter);
        if (index != -1)
            output.push(index+1);
    });
    return output.join(" ");
};

const morse_to_text = function(s) {
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
            return ' ';
    }
};

const text_to_morse = function(s) {
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
            return ' ';
        default:
            return '';
    }
};

const from_morse = function(str) {
    list = str.split(" ");
    output = [];
    list.forEach(function(letter) {
        output.push(morse_to_text(letter));
    });
    return output.join(" ");
};

const to_morse = function(str) {
    list = str.split("");
    output = [];
    list.forEach(function(letter) {
        output.push(text_to_morse(letter));
    });
    return output.join(" ");
};

const only_capital_words = function(str) {
    list = str.split(" ");
    output = [];
    list.forEach(function(word) {
        if (word.charAt(0).toUpperCase() === word.charAt(0))
            output.push(word);
    });
    return output.join(" ");
};

const to_caesar = function(str, int, rotate=0) {
    r = 0
    list = str.toLowerCase().split("");
    output = [];
    list.forEach(function(letter) {
        if (letter == " ") {
            output.push(letter);
        } else {
            c = letter.charCodeAt(0) + int + r;
            if (c > 122) c = c - 26
            output.push(String.fromCharCode(c))
            r = r + rotate;
        }
    });
    return output.join("");
}

const from_caesar = function(str, int, rotate=0) {
    r = 0
    list = str.toLowerCase().split("");
    output = [];
    list.forEach(function(letter) {
        if (letter == " ") {
            output.push(letter);
        } else {
            c = letter.charCodeAt(0) - int - r;
            if (c < 97) c = c + 26
            output.push(String.fromCharCode(c))
            r = r + rotate;
        }
    });
    return output.join("");
}
