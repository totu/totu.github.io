const loc = window.location.toString().split("/");
const file = loc[loc.length-2];
const main = document.getElementById("main");
(function() {
    if (file != "dots")
        main.innerHTML = "loading...";
})();

const get = function(title, url, cb, comment, syntax) {
    const ajax = new XMLHttpRequest();
    ajax.open("GET", url, true);
    ajax.onreadystatechange = function () {
        if (ajax.readyState != 4 || ajax.status != 200) return undefined;
        cb(ajax.responseText, syntax, comment, title);
    };
    ajax.send();
}

const sanitize = function(txt) {
    return txt.replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}


const highlight = function(txt, syntax) {
    /* Add highlighted syntax from given list of syntax words */
    for (let i=0; i<syntax.length; i++) {
        let regex = new RegExp("(" + syntax[i][1] + ")", syntax[i][2]);
        txt = txt.replace(regex, "<span class='dot-syntax " + syntax[i][0] + "'>$1</span>");
    }
    return txt
}

const print = function(txt, syntax, comment, title) {
    document.title += title
    let html = "<h1>" + title + "</h1>";
    last_was_comment = false;    // this keeps track of "code blocks" and comments

    // Go over whole file line by line
    txt = txt.split("\n");
    for (let i=0; i<txt.length; i++) {
        let row = sanitize(txt[i])

        // Handle comments
        if (row.startsWith(comment)) {
            // If last row was code, close "code block" first
            if (!last_was_comment) {
                html += "</div>";
            }
            // Remove ending ] if git style heading
            if (row.endsWith("]")) {
                row = row.substring(0, row.length-1)
            }
            html += "<p class='dot-comment'>" + row.substring(comment.length).trim() + "</p>";
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

const add_tag = function(tag, keywords, flag="i") {
    let syntax = [];
    for (let i=0; i<keywords.length; i++) {
        syntax.push([tag, keywords[i], flag]);
    }
    return syntax;
}

const vim_syntag_generator = function() {
    const vim_keywords = ["let ", " set ", "^set ", "call ", "if ", "endif", "abbrev ", "au ", "colorscheme ", "inoremap", "tnoremap", "vnoremap ", "nnoremap ", "noremap ", "function! ", "endfunction", "autocmd ", "inoremap ", "command! ", "execute ", "vmap ", "nmap ", "cmap ", "map "];
    const vim_plugin_words = [",", "= ", "Plugin ", "filetype ", "^syntax ", ":"]
    const vim_keybinds = ["&#039.+?&#039", "&lt;.+?&gt;"];
    let vim_syntax = [["cyan", "&quot; .*", "i"]];
    vim_syntax = vim_syntax.concat(add_tag("yellow", vim_plugin_words))
    vim_syntax = vim_syntax.concat(add_tag("purple", vim_keybinds, "g"))
    vim_syntax = vim_syntax.concat(add_tag("red", vim_keywords))
    return vim_syntax;
}

const tmux_syntag_generator = function() {
    const tmux_keywords = ["run-shell", "set-window-option", "^set-option", "setw", "^set"];
    const tmux_plugin_words = ["&#039.+?&#039", " on", " off", "unbind-key", "bind-key", "unbind", "bind"]
    const tmux_keybinds = [" -[a-zA-Z]+", "&quot;.*&quot;", "&lt;.+?&gt;"];
    let tmux_syntax = [["cyan", "# .*", "i"]];
    tmux_syntax = tmux_syntax.concat(add_tag("yellow", tmux_plugin_words))
    tmux_syntax = tmux_syntax.concat(add_tag("purple", tmux_keybinds, "g"))
    tmux_syntax = tmux_syntax.concat(add_tag("red", tmux_keywords))
    return tmux_syntax;
}

document.addEventListener("DOMContentLoaded", function() {
    const dot_files = {
        "vimrc": {"url": "https://topituulensuu.com/dotfiles/vimrc", "syntax": vim_syntag_generator(), "comment": "&quot;"},
        "tmux.conf": {"url": "https://topituulensuu.com/dotfiles/tmux.conf", "syntax": tmux_syntag_generator(), "comment": "#"},
        "gitconfig": {"url": "https://topituulensuu.com/dotfiles/gitconfig", "syntax": vim_syntag_generator(), "comment": "["}
    }
    if (file in dot_files) {
        url = dot_files[file]["url"]
        syntax = dot_files[file]["syntax"]
        comment = dot_files[file]["comment"]
        get(file, url, print, comment, syntax);
    }
});
