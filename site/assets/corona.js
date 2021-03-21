const main = document.getElementById("main");
(function() {
    main.innerHTML = "Loading... \nThis will take a while we are loading a lot of data at this point.";
})();
const url = "https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData/v2"
let db = {};

const get = function(url, cb) {
    const ajax = new XMLHttpRequest();
    ajax.open("GET", url, true);
    ajax.onreadystatechange = function () {
        if (ajax.readyState != 4 || ajax.status != 200) return undefined;
        cb(ajax.responseText);
    };
    ajax.send();
}

const get_date = function(str) {
    const date = new Date(str);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) month = "0" + month;
    let day = date.getDate();
    if (day < 10) day = "0" + day;
    return year + "-" + month + "-" + day;
}

const order_dict = function(db, data) {
    for (item in data) {
        for (let i=0; i<data[item].length; i++) {
            const date = get_date(data[item][i].date);
            if (db[date] == undefined) {
                db[date] = {
                    "confirmed": 0,
                    "deaths": 0,
                    "recovered": 0
                }
            }
        }
    }
    const ordered = {};
    Object.keys(db).sort().forEach(function(key) {
        ordered[key] = db[key];
    });
    return ordered;
}

const get_bar = function(count, max) {
    const mark = "▉";
    let bar = "";
    const percent = Math.ceil(count/max*14);
    for (let i=0; i<percent; i++) {
        bar += mark;
    }
    return bar;
}

const draw_chart = function(data) {
    main.innerHTML = "Generating chart";
    data = JSON.parse(data);
    db = order_dict(db, data);
    con_total = 0;
    ded_total = 0;
    rec_total = 0;
    for (item in db) {
        db[item].confirmed += con_total;
        for (con in data.confirmed) {
            if (get_date(data.confirmed[con].date) == item) {
                db[item].confirmed += 1;
                con_total += 1;
            }
        }

        db[item].deaths += ded_total;
        for (ded in data.deaths) {
            if (get_date(data.deaths[ded].date) == item) {
                db[item].deaths += 1;
                ded_total += 1;
            }
        }

        db[item].recovered += rec_total;
        for (rec in data.recovered) {
            if (get_date(data.recovered[rec].date) == item) {
                db[item].recovered += 1;
                rec_total += 1;
            }
        }
    }
    const longest = con_total + ded_total + rec_total;

    let html = "";
    for (item in db) {
        const confirmed = get_bar(db[item].confirmed, longest)
        const deaths = get_bar(db[item].deaths, longest)
        const recovered = get_bar(db[item].recovered, longest)
        let date = item.split("-");
        date = date[2] + "/" + date[1] + "/" + date[0];
        html = "<p>" + date + " "
        + "<span class='confirmed box'>" + confirmed + "</span>"
        + "<span class='deaths box'>" + deaths + "</span>"
        + "<span class='recovered box'>" + recovered + "</span>"
        + " "
        + "<span class='count'>"
        + "<span class='confirmed'>" + db[item].confirmed + "</span> "
        + "/ "
        + "<span class='deaths'>" + db[item].deaths + "</span> "
        + "/ "
        + "<span class='recovered'>" + db[item].recovered + "</span> "
        + "</span>"
        + "</p>" + html;
    }

    main.innerHTML = "<p>Covid-19 in Finland<span class='count'>"
        + "<span class='confirmed'>confirmed</span> "
        + "/ "
        + "<span class='deaths'>deaths</span> "
        + "/ "
        + "<span class='recovered'>recovered</span> "
        + "</p>" + html;
}

document.addEventListener("DOMContentLoaded", function() {
    get(url, draw_chart);
});
