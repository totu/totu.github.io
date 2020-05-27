const scan = document.querySelector("#scan");
const main = document.querySelector("#main");
const results = {}
let normalSort = true;
let lastSort = 0;
let ip = "127.0.0.1";
let last = 0

const reportPort = (type, socket) => {
    let delta = (performance.now() - socket.start);
    const tmp = last;
    last = delta;
    delta = delta - tmp;
    const scanPort = socket.port;
    results[scanPort][type] = delta + "ms";
    main.innerHTML = "";
    let html = "<table>";
    html += "<tr>";
    html += "<th>port</th>";
    html += "<th>time</th>";
    html += "</tr>";
    for (port in results) {
        for (type in results[port]) {
            html += "<tr>";
            html += "<td>" + port + "</td>";
            html += "<td>" + results[port][type] + "</td>";
            html += "</tr>";
        }
    }
    html += "</table>";
    main.innerHTML = html;
    document.querySelectorAll('th').forEach((th) => {
        th.addEventListener("click", () => {
            sortTableBy(th.innerHTML);
        });
    });
}

const sortTableBy = (column) => {
    let table = document.querySelector("table");
    const content = []
    for (row in table.rows) {
        const temp = [];
        try {
            table.rows[row].childNodes.forEach((node) => {
                temp.push(node.innerHTML)
            });
            content.push(temp)
        } catch (e) {
            console.log(e)
        }

    }
    // header is the first element, pop it
    const header = content.shift();
    const sortingIndex = header.indexOf(column);
    if (lastSort == sortingIndex && normalSort) {
        content.sort(function(a,b){return a[sortingIndex].localeCompare(b[sortingIndex]);});
        normalSort = false;
    } else {
        content.sort(function(a,b){return b[sortingIndex].localeCompare(a[sortingIndex]);});
        normalSort = true;
    }
    lastSort = sortingIndex;
    let html = "<tr><th>" + header[0] + "</th>";
    html += "<th>" + header[1] + "</th></tr>";
    for (let i=0; i<content.length; i++) {
        html += "<tr>";
        html += "<td>" + content[i][0] + "</td>";
        html += "<td>" + content[i][1] + "</td>";
        html += "</tr>";
    }
    table.innerHTML = html;
    document.querySelectorAll('th').forEach((th) => {
        th.addEventListener("click", () => {
            sortTableBy(th.innerHTML);
        });
    });
}

const websocket = (port) => {
    try {
        const socket = new WebSocket("ws://" + ip + ":" + port);
        socket.port = port;
        socket.start = performance.now();
        socket.onerror = () => {
            reportPort("websocket", socket);
        }
        socket.onopen = () => {
            reportPort("websocket", socket);
            socket.close();
        }
    } catch(e) {
        console.log(ip, port)
        console.log("error:", e);
    }
}

const scanner = () => {
    for (port in results) {
        websocket(port);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    scan.addEventListener("click", () => {
        const ports = document.querySelector("#ports").value.split(",");
        for (i in ports) {
            const port = parseInt(ports[i]);
            if (typeof(port) == "number" && !(port in results))
                results[port] = {}
        }
        for (port in results) {
            results[port]["websocket"] = "--";
        }
        scanner();
    });
});
