const scan = document.querySelector("#scan");
const main = document.querySelector("#main");
const results = {}
let ip = "localhost";

const reportPort = (type, socket) => {
    const delta = performance.now() - socket.start;
    const scanPort = socket.port;
    results[scanPort][type] = delta + "ms";
    main.innerHTML = "";
    let html = "<table>";
    for (port in results) {
        for (type in results[port]) {
            html += "<tr>";
            html += "<td>" + port + "</td>";
            html += "<td>" + type + "</td>";
            html += "<td>" + results[port][type] + "</td>";
            html += "</tr>";
        }
    }
    html += "</table>";
    main.innerHTML = html;
}

const websocket = (port) => {
    try {
        const socket = new WebSocket("ws://" + ip + ":" + port);
        socket.port = port;
        socket.start = performance.now();
        socket.onerror = () => { reportPort("websocket", socket); }
        socket.onopen = () => { reportPort("websocket", socket); }
    } catch(e) {
        console.log(ip, port)
        console.log("error:", e);
    }
}

const ajax = (port) => {
    const request = new XMLHttpRequest();
    request.port = port;
    request.start = performance.now()
    request.onreadystatechange = () => {
        if (request.readyState == 4) {
            reportPort("http", request);
        }
    };
    request.open("GET", ip + ":" + port, true);
    request.send();
}

const img = (port) => {
    const image = new Image();
    image.port = port;
    image.start = performance.now();
    image.onloadend = () => { reportPort("img", image); }
    image.src = ip + ":" + port + "/image.jpg";
}

const scanner = () => {
    for (port in results) {
        websocket(port);
        ajax(port);
        img(port);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    scan.addEventListener("click", () => {
        const ports = document.querySelector("#ports").value.split(",");
        ip = document.querySelector("#ip").value;
        for (i in ports) {
            const port = parseInt(ports[i]);
            if (typeof(port) == "number" && !(port in results))
                results[port] = {}
        }
        scanner();
    });
});
