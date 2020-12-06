let clickedSquares = [];
let buttons = [];
let nums = [];
let answers = [];
let step = 0;
let myDim;

function startGame(dim = 6, length = 6, maxNum = 100) {
    myDim = dim;
    let x = 30;
    let y = 150;
    let arr = defineNums(dim, length, maxNum);
    let numbers = arr[0];
    answers = arr[1];
    answers.sort((a) => nums[a]);
    let myNum;
    for (let i = 0; i < dim * dim; i++) {
        let size = (480-(dim+1)*30)/dim;
        let myGamePiece = new component(size, size, "lightgray", x, y);
        if (numbers[i]<10) {
            myNum = new component("30px", "Consolas", "black", x+(size-16.5)/2, y+(size+21.5)/2, "text")
        } else {
            myNum = new component("30px", "Consolas", "black", x+(size-32.5)/2, y+(size+21.5)/2, "text")
        }
        myNum.text = numbers[i];
        buttons.push(myGamePiece);
        nums.push(myNum);
        if (i % dim == dim - 1) {
            x = 30;
            y += 30 + size;
        } else {
            x += 30 + size;
        }
    }
    console.log(answers);
    myGameArea.start();
}

let myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('mousedown', function (e) {
            myGameArea.x = e.pageX;
            myGameArea.y = e.pageY;
        })
        window.addEventListener('mouseup', function (e) {
            myGameArea.x = false;
            myGameArea.y = false;
        })
        window.addEventListener('touchstart', function (e) {
            myGameArea.x = e.pageX;
            myGameArea.y = e.pageY;
        })
        window.addEventListener('touchend', function (e) {
        myGameArea.x = false;
        myGameArea.y = false;
        })
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
        let restart_button = new component(80, 30, "lightgray", 200, 100);
        let restart_message = new component("15px", "Consolas", "black", 217, 120, "text");
        restart_message.text = "Restart";
        let lose_message = new component("20px", "Consolas", "black", 118, 80, "text");
        lose_message.text = "You lose. Good luck next time.";
        restart_button.update();
        restart_message.update();
        lose_message.update();
        setInterval(function() {
            if (restart_button.clicked()) {
                location.reload();
            }
        }, 20);
    },
    win : function() {
        clearInterval(this.interval);
        let restart_button = new component(80, 30, "lightgray", 200, 100);
        let restart_message = new component("15px", "Consolas", "black", 217, 120, "text");
        restart_message.text = "Restart";
        let win_message = new component("20px", "Consolas", "black", 160, 80, "text");
        win_message.text = "You win! Good job!";
        restart_button.update();
        restart_message.update();
        win_message.update();
        setInterval(function() {
            if (restart_button.clicked()) {
                location.reload();
            }
        }, 20);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;    
    this.update = function(){
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.clicked = function() {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var clicked = true;
        if ((mybottom < myGameArea.y) || (mytop > myGameArea.y) || (myright < myGameArea.x) || (myleft > myGameArea.x)) {
          clicked = false;
        }
        return clicked;
    }

}
    
function updateGameArea() {
    myGameArea.clear();
    for (let j = 0; j < myDim * myDim; j++){
        if (myGameArea.x && myGameArea.y) {
            if (buttons[j].clicked()) {
                if (! clickedSquares.includes(j)) {
                    clickedSquares.push(j);
                    if (j == answers[step]) {
                        step ++;
                        buttons[j] = new component(buttons[j].width, buttons[j].height, "lime", buttons[j].x, buttons[j].y);
                        if (step == 6) {
                            myGameArea.win();
                        }
                    } else {
                        buttons[j] = new component(buttons[j].width, buttons[j].height, "red", buttons[j].x, buttons[j].y);
                        myGameArea.stop();
                    }
                }
            }
        }
    }
    for (let i = 0; i < myDim * myDim; i++){
        buttons[i].update();
        nums[i].update();
    }
}

function neighbors(num, d) {
    let ret = [];
    let row = Math.floor(num / d) + 1;
    let col = num % d + 1;
    if (row != 1) {
        ret.push(num-d);
    }
    if (row != d) {
        ret.push(num+d);
    }
    if (col != 1) {
        ret.push(num-1);
    }
    if (col != d) {
        ret.push(num+1);
    }
    return ret;
}

function makeArray(d, l, maxNum) {
    ret = [];
    if (l <= 2*d && d < 10) {
        let startNum = Math.floor(Math.random() * Math.floor(maxNum/2)) + 1;
        let commonD = Math.floor(Math.random() * ((maxNum-startNum)/(l-1)-1)) + 1;
        for (let i = 0; i < l; i++) {
            ret.push(startNum + i * commonD);
        }
        let forbiddenNum1 = startNum - commonD;
        let forbiddenNum2 = startNum + l * commonD;
        for (let j = 0; j < d * d - l; j++) {
            let newNum = Math.floor(Math.random() * maxNum) + 1;
            while (newNum == forbiddenNum1 || newNum == forbiddenNum2 || ret.includes(newNum)) {
                newNum = Math.floor(Math.random() * maxNum) + 1;
            }
            ret.push(newNum);
        }
    }
    return ret;
}

function constructPath(d, l) {
    while (true) {
        let ret = [];
        let current = Math.floor(Math.random() * d*d);
        ret.push(current);
        let n;
        let completed = false;
        for (let i = 1; i < l; i++) {
            n = neighbors(current, d);
            while (n.length != 0) {
                let idx = Math.floor(Math.random() * n.length);
                if (! ret.includes(n[idx])) {
                    current = n[idx];
                    ret.push(current);
                    if (i == l-1) {
                        completed = true;
                    }
                    break;
                } else {
                    n.splice(idx, 1);
                }
            }
        }
        if (completed) {
            return ret;
        }
    }
}

function defineNums(d, l, maxNum) {
    let arr = makeArray(d, l, maxNum);
    let path = constructPath(d, l);
    let ret = [];
    for (let i = 0; i < path.length; i++) {
        ret[path[i]] = arr[i];
    }
    let idx = path.length;
    for (let j = 0; j < d * d; j++) {
        if (ret[j] == undefined) {
            ret[j] = arr[idx];
            idx ++;
        }
    }
    if (ret.includes(undefined)) {
        console.log(path);
    }
    return [ret, path];
}
