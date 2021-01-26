function calculateMarginForMenu() {
    let marginTop = document.getElementById("fixed").offsetHeight;
    //marginTop = document.getElementById("daedos-canvas").offsetHeight;
    console.log(marginTop);

    if (window.innerWidth < 650) {
        //document.getElementById("daedos-menu").style.marginTop = marginTop + 15 + "px";
    }
}


window.onload = calculateMarginForMenu;
window.onresize = calculateMarginForMenu;
calculateMarginForMenu();

//########### HANDLING BUTTON EVENTS ############################################################################################

function initButtonHandlers() {
    checkConsoleButtons();
    checkModifierButtons();
}


function checkConsoleButtons() {
    const wrapper = document.getElementById("console");

    let buttons = wrapper.getElementsByTagName("button");


    wrapper.addEventListener('click', (event) => {
        const isButton = event.target.nodeName === 'BUTTON';
        if (!isButton) {
            return;
        }


        for (let item of buttons) {
            item.classList.remove('active')
        }

        event.target.classList.toggle("active");

        console.dir("button clicked: " + event.target.id);

        switch (event.target.id) {
            case "startButton":
                console.log("start animation");

                startBtnValue = true;

                document.getElementById("startButton").classList.add("blinkingBackground");
                document.getElementById("pauseButton").classList.remove("blinkingBackground", "noWay");

                setObjectEditMode(false);
                startAnimating();
                updateURL();
                appendCurrentURLtoHistory(window.location);

                break;

            case "pauseButton":
                console.log("pause animatiion");

                startBtnValue = false;
                setObjectEditMode(false);

                document.getElementById("startButton").classList.remove("blinkingBackground");
                document.getElementById("pauseButton").classList.add("blinkingBackground");


                break;

            case "resetButton":
                console.log("stop and reset animatiion");
                setObjectEditMode(false);
                resetButtonActions();


                break;


            case "shareButton":
                shareButtonActions();
                setObjectEditMode(false);

                break;

            case "selectObjButton":
                document.getElementById("selectObj").classList.add("mod-active");
                document.getElementById("positionObj").classList.remove("mod-active");
                document.getElementById("sizeObj").classList.remove("mod-active");
                document.getElementById("canvasSize").classList.remove("mod-active");
                setObjectEditMode(true);

                break;

            case "moveObjButton":
                document.getElementById("selectObj").classList.remove("mod-active");
                document.getElementById("positionObj").classList.add("mod-active");
                document.getElementById("sizeObj").classList.remove("mod-active");
                document.getElementById("canvasSize").classList.remove("mod-active");
                setObjectEditMode(true);

                break;

            case "sizeObjButton":
                document.getElementById("selectObj").classList.remove("mod-active");
                document.getElementById("positionObj").classList.remove("mod-active");
                document.getElementById("sizeObj").classList.add("mod-active");
                document.getElementById("canvasSize").classList.remove("mod-active");
                setObjectEditMode(true);

                break;

            case "sizeCanvasButton":
                document.getElementById("selectObj").classList.remove("mod-active");
                document.getElementById("positionObj").classList.remove("mod-active");
                document.getElementById("sizeObj").classList.remove("mod-active");
                document.getElementById("canvasSize").classList.add("mod-active");
                setObjectEditMode(true);

                break;

        }

    })


}

function resetButtonActions() {
    startBtnValue = false;


    document.getElementById("startButton").classList.remove("blinkingBackground");
    document.getElementById("pauseButton").classList.remove("blinkingBackground", "blinkBoxshadow");
    document.getElementById("resetButton").classList.remove("blinkingBackground", "blinkBoxshadow");


    heading.classList.remove("blinkingBackgroundHeading");
    //document.getElementById("daedos-canvas").classList.remove("blinkBoxshadow");

    noWay = false;

    resetCanvas();
    drawWalker();
}

function setObjectEditMode(e) {
    obsSelectedEditMode = e;
    console.log("Edit mode: " + e);
    e ? resetButtonActions() : "";
}





//############ GUI ##################################################################################


function insertOneNewRadiobutton(object) {

    let checked = object.selected ? " checked" : "";


    //append a new radiobutton to the gui


    let radioString = `
        <label class="radio radio-before" onclick="getSelectedObstacleFromGUI(this)" id="` + object.obsIndex + `">
            <span class="radio__input">
                <input type="radio" name="obstacle"  obsindex="` + object.obsIndex + `"` + checked + `>
                <span class="radio__control"></span>
            </span>
            <span class="radio__label">
                <span class="radio__label_inner">
                    <div class="radio__label_inner__object" style="background-color:` + object.obsColor + `"></div>
                </span>
            </span>
        </label>`;



    document.getElementById("obstacleForm").innerHTML += radioString;
}

