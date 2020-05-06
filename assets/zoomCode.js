const add_tag = (tag, keywords, flag="i") => {
    let syntax = [];
    for (let i=0; i<keywords.length; i++) {
        syntax.push([tag, keywords[i], flag]);
    }
    return syntax;
}

const highlight = (txt, syntax) => {
    /* Add highlighted syntax from given list of syntax words */
    for (let i=0; i<syntax.length; i++) {
        let regex = new RegExp("(" + syntax[i][1] + ")", syntax[i][2]);
        txt = txt.replace(regex, "<span class='" + syntax[i][0] + "'>$1</span>");
    }
    return txt
}

const syntag_generator = () => {
    const variables = ["&amp", "&quot.+&quot","undefined\\d ", "undefined ", "null ", "None ", "uint\\d ", "uint ", "int\\d ", "int ", "char ", "chr ", "ulong"]
    const core = ["for ", "in ", "&lt&#61", "&lt", "&gt", "return", "if", "else", "{", "}", "!&#61", "&#61&#61", "&#61", ";$", "&#43", "import ", "#!.*"]
    const other = ["&#42", "&#94", "&#41", " [a-zA-Z0-9_-]+&#40", "print&#40"]
    const brax = ["&#43", "&#42", "&#94", "&#93", "&#91", "&#40", "&#41", "&#40", ","]
    const multi = ["&gt", "&lt", "%s", "%i"]
    let syntax = [["cyan", "# .*", "i"]]   // comments
    syntax = syntax.concat(add_tag("yellow", variables))
    syntax = syntax.concat(add_tag("purple", core))
    syntax = syntax.concat(add_tag("cyan", other))
    syntax = syntax.concat(add_tag("cyan", brax, "g"))
    syntax = syntax.concat(add_tag("purple", multi, "g"))
    return syntax;
}

const sanitize = function(txt) {
    return txt.replace(/&/g, "&amp")
         .replace(/<=/g, "&lt&#61")
         .replace(/</g, "&lt")
         .replace(/#amp#/g, "&amp")
         .replace(/#gt#/g, "&gt")
         .replace(/#lt#/g, "&lt")
         .replace(/>/g, "&gt")
         .replace(/"/g, "&quot")
         .replace(/'/g, "&#039")
         .replace(/=/g, "&#61")
         .replace(/\+/g, "&#43")
         .replace(/\[/g, "&#91")
         .replace(/\]/g, "&#93")
         .replace(/\\/g, "&#92")
         .replace(/\^/g, "&#94")
         .replace(/\)/g, "&#41")
         .replace(/\(/g, "&#40")
         .replace(/\*/g, "&#42")
}

document.addEventListener("DOMContentLoaded", () => {
    const pres = document.querySelectorAll("pre");
    pres.forEach((pre) => {
        if (pre.children.length == 1) {
            const code = pre.childNodes[0];
            if (code.tagName == "CODE") {
                // Highlight
                const rows = code.innerHTML.split("\n");
                let colored = [];
                for (i in rows) {
                    const row = rows[i]
                        .replace(/&gt;/g, "#gt#")
                        .replace(/&lt;/g, "#lt#")
                        .replace(/&amp;/g, "#amp#");
                    colored.push(highlight(sanitize(row), syntag_generator()));
                }
                code.innerHTML = colored.join("\n");

                // Add toggle
                code.dataset.toggle = true;
                pre.addEventListener("click", () => {
                    if (code.dataset.toggle == "true") {
                        code.style.position = "relative";
                        code.style.left = -1.0 * (code.offsetLeft - 25)+ "px";
                        code.style.width = window.innerWidth - 100 + "px";
                        code.dataset.toggle = false;
                    } else {
                        code.style.left = 0;
                        code.style.width = "500px";
                        code.dataset.toggle = true;
                    }
                });
            }
        }
    });
});
