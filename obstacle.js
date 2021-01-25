//################## OBSTACLES ################################################################################################



var obstacleArray = [];
var selectedObstacleArrayIndex = 0;
var selectedObstacleIdentifier = "";
var selectedObjectColor = "violet";
var countedObstacles = 0;
var obsMoveSpeed = 120;


function createObstacleObjects(array) {
    array.splice(0, 8); // remove first 8 values of url parameter array.
    countedObstacles = array.length / 6; // determine the number of obstacles
    //console.log("createObstacleObjects");
    //console.table(array);

    for (let i = 0; i < countedObstacles; i++) {
        // extract the values from the array and push them into an seperate object

        let obs = {
            obsIndex: array[0],
            obsX: parseInt(array[1]),
            obsY: parseInt(array[2]),
            obsWidth: parseInt(array[3]),
            obsHeight: parseInt(array[4]),
            obsColor: array[5],

            //edit mode feature
            type: "obs",
            selected: false

        };

        obstacleArray.push(obs);
        array.splice(0, 6); //vorher: splice(0,6) jetzt (0,7) wegen dem "type"
    }

    //set the first object as selected for starting right away the modification 
    obstacleArray[0].selected = true;

    //selectedObstacle = countedObstacles; //set selected object to last inserted
    console.log(obstacleArray);
}




function setObstaclesIntoWalkerArray() {
    console.log("counted obstacles: " + obstacleArray.length);
    //  console.table(obstacleArray);
    for (let obs = 0; obs < obstacleArray.length; obs++) {
        let object = obstacleArray[obs];

        for (let y = 0; y < object.obsHeight; y++) {
            for (let x = 0; x < object.obsWidth; x++) {
                let fragment = {
                    obsIndex: object.obsIndex,
                    x: x + object.obsX,
                    y: y + object.obsY,
                    color: object.obsColor,
                    type: object.type,
                    selected: object.selected
                };
                setWalker(fragment); // inserts object into walkerArray
            }
        }
    }
    console.log("obstacles placed");

}





function uuidv4() {
    return 'xxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}





function insertNewObstacleIntoArray() {
    let obsWidth = Math.trunc(canvasWidthMultiple * (10 / 100)); // 5%
    let obsHeight = Math.trunc(canvasHeightMultiple * (10 / 100)); //5%
    console.log("obstacleArrayLength: " + obstacleArray.length);


    let firstObject = false;
    obstacleArray.length == 0 ? firstObject = true : firstObject;


    //reset the "selected" value to false of all elements in array
    for (element of obstacleArray) {
        element.selected = false;
    }
    // so that only the new inserted element will be the selected one

    let newIndex = uuidv4();
    let basicObstacle = {


        obsIndex: newIndex, //maybe generate a random number
        obsX: Math.trunc(canvasWidthMultiple / 2 - obsWidth / 2),
        obsY: Math.trunc(canvasHeightMultiple / 2 - obsHeight / 2),
        obsWidth: obsWidth,
        obsHeight: obsHeight,
        obsColor: "white", //selected-
        type: "obs",
        selected: true
    };
    obstacleArray.push(basicObstacle);
    console.log("inserted new Object with Identifier: " + basicObstacle.obsIndex);




    //set the selected Object to the new inserted one
    selectedObstacleIdentifier = newIndex;
    console.log(selectedObstacleIdentifier);

    return basicObstacle;
}


function findIndexOfSelectedObstacleInArray(selected) {
    let indexNumber = obstacleArray.findIndex(element => element.obsIndex == selected);
    return indexNumber;
}

function returnSelectedObstacleFromArray(selected) {
    let element = obstacleArray[findIndexOfSelectedObstacleInArray(selected)];
    return element;
}


function removeSelectedObstacleFromArray(del) {
    obstacleArray.splice(del, 1);
}

function moveObstacle(dir) {
    let index = findIndexOfSelectedObstacleInArray(selectedObstacleIdentifier);
    switch (dir) {
        case "up":
            obstacleArray[index].obsY--;
            break;
        case "down":
            obstacleArray[index].obsY++;
            break;
        case "left":
            obstacleArray[index].obsX--;
            break;
        case "right":
            obstacleArray[index].obsX++;
            break;
    }

}

function transform(element, transform) {

    switch (element) {
        case "canvas":
            switch (transform) {
                case "x+":
                    canvasWidthMultiple++;
                    break;
                case "x-":
                    canvasWidthMultiple--;
                    break;
                case "y+":
                    canvasHeightMultiple++;
                    break;
                case "y-":
                    canvasHeightMultiple--;
                    break;
            }
            break;

        case "obs":
            let index = findIndexOfSelectedObstacleInArray(selectedObstacleIdentifier);

            switch (transform) {

                case "x+":
                    obstacleArray[index].obsWidth++;

                    break;
                case "x-":
                    obstacleArray[index].obsWidth--;
                    break;
                case "y+":
                    obstacleArray[index].obsHeight++;
                    break;
                case "y-":
                    obstacleArray[index].obsHeight--;
                    break;
            }
            break;
    }
}