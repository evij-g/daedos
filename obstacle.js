//################## OBSTACLES ################################################################################################



var obstacleArray = [];
var selectedObstacle = 0;
var selectedObjectColor = "violet";



function createObstacleObjects(array) {
    array.splice(0, 8); // remove first 8 values of url parameter array.
    let countedObstacles = array.length / 6; // determine the number of obstacles

    for (let i = 0; i < countedObstacles; i++) {
        // extract the values from the array and push them into an seperate object

        let obs = {
            obsIndex: array[0],
            obsX: parseInt(array[1]),
            obsY: parseInt(array[2]),
            obsWidth: parseInt(array[3]),
            obsHeight: parseInt(array[4]),
            obsColor: array[5],
            obsSelected: false,
        };

        obstacleArray.push(obs);
        array.splice(0, 6);
    }

    selectedObstacle = countedObstacles; //set selected object to last inserted
}



//--------------------- selected object indication enhancement ----------------------

function setSelectedObstacleColor() {
    let obsColor = obstacleArray[selectedObstacle].obsColor;

    obstacleArray[selectedObstacle].obsSelected = true; // visual reference override
}

function overrideAllObstaclesColorToWhite() { // This one should be called right before user press "play" and before the user selects a object
    for (let obs = 0; obs < obstacleArray.length; obs++) {
        obstacleArray[obs].obsColor = "white";
    }
}


//--------------------- --------------------------------------------------------------





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
                setWalker(fragment); // inserts object into walkerArray
            }
        }
    }
    console.log("obstacles placed");
}









function insertNewObstacle() {
    let obsWidth = Math.trunc(canvasWidthMultiple * (10 / 100)); // 5%
    let obsHeight = Math.trunc(canvasHeightMultiple * (10 / 100)); //5%

    let basicObstacle = {
        obsIndex: obstacleArray.length + 1,
        obsX: Math.trunc(canvasWidthMultiple / 2 - obsWidth / 2),
        obsY: Math.trunc(canvasHeightMultiple / 2 - obsHeight / 2),
        obsWidth: obsWidth,
        obsHeight: obsHeight,
        obsColor: selectedObjectColor, //selected-
    };
    obstacleArray.push(basicObstacle);

}