function removeSelectedObstacleRadiobuttonFromGUI(selectedobject) {
    try {
        let del = document.getElementById(selectedobject);
        del.remove();
        console.log("object " + selectedobject + " removed");
        setActiveRadiobutton();
    } catch (error) {
        window.alert("nothing to delete");
    }


}

function createObstaclesRadiobuttonsFromURL() {
    // generate all radiobuttons and assign the color to the label from obstacleArray

    for (let obs = 0; obs < obstacleArray.length; obs++) {

        insertOneNewRadiobutton(obstacleArray[obs]);

    }

}



function getSelectedObstacleFromGUI(e) {
    setObjectEditMode(true);
    console.log(e.id);


    try {
        selectedObstacleIdentifier = e.id;
        selectedObstacleArrayIndex = findIndexOfSelectedObstacleInArray(selectedObstacleIdentifier); //find the index in obstacleArray of selected object
        console.log("selected object:" + selectedObstacleIdentifier);

        //then update the values of the array

        //fist deselect all object elements of array 
        for (object of obstacleArray) {
            if (object.obsIndex == selectedObstacleIdentifier) {
                object.selected = true;
            } else {
                object.selected = false;
            }
        }

    } catch (err) {
        console.trace("there are no Objects");

    }

    setSelectedObstacleRadioIndicatorColor(selectedObstacleIdentifier);
}


function setActiveRadiobutton() {
    console.log("id before: " + selectedObstacleIdentifier);
    try {
        console.log("try");
        selectedObstacleIdentifier = obstacleArray[obstacleArray.length - 1].obsIndex;
        obstacleArray[obstacleArray.length - 1].selected = true;
        selectedObstacleArrayIndex = findIndexOfSelectedObstacleInArray(selectedObstacleIdentifier); //find the index in obstacleArray of selected object
        document.getElementById(selectedObstacleIdentifier).getElementsByTagName("input").item(0).checked = true;
        setSelectedObstacleRadioIndicatorColor(selectedObstacleIdentifier);

    } catch (error) {
        // if we removed one object, the selectedObstaceIdentifier is no more present, 
        // so we have so set it to the last element in our array
        console.log("catch");
        try {
            selectedObstacleIdentifier = obstacleArray[obstacleArray.length - 1].obsIndex;
            selectedObstacleArrayIndex = findIndexOfSelectedObstacleInArray(selectedObstacleIdentifier); //find the index in obstacleArray of selected object
            obstacleArray[obstacleArray.length - 1].selected = true;
            setSelectedObstacleRadioIndicatorColor(selectedObstacleIdentifier);
        } catch (error) {
            console.log("no objects to delete");
        }


    }
}




function setSelectedObstacleRadioIndicatorColor(element) { //override the color of the active radiobutton-object 

    let r = document.documentElement;

    // Set the value of variable --blue to another value (in this case "violet")
    r.style.setProperty('--selectedObjectColor', selectedObjectColor);

    //remove checked class from radiobuttons
    for (entry of obstacleForm.children) { //obstacleForm.children returns array iterator // zuerst wird die active-klasse von allen radiobuttons entfernt
        entry.classList.remove("checked");
    }
    let activeRadio = obstacleForm.children.namedItem(element);
    activeRadio.classList.add("checked");
    activeRadio.getElementsByTagName("input").item(0).checked = true;

    resetCanvas();
    drawWalker();
}






function reloadMenu() {
    document.getElementById("obstacleForm").innerHTML = "";
    createObstaclesRadiobuttonsFromURL();
}






function noWayEvent() {
    console.log("NO WAY OUT");
    heading.classList.toggle("blinkingBackgroundHeading");

    //heading.classList.add("blinkBoxshadow");
    let resetbtn = document.getElementById("resetButton");
    resetbtn.classList.add("blinkBoxshadow");
    resetbtn.classList.remove("active");

    let startbtn = document.getElementById("startButton");
    startbtn.classList.remove("blinkingBackground");
    startbtn.classList.remove("active");



}



/* ################################## SHARE BUTTONS ########################################### */



