const scan = document.querySelector("#scan");
const main = document.querySelector("#main");
const results = {}

const reportPort = (socket) => {
    const delta = performance.now() - socket.start;
    const scanPort = socket.port;
    results[scanPort] = delta + "ms";
    main.innerHTML = "";
    let html = "<table>";
    for (port in results) {
        html += "<tr>";
        html += "<td>" + port + "</td>";
        html += "<td>" + results[port] + "</td>";
        html += "</tr>";
    }
    html += "</table>";
    main.innerHTML = html;
}

const scanner = () => {
    for (port in results) {
        try {
            const socket = new WebSocket("ws://localhost:" + port);
            socket.start = performance.now();
            socket.port = port;
            socket.onerror = () => { reportPort(socket); }
            socket.onopen = () => { reportPort(socket); }
        } catch(e) {
            console.log("error:", e);
            reportPort(port, e)
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    scan.addEventListener("click", () => {
        const ports = document.querySelector("#ports").value.split(",");
        const ip = document.querySelector("#ip");
        for (i in ports) {
            const port = parseInt(ports[i]);
            if (typeof(port) == "number" && !(port in results))
                results[port] = "not scanned"
        }
        scanner();
    });
});
