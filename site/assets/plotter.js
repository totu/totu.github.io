const main = document.getElementById("main");

document.addEventListener("DOMContentLoaded", () => {
    main.innerHTML = "loading...";
    html = '<input value="Create a chart" type="button" name="make-plot" id="make-plot">'
    html += '<label for="title">Title</label>'
    html += '<input type="text" placeholder="My chart" name="title" id="title">'
    html += '<label for="data">Data</label>'
    html += '<textarea placeholder="[1,2,3,4,5,6]" name="data" id="data" cols="50" rows="3"></textarea>'
    html += '<label for="label1">x</label>'
    html += '<input type="text" placeholder="time" name="label1" id="label1">'
    html += '<label for="label2">y</label>'
    html += '<input type="text" placeholder="count" name="label2" id="label2">'
    main.innerHTML = html;
    document.querySelector('#make-plot').addEventListener("click", () => {
        const title = document.querySelector('#title').value;
        const label1 = document.querySelector('#label1').value;
        const label2 = document.querySelector('#label2').value;
        const data = eval(document.querySelector('#data').value);
        let url = window.location.href
        // If we aren't already in the index.html add it
        if (!window.location.href.endsWith("index.html"))
            url += "index.html"
        url += "?data=[" + data + "]"
        if (title != "")
            url += "&title=" + title
        if (label1 != "")
            url += "&label1=" + label1
        if (label2 != "")
            url += "&label2=" + label2
        window.location = url
        // makePlot();
    });

    const get_params = window.location.search.substr(1);

    if (get_params != "") {
        params = get_params.split("&");
        console.log(params)
        for (let i=0; i<params.length; i++) {
            const param = params[i].split("=");
            document.querySelector("#" + param[0]).value = param[1];
        }
        makePlot();
    }
});

const makePlot = () => {
    const title = document.querySelector('#title').value;
    const label1 = document.querySelector('#label1').value;
    const label2 = document.querySelector('#label2').value;
    const opts = makeOpts(title, label1, label2);
    const data = eval(document.querySelector('#data').value);
    if (Array.isArray(data)) {
        html = "<div id='plot' class='article noselect'>"
        html += '<input value="create a new chart" type="button" name="new-plot" id="new-plot">'
        main.innerHTML = html
        const plot = document.querySelector('#plot');
        const plottableData = [];
        const xAxis = new Array(data.length);
        for (let i=0; i<xAxis.length; i++) { xAxis[i] = i+1 };
        plottableData.push(xAxis);
        plottableData.push(data);
        const uplot = new uPlot(opts, plottableData, plot);
        document.querySelector('#new-plot').addEventListener("click", () => {
            window.location = window.location.origin + "/chart";
        });
    } else {
        console.debug(typeof(data), data);
        alert("Data needs to be an Array")
    }
}

const makeOpts = (title, label1, label2) => {
    if (label1 == "") label1 = "X";
    if (label2 == "") label2 = "Y";
    const font = "16px VT323";
    const grid = "rgba(255, 255, 255, 0.1)";
    const opts = {
        title: title,
        width: 550,
        height: 500,
        labelFont: font,
        font: font,

        axes: [
            {
                show: true,
                stroke: "#E8E8A0",
                labelFont: font,
                font: font,
                grid: {
                    show: true,
                    stroke: grid,
                },
                ticks: {
                    show: true,
                    stroke: grid,
                },
                values: (self, ticks) => ticks.map(rawValue => rawValue),
            },
            {
                show: true,
                stroke: "#E8E8A0",
                labelFont: font,
                font: font,
                grid: {
                    show: true,
                    stroke: grid,
                },
                ticks: {
                    show: true,
                    stroke: grid,
                },
                values: (self, ticks) => ticks.map(rawValue => rawValue),
                // values: (self, ticks) => ticks.map(rawValue => rawValue + "ms"),
            }
        ],

        series: [
            {
                show: true,
                label: label1,
                value: (self, rawValue) => rawValue,
                labelFont: font,
                font: font,
            },
            {
                // initial toggled state (optional)
                show: true,
                spanGaps: false,
                labelFont: font,
                font: font,
                label: label2,
                value: (self, rawValue) => rawValue,
                // value: (self, rawValue) => rawValue.toFixed(2) + "ms",
                stroke: "#9FE7E7",
                width: 1,
                fill: "rgba(159, 159, 231, 0.5)",
            }
        ]
    }
    return opts
}
