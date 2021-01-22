// ######### URL HANDLING ####################################################################

// The URL contains all the variables set to create a specific image.
// If all values are communicated via the URL, the nice "LABYRs" can be conveniently "saved" and "shared".

function getUrlParameter() {
    //TEST-STRING
    //queryString="?width=500&height=400&scale=10&bgcolor=white&startx=2&starty=1&startdir=down&linecolor=black&obs=1&obsx=5&obsy=6&obswidth=4&obsheight=4&obscolor=red&obs=2&obsx=30&obsy=26&obswidth=5&obsheight=8&obscolor=blue";
    queryString = window.location.search;

    //console.log(queryString);
    queryString != "" ? queryString : (queryString = initqueryString);
    let urlParams = new URLSearchParams(queryString);
    return urlParams;
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














function createObstaclesRadiobuttonsFromURL() {
    // generate all radiobuttons and assign the color to the label from obstacleArray

    for (let obs = 0; obs < obstacleArray.length; obs++) {
        let object = obstacleArray[obs];
        let color = object.obsColor;
        let first = (obs == 0) ? 'checked="checked"' : " ";

        let radioString =
            `
            <label class="radio radio-before">
                <span class="radio__input">
                <input type="radio" name="obstacle" value="` + obs + `" ` + first + `>
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


    }

    if (history.pushState) {
        newurl =
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?" +
            urlParams.toString();
        window.history.replaceState({
            path: newurl
        }, "", newurl);
        //location.href=newurl;
    }

    console.log("url updated");
    return newurl;
}