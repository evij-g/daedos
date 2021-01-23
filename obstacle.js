//################## OBSTACLES ################################################################################################



var obstacleArray = [];
var selectedObstacle = 0;
var selectedObjectColor = "violet";
var countedObstacles = 0;



function createObstacleObjects(array) {
    array.splice(0, 8); // remove first 8 values of url parameter array.
    countedObstacles = array.length / 6; // determine the number of obstacles
    //console.log("createObstacleObjects");
    //console.table(array);

    for (let i = 0; i < countedObstacles; i++) {
        // extract the values from the array and push them into an seperate object

        let obs = {
            obsIndex: parseInt(array[0]),
            obsX: parseInt(array[1]),
            obsY: parseInt(array[2]),
            obsWidth: parseInt(array[3]),
            obsHeight: parseInt(array[4]),
            obsColor: array[5],

            //edit mode feature
            type: "obs"

        };

        obstacleArray.push(obs);
        array.splice(0, 6); //vorher: splice(0,6) jetzt (0,7) wegen dem "type"
    }

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
                    type: object.type
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
    console.log("obstacleArrayLength: " + obstacleArray.length);

    let newObsIndex = obstacleArray.length;
    newObsIndex == 0 ? newObsIndex = 0 : newObsIndex++;

    let basicObstacle = {


        obsIndex: newObsIndex,
        obsX: Math.trunc(canvasWidthMultiple / 2 - obsWidth / 2),
        obsY: Math.trunc(canvasHeightMultiple / 2 - obsHeight / 2),
        obsWidth: obsWidth,
        obsHeight: obsHeight,
        obsColor: "white", //selected-
        type: "obs"
    };
    obstacleArray.push(basicObstacle);

}


function removeSelectedObstacle(del) {


    //const result = inventory.find( fruit => fruit.name === 'cherries' );
    let result = obstacleArray.find(element => element.obsIndex == del);

    console.log(result) // { name: 'cherries', quantity: 5 }


    /*
        var j = 0;
        for (var i = 0, l = obstacleArray.length; i < l; i++) {
            console.log(obstacleArray[i]);
            if (obstacleArray[i]. !== element) {
                obstacleArray[j++] = obstacleArray[i];
            }
        }
        arr.length = j;
    */
}