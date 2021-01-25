let version = document.getElementsByTagName("version");
version.item(0).textContent = "V.1.3.2 25-01-2021";

//disable all console logs!
console.log = function() {};
console.trace = function() {};




var canvas = document.getElementById("daedos-canvas");
var ctx = canvas.getContext("2d");

var scale = 20;
var counter = 0;

var heading = document.getElementById("daedos-title");

var canvasWidth = canvas.width;
var canvasHeight = canvas.height;

var canvasWidthMultiple;
var canvasHeightMultiple;
var canvasBackgroundColor;

var basicCell = {};

var canvasArray = [];

var walkerCTX = ctx;
var walkerCanvasArray = canvasArray;
var walker = {};

var walkerMatrixValues = {};


walkerCTX.webkitImageSmoothingEnabled = true;
walkerCTX.imageSmoothingEnabled = true;

//############################################################################################

var fps = 60;
var stroke = false;
var doAnim = false;

// ###########################################################################################

var startBtnValue = false;
var obsSelectedEditMode = false;
var noWay = false;

var colorArray = ["#FF0000", "#00FF00", "#0000FF"];

var stop = false;
var frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed;

let queryString;
let initqueryString = "?width=1200&height=620&scale=10&bgcolor=black&startx=1&starty=1&startdir=down&linecolor=white&obs=1&obsx=5&obsy=16&obswidth=7&obsheight=5&obscolor=white&obs=3&obsx=26&obsy=40&obswidth=4&obsheight=15&obscolor=white&obs=3&obsx=64&obsy=49&obswidth=5&obsheight=12&obscolor=white";
initqueryString = "?width=840&height=460&scale=10&bgcolor=black&startx=1&starty=1&startdir=down&linecolor=white&obs=1&obsx=5&obsy=16&obswidth=6&obsheight=3&obscolor=white&obs=2&obsx=26&obsy=29&obswidth=3&obsheight=10&obscolor=white&obs=3&obsx=51&obsy=38&obswidth=3&obsheight=7&obscolor=white";
initqueryString = "?width=770&height=460&scale=10&bgcolor=black&startx=1&starty=1&startdir=down&linecolor=white&obs=1&obsx=5&obsy=16&obswidth=6&obsheight=3&obscolor=white&obs=2&obsx=26&obsy=26&obswidth=3&obsheight=9&obscolor=white&obs=3&obsx=47&obsy=34&obswidth=3&obsheight=7&obscolor=white";




//######## INIT VALUES ##########################################################################################################

function initValues() {
    console.log("init values loaded");

    scale = 10;
    canvasWidthMultiple = canvasWidth / scale;
    canvasHeightMultiple = canvasHeight / scale;
    canvasBackgroundColor = "#FFFFFF";

    basicCell = {
        x: 0,
        y: 0,
        type: "background",
        color: canvasBackgroundColor
    };

    walker = {
        x: 2,
        y: 1,
        color: "#000000",
        direction: "down",
        type: "walker"
    };
}















//############ ANIMATION ################################################################################
// initialize the timer variables and start the animation

function startAnimating() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate();
}

function animate() {
    // request another frame

    if (startBtnValue && !noWay) {
        requestAnimationFrame(animate);

        // calc elapsed time since last loop

        now = Date.now();
        elapsed = now - then;

        // if enough time has elapsed, draw the next frame

        if (elapsed > fpsInterval) {
            // Get ready for next frame by setting then=now, but also adjust for your
            // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
            then = now - (elapsed % fpsInterval);

            // Put your drawing code here

            walk();
            var sinceStart = now - startTime;
            var currentFps =
                Math.round((1000 / (sinceStart / ++frameCount)) * 100) / 100;
            // console.log("current FPS: " + currentFps);
        }
    } else {
        //return;
    }
}














//########### WALKER ###########################################################################################

