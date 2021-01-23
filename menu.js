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
    console.log("Edit mode: " + e);
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
        setObjectEditMode(true);

        switch (event.target.id) {

            case "addObs":

                insertNewObstacle();
                //updateURL();
                reloadMenu();
                console.log(obstacleArray);
                break;

            case "removeObs":
                console.log("remove selected Obstacle: " + selectedObstacle);
                obstacleArray.splice(selectedObstacle, 1);
                //emoveSelectedObstacle(selectedObstacle);
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

        getSelectedObstacleFromGUI();
        updateURL();
        resetButtonActions();


    })



}


//############ GUI ##################################################################################


function createObstaclesRadiobuttonsFromURL() {
    // generate all radiobuttons and assign the color to the label from obstacleArray

    for (let obs = 0; obs < obstacleArray.length; obs++) {
        //for (let obs = 1; obs <= countedObstacles; obs++) {
        let object = obstacleArray[obs];
        console.log(object);
        let color = object.obsColor;

        let radioString = `<label class="radio radio-before"><span class="radio__input"><input type="radio" name="obstacle" obsindex="` + obs + `"><span class="radio__control"></span></span><span class="radio__label"><span class="radio__label_inner"><div class="radio__label_inner__object" style="background-color:` + color + `"></div></span></span></label>`;

        // radioString="test";

        document.getElementById("obstacleForm").innerHTML += radioString;
    }

    // add event listener to radiobuttons form

    //document.obstacleForm.addEventListener("change", getSelectedObstacleFromGUI);
    // document.obstacleForm.addEventListener("click", getSelectedObstacleFromGUI);
    console.log(obstacleForm);

    for (RadioButton of obstacleForm.children) {
        //RadioButton.Attributes.Add("onclick", "alert('hello');");
        //console.log("radiobutton element: " + RadioButton);
        RadioButton.onclick = getSelectedObstacleFromGUI;

    }
}



function getSelectedObstacleFromGUI() {


    console.log("this one");
    console.log(this.childNodes.item(1));
    console.log(this.getElementsByTagName("input").item(0).getAttribute("obsindex"));

    selectedObstacle = parseInt((this.getElementsByTagName("input").item(0).getAttribute("obsindex")));
    console.log("selected object:" + selectedObstacle);
    try {

        //uncheck all radiobuttons 
        for (entry of obstacleForm.children) { //obstacleForm.children returns array iterator // zuerst wird die active-klasse von allen radiobuttons entfernt
            entry.classList.remove("checked");
        }
        //then set checked on clicked one
        let activeRadio = item.parentElement.parentElement;
        activeRadio.classList.add("checked");

        drawWalker();

        // setSelectedObstacleRadioIndicatorColor(); //sets css variable



        // setObjectEditMode(true);

        // console.log(this.getElementsByTagName("input").item(0).getAttribute("obsindex"));
        //selectedObstacle = (this.getElementsByTagName("input").item(0).getAttribute("obsindex"));

        //let obstacleForm = document.getElementById("obstacleForm");
        let radios = obstacleForm.elements.obstacle; //returns html collection where active radiobutton is "value"
        //console.log(radios);

        /* V2


                for (let i = 0; i < radios.length; i++) {
                    let item = radios[i];
                    // console.log("obsIndex: " + item.getAttribute("obsindex") + " checked?: " + item.checked);
                    //console.log(item);

                    if (item.checked) {
                        // selectedObstacle = item.getAttribute("obsindex");

                        console.log(item.parentElement.parentElement);

                        let activeRadio = item.parentElement.parentElement;


                        setSelectedObstacleRadioIndicatorColor(); //sets css variable
                        activeRadio.classList.add("checked");
                    }
                }
        */





        /*
                selectedObstacle = radios.value; // sets the global selectedObstacle variable to active radiobutton-value
                selectedObstacle = radios.attr("obsIndex");

                //obstacleArray[selectedObstacle].obsColor = selectedObstacleColor; // visual reference override works!

                console.log("selected radiobutton: " + selectedObstacle);

                for (entry of obstacleForm.children) { //obstacleForm.children returns array iterator // zuerst wird die active-klasse von allen radiobuttons entfernt
                    entry.classList.remove("checked");
                }

                //danach setze die checked klasse auf den aktiven Radiobutton
                let activeRadio = obstacleForm.children.item(selectedObstacle);

                setSelectedObstacleRadioIndicatorColor();
                activeRadio.classList.add("checked");*/

    } catch (error) {
        console.log("no objects inserted!");
    }


    //setSelectedObstacleRadioIndicatorColor(); //sets css variable
    //overrideAllObstaclesColorToWhite();
    //resetCanvas(); //there should be set the active object color 

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