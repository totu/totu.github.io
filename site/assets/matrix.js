let matrix = document.getElementById("matrix");
let height = 55;
var anime_count = 0;
var columns = [];

(function() {
    matrix.innerHTML = "";
})();

let rand_alpha = function(count, old='') {
    var rand = old + Math.random().toString(36).substring(2);
    if (rand.length < count) {
        rand = rand_alpha(count, rand);
    }
    return rand.substring(rand.length-count);
}

let string = function(len) {
    rand = rand_alpha(len);
    str = "";
    for (var i=0; i<rand.length; i++) {
        str += "<span class='matrix-chr'>" + rand[i] + '</span>';
    }
    return str;
}

let sleep = function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let randomize_column = function() {
    var random_column = Math.floor(Math.random() * height + 1);
    do {
        random_column = Math.floor(Math.random() * height + 1);
    }
    while (columns.indexOf(random_column) != -1);
    columns.push(random_column);
    return random_column;
}

let animate = async function() {
    anime_count += 1;
    let random_column = randomize_column();
    let speed = Math.floor(Math.random() * height + 50);
    let random_len = Math.floor(Math.random() * matrix_size/2/3 + 1);
    let rows = document.getElementsByClassName("matrix-row");

    for (var i=0; i<rows.length+random_len+1; i++) {
        for (var j=0; j<i-random_len; j++) {
            let row = rows[j];
            let child = row.children[random_column];
            child.classList.remove('matrix-after');
        }
        for (var j=i-random_len; j<i; j++) {
            let row = rows[j];
            if (row != undefined) {
                let child = row.children[random_column];
                child.classList.add('matrix-after');
                child.classList.remove('matrix-green');
            }
        }
        let row = rows[i];
        if (row != undefined) {
            let child = row.children[random_column];
            if (child != undefined) {
                child.classList.add('matrix-green');
            }
        }
        await sleep(speed);
    }
    await sleep(speed);
    let new_col = rand_alpha(height);
    for (var i=0; i<rows.length; i++) {
        let row = rows[i];
        let child = row.children[random_column];
        child.innerHTML = new_col[i];
    }
    columns.splice(columns.indexOf(random_column), 1);
    anime_count -= 1;
}

window.addEventListener('load', async function() {
    matrix_size = height;
    str = ""
    for (var i=0; i<matrix_size/2; i++) {
        str += "<div class='matrix-row matrix-row-"+i+"'>" + string(matrix_size) + "</div>";
    }
    matrix.innerHTML = str;
    while(true) {
        if (anime_count < 10) {
            animate();
        }
        await sleep(250);
    }
})


