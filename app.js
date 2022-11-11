const circle_pos =
    ["0,3.8,0.1",
        "-4,1,0.1",
        "-0.9,1,0.1",
        "0.9,1,0.1",
        "4,1,0.1",
        "-1.5,0.9,0.1",
        "1.5,0.9,0.1",
        "0,-2,0.1",
        "-2.5,-3.8,0.1",
        "2.5,-3.8,0.1]"];


let normal_jumps = {
    "c0": ["c2", "c3"],
    "c1": ["c2", "c5"],
    "c2": ["c0", "c1", "c3", "c5"],
    "c3": ["c0", "c2", "c4", "c6"],
    "c4": ["c3", "c6"],
    "c5": ["c1", "c2", "c7", "c8"],
    "c6": ["c3", "c4", "c7", "c9"],
    "c7": ["c5", "c6", "c8", "c9"],
    "c8": ["c5", "c7"],
    "c9": ["c6", "c7"]
};

let kill_jumps = {
    "c0": ["c5", "c6", "c2", "c3"],
    "c1": ["c3", "c7", "c2", "c5"],
    "c2": ["c4", "c8", "c3", "c5"],
    "c3": ["c1", "c9", "c2", "c6"],
    "c4": ["c2", "c7", "c3", "c6"],
    "c5": ["c0", "c9", "c2", "c7"],
    "c6": ["c0", "c8", "c3", "c7"],
    "c7": ["c1", "c4", "c5", "c6"],
    "c8": ["c2", "c6", "c5", "c7"],
    "c9": ["c3", "c5", "c6", "c7"]
};

let chance = 0; // 0 for crow , 1 for vulture
let count = 0;
let deleted = 0;
let log = "";

