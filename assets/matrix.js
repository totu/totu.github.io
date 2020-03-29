const matrix = document.getElementById("matrix");
const height = 75;
let anime_count = 0;
let columns = [];

(function() {
    matrix.innerHTML = "loading...";
})();

const rand_alpha = function(count, old='') {
    let rand = old + Math.random().toString(36).substring(2);
    if (rand.length < count) {
        rand = rand_alpha(count, rand);
    }
    return rand.substring(rand.length-count);
}

const string = function(len) {
    rand = rand_alpha(len);
    str = "";
    for (let i=0; i<rand.length; i++) {
        str += "<span class='matrix-chr'>" + rand[i] + '</span>';
    }
    return str;
}

const sleep = function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const randomize_column = function() {
    let random_column = Math.floor(Math.random() * height + 1);
    do {
        random_column = Math.floor(Math.random() * height + 1);
    }
    while (columns.indexOf(random_column) != -1);
    // columns.push(random_column);
    return random_column;
}

const animate = async function() {
    anime_count += 1;
    const random_column = randomize_column();
    const speed = Math.floor(Math.random() * height + 30);
    const random_len = Math.floor(Math.random() * matrix_size/2/3 + 1);
    const rows = document.getElementsByClassName("matrix-row");

    for (let i=0; i<rows.length+random_len+1; i++) {
        for (let j=0; j<i-random_len; j++) {
            const row = rows[j];
            const child = row.children[random_column];
            child.classList.remove('matrix-after');
        }
        for (let j=i-random_len; j<i; j++) {
            const row = rows[j];
            if (row != undefined) {
                let child = row.children[random_column];
                if (child != undefined) {
                    child.classList.add('matrix-after');
                    child.classList.remove('matrix-green');
                }
            }
        }
        let row = rows[i];
        if (row != undefined) {
            const child = row.children[random_column];
            if (child != undefined) {
                child.classList.add('matrix-green');
            }
        }
        await sleep(speed);
    }
    await sleep(speed);
    const new_col = rand_alpha(height);
    for (let i=0; i<rows.length; i++) {
        const row = rows[i];
        const child = row.children[random_column];
        child.innerHTML = new_col[i];
    }
    columns.splice(columns.indexOf(random_column), 1);
    anime_count -= 1;
}

window.addEventListener('load', async function() {
    matrix_size = height;
    str = ""
    for (let i=0; i<matrix_size/2; i++) {
        str += "<div class='matrix-row matrix-row-"+i+"'>" + string(matrix_size) + "</div>";
    }
    matrix.innerHTML = str;
    while(true) {
        if (anime_count < 40) {
            animate();
        }
        await sleep(Math.floor(Math.random() * 250));
    }
})


