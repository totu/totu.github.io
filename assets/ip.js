const main = document.getElementById("main");
let inputs = [];

(function() {
    main.innerHTML = "loading...";
    html = '<label for="ip">IP Address</label><input name="ip" id="ip">'
    html += '<label for="remove-zeros">remove-zeros</label><input name="remove-zeros" id="remove-zeros" class="disabled_field_input">'
    html += '<label for="overflow">overflow</label><input name="overflow" id="overflow" class="disabled_field_input">'
    html += '<label for="bitshift">bitshift</label><input name="bitshift" id="bitshift" class="disabled_field_input">'
    html += '<label for="hexa">hexa</label><input name="hexa" id="hexa" class="disabled_field_input">'
    html += '<label for="binary">binary</label><input name="binary" id="binary" class="disabled_field_input">'
    main.innerHTML = html;
    window["remove-zeros"] = function(other) {
        let content = other.value;
        const own = document.getElementById("remove-zeros");
        content = content.split(".");
        let val = [];
        for (let i=0; i<content.length; i++) {
            const oct = content[i];
            if (oct * 1.0 != 0) {
                val.push(oct);
            }
        }
        val = val.join(".");
        own.value = val;
    }

    window["overflow"] = function(other) {
        let content = other.value;
        const own = document.getElementById("overflow");
        content = content.split(".");
        const second_last = content[2];
        let last = content[3];
        last = (second_last * 1.0) * 256 + (last * 1.0);
        own.value = [content[0], content[1], last].join(".");
    }

    window["hexa"] = function(other) {
        let content = other.value;
        const own = document.getElementById("hexa");
        content = content.split(".");
        let val = "";

        const hexlify = function(s) {
            let val = s * 1.0;
            if (val == 0)
                return "00";
            if (val < 10)
                return "0" + val;
            val = val.toString(16);
            if (val.length == 1)
                return "0" + val;
            return val;
        }

        for (let i=0; i<content.length; i++) {
            val += hexlify(content[i])
        }
        own.value = "0x" + val;
    }

    window["binary"] = function(other) {
        let content = other.value;
        const own = document.getElementById("binary");
        content = content.split(".");
        let val = "";
        for (let i=0; i<content.length; i++) {
            bin = (content[i] * 1.0).toString(2);
            let pad = "";
            for (let j=0; j<8-bin.length; j++) {
                pad += "0";
            }
            bin = pad + bin;
            val += bin;
        }
        own.value = val;
    }

    window["bitshift"] = function(other) {
        // >>> (127<<24) + (0<<16) + (0<<8) + 1
        const own = document.getElementById("bitshift");
        const hex = document.getElementById("hexa");
        let val = 0;
        val = parseInt(hex.value, 16);
        own.value = val;
    }

    const get_param = window.location.search.substr(1);

    if (get_param != "") {
        param = get_param.split("=");
        const child = document.getElementById("ip");
        child.value = param[1];
        window["remove-zeros"](child);
        window["overflow"](child);
        window["hexa"](child);
        window["binary"](child);
        window["bitshift"](child);
    }
})();

document.addEventListener("DOMContentLoaded", function() {
    const children = main.children;
    for (let i=0; i<children.length; i++) {
        const child = children[i];
        inputs.push(child);
        if (child.tagName == "INPUT") {
            child.onkeypress = function(evnt) {
                key = evnt.keyCode;
                if (key == 13) {
                    window["remove-zeros"](child);
                    window["overflow"](child);
                    window["hexa"](child);
                    window["binary"](child);
                    window["bitshift"](child);
                    return true;
                }
                if (key < 46 || key > 57) {
                    return false;
                }
            }
        }
    }
    document.getElementById("ip").focus();
});


