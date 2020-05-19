const generateWave = (body) => {
    const canvas_count = document.querySelectorAll("canvas").length;
    const canvas = document.createElement("canvas");
    canvas.style.left = body.offsetLeft + "px";
    canvas.width = body.offsetWidth;
    canvas.height = body.offsetHeight / 10;
    canvas.style.top = body.offsetHeight - canvas_count*canvas.height + "px";
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.lineTo(0, 0);
    for (let i=0; i<body.offsetWidth / 10; i++) {
        const point = Math.random() * canvas.height;
        ctx.lineTo((1 + i) * 10, point);
    }
    ctx.lineTo(canvas.width, 10);
    ctx.lineTo(canvas.width, 100);
    ctx.lineTo(0, 100);
    ctx.strokeStyle = '#9F9FE7';
    ctx.lineWidth = 2;
    ctx.closePath();
    const grd = ctx.createLinearGradient(0, 0, 0, 13);
    grd.addColorStop(1, "#000");
    grd.addColorStop(0, "#9F9FE7");
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.stroke();
    body.appendChild(canvas);
    setTimeout(function() {
        canvas.style.top = -1.0 * canvas.height + "px";
    }, 100);
    setTimeout(function() {
        canvas.parentNode.removeChild(canvas);
    }, 1000);
}

document.addEventListener("DOMContentLoaded", function() {
    const body = document.querySelector("#art");
    console.log(body)
    setInterval(function() {generateWave(body);}, 200);
});
