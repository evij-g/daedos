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
                console.log("start animatiion");

                startBtnValue = true;

                document.getElementById("startButton").classList.add("blinkingBackground");
                document.getElementById("pauseButton").classList.remove("blinkingBackground", "noWay");

                setObjectEditMode(false);
                startAnimating();

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

                // case "menuButton":
                //     document.getElementById("daedos-menu").classList.toggle("showMenu");
                //     break;

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
}

function setObjectEditMode(e) {
    obsSelectedEditMode = e;
    console.log("Edit mode!");
    drawWalker();
}



function checkModifierButtons() {
    const wrapper = document.getElementById("modifiers");
    wrapper.addEventListener('click', (event) => {
        const isButton = event.target.nodeName === 'BUTTON';
        if (!isButton) {
            return;
        }

        // event.target.classList.add("active");

        console.dir("modifier button clicked: " + event.target.id);

        switch (event.target.id) {

            case "addObs":

                insertNewObstacle();
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
                //resetCanvas();
                break;
            case "canvasSizeXMinusButton":
                canvasWidthMultiple--;
                //resetCanvas();
                break;
            case "canvasSizeYPlusButton":
                canvasHeightMultiple++;
                //resetCanvas();
                break;
            case "canvasSizeYMinusButton":
                canvasHeightMultiple--;
                //resetCanvas();
                break;
        }
        setObjectEditMode(true);
        updateURL();
        resetButtonActions();


    })



}


//############ GUI ##################################################################################


function createObstaclesRadiobuttonsFromURL() {
    // generate all radiobuttons and assign the color to the label from obstacleArray

    for (let obs = 0; obs < obstacleArray.length; obs++) {
        let object = obstacleArray[obs];
        let color = object.obsColor;
        let last = (obs == 0) ? 'checked="checked"' : " ";

        let radioString =
            `
            <label class="radio radio-before">
                <span class="radio__input">
                <input type="radio" name="obstacle" value="` + obs + `" ` + last + `>
                <span class="radio__control"></span>
                </span>
                <span class="radio__label">
                    <span class="radio__label_inner">
                    <div class="radio__label_inner__object" style="background-color:` + color + `"></div>
                        
                    </span>
                </span>
            </label>`;

        // radioString="test";

        document.getElementById("obstacleForm").innerHTML += radioString;
    }

    // add event listener to radiobuttons form

    document.obstacleForm.addEventListener("change", getSelectedObstacleFromGUI);
}



function getSelectedObstacleFromGUI() {

    let obstacleForm = document.getElementById("obstacleForm");
    let radios = obstacleForm.elements.obstacle; //returns html collection where active radiobutton is "value"


    try {

        selectedObstacle = radios.value; // sets the global selectedObstacle variable to active radiobutton-value

        //obstacleArray[selectedObstacle].obsColor = selectedObstacleColor; // visual reference override works!

        console.log("selected radiobutton: " + selectedObstacle);

        for (entry of obstacleForm.children) { //obstacleForm.children returns array iterator // zuerst wird die active-klasse von allen radiobuttons entfernt
            entry.classList.remove("checked");
        } //danach setze die checked klasse auf den aktiven Radiobutton
        let activeRadio = obstacleForm.children.item(selectedObstacle);
        setSelectedObstacleRadioIndicatorColor();
        activeRadio.classList.add("checked");
    } catch (error) {
        console.log("no objects inserted!");
    }



    //overrideAllObstaclesColorToWhite();
    resetCanvas(); //there should be set the active object color 
    //drawWalker();
}


function setSelectedObstacleRadioIndicatorColor() { //override the color of the active radiobutton-object 

    let r = document.documentElement;

    // Set the value of variable --blue to another value (in this case "lightblue")
    r.style.setProperty('--selectedObjectColor', selectedObjectColor);
    //drawCanvasArray();
    drawWalker();
}

function reloadMenu() {
    document.getElementById("obstacleForm").innerHTML = "";
    createObstaclesRadiobuttonsFromURL();
    getSelectedObstacleFromGUI();
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
    //document.getElementById("menu").classList.remove("showMenu");
    //let title = document.getElementById("daedos-title").innerText;
    //console.log(title);
    const title = document.title;


    const url =
        // (document.querySelector("link[rel=canonical]") &&
        //    document.querySelector("link[rel=canonical]").href) ||
        window.location.href;
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
    //const title = document.getElementById("daedos-title").textContent;
    const title = document.title;
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
    alert("Link copied please open your messenger and paste to send");
}