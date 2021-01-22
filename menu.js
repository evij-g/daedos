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


                startAnimating();

                break;

            case "pauseButton":
                console.log("pause animatiion");

                startBtnValue = false;

                document.getElementById("startButton").classList.remove("blinkingBackground");
                document.getElementById("pauseButton").classList.add("blinkingBackground");


                break;

            case "resetButton":
                console.log("stop and reset animatiion");

                resetButtonActions();


                break;

                // case "menuButton":
                //     document.getElementById("daedos-menu").classList.toggle("showMenu");
                //     break;

            case "shareButton":
                shareButtonActions();

                break;

            case "selectObjButton":
                document.getElementById("selectObj").classList.add("mod-active");
                document.getElementById("positionObj").classList.remove("mod-active");
                document.getElementById("sizeObj").classList.remove("mod-active");
                document.getElementById("canvasSize").classList.remove("mod-active");
                break;

            case "moveObjButton":
                document.getElementById("selectObj").classList.remove("mod-active");
                document.getElementById("positionObj").classList.add("mod-active");
                document.getElementById("sizeObj").classList.remove("mod-active");
                document.getElementById("canvasSize").classList.remove("mod-active");
                break;

            case "sizeObjButton":
                document.getElementById("selectObj").classList.remove("mod-active");
                document.getElementById("positionObj").classList.remove("mod-active");
                document.getElementById("sizeObj").classList.add("mod-active");
                document.getElementById("canvasSize").classList.remove("mod-active");
                break;

            case "sizeCanvasButton":
                document.getElementById("selectObj").classList.remove("mod-active");
                document.getElementById("positionObj").classList.remove("mod-active");
                document.getElementById("sizeObj").classList.remove("mod-active");
                document.getElementById("canvasSize").classList.add("mod-active");
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
    overrideAllObstaclesColorToWhite();
    resetCanvas();
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
        updateURL();
        resetButtonActions();


    })



}


//############ GUI ##################################################################################


function getSelectedObstacleFromGUI() {
    //



    let obstacleForm = document.getElementById("obstacleForm");
    let radios = obstacleForm.elements.obstacle; //returns html collection with active radiobutton as "value"
    selectedObstacle = radios.value; // sets the global selectedObstacle variable to active radiobutton-value

    //obstacleArray[selectedObstacle].obsColor = selectedObstacleColor; // visual reference override works!



    for (entry of obstacleForm.children) { //obstacleForm.children returns array iterator // zuerst wird die active-klasse von allen radiobuttons entfernt
        console.log(entry);
        entry.classList.remove("checked");
    } //danach setze die checked klasse auf den aktiven Radiobutton
    let activeRadio = obstacleForm.children.item(selectedObstacle);
    setSelectedObstacleRadioIndicatorColor();
    activeRadio.classList.add("checked");


    //live nodelists

    // console.log(radios.childNodes);

    /* const radiobuttons = document.querySelectorAll('input[name="obstacle"]');
     for (const button of radiobuttons) {
         if (button.checked) {
             selectedObstacle = button.value;
             console.log(button);
             console.log("parentNode");
             console.log(button.parentNode.parentNode);
             button.parentNode.parentNode.classList.toggle("checked");
             overrideAllObstaclesColorToWhite();

             obstacleArray[selectedObstacle].obsColor = selectedObstacleColor; // visual reference override
             //console.log(obstacleArray[selectedObstacle]);
             setSelectedObstacleRadioIndicatorColor();
             break;

         }
     }*/

    //resetButtonActions();
    console.log("selected Object: " + selectedObstacle);
    resetCanvas();
}


function setSelectedObstacleRadioIndicatorColor() { //override the color of the active radiobutton-object 

    let r = document.documentElement;

    // Set the value of variable --blue to another value (in this case "lightblue")
    r.style.setProperty('--selectedObjectColor', selectedObjectColor);



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