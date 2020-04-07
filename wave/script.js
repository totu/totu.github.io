let height = null;
let width = null;
const waveCount = 10

const generateWave = (body) => {
    const canvas = document.createElement("canvas");
    canvas.style.top = height + "px";
    canvas.width = width;
    canvas.height = height / waveCount;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.lineTo(0, 0);
    for (let i=0; i<width / 10; i++) {
        const point = Math.random() * canvas.height;
        ctx.lineTo((1 + i) * width / 20, point);
    }
    ctx.lineTo(canvas.width, 10);
    ctx.lineTo(canvas.width, 100);
    ctx.lineTo(0, 100);
    ctx.strokeStyle = '#9F9FE7';
    ctx.lineWidth = 2;
    ctx.closePath();
    const grd = ctx.createLinearGradient(0, 0, 0, canvas.height/2 );
    grd.addColorStop(1, "#000");
    grd.addColorStop(0, "#9F9FE7");
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.stroke();
    body.appendChild(canvas);
    setTimeout(function() {
        canvas.style.top = -1.0 * (height + canvas.height) + "px";
    },10);
    setTimeout(function() {
        canvas.parentNode.removeChild(canvas);
    }, 10000);
}

document.addEventListener("DOMContentLoaded", function() {
    const body = document.querySelector("body");
    width = body.offsetWidth;
    height = document.documentElement.clientHeight;
    setInterval(function() {generateWave(body);}, 250);
});
