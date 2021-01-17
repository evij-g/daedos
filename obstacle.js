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