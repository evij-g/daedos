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

var canvasArray = [];

var walkerCTX = ctx;
var walkerCanvasArray = canvasArray;
var walker = {};

var walkerMatrixValues = {};

var obstacleArray = [];
var selectedObstacle = 0;

walkerCTX.webkitImageSmoothingEnabled = true;
walkerCTX.imageSmoothingEnabled = true;

//############################################################################################

var fps = 60;
var stroke = false;
var doAnim = false;

// ###########################################################################################

var startBtnValue = false;
var noWay = false;

var colorArray = ["#FF0000", "#00FF00", "#0000FF"];

var stop = false;
var frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed;

let queryString;

// ######### URL HANDLING ####################################################################

// The URL contains all the variables set to create a specific image.
// If all values are communicated via the URL, the nice "LABYRs" can be conveniently "saved" and "shared".

function getUrlParameter() {
    //TEST-STRING
    //queryString="?width=500&height=400&scale=10&bgcolor=white&startx=2&starty=1&startdir=down&linecolor=black&obs=1&obsx=5&obsy=6&obswidth=4&obsheight=4&obscolor=red&obs=2&obsx=30&obsy=26&obswidth=5&obsheight=8&obscolor=blue";
    initqueryString =
        "?width=500&height=420&scale=10&bgcolor=black&startx=1&starty=1&startdir=down&linecolor=white&obs=1&obsx=1&obsy=11&obswidth=4&obsheight=4&obscolor=white&obs=2&obsx=18&obsy=4&obswidth=5&obsheight=8&obscolor=white";
    queryString = window.location.search;

    console.log(queryString);
    queryString != "" ? queryString : (queryString = initqueryString);
    let urlParams = new URLSearchParams(queryString);
    return urlParams;
}

function updateURL() {
    let urlParams = new URLSearchParams(queryString);

    let newURL = "";

    urlParams.set("width", canvas.width);
    urlParams.set("height", canvas.height);
    urlParams.set("scale", scale);
    urlParams.set("bgcolor", canvasBackgroundColor);

    urlParams.set("startx", walker.startx);
    urlParams.set("starty", walker.starty);
    urlParams.set("linecolor", walker.color);
    urlParams.set("startdir", walker.startdirection);

    urlParams.delete("obs");
    urlParams.delete("obsx");
    urlParams.delete("obsy");
    urlParams.delete("obswidth");
    urlParams.delete("obsheight");
    urlParams.delete("obscolor");

    for (let i = 0; i < obstacleArray.length; i++) {
        // extract the values from the array and push it into an seperate object

        urlParams.append("obs", obstacleArray[i].obsIndex);
        urlParams.append("obsx", obstacleArray[i].obsX);
        urlParams.append("obsy", obstacleArray[i].obsY);
        urlParams.append("obswidth", obstacleArray[i].obsWidth);
        urlParams.append("obsheight", obstacleArray[i].obsHeight);
        urlParams.append("obscolor", obstacleArray[i].obsColor);

        console.log(urlParams.toString());
    }

    if (history.pushState) {
        newurl =
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?" +
            urlParams.toString();
        window.history.replaceState({ path: newurl }, "", newurl);
        //location.href=newurl;
    }
}

function countURLparameter(parameter) {
    entries = parameter.entries();
    let counter = 0;
    let paramsArray = [];

    // Display the key/value pairs
    for (var pair of parameter.entries()) {
        paramsArray.push(pair[1]); //es werden nur die Werte in das Array geladen.
        // console.log(pair[0]+ ', '+ pair[1]);
        counter++;
    }

    createObstacleObjects(paramsArray);
    return counter;
}

function setPropertiesFromURL() {
    let parameter = getUrlParameter();
    let parameterCounter = countURLparameter(parameter);

    if (parameterCounter === 0) {
        console.log("no URL parameters found. Use init values instead!");
        initValues();
        initCanvasArray();
        initWalker();
    } else {
        console.log("URL parameters found!");

        canvas.width = parameter.get("width");
        canvas.height = parameter.get("height");
        canvasBackgroundColor = parameter.get("bgcolor");

        scale = parameter.get("scale");

        canvasWidthMultiple = canvas.width / scale;
        canvasHeightMultiple = canvas.height / scale;

        walker = {
            startx: parameter.get("startx"),
            starty: parameter.get("starty"),
            color: parameter.get("linecolor"),
            startdirection: parameter.get("startdir"),
        };

        initCanvasArray();
        initWalker();
        setObstaclesIntoWalkerArray();
    }
}

//################## OBSTACLES ################################################################################################

