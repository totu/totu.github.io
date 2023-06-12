// run on page load
function init() {
    const size_input = document.getElementById('size');
    size = size_input.value;
    const canvas = document.getElementById('canvas');
    const img = document.getElementById('img');
    let width = img.width;
    let height = img.height;
    if (width > height) {
        ratio = width / height;
        height = size / ratio;
        width = size ;
    } else {
        ratio = height / width;
        height = size * ratio
        width = size;
    }
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
    let data = imageData.data;
    const zoom = document.getElementById('zoom').value;
    data = resize(ctx, data, width, height, zoom);
    data = resize(ctx, data, width, height, 1);
    width = imageData.width;
    height = imageData.height;
    const dithered = dither(data, width, height);
    imageData.data.set(dithered);
    ctx.putImageData(imageData, 0, 0);
}

function resize(ctx, data, width, height, zoom) {
    // Draw the zoomed-up pixels to a different canvas context
    ctx.clearRect(0, 0, width, height);
    for (var x=0;x<width*zoom;++x){
      for (var y=0;y<height*zoom;++y){
        // Find the starting index in the one-dimensional image data
        var i = (y*width*zoom + x*zoom)*4;
        var r = data[i];
        var g = data[i+1];
        var b = data[i+2];
        var a = data[i+3];
        ctx.fillStyle = "rgba("+r+","+g+","+b+","+(a/255)+")";
        ctx.fillRect(x*zoom,y*zoom,zoom,zoom);
      }
    }
    const imageData = ctx.getImageData(0, 0, width, height);
    return imageData.data;
}

function get_pixel(data, width, x, y) {
    const i = y * width * 4 + x * 4;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    return [r, g, b];
}

function set_pixel(data, width, x, y, color) {
    const i = y * width * 4 + x * 4;
    data[i] = color;
    data[i + 1] = color;
    data[i + 2] = color;
    return data;
}

function dither(data, width, height) {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const gray = (r + g + b) / 3;
        const newR = gray;
        const newG = gray;
        const newB = gray;

        data[i] = newR;
        data[i + 1] = newG;
        data[i + 2] = newB / 100;
    }

    const da = document.getElementById('dither_amount');
    const dither_amount = (da.max - da.value) / 100;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++ ) {
            pixel = get_pixel(data, width, x, y);
            r = pixel[0];
            new_color = Math.round(r / 255) * 255 / dither_amount;
            error = r - new_color
            data = set_pixel(data, width, x, y, new_color)

            pixel = get_pixel(data, width, x + 1, y)
            r = pixel[0];
            r = r + error * 7 / 16
            data = set_pixel(data, width, x + 1, y, r)

            pixel = get_pixel(data, width, x - 1, y + 1)
            r = pixel[0];
            r = r + error * 3 / 16
            data = set_pixel(data, width, x - 1, y + 1, r)

            pixel = get_pixel(data, width, x, y + 1)
            r = pixel[0];
            r = r + error * 5 / 16
            data = set_pixel(data, width, x, y + 1, r)

            pixel = get_pixel(data, width, x + 1, y + 1)
            r = pixel[0];
            r = r + error * 1 / 16
            data = set_pixel(data, width, x + 1, y + 1, r)
        }
    }
    return data
}

window.onload = function() {
    const upload = document.getElementById('upload');
    const img = document.getElementById('img');
    upload.onchange = function (evt) {
        var tgt = evt.target || window.event.srcElement,
            files = tgt.files;
        // FileReader support
        if (FileReader && files && files.length) {
            var fr = new FileReader();
            fr.onload = function () {
                img.src = fr.result;
                const new_img = new Image();
                new_img.onload = function () {
                    img.width = new_img.width;
                    img.height = new_img.height;
                    setup();
                }
                new_img.src = fr.result;
            }
            fr.readAsDataURL(files[0]);
        }
        else {
            alert("something went wrong")
        }
    }
}

function setup() {
    const controls = document.getElementById('controls');
    controls.style.display = 'block';
    const upload_label = document.getElementById('upload_label');
    upload_label.style.display = 'none';

    init();
    const dither_amount = document.getElementById('dither_amount');
    const zoom = document.getElementById('zoom');
    const size_input = document.getElementById('size');
    const invert = document.getElementById('invert');
    dither_amount.oninput = init;
    zoom.oninput = init;
    size_input.oninput = init;
    invert.onchange = function () {
        const checked = invert.checked;
        const canvas = document.getElementById('canvas');
        canvas.style.filter = checked ? 'invert(100%)' : 'invert(0%)';
    }
}
