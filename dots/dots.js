let main = document.getElementById("main");

(function() {
    main.innerHTML = "";
})();

let get = function(title, url, cb, syntax) {
    var ajax = new XMLHttpRequest();
    ajax.open("GET", url, true);
    ajax.onreadystatechange = function () {
        if (ajax.readyState != 4 || ajax.status != 200) return undefined;
        cb(ajax.responseText, syntax, title);
    };
    ajax.send();
}

let sanitize = function(txt) {
    return txt.replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}


let highlight = function(txt, syntax) {
    /* Add highlighted syntax from given list of syntax words */
    for (var i=0; i<syntax.length; i++) {
        let regex = new RegExp("(" + syntax[i][1] + ")", syntax[i][2]);
        txt = txt.replace(regex, "<span class='dot-syntax " + syntax[i][0] + "'>$1</span>");
    }
    return txt
}

let print = function(txt, syntax, title) {
    html = "<h1>" + title + "</h1>";
    last_was_comment = false;    // this keeps track of "code blocks" and comments

    // Go over whole file line by line
    txt = txt.split("\n");
    for (var i=0; i<txt.length; i++) {
        let row = sanitize(txt[i])

        // Handle comments
        if (row.startsWith('&quot;')) {
            // If last row was code, close "code block" first
            if (!last_was_comment) {
                html += "</div>";
            }
            html += "<p class='dot-comment'>" + row.substring(6).trim() + "</p>";
            last_was_comment = true;

        // Handle code lines
        } else {
            // If this row only has spaces, skip it
            if (row.trim() == "") continue;

            // If last line was comment, start a "code block"
            if (last_was_comment) {
                html += "<div class='dot-section'>";
            }
            html += "<p class='dot-code'>";

            // Add syntax highlights
            row = highlight(row, syntax);

            html += row.trim();
            html += "</p>";
            last_was_comment = false;
        }
    }
    main.innerHTML = html;
}

let add_tag = function(tag, keywords, flag="i") {
    var syntax = [];
    for (var i=0; i<keywords.length; i++) {
        syntax.push([tag, keywords[i], flag]);
    }
    return syntax;
}

let vim_syntag_generator = function() {
    let vim_keywords = ["let ", " set ", "^set ", "call ", "if ", "endif", "abbrev ", "au ", "colorscheme ", "inoremap", "tnoremap", "vnoremap ", "nnoremap ", "noremap ", "function! ", "endfunction", "autocmd ", "inoremap ", "command! ", "execute ", "vmap ", "nmap ", "cmap ", "map "];
    let vim_plugin_words = [",", "= ", "Plugin ", "filetype ", "^syntax ", ":"]
    let vim_keybinds = ["&lt;.+?&gt;"];
    var vim_syntax = [["cyan", "&quot; .*", "i"]];
    vim_syntax = vim_syntax.concat(add_tag("yellow", vim_plugin_words))
    vim_syntax = vim_syntax.concat(add_tag("purple", vim_keybinds, "g"))
    vim_syntax = vim_syntax.concat(add_tag("red", vim_keywords))
    return vim_syntax;
}

document.addEventListener("DOMContentLoaded", function() {
    let vim_syntax = vim_syntag_generator();
    get(".vimrc", "https://topituulensuu.com/dotfiles/vimrc", print, vim_syntax);
});