function createObstacleObjects(array) {
    array.splice(0, 8); // remove first 8 values of url parameter array.
    let countedObstacles = array.length / 6; // determine the number of obstacles

    for (let i = 0; i < countedObstacles; i++) {
        // extract the values from the array and push it into an seperate object

        let obs = {
            obsIndex: array[0],
            obsX: parseInt(array[1]),
            obsY: parseInt(array[2]),
            obsWidth: parseInt(array[3]),
            obsHeight: parseInt(array[4]),
            obsColor: array[5],
        };

        obstacleArray.push(obs);
        array.splice(0, 6);
    }
}

function setObstaclesIntoWalkerArray() {
    for (let obs = 0; obs < obstacleArray.length; obs++) {
        let object = obstacleArray[obs];

        for (let y = 0; y < object.obsHeight; y++) {
            for (let x = 0; x < object.obsWidth; x++) {
                let fragment = {
                    x: x + object.obsX,
                    y: y + object.obsY,
                    color: object.obsColor,
                };
                setWalker(fragment);
            }
        }
    }
    console.log("obstacles placed");
}

//######## INIT VALUES ##########################################################################################################

function initValues() {
    console.log("init values loaded");

    scale = 10;
    canvasWidthMultiple = canvasWidth / scale;
    canvasHeightMultiple = canvasHeight / scale;
    canvasBackgroundColor = "#FFFFFF";

    walker = { x: 2, y: 1, color: "#000000", direction: "down" };
}

//########### HANDLING BUTTON EVENTS ############################################################################################
function buttonchecker(e) {
    console.log(e + " clicked");

    switch (e) {
        case "startButton":
            console.log("start animatiion");

            startBtnValue = true;

            document.getElementById("startButton").classList.add("blinkingBackground");
            document.getElementById("pauseButton").classList.remove("blinkingBackground");
            document.getElementById("daedos-menu").classList.remove("showMenu");
            startAnimating();

            break;

        case "pauseButton":
            console.log("pause animatiion");

            startBtnValue = false;

            document.getElementById("startButton").classList.remove("blinkingBackground");
            document.getElementById("pauseButton").classList.add("blinkingBackground");
            document.getElementById("daedos-menu").classList.remove("showMenu");

            break;

        case "resetButton":
            console.log("stop and reset animatiion");

            resetButtonActions();
            document.getElementById("daedos-menu").classList.remove("showMenu");

            break;

        case "menuButton":
            document.getElementById("daedos-menu").classList.toggle("showMenu");
            break;

        case "shareButton":
            updateURL();
            //document.getElementById("menu").classList.remove("showMenu");
            const title = document.getElementById("daedos-title").textContent;
            const url =
                // (document.querySelector("link[rel=canonical]") &&
                //    document.querySelector("link[rel=canonical]").href) ||
                window.location.href;
            if (navigator.share) {
                navigator
                    .share({
                        //title: title,
                        //text: "generating",
                        url: url,
                    })
                    .then(() => {
                        console.log("Thanks for sharing!");
                    })
                    .catch((err) => {
                        console.log(`Couldn't share because of`, err.message);
                    });
            } else {
                console.log("web share not supported");
                popUpMessage();
            }

            break;
    }
}

function resetButtonActions() {
    startBtnValue = false;

    document.getElementById("startButton").classList.remove("blinkingBackground");
    document.getElementById("pauseButton").classList.remove("blinkingBackground");

    heading.classList.remove("noWayOut");

    noWay = false;

    resetCanvas();
}

function popUpMessage() {
    const title = document.getElementById("daedos-title").textContent;
    const url =
        // (document.querySelector("link[rel=canonical]") &&
        //     document.querySelector("link[rel=canonical]").href) ||
        window.location.href;

    var dummy = document.createElement("input"),
        text = window.location.href;
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    alert("Link copied please open your messanger and paste to send");
}

