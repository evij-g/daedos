//########### HANDLING BUTTON EVENTS ############################################################################################

function menuButtonHandler() {
    const menuwrapper = document.getElementById("daedos-menu");
    menuwrapper.addEventListener('click', (event) => {
        const isButton = event.target.nodeName === 'BUTTON';
        if (!isButton) {
            return;
        }

        console.dir("button clicked: " + event.target.id);

        switch (event.target.id) {
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

                //######### MODIFIERS #####################

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



    })
    updateURL();
    resetButtonActions();
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

function changeSelectedModifier(button) {
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

function reloadMenu() {
    document.getElementById("obstacleForm").innerHTML = "";
    createObstaclesRadiobuttonsFromURL();
}