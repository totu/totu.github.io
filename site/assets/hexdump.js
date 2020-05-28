const main = document.querySelector("#main");
const file = document.querySelector("#file");

// File system reader
const reader = new FileReader();

// Handle loading image from filesystem
reader.onload = (e) => {
    const content = atob(reader.result.split(",")[1]);
    const bytes = content.split('').map((x) => { return x.charCodeAt(0); });
    const hexa = bytes.map((x) => {
        x = x.toString(16);
        if (x.length == 1) {
            x = "0" + x;
        }
        return x;
    });
    main.innerHTML = "";
    let hex = "<div class='hex'>";
    let clear = "<div class='clear'>";
    for (i in hexa) {
        hex += "<div class='hexa h" + i + "'>" + hexa[i] + "</div>";
        clear += "<div class='hexa h" + i + "'>" + String.fromCharCode(parseInt(hexa[i], 16)) + "</div>";
    }
    hex += "</div>";
    clear += "</div>";
    main.innerHTML = hex + clear;
    document.querySelectorAll(".hexa").forEach((elem) => {
        // Mouseover hilight;
        elem.addEventListener("mouseover", () => {
            // Clear rest
            document.querySelectorAll("." + elem.classList[0]).forEach((e) => {
                e.classList.remove("yellow");
            });
            // hilight under mouse
            document.querySelectorAll("." + elem.classList[1]).forEach((e) => {
                e.classList.add("yellow");
            });
        });
        // Clear when mouse out side of square
        elem.addEventListener("mouseout", () => {
            document.querySelectorAll("." + elem.classList[1]).forEach((e) => {
                e.classList.remove("yellow");
            });
        });
    });
    // Clear previous selection
    document.addEventListener("mousedown",event=>{
        document.querySelectorAll(".hexa").forEach((elem) => {
            elem.classList.remove("cyan");
        });
    });
    // Selection
    document.addEventListener("selectionchange",event=>{
        const selection = document.getSelection ? document.getSelection() : document.selection.createRange() ;
        const elem = selection.focusNode.parentNode;
        document.querySelectorAll("." + elem.classList[1]).forEach((e) => {
            e.classList.add("cyan");
        });
    })
}


document.addEventListener("DOMContentLoaded", () => {
    file.addEventListener("change", () => {
        reader.readAsDataURL(file.files[0]);
    });
});