function changeSelectedObstacle(button) {
    console.log("selected obstacle: " + selectedObstacle);
    //console.log(obstacleArray[0]);
    console.log(button);

    switch (button) {
        case "addObs":
            let obsWidth = Math.trunc(canvasWidthMultiple * (10 / 100)); // 5%
            let obsHeight = Math.trunc(canvasHeightMultiple * (10 / 100)); //5%

            let basicObstacle = {
                obsIndex: obstacleArray.length + 1,
                obsX: canvasWidthMultiple - 2 * obsWidth,
                obsY: canvasHeightMultiple - obsHeight,
                obsWidth: obsWidth,
                obsHeight: obsHeight,
                obsColor: "white",
            };
            obstacleArray.push(basicObstacle);
            reloadMenu();
            console.log(obstacleArray);
            break;
        case "removeObs":
            obstacleArray.splice(selectedObstacle, 1);
            reloadMenu();

            console.log(obstacleArray);

            break;
        case "upPosButton":
            obstacleArray[selectedObstacle].obsY--;
            break;
        case "downPosButton":
            obstacleArray[selectedObstacle].obsY++;
            break;
        case "leftPosButton":
            obstacleArray[selectedObstacle].obsX--;
            break;
        case "rightPosButton":
            obstacleArray[selectedObstacle].obsX++;
            break;
        case "sizeXPlusButton":
            obstacleArray[selectedObstacle].obsWidth++;
            break;
        case "sizeXMinusButton":
            obstacleArray[selectedObstacle].obsWidth--;
            break;
        case "sizeYPlusButton":
            obstacleArray[selectedObstacle].obsHeight++;
            break;
        case "sizeYMinusButton":
            obstacleArray[selectedObstacle].obsHeight--;
            break;

        case "canvasSizeXPlusButton":
            canvasWidthMultiple++;
            resetCanvas();
            break;
        case "canvasSizeXMinusButton":
            canvasWidthMultiple--;
            resetCanvas();
            break;
        case "canvasSizeYPlusButton":
            canvasHeightMultiple++;
            resetCanvas();
            break;
        case "canvasSizeYMinusButton":
            canvasHeightMultiple--;
            console.log("before");
            console.table(walkerCanvasArray);

            resetCanvas();
            console.log("after");
            console.table(walkerCanvasArray);
            break;
    }

    updateURL();
    resetButtonActions();
}

//############ GUI ##################################################################################

function createObstaclesRadiobuttonsFromURL() {
    // generate all radiobuttons and assign the color to the label from obstacleArray

    for (let obs = 0; obs < obstacleArray.length; obs++) {
        let object = obstacleArray[obs];
        let color = object.obsColor;

        let radioString =
            `
            <label class="radio radio-before">
                <span class="radio__input">
                <input type="radio" name="obstacle" value="` +
            obs +
            `">
                <span class="radio__control"></span>
                </span>
                <span class="radio__label">
                    <span class="radio__label_inner">
                        <svg fill="` +
            color +
            `"><use href="#rect"></use></svg>
                    </span>
                </span>
            </label>`;

        // radioString="test";

        document.getElementById("obstacleForm").innerHTML += radioString;
    }

    // add event listener to radiobuttons form

    document.obstacleForm.addEventListener("change", getSelectedObstacleFromGUI);
}

function reloadMenu() {
    document.getElementById("obstacleForm").innerHTML = "";
    createObstaclesRadiobuttonsFromURL();
}

function getSelectedObstacleFromGUI() {
    //

    const radiobuttons = document.querySelectorAll('input[name="obstacle"]');

    for (const button of radiobuttons) {
        if (button.checked) {
            selectedObstacle = button.value;
            console.log(selectedObstacle);
            break;
        }
    }
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
            //if(walkerCanvasArray[y][x] != "walker"){
            ctx.fillStyle = walkerCanvasArray[y][x];
            //}else{
            // ctx.fillStyle = walker.get("color");
            // }

            ctx.fillRect(x * scale, y * scale, scale, scale);
            if (stroke) {
                ctx.strokeRect(x * scale, y * scale, scale, scale);
            }
        }
    }

    //setCanvasToOpenGraphImage();
}

function setCanvasToOpenGraphImage() {

    html2canvas(document.getElementById('daedos-canvas')).then(function(canvas) {
        document.body.appendChild(canvas);
        document.querySelector("meta[property='og:image']").setAttribute('content', canvas);

    });
    var dataURL = canvas.toDataURL("image/png");
    console.log(dataURL);

    var meta = document.querySelector("meta[property='og:image']").getAttribute('content');
    document.querySelector("meta[property='og:image']").setAttribute('content', 'dataURL');

    console.log(meta);


}

function initWalker() {
    walkerCanvasArray = canvasArray;
    console.log(walker);
    walker.x = parseInt(walker.startx);
    walker.y = parseInt(walker.starty);
    walker.direction = walker.startdirection;
    setWalker(walker);
}

