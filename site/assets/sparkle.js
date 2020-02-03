let sparkle = function(elem, classes) {
    for (var i=0; i<banner.childElementCount; i++) {
        let child = banner.children[i];
        let cls = child.className;
        if (classes.indexOf(cls) != -1) {
            child.classList.remove(cls)
            var x = classes.indexOf(cls) + 1;
            if (x >= classes.length - 1) {
                x = 0;
            }
            child.classList.add(classes[x])
        }
    }
    setTimeout(function() { sparkle(elem, classes); }, 2000);
}

document.addEventListener("DOMContentLoaded", function() {
    let banner = document.getElementById("banner");
    var classes = ["alaviiva", "keno", "takakeno", "sulku"]
    // Cycle through the classes
    setTimeout(function() { sparkle(banner, classes); }, 2000);
});
