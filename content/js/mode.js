let current_mode = 'dark';
const colors = {
    "--dark-gold": {
        "dark": "#0f0f0c",
        "light": "#b0daff"
    },
    "--gold": {
        "dark": "#99835c",
        "light": "#b0daff"
    },
    "--blue": {
        "dark": "#69d3ff",
        "light": "#b0daff"
    },
    "--pink": {
        "dark": "#ff3eb5",
        "light": "#ffb4b4"
    },
    "--yellow": {
        "dark": "#ffe900",
        "light": "#feff86",
    },
    "--always-black": {
        "dark": "#000",
        "light": "#000"
    },
    "--black": {
        "dark": "#000",
        "light": "#fff"
    },
    "--white": {
        "dark": "#fff",
        "light": "#000"
    },
    "--red": {
        "dark": "#f40e00",
        "light": "#ffb4b4"
    },
    "--orange": {
        "dark": "#f7a500",
        "light": "#b0daff"
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const mode = localStorage.getItem('mode');
    if (mode) {
        current_mode = mode;
        toggleMode(mode);
    }
});

function toggleMode(mode) {
    for (const color in colors) {
        document.documentElement.style.setProperty(color, colors[color][mode]);
    }
    localStorage.setItem('mode', mode);
}