function drawWalker() {
    //walkerCTX.clearRect(0, 0, canvasWidth, canvasHeight);
    //commented out, because it would erase its trace
    // so just draw always on top

    for (var y = 0; y < canvasHeightMultiple; y++) {
        for (var x = 0; x < canvasWidthMultiple; x++) {
            /* //if(walkerCanvasArray[y][x] != "walker"){
             ctx.fillStyle = walkerCanvasArray[y][x].color;
             //}else{
             // ctx.fillStyle = walker.get("color");
             // }

             ctx.fillRect(x * scale, y * scale, scale, scale);
             if (stroke) {
                 ctx.strokeRect(x * scale, y * scale, scale, scale);
             }
             */

            let thisCell = canvasArray[y][x]; //aktuelles Zellenobjekt


            let cellColor = thisCell.color;

            switch (thisCell.type) {
                case "background" || "walker":
                    cellColor = thisCell.color;


                    break;
                case "obs":

                    //console.log(thisCell.obsIndex);

                    //edit mode feature
                    // durch den neu eingeführten "type" im Zellenobjekt kann ich präziser herausfinden, um welches objekt es sich handelt
                    // und demnach auch entscheiden, wie es gerendert werden soll
                    // console.log(thisCell.selected ? "this cell is selected: " + thisCell.selected + " its color: " + thisCell.color : "this cell index: " + thisCell.obsIndex + " with color " + thisCell.color + " is not selected");

                    // if (obsSelectedEditMode == true && thisCell.type == "obs" && thisCell.obsIndex == selectedObstacle) {
                    if (obsSelectedEditMode == true && thisCell.type == "obs" && thisCell.selected) {
                        //console.log("drawWalker: \t edit object: " + thisCell.obsIndex + "\t its color: " + thisCell.color);

                        // wir sind nun im editmode
                        // jetzt wird gecheckt ob das objekt in der aktuellen zelle das aktive obstacle ist
                        // wenn ja, dann soll die farbe, in der es gerendert werden soll, mit der aktiven Edit-Farbe überschrieben werden.
                        cellColor = selectedObjectColor; // holt sich nur den Farbwert aus dem Zellobjekt
                    } else {
                        cellColor = thisCell.color;
                    }
                    break;


            }


            //console.log(cellColor);

            ctx.fillStyle = cellColor;
            ctx.fillRect(x * scale, y * scale, scale, scale);
            if (stroke) {
                ctx.strokeRect(x * scale, y * scale, scale, scale);
            }
        }
    }

    //setCanvasToOpenGraphImage();
}

/*function setCanvasToOpenGraphImage() {

    html2canvas(document.getElementById('daedos-canvas')).then(function(canvas) {
        document.body.appendChild(canvas);
        document.querySelector("meta[property='og:image']").setAttribute('content', canvas);

    });
    var dataURL = canvas.toDataURL("image/png");
    console.log(dataURL);

    var meta = document.querySelector("meta[property='og:image']").getAttribute('content');
    document.querySelector("meta[property='og:image']").setAttribute('content', 'dataURL');

    console.log(meta);


}*/
















function initWalker() {
    walkerCanvasArray = canvasArray;
    console.log("init walker");
    walker.x = parseInt(walker.startx);
    walker.y = parseInt(walker.starty);
    walker.direction = walker.startdirection;
    setWalker(walker);
}







function setWalker(cell) {
    //walkerCanvasArray[fragment.y][fragment.x] = fragment.color; //working!

    // if instead of just filling the array with colors, fill it with the full object, i can determine if its a "walker"-cell, "object"-cell or free space
    walkerCanvasArray[cell.y][cell.x] = cell;
}








function walk() {
    // console.log("walker direction: "+walker.direction);

    setWalker(walker);
    check(walker.direction);
    drawWalker();
}







function noWayOut() {
    switch (walker.direction) {
        case "up":
            if (!walker.up && !walker.left && !walker.right) {
                noWay = true;
            }
            break;

        case "down":
            if (!walker.down && !walker.left && !walker.right) {
                noWay = true;
            }

            break;

        case "left":
            if (!walker.left && !walker.up && !walker.down) {
                noWay = true;
            }
            break;

        case "right":
            if (!walker.right && !walker.up && !walker.down) {
                noWay = true;
            }
            break;
    }

    if (noWay) {
        noWayEvent();
    }

    // noWay
    //     ?
    //     (console.log("NO WAY OUT"),
    //         heading.classList.add("blink"),
    //         //document.getElementById("daedos-canvas").classList.add("blinkBoxshadow"),
    //         pausebtn = document.getElementById("pauseButton"),
    //         pausebtn.classList.add("blinkBoxshadow"), document.getElementById("startButton").classList.remove("blinkingBackground")) :
    //     noWay;

    return noWay;
}














