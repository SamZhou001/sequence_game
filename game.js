let clickedSquares = [];
let buttons = [];

function startGame() {
    let x = 30;
    let y = 150;
    for (let i = 0; i < 16; i++) {
        let myGamePiece = new component(82.5, 82.5, "lightgray", x, y);
        buttons.push(myGamePiece);
        if (i % 4 == 3) {
            x = 30;
            y += 112.5;
        } else {
            x += 112.5;
        }
    }
    console.log(defineNums(4, 6, 30));
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
    }
}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;    
    this.update = function(){
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
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
    for (let j = 0; j < 16; j++){
        if (myGameArea.x && myGameArea.y) {
            if (buttons[j].clicked()) {
                let contains = false;
                for (let i of clickedSquares) {
                    if (i[0] == buttons[j].x && i[1] == buttons[j].y) {
                        contains = true;
                    }
                }
                if (! contains) {
                    clickedSquares.push([buttons[j].x, buttons[j].y]);
                    buttons[j] = new component(buttons[j].width, buttons[j].height, "blue", buttons[j].x, buttons[j].y);
                }
            }
        }
    }
    for (let i = 0; i < 16; i++){
        buttons[i].update();
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
        let commonD = Math.floor(Math.random() * (maxNum-startNum)/(l-1)) + 1;
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
        let current = Math.floor(Math.random() * d*d) + 1;
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
    return ret;
}

function chartNums(defineNums, updateGameArea) {
    let arr = defineNums(d, l, maxNum);
    ctx = myGameArea.context;
    ctx.fillStyle = '#FFF';
    for (let k = 0; k < arr.length; k++) {
        ctx.fillText(arr[k], buttons[k].x, buttons[k].y)
    }
}