const main = document.getElementById("main");

document.addEventListener("DOMContentLoaded", () => {
    main.innerHTML = "loading...";
    // Draw the initial input fields
    html = '<input value="Create a chart" type="button" name="make-plot" id="make-plot">'
    html += '<label for="title">Title</label>'
    html += '<input type="text" placeholder="My chart" name="title" id="title">'
    html += '<label for="data">Data</label>'
    html += '<textarea placeholder="1,4,3,2,1" name="data" id="data" cols="50" rows="3"></textarea>'
    html += '<p class="todo"># TODO: add X axis input, currently just running numbers</p>'
    html += '<label for="label1">x</label>'
    html += '<input type="text" placeholder="time" name="label1" id="label1">'
    html += '<label for="label2">y</label>'
    html += '<input type="text" placeholder="count" name="label2" id="label2">'
    main.innerHTML = html;
    // Hook up the button
    document.querySelector('#make-plot').addEventListener("click", () => {
        makePlot();
    });

    // Next check if URI has parameters to draw
    const get_params = window.location.search.substr(1);
    if (get_params != "") {
        params = get_params.split("&");
        for (let i=0; i<params.length; i++) {
            const param = params[i].split("=");
            document.querySelector("#" + param[0]).value = param[1];
        }
        makePlot();
    } else {
        // Check if we have previous plot (i.e. if this was refresh reset)
        const previousPlotData = localStorage.getItem('plotData');
        const previousPlotLabel1 = localStorage.getItem("plotLabel1");
        const previousPlotLabel2 = localStorage.getItem("plotLabel2");
        const previousPlotTitle = localStorage.getItem("plotTitle");
        const previousPlotOpts = makeOpts(previousPlotTitle, previousPlotLabel1, previousPlotLabel2);
        if (previousPlotData != null && previousPlotOpts != null) {
            try {
                makePlot(previousPlotData.split(","), previousPlotOpts);
            } catch(e) {
                localStorage.clear();
            }
        }
    }

});

const makePlot = (data=null, opts=null) => {
    // If data was not given, take it from data field
    if (data == null) {
        data = document.querySelector('#data').value.split(",");
        // Store to browser for refresh resets
        localStorage.setItem("plotData", data);
    }

    // If opts was mot give, make them from other fields
    if (opts == null) {
        var title = document.querySelector('#title').value;
        var label1 = document.querySelector('#label1').value;
        var label2 = document.querySelector('#label2').value;
        // Store to browser for refresh resets
        localStorage.setItem("plotLabel1", label1);
        localStorage.setItem("plotLabel2", label2);
        localStorage.setItem("plotTitle", title);
        opts = makeOpts(title, label1, label2);
    }

    // Check that data is array and has some data.
    if (Array.isArray(data) && data.length > 1) {
        // Replace UI with new plot button and the plot
        html = "<div id='plot' class='article noselect'>"
        html += '<input value="create a new chart" type="button" name="new-plot" id="new-plot">'
        html += '<input type="text" name="share-plot" id="share-plot">'
        main.innerHTML = html
        let uri = window.location.origin + window.location.pathname;
        if (!uri.endsWith("index.html"))
            uri += "index.html";
        uri += "?data=" + data;
        if (title)
            uri += "&title=" + title;
        if (label1)
            uri += "&label1=" + label1;
        if (label2)
            uri += "&label2=" + label2;
        document.querySelector('#share-plot').value = uri

        // New plot clears local storage and refreshes
        document.querySelector('#new-plot').addEventListener("click", () => {
            localStorage.clear();
            window.location = window.location.origin + "/chart";
        });

        try {
            // Create X axis "data"
            const plot = document.querySelector('#plot');
            const plottableData = [];
            const xAxis = new Array(data.length);
            for (let i=0; i<xAxis.length; i++) { xAxis[i] = i+1 };
            plottableData.push(xAxis);
            plottableData.push(data);
            const uplot = new uPlot(opts, plottableData, plot);

        } catch(e) {
            console.log(e);
            console.log(data)
            alert("bad data")
            localStorage.clear();
            window.location = window.location.origin + "/chart";
        }

    // If data is not a list, then clear local storage just in case.
    } else {
        console.debug(typeof(data), data);
        localStorage.clear();
        alert("Invalid data");
    }
}

const makeOpts = (title, label1, label2) => {
    if (label1 == "") label1 = "X";
    if (label2 == "") label2 = "Y";
    const font = "16px VT323";
    const grid = "rgba(255, 255, 255, 0.1)";
    const opts = {
        title: title, width: 550, height: 500, labelFont: font, font: font,
        axes: [
            {
                show: true, stroke: "#E8E8A0", labelFont: font, font: font, grid: { show: true, stroke: grid, }, ticks: { show: true, stroke: grid, },
                values: (self, ticks) => ticks.map(rawValue => rawValue),
            },
            {
                show: true, stroke: "#E8E8A0", labelFont: font, font: font, grid: { show: true, stroke: grid, }, ticks: { show: true, stroke: grid, },
                values: (self, ticks) => ticks.map(rawValue => rawValue),
                // values: (self, ticks) => ticks.map(rawValue => rawValue + "ms"),
            }
        ],
        series: [
            {
                value: (self, rawValue) => rawValue,
                show: true, label: label1, labelFont: font, font: font,
            },
            {
                show: true, spanGaps: false, labelFont: font, font: font, label: label2, stroke: "#9FE7E7", width: 1, fill: "rgba(159, 159, 231, 0.5)",
                value: (self, rawValue) => rawValue,
                // value: (self, rawValue) => rawValue.toFixed(2) + "ms",
            }
        ]
    }
    return opts
}