function checkWalkerMatrixValues() {
    let tx1;
    let tx2;
    let tx3;
    let tx4;

    let tup;
    let tdown;
    let tleft;
    let tright;

    let tupBorder = walker.y - 2 < 0 ? true : false;
    let tleftBorder = walker.x - 2 < 0 ? true : false;
    let tdownBorder = walker.y + 2 >= canvasHeightMultiple ? true : false;
    let trightBorder = walker.x + 2 >= canvasWidthMultiple ? true : false;

    try {
        tup =
            walkerCanvasArray[walker.y - 2][walker.x - 1].type === "background" &&
            walkerCanvasArray[walker.y - 2][walker.x].type === "background" &&
            walkerCanvasArray[walker.y - 2][walker.x + 1].type === "background" ?


            true :
            false;
    } catch (error) {
        tup = false;
    }

    try {
        tleft =
            walkerCanvasArray[walker.y - 1][walker.x - 2].type === "background" &&
            walkerCanvasArray[walker.y][walker.x - 2].type === "background" &&
            walkerCanvasArray[walker.y + 1][walker.x - 2].type === "background" ?
            true :
            false;
    } catch (error) {
        tleft = false;
    }

    try {
        tdown =
            walkerCanvasArray[walker.y + 2][walker.x - 1].type === "background" &&
            walkerCanvasArray[walker.y + 2][walker.x].type === "background" &&
            walkerCanvasArray[walker.y + 2][walker.x + 1].type === "background" ?
            true :
            false;
    } catch (error) {
        tdown = false;
    }

    try {
        tright =
            walkerCanvasArray[walker.y - 1][walker.x + 2].type === "background" &&
            walkerCanvasArray[walker.y][walker.x + 2].type === "background" &&
            walkerCanvasArray[walker.y + 1][walker.x + 2].type === "background" ?
            true :
            false;
    } catch (error) {
        tright = false;
    }

    //#################### corners ######################

    try {
        tx1 =
            walkerCanvasArray[walker.y - 2][walker.x - 2].type === "background" ?
            true :
            false;
    } catch (error) {
        tx1 = false;
    }

    try {
        tx2 =
            walkerCanvasArray[walker.y + 2][walker.x - 2].type === "background" ?
            true :
            false;
    } catch (error) {
        tx2 = false;
    }

    try {
        tx3 =
            walkerCanvasArray[walker.y + 2][walker.x + 2].type === "background" ?
            true :
            false;
    } catch (error) {
        tx3 = false;
    }

    try {
        tx4 =
            walkerCanvasArray[walker.y - 2][walker.x + 2].type === "background" ?
            true :
            false;
    } catch (error) {
        tx4 = false;
    }

    //console.log("upBorder: "+upBorder+"\t\tleftBorder: "+leftBorder+"\tdownBorder: "+downBorder+"\trightBorder: "+rightBorder);

    walkerMatrixValues = {
        x1: tx1,
        x2: tx2,
        x3: tx3,
        x4: tx4,
        up: tup,
        down: tdown,
        left: tleft,
        right: tright,
        upBorder: tupBorder,
        downBorder: tdownBorder,
        leftBorder: tleftBorder,
        rightBorder: trightBorder,
    };

    //console.table(walkerMatrixValues);

    walker = Object.assign(walker, walkerMatrixValues);
    //walker.walkerMatrixValues;
    //console.table(walker);
    //console.table(walkerCanvasArray);
}