function setWalker(fragment) {
    walkerCanvasArray[fragment.y][fragment.x] = fragment.color;
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

    noWay
        ?
        (console.log("NO WAY OUT"),
            heading.classList.add("noWayOut"),
            document.getElementById("startButton").classList.remove("blink")) :
        noWay;

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
            walkerCanvasArray[walker.y - 2][walker.x - 1] === canvasBackgroundColor &&
            walkerCanvasArray[walker.y - 2][walker.x] === canvasBackgroundColor &&
            walkerCanvasArray[walker.y - 2][walker.x + 1] === canvasBackgroundColor ?
            true :
            false;
    } catch (error) {
        tup = false;
    }

    try {
        tleft =
            walkerCanvasArray[walker.y - 1][walker.x - 2] === canvasBackgroundColor &&
            walkerCanvasArray[walker.y][walker.x - 2] === canvasBackgroundColor &&
            walkerCanvasArray[walker.y + 1][walker.x - 2] === canvasBackgroundColor ?
            true :
            false;
    } catch (error) {
        tleft = false;
    }

    try {
        tdown =
            walkerCanvasArray[walker.y + 2][walker.x - 1] === canvasBackgroundColor &&
            walkerCanvasArray[walker.y + 2][walker.x] === canvasBackgroundColor &&
            walkerCanvasArray[walker.y + 2][walker.x + 1] === canvasBackgroundColor ?
            true :
            false;
    } catch (error) {
        tdown = false;
    }

    try {
        tright =
            walkerCanvasArray[walker.y - 1][walker.x + 2] === canvasBackgroundColor &&
            walkerCanvasArray[walker.y][walker.x + 2] === canvasBackgroundColor &&
            walkerCanvasArray[walker.y + 1][walker.x + 2] === canvasBackgroundColor ?
            true :
            false;
    } catch (error) {
        tright = false;
    }

    //#################### corners ######################

    try {
        tx1 =
            walkerCanvasArray[walker.y - 2][walker.x - 2] === canvasBackgroundColor ?
            true :
            false;
    } catch (error) {
        tx1 = false;
    }

    try {
        tx2 =
            walkerCanvasArray[walker.y + 2][walker.x - 2] === canvasBackgroundColor ?
            true :
            false;
    } catch (error) {
        tx2 = false;
    }

    try {
        tx3 =
            walkerCanvasArray[walker.y + 2][walker.x + 2] === canvasBackgroundColor ?
            true :
            false;
    } catch (error) {
        tx3 = false;
    }

    try {
        tx4 =
            walkerCanvasArray[walker.y - 2][walker.x + 2] === canvasBackgroundColor ?
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

        /* let log1 = [];
            //log1.push(["","upBorder: "+upBorder,""]);
            log1.push(["x1:"+x1,"up: "+up,"x4: "+x4]);
            log1.push(["left: "+left,"dir: "+walker.direction,"right: "+right]);
            log1.push(["x2: "+x2,"down: "+down,"x3: "+x3]);  */

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

        //console.table(log1);

        //printWalkerMatrix();
    }
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
    for (var y = 0; y < canvasHeightMultiple; y++) {
        canvasArray[y] = [];
        for (var x = 0; x < canvasWidthMultiple; x++) {
            let color = canvasBackgroundColor;
            let element = { x, y, color };
            setCanvasArray(element);
        }
    }
}

//set color in array field of given object variables (x,y,color)
function setCanvasArray(e) {
    canvasArray[e.y][e.x] = e.color;
}

function drawCanvasArray() {
    for (var y = 0; y < canvasHeightMultiple; y++) {
        for (var x = 0; x < canvasWidthMultiple; x++) {
            //console.log(" drawCanvasArray:\ty:"+y+" x:"+x+" color:"+canvasArray[y][x]);

            // if(canvasArray[y][x] != "walker"){
            ctx.fillStyle = canvasArray[y][x];
            /* }else{
              ctx.fillStyle ="black";
            }*/

            ctx.fillRect(x * scale, y * scale, scale, scale);
            ctx.strokeRect(x * scale, y * scale, scale, scale);
        }
    }
}

function resetCanvas() {
    let width = canvasWidthMultiple * scale;
    let height = canvasHeightMultiple * scale;

    initCanvasArray();
    //createBorder();
    initWalker();
    walkerCTX.canvas.width = width;
    ctx.canvas.width = width;
    walkerCTX.canvas.height = height;
    ctx.canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    walkerCTX.clearRect(0, 0, width, height);
    setObstaclesIntoWalkerArray();
    drawWalker();
}

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

// ############ DRAW CANVAS WITH BORDERS #####################################################################
//############################################################################################################
//############################################################################################################

function initDAEDOS() {
    setPropertiesFromURL(); // use init values if no url parameter are attached

    //createBorder();

    drawCanvasArray();
    drawWalker();

    createObstaclesRadiobuttonsFromURL();
}

//############################################################################################################
//############################################################################################################
//############################################################################################################