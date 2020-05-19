const colors = ["#E8E8A0", "#9FE7E7", "#E79F9F", "#9F9FE7"]
let lastmousex = 0;
let lastmousey = 0;
let idle = undefined;
let demo_timer = undefined;

const drawMe = (canvas, x, y, size) => {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.strokeStyle = canvas.dataset.color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
}

const bubble = (inputx, inputy) => {
    const body = document.querySelector("body");
    const canvas = document.createElement("canvas");
    canvas.width = body.offsetWidth;
    canvas.height = body.offsetHeight;
    const x = inputx;
    const y = inputy;
    const size = Math.random() * 40;
    const color = colors[Math.floor(Math.random() * colors.length)]
    canvas.dataset.color = color;
    canvas.dataset.lastx = lastmousex;
    canvas.dataset.lasty = lastmousey;
    canvas.dataset.x = x;
    canvas.dataset.y = y;
    lastmousey = y;
    lastmousex = x;
    canvas.dataset.size = size;
    drawMe(canvas, x, y, size);
    body.appendChild(canvas);
}

const demo = () => {
    idle = setInterval(() => {
        const body = document.querySelector("body");
        const x = Math.random() * body.offsetWidth;
        const y = Math.random() * body.offsetHeight;
        xdelta = Math.random() < 0.5 ? -1 : 1;
        ydelta = Math.random() < 0.5 ? -1 : 1;
        lastmousex = x + xdelta;
        lastmousey = y + ydelta;
        bubble(x, y);
    }, 500);
}

document.addEventListener("mousemove", (mouseEvent) => {
    clearTimeout(demo_timer);
    bubble(mouseEvent.clientX, mouseEvent.clientY);
    if (idle != 0) {
        clearInterval(idle);
        idle = 0;
    }
    demo_timer = setTimeout(() => {demo();} , 3000);
});


document.addEventListener("DOMContentLoaded", () => {
    demo();
    setInterval(() => {
        const body = document.querySelector("body");
        const canvases = document.querySelectorAll("canvas");
        canvases.forEach((canvas) => {
            const x = parseFloat(canvas.dataset.x);
            const y = parseFloat(canvas.dataset.y);
            const size = parseFloat(canvas.dataset.size);
            const lastx = parseFloat(canvas.dataset.lastx);
            const lasty = parseFloat(canvas.dataset.lasty);
            let xdelta = x - lastx;
            let ydelta = y - lasty;
            let movex = x + xdelta
            let movey = y + ydelta
            drawMe(canvas, movex, movey, size);
            canvas.dataset.lastx = x;
            canvas.dataset.lasty = y;
            canvas.dataset.x = movex;
            canvas.dataset.y = movey;
            canvas.dataset.xdelta = xdelta;
            canvas.dataset.ydelta = ydelta;
            if (x > body.offsetWidth + size || x < 0-size || y > body.offsetHeight+size || y < 0-size) {
                canvas.parentNode.removeChild(canvas);
            }
        });
    }, 50);
});
