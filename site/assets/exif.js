const main = document.querySelector("#main");
const form = document.querySelector("#img");
let img = null;
let disp = null;
let c = 0;

// File system reader
const reader = new FileReader();

// Handle loading image from filesystem
reader.onload = (e) => {
    img.src = reader.result;
}

const parseExif = () => {
    const image = document.querySelector("img");
    main.style.borderBottom = "1px solid #333";
    disp.innerHTML = "";
    EXIF.getData(image, () => {
        const tags = EXIF.getAllTags(image);
        for (tag in tags) {
            drawData(tag, tags[tag]);
        }
    });
}

const drawData = (name, data) => {
    if (name == "thumbnail") return;
    let html = "";
    html += "<label class='cyan c" + c + "' for='" + name + "'>" + name + "</label>";
    html += "<input class='yellow c" + c + "' type='text' readonly='readonly' value='" + data + "'>";
    disp.innerHTML += html;
    if (c == 0) { c = 1 } else { c = 0 }
}

document.addEventListener("DOMContentLoaded", () => {
    // When image is selected draw info
    img = document.createElement("img");
    disp = document.createElement("div");
    img.style.display = "none";
    img.onload = parseExif;
    main.appendChild(img);
    main.appendChild(disp);
    form.addEventListener("change", () => {
        reader.readAsDataURL(form.files[0]);
    });
});