function check(direction) {
    checkWalkerMatrixValues();

    if (!noWayOut()) {
        /*

                -------t-------
                | x1| | | |x4 |
                | --| | | |-- |
                l --| |x| |-- r
                | --| | | |-- |
                | x2| | | |x3 |
                -------d-------

                */

        switch (direction) {
            case "up": //#################################################################################################
                if (walker.upBorder && walker.rightBorder) {
                    go("left");
                    break;
                } else {
                    if (walker.up && !walker.right && (walker.x3 || !walker.x3)) go("up");

                    if (!walker.up && !walker.right && walker.left) go("left");

                    //obstacle
                    if (walker.up && walker.right && !walker.x3) go("right");

                    //neuer Fall
                    if (!walker.up && walker.right && !walker.x3) go("right");
                }

                break;

            case "down": //#################################################################################################
                if (walker.leftBorder && walker.upBorder) {
                    go("down");
                    break;
                }

                if (walker.downBorder && walker.leftBorder) {
                    go("right");
                } else {
                    if (walker.down && !walker.left && (walker.x1 || !walker.x1))
                        go("down");

                    if (!walker.down && !walker.left && walker.right) go("right");

                    //obstacle
                    if ((walker.down || !walker.down) && walker.left && !walker.x1)
                        go("left");
                }
                break;

            case "left": //#################################################################################################
                if (walker.leftBorder && walker.upBorder) {
                    go("down");
                } else {
                    if (walker.left && !walker.up && (walker.x4 || !walker.x4)) {
                        //weiter
                        go("left");
                    }

                    if (!walker.left && !walker.up && walker.down) {
                        //ecke
                        go("down");
                    }

                    if (walker.up && !walker.x4) {
                        //obstacle
                        go("up");
                    }
                }
                break;

            case "right": //#################################################################################################
                if (walker.rightBorder && walker.downBorder) {
                    go("up");
                } else {

                    if (walker.right && !walker.down && (walker.x2 || !walker.x2)) {
                        console.log("neuerFall");
                        //weiter
                        go("right");

                    }

                    if (!walker.down && !walker.right && walker.up) {
                        //ecke
                        go("up");
                    }

                    if (walker.right && walker.down && !walker.x2) {
                        //obstacle
                        go("down");
                    }
                    if (!walker.right && walker.down && !walker.x2) {
                        //obstacle
                        go("down");
                    }


                }
                break;
        }
        //printWalkerValues();
    }
}

function printWalkerValues() {
    console.log(
        "dir: " +
        walker.direction +
        "\tup: " +
        walker.up +
        "\tleft: " +
        walker.left +
        "\tdown: " +
        walker.down +
        "\tright: " +
        walker.right +
        "\tx1: " +
        walker.x1 +
        "\tx2: " +
        walker.x2 +
        "\tx3: " +
        walker.x3 +
        "\tx4: " +
        walker.x4
    );

    /* let log1 = [];
               //log1.push(["","upBorder: "+upBorder,""]);
               log1.push(["x1:"+x1,"up: "+up,"x4: "+x4]);
               log1.push(["left: "+left,"dir: "+walker.direction,"right: "+right]);
               log1.push(["x2: "+x2,"down: "+down,"x3: "+x3]);  */


    // console.table(walkerMatrixValues);
    //console.table(walkerCanvasArray);

    //printWalkerMatrix();
}

function go(dir) {
    switch (dir) {
        case "up":
            walker.direction = "up";
            walker.y--;
            break;
        case "down":
            walker.direction = "down";
            walker.y++;
            break;
        case "left":
            walker.direction = "left";
            walker.x--;
            break;
        case "right":
            walker.direction = "right";
            walker.x++;
            break;
    }
    console.log("go: " + dir);
}















//########### GLOBAL COLOR COUNTER ##################

function countToThree() {
    if (counter < 2) {
        counter++;
    } else {
        counter = 0;
    }
    //console.log("counter: "+counter);
    return counter;
}














// ############ CANVAS ARRAY ########### ####################################################################################
function initCanvasArray() {
    canvasArray.length = 0; //reset canvasArray fix for stopping walker process after vertical resize of canvas

    for (let y = 0; y < canvasHeightMultiple; y++) {
        canvasArray[y] = [];
        for (let x = 0; x < canvasWidthMultiple; x++) {
            /*let color = canvasBackgroundColor;
            let element = {
                type: "background", //edit mode feature
                x,
                y,
                color
            };*/
            //setCanvasArray(element);
            basicCell = {
                x: x,
                y: y,
                type: "background",
                color: canvasBackgroundColor
            };
            setCanvasArray(basicCell);
        }
    }
}






