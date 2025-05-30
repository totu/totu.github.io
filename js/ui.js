const tools = [];
const ui = {
    "wins": [],
    "activates": [],
    "style": null,
};

const winDressing = {
    "close": "x",
    "minimize": "^",
    "maximize": "^",
}

document.addEventListener('DOMContentLoaded', async function() {
    let wins = document.querySelectorAll('.window');
    wins.forEach(function(win) {
        prepare(win);
        ui.wins.push(win);
        win.style.top = "7.5em";
        win.style.left = "2.5em";
    });

    // hijack links
    hijackLinks();
});

const createWindow = function(title, content) {
    // Create elements
    const win = document.createElement('div');
    const titleElement = document.createElement('span');
    const body = document.createElement('div');

    // Add classes
    win.classList.add('window');
    titleElement.classList.add('title');
    titleElement.innerHTML = title;

    body.classList.add('body');

    // Extract scripts from content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    const scripts = tempDiv.querySelectorAll('script');
    scripts.forEach(script => {
        const newScript = document.createElement('script');
        if (script.src) {
            newScript.src = script.src;
        } else {
            newScript.textContent = script.textContent;
        }
        document.body.appendChild(newScript); 
    });

    // Remove scripts from content to avoid duplication
    scripts.forEach(s => s.remove());

    // Set sanitized content
    body.innerHTML = tempDiv.innerHTML;

    // Assemble and activate window
    win.appendChild(titleElement);
    win.appendChild(body);
    document.body.appendChild(win);
    findSpace(win);
    prepare(win);
    activate(win);
    ui.wins.push(win);
    hijackLinks();
}

const findSpace = function(win) {
    let x = 0;
    let y = 0;

    for (const win of ui.wins) {
        const width = win.offsetWidth;
        x += width + 10;
        if (x + width > window.innerWidth) {
            x = 0;
            y += win.offsetHeight + 10;
        }
    }

    win.style.left = x + "px";
    win.style.top = y + "px";
    win.style.width = "550px";
    win.style.height = "600px";
}

const activate = function(win) {
    ui.wins.forEach(function(uiwin) {
        uiwin.style.zIndex = 0;
        win.classList.remove('active');
    });
    win.style.zIndex = 1;
    const index = ui.activates.indexOf(win);
    if (index > -1) {
        ui.activates.splice(index, index+1);
    }
    ui.activates.push(win);
    for (const activate of ui.activates) {
        activate.style.zIndex = ui.activates.indexOf(activate);
    }
    win.classList.add('active');
}

const prepare = function(win) {
    win.addEventListener('click', function() {
        activate(win);
    });

    // Make draggable
    const title = win.querySelector('.title');
    dragElement(title);

    const fixButtons = function(thisWin) {
        const buttons = thisWin.querySelectorAll('.win-button');
        for (const button of buttons) {
            button.style.left = thisWin.offsetWidth - thisWin.children[0].offsetWidth + 40 - button.offsetWidth + 'px';
        }
        const title = thisWin.querySelector('.title');
        title.style.width = "100%";
    }

    // Add buttons
    for (const button in winDressing) {
        const buttonElement = document.createElement('button');
        buttonElement.classList.add(button);
        buttonElement.classList.add("win-button");
        buttonElement.innerHTML = winDressing[button];
        buttonElement.addEventListener('click', function() { win.classList.remove('active') });
        title.appendChild(buttonElement);
        fixButtons(win);
        const body = win.querySelector('.body');
        if (button == "close") {
            buttonElement.addEventListener('click', function() {
                win.remove()
                // remove from ui.wins
                const index = ui.wins.indexOf(win);

                if (index > -1) {
                    ui.wins.splice(index, 1);
                }
            });
        }
        if (button == "minimize") {
            buttonElement.addEventListener('click', function() {
                // find child with class body
                win.style.width = null;
                win.style.height = null;
                body.style.display = body.style.display == "none" ? "block" : "none";
                win.classList.toggle('minimized');
                win.classList.remove('maximized');
                fixButtons(win);
            });
        }
        if (button == "maximize") {
            buttonElement.addEventListener('click', function() {
                if (ui.style != null) {
                    win.style = ui.style;
                    ui.style = null;
                    win.style.width = "450px";
                    win.style.height = "600px";
                    findSpace(win);
                } else {
                    ui.style = win.style;
                    win.style = null;
                    body.style.display = "block";
                }
                win.classList.toggle('maximized');
                win.classList.remove('minimize');
                fixButtons(win);
            });
        }
    }
}

const print = function(text) {
    console.log(text);
}


function dragElement(title) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const elmnt = title.parentElement;
    title.addEventListener('mousedown', dragMouseDown);

    function dragMouseDown(e) {
        if (event.target != title) {
            return
        }
        activate(elmnt);
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
        elmnt.classList.add("dragging")
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2 - 16) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1 - 16) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
        elmnt.classList.remove("dragging")
    }
}

const openWindow = async function(e) {
    e.preventDefault();
    const link = e.target
    let href = link.getAttribute('href');
    if (href == null) {
        href = link.parentElement.getAttribute('href');
    }
    console.log(link)
    const resp = await fetch(href)
    const text = await resp.text()
    let title = link.getAttribute('title');
    if (title == null) {
	title = href.split('.')[0];
        if (title != "archive") {
            title = "archive" + title;
        }
    }
    createWindow(title, text);
}

const hijackLinks = function() {
    const links = document.querySelectorAll('a');
    for (const link of links) {
        if (link.classList.contains('post')) {
            if (link.hasEventListener) {
                continue;
            }
            link.hasEventListener = true;
            link.addEventListener('click', openWindow)
        }
    }
}
