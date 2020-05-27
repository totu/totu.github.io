const scan = document.querySelector("#scan");
const main = document.querySelector("#main");
const results = {}
let normalSort = true;
let lastSort = 0;
let ip = "localhost";

const reportPort = (type, socket) => {
    const delta = performance.now() - socket.start;
    const scanPort = socket.port;
    results[scanPort][type] = delta + "ms";
    main.innerHTML = "";
    let html = "<table>";
    html += "<tr>";
    html += "<th>port</th>";
    html += "<th>protocol</th>";
    html += "<th>time</th>";
    html += "</tr>";
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
    html += "<th>" + header[1] + "</th>";
    html += "<th>" + header[2] + "</th></tr>";
    for (let i=0; i<content.length; i++) {
        html += "<tr>";
        html += "<td>" + content[i][0] + "</td>";
        html += "<td>" + content[i][1] + "</td>";
        html += "<td>" + content[i][2] + "</td>";
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
        // Reset times
        const list = ["websocket", "http", "img"];
        for (i in list) {
            results[port][list[i]] = "--";
        }
        // Scan ports
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