//set color in array field of given object variables (x,y,color)
function setCanvasArray(e) {
    //canvasArray[e.y][e.x] = e.color; //old version

    //edit mode feature

    canvasArray[e.y][e.x] = e; // fügt anstelle des reinen farbwerts ein Objekt in die Array Zelle ein.

}







function drawCanvasArray() {
    for (let y = 0; y < canvasHeightMultiple; y++) {
        for (let x = 0; x < canvasWidthMultiple; x++) {

            let thisCell = canvasArray[y][x]; //aktuelles Zellenobjekt


            let cellColor = thisCell.color;

            switch (thisCell.type) {
                case "background" || "walker":
                    cellColor = thisCell.color;


                    break;
                case "obs":


                    //edit mode feature
                    // durch den neu eingeführten "type" im Zellenobjekt kann ich präziser herausfinden, um welches objekt es sich handelt
                    // und demnach auch entscheiden, wie es gerendert werden soll

                    if (obsSelectedEditMode == true && thisCell.type == "obs" && thisCell.obsIndex == selectedObstacle) {
                        console.log("DRAWCANVASARRAY: \t edit object: " + thisCell.obsIndex + "\t its color: " + thisCell.color);
                        // wir sind nun im editmode
                        // jetzt wird gecheckt ob das objekt in der aktuellen zelle das aktive obstacle ist
                        // wenn ja, dann soll die farbe, in der es gerendert werden soll, mit der aktiven Edit-Farbe überschrieben werden.
                        cellColor = selectedObjectColor; // holt sich nur den Farbwert aus dem Zellobjekt
                    } else {
                        cellColor = thisCell.color;
                    }
                    break;


            }


            //console.log(cellColor);

            ctx.fillStyle = cellColor;

            ctx.fillRect(x * scale, y * scale, scale, scale);
            ctx.strokeRect(x * scale, y * scale, scale, scale);
        }
    }
    //console.table(canvasArray);
}








function resetCanvas() {
    let width = canvasWidthMultiple * scale;
    let height = canvasHeightMultiple * scale;
    //calculateMarginForMenu();

    initCanvasArray();
    //createBorder();
    initWalker();
    walkerCTX.canvas.width = width;
    ctx.canvas.width = width;
    walkerCTX.canvas.height = height;
    ctx.canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    walkerCTX.clearRect(0, 0, width, height);

    //setPropertiesFromURL();
    //overrideAllObstaclesColorToWhite(); //reset selected object color
    setObstaclesIntoWalkerArray();

    drawWalker();


}













/*
// ############ CREATE BORDER OF CANVAS ###############
// AND SET ALL POSITIONS OF CANVAS ARRAY
function createBorder() {
    color = "black";
    let borderElement;

    for (let y = 0; y < canvasHeightMultiple; y++) {
        //left border
        //color = colorArray[countToThree()];

        borderElement = { x: 0, y: y, color: color };
        setCanvasArray(borderElement);

        //right border
        //color = colorArray[countToThree()];

        borderElement = { x: canvasWidthMultiple - 1, y: y, color: color };
        setCanvasArray(borderElement);
    }

    //top and bottom border
    for (let x = 0; x < canvasWidthMultiple; x++) {
        //top border
        //color = colorArray[countToThree()];
        borderElement = { x, y: 0, color };
        setCanvasArray(borderElement);

        //bottom border
        //color = colorArray[countToThree()];
        borderElement = { x, y: canvasHeightMultiple - 1, color };
        setCanvasArray(borderElement);
    }
}

*/
















//############################################################################################################
//############################################################################################################
//############################################################################################################


function initDAEDOS() {
    setPropertiesFromURL(); // use init values if no url parameter are attached
    initButtonHandlers();
    calculateMarginForMenu();
    //createBorder();

    drawCanvasArray();
    drawWalker();

    createObstaclesRadiobuttonsFromURL();
    presetActiveObject()
}

//############################################################################################################
//############################################################################################################
//############################################################################################################