function shareButtonActions() {
    updateURL();

    const title = document.title;


    const url = window.location.href;
    if (navigator.share) {
        navigator
            .share({
                title: title,
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
}






function popUpMessage() {

    const title = document.title;
    const url = window.location.href;

    var dummy = document.createElement("input"),
        text = window.location.href;
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    alert("Link copied please open your messenger and paste to send");
}






//######################### ENABLE LONG PRESS ON MODIFICATOR BUTTONS ###########
function checkModifierButtons() {
    const wrapper = document.getElementById("modifiers");



    // Listening for the mouse and touch events 
    wrapper.addEventListener("click", modifierButtonsEvents, false);
    wrapper.addEventListener("mousedown", toggleOn, false);
    wrapper.addEventListener("mouseup", toggleOff, false);
    wrapper.addEventListener("mouseleave", toggleOff, false);

    wrapper.addEventListener("touchstart", toggleOn, false);
    wrapper.addEventListener("touchend", toggleOff, false);
    wrapper.addEventListener("pressHold", toggleOn, false);




}

let timerID;
counter = 0;

let pressHoldEvent = new CustomEvent("pressHold");

// Increase or decreae value to adjust how long
// one should keep pressing down before the pressHold
// event fires
let pressHoldDuration = 50;






// function trigger(e) {

//     let tid = 0;
//     let speed = 300;
//     e.mousedown = ThingToDo();

// }


var tid = 0;
var eve = "";
var mousedownFired = false;

function toggleOn(e) {
    const isButton = e.target.nodeName === 'BUTTON';


    //disable toggle option on "add" or "remove" objects buttons
    if (!isButton || e.target.id == "addObs" || e.target.id == "removeObs") {
        return;
    }

    eve = e.target.id;
    mousedownFired = true;
    console.log("mousedownFired: " + e);
    if (tid == 0) {
        tid = setInterval(ThingToDo, obsMoveSpeed);
    } else {
        console.log("do nothing");
    }
}

function toggleOff() {
    if (tid != 0) {
        clearInterval(tid);
        tid = 0;
    }
    mousedownFired = true;
}

function ThingToDo() {

    if (mousedownFired) {
        mousedownFired = false;
        return;
    }
    console.log("event:" + eve);
    modifierButtonsEvents(eve);
}



function modifierButtonsEvents(event) {
    let buttonEvent = event;
    console.log(buttonEvent);
    try {
        const isButton = event.target.nodeName === 'BUTTON';
        if (!isButton) {
            return;
        }
        buttonEvent = event.target.id;
    } catch (error) {
        console.log("longpress");

    }
    switch (buttonEvent) {

        case "addObs":

            insertOneNewRadiobutton(insertNewObstacleIntoArray());
            setActiveRadiobutton();
            break;

        case "removeObs":
            removeSelectedObstacleFromArray(selectedObstacleArrayIndex);
            removeSelectedObstacleRadiobuttonFromGUI(selectedObstacleIdentifier);
            setActiveRadiobutton();
            break;



        case "upPosButton":
            moveObstacle("up");
            break;
        case "downPosButton":
            moveObstacle("down");
            break;
        case "leftPosButton":
            moveObstacle("left");
            break;
        case "rightPosButton":
            moveObstacle("right");
            break;



        case "sizeXPlusButton":
            transform("obs", "x+");
            break;

        case "sizeXMinusButton":
            transform("obs", "x-");
            break;

        case "sizeYPlusButton":
            transform("obs", "y+");
            break;

        case "sizeYMinusButton":
            transform("obs", "y-");
            break;




        case "canvasSizeXPlusButton":
            transform("canvas", "x+");
            break;

        case "canvasSizeXMinusButton":
            transform("canvas", "x-");
            break;

        case "canvasSizeYPlusButton":
            transform("canvas", "y+");
            break;

        case "canvasSizeYMinusButton":
            transform("canvas", "y-");
            break;
    }



    updateURL();
    resetCanvas();

    setObjectEditMode(true);


}



function downloadCanvasAsImage() {
    let today = new Date();
    let dd = today.getDate();

    let mm = today.getMonth() + 1;

    let yyyy = today.getFullYear();
    today = mm + '-' + dd + '-' + yyyy;
    let filename = "daedos-" + uuidv4() + "_" + today + ".png";
    console.log(filename);

    let downloadLink = document.getElementById('dlc');
    downloadLink.setAttribute('download', filename);
    let canvas = document.getElementById('daedos-canvas');
    //base64String = canvas.toDataURL("image/png", 0.92);
    canvas.toBlob(function(blob) {

        let url = URL.createObjectURL(blob);
        downloadLink.setAttribute('href', url);

    });
}