AFRAME.registerComponent('handle-events', {
    init: function () {
        var el = this.el;
        el.addEventListener('click', function () {
            var temp = el.getAttribute('class');
            let sceneEl = document.querySelector('a-scene');

            if (temp == "crow") {
                if (chance == 0) {
                    let crows = sceneEl.querySelectorAll('.crow');
                    let flag = true; // checking if any other crow is not clicked before clicking the current crow
                    for (var i = 0; i < crows.length; i++) {
                        if (crows[i].getAttribute('clicked') == 1) {
                            crows[i].setAttribute('radius', 0.5);
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        log += "Crow was clicked! \n";
                        el.setAttribute('clicked', 1);
                        el.setAttribute('radius', 0.7);
                    }
                }
            }

            else if (temp == "vulture") {
                if (chance == 1) {
                    log += "Vulture was clicked! \n";
                    el.setAttribute('clicked', 1);
                    el.setAttribute('radius', 0.7);
                }
            }

            else if (temp == "circle") {
                if (el.getAttribute('filled') == 0) { // the circle on which we are clicking must be empty
                    if (chance == 0) {
                        let crows = sceneEl.querySelectorAll('.crow');
                        if (count != 7) { // still some crows are left to come on board
                            for (var i = 0; i < crows.length; i++) {
                                if (crows[i].getAttribute('clicked') == 1 && crows[i].getAttribute('state') == 0) {
                                    crows[i].setAttribute('clicked', 0);
                                    let temp = el.getAttribute('position').x + " " + el.getAttribute('position').y + " 0.5";
                                    crows[i].setAttribute('position', temp);
                                    crows[i].setAttribute('at', el.getAttribute('id'));
                                    crows[i].setAttribute('state', 1); // state = 1 means crow is now on board
                                    crows[i].setAttribute('radius', 0.5);
                                    count++;
                                    el.setAttribute('filled', 1);
                                    chance = 1;
                                    log += 'One of the crow arrives! \n';
                                    break;
                                }
                                else if (crows[i].getAttribute('clicked') == 1 && crows[i].getAttribute('state') == 1) {
                                    crows[i].setAttribute('clicked', 0);
                                    crows[i].setAttribute('radius', 0.5);
                                    log += `Wrong move - All the crows haven't arrived. \n`;
                                    break;
                                }
                            }
                        }
                        else { // all crows are on board
                            for (var i = 0; i < crows.length; i++) {
                                if (crows[i].getAttribute('clicked') == 1 && crows[i].getAttribute('state') == 1) {

                                    let clicked_circle_id = el.getAttribute('id');
                                    let crow_circle_id = crows[i].getAttribute('at');

                                    let adjacent_moves = normal_jumps[crow_circle_id];
                                    let flag = false;
                                    for (var j = 0; j < adjacent_moves.length; j++) {
                                        if (adjacent_moves[j] == clicked_circle_id) {
                                            flag = true;
                                            break;
                                        }
                                    }
                                    if (flag) {
                                        let prev_circle = sceneEl.querySelector('#' + crow_circle_id);
                                        prev_circle.setAttribute('filled', 0);
                                        let temp = el.getAttribute('position').x + " " + el.getAttribute('position').y + " 0.5";
                                        crows[i].setAttribute('position', temp); // moving crow
                                        crows[i].setAttribute('clicked', 0);
                                        crows[i].setAttribute('at', el.getAttribute('id'));
                                        crows[i].setAttribute('radius', 0.5);
                                        chance = 1;
                                        el.setAttribute('filled', 1); // jaha crow rakha, us circle ka filled 1
                                        log += 'Crow was moved from one circle to other on board. \n';
                                    }
                                    else {
                                        crows[i].setAttribute('clicked', 0);
                                        crows[i].setAttribute('radius', 0.5);
                                        log += 'Wrong move by crow. \n';
                                    }
                                }
                            }
                        }
                        let vulture_circle_id = sceneEl.querySelector('#vulture').getAttribute('at');
                        if (vulture_circle_id != "") {
                            let adjacent_moves = normal_jumps[vulture_circle_id];
                            let crow_win = true;
                            for (var j = 0; j < adjacent_moves.length; j++) {
                                if (sceneEl.querySelector('#' + adjacent_moves[j]).getAttribute('filled') == 0) {
                                    crow_win = false;
                                    break;
                                }
                            }
                            if (crow_win) {
                                let adj_adjacent_moves = kill_jumps[vulture_circle_id];
                                for (var j = 0; j < 2; j++) {
                                    if (sceneEl.querySelector('#' + adj_adjacent_moves[j]).getAttribute('filled') == 0) {
                                        crow_win = false;
                                        break;
                                    }
                                }
                            }
                            if (crow_win) {
                                log += 'Crows win! CAW CAW \n';
                                alert('Crows win! CAW CAW');
                                location.reload();
                            }
                        }
                    }
                    else {
                        let vulture = sceneEl.querySelector('#vulture');
                        if (vulture.getAttribute('clicked', 1)) {
                            if (vulture.getAttribute('state') == 0) { // vulture not on board
                                vulture.setAttribute('state', 1);
                                vulture.setAttribute('clicked', 0);
                                el.setAttribute('filled', 1);
                                vulture.setAttribute('at', el.getAttribute('id'));
                                let temp = el.getAttribute('position').x + " " + el.getAttribute('position').y + " 0.5";
                                vulture.setAttribute('position', temp); // move vulture to clicked circle's position
                                vulture.setAttribute('radius', 0.5);
                                log += 'Vulture arrives! \n';
                            }
                            else if (vulture.getAttribute('state') == 1) { // vulture on board and playing
                                let clicked_circle_id = el.getAttribute('id');
                                let vulture_circle_id = vulture.getAttribute('at');

                                let adjacent_moves = normal_jumps[vulture_circle_id];
                                let flag = false;
                                for (var j = 0; j < adjacent_moves.length; j++) {
                                    if (adjacent_moves[j] == clicked_circle_id) {
                                        flag = true;
                                        break;
                                    }
                                }
                                if (flag) {
                                    let prev_circle = sceneEl.querySelector('#' + vulture_circle_id);
                                    prev_circle.setAttribute('filled', 0);
                                    let temp = el.getAttribute('position').x + " " + el.getAttribute('position').y + " 0.5";
                                    vulture.setAttribute('position', temp); // moving vulture
                                    vulture.setAttribute('clicked', 0);
                                    vulture.setAttribute('at', el.getAttribute('id'));
                                    vulture.setAttribute('radius', 0.5);
                                    el.setAttribute('filled', 1); // jaha vulture rakha, us circle ka filled 1
                                    log += 'Vulture was moved from one circle to other on the board. \n';
                                }
                                else { // shayad maarne ki koshish ki jaa rahi
                                    let adj_adjacent_moves = kill_jumps[vulture_circle_id];
                                    let flag = false;
                                    let intermediate_circle;
                                    for (var j = 0; j < 2; j++) {
                                        if (adj_adjacent_moves[j] == clicked_circle_id) {
                                            intermediate_circle = sceneEl.querySelector('#' + adj_adjacent_moves[j + 2]);
                                            if (intermediate_circle.getAttribute('filled') == 1) {
                                                flag = true;
                                                break;
                                            }
                                        }
                                    }
                                    if (flag) {
                                        let crows = sceneEl.querySelectorAll('.crow');
                                        for (var i = 0; i < 7; i++) {
                                            if (crows[i].getAttribute('position').x == intermediate_circle.getAttribute('position').x &&
                                                crows[i].getAttribute('position').y == intermediate_circle.getAttribute('position').y) {
                                                crows[i].setAttribute('position', '0 0 -6');
                                                intermediate_circle.setAttribute('filled', 0);
                                                deleted++;
                                                log += 'Vulture kills one of the crows! \n';
                                                break;
                                            }
                                        }
                                        let prev_circle = sceneEl.querySelector('#' + vulture_circle_id);
                                        prev_circle.setAttribute('filled', 0);
                                        let temp = el.getAttribute('position').x + " " + el.getAttribute('position').y + " 0.5";
                                        vulture.setAttribute('position', temp); // moving vulture
                                        vulture.setAttribute('clicked', 0);
                                        vulture.setAttribute('at', el.getAttribute('id'));
                                        vulture.setAttribute('radius', 0.5);
                                        el.setAttribute('filled', 1);
                                        if (deleted == 4) {
                                            log += 'Vulture wins! \n'
                                            alert('Vulture wins!');
                                            location.reload();
                                        }
                                    }
                                    else {
                                        vulture.setAttribute('clicked', 0);
                                        vulture.setAttribute('radius', 0.5);
                                        log += 'Wrong move by vulture \n';
                                    }
                                }
                            }
                            else { // vulture died
                                alert('Crow wins!');
                            }
                        }
                        chance = 0;
                    }
                }
            }
        });
    }
});

AFRAME.registerComponent('handle-download', {
    init: function () {
        var el = this.el;
        el.addEventListener('click', function () {
            let file = new Blob([log], { type: "text/plain;" });
            let hyperlink = document.createElement('a');
            hyperlink.setAttribute('href', window.URL.createObjectURL(file));
            hyperlink.setAttribute('download', 'GameLogs.txt');
            hyperlink.click();
        });
    }
});