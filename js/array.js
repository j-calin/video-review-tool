//Global Video Upload Module
(function localFileVideoPlayer() {
	'use strict'
  var URL = window.URL || window.webkitURL
  var displayMessage = function (message, isError) {
    var element = document.querySelector('#message')
    element.innerHTML = message
    element.className = isError ? 'error' : 'info'
  }
  var playSelectedFile = function (event) {
    var file = this.files[0]
    var type = file.type
    var videoNode = document.querySelector('video')
    var canPlay = videoNode.canPlayType(type)
    if (canPlay === '') canPlay = 'no'
    var message = 'Can play type "' + type + '": ' + canPlay
    var isError = canPlay === 'no'
    displayMessage(message, isError)

    if (isError) {
      return
    }

    var fileURL = URL.createObjectURL(file)
    videoNode.src = fileURL
  }
  var inputNode = document.querySelector('input')
  inputNode.addEventListener('change', playSelectedFile, false)
})();

//CSV Download Code
function downloadCSV(csv, filename) {
    var csvFile;
    var downloadLink;
    // CSV file
    csvFile = new Blob([csv], {type: "text/csv"}); 
    // Download link
    downloadLink = document.createElement("a");
    // File name
    downloadLink.download = filename;
    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);
    // Hide download link
    downloadLink.style.display = "none";
    // Add the link to DOM
    document.body.appendChild(downloadLink);
    // Click download link
    downloadLink.click();
  }
function exportTableToCSV(filename) {
    var csv = [];
    var rows = document.querySelectorAll("table tr");

    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");
        
        for (var j = 0; j < cols.length; j++) 
            if (cols[j].innerText.match("^[A-Za-z0-9_.-]+$"))
                row.push(cols[j].innerText);
        
        joinedRow = row.join(",");
        csv.push(joinedRow);        
    }
    // Download CSV file
    downloadCSV(csv.join("\n"), filename);
}

let timestampLog = JSON.parse(localStorage.getItem("timestampLog"));
let rowNum = JSON.parse(localStorage.getItem("rowNum"));
let countData = JSON.parse(localStorage.getItem("countData"));
let buttonData = JSON.parse(localStorage.getItem("buttonData"));
let lastData = JSON.parse(localStorage.getItem("lastData"));
let tableid = "timestamps";
  
//Create Blank Array
function initializeData(){
    if (!(countData) || !(countData.numGenerated)) {
        countData = new Object();
        countData.ids = [];
        countData.numDeleted = 0;
        countData.numGenerated = 0;
        countData.table_len = 0;
    }
    if (!(buttonData)) {
        buttonData = new Object();
        buttonData.classNames = [];
        buttonData.html = "";
        buttonData.undoVisibility = "visibleFill";
    }
    if (!timestampLog) {
        timestampLog = [];
        rowNum = {}; //"id": "row"
    }
    updateLocalStorage(timestampLog, rowNum, countData, buttonData, lastData);
}

//Upload array and dict to Localstorage
function updateLocalStorage(timestampLog, rowNum, countData, buttonData=null, lastData=null){
    localStorage.setItem("timestampLog", JSON.stringify(timestampLog));
    localStorage.setItem("rowNum", JSON.stringify(rowNum));
    localStorage.setItem("countData", JSON.stringify(countData));
    localStorage.setItem("buttonData", JSON.stringify(buttonData));
    localStorage.setItem("lastData", JSON.stringify(lastData));
}

// START EDIT
function idMatchesTimestamp(id, timestamp) {
    if (timestamp.id === id)
        return true;
    else
        return false;
}
function searchForTimestamp(timestampLog, targetID) {
    for (index in timestampLog) {
        timestamp = timestampLog[index];
        if (timestamp && idMatchesTimestamp(targetID, timestamp)) {
            return timestamp;
        }
    }
    return false;
}
function saveTimestampEdit(timestampLog) {
    /*var rows = document.querySelectorAll("table tr");
    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");
        
        for (var j = 0; j < cols.length; j++) 
            row.push(cols[j].innerText);
        
        csv.push(row.join(","));        
    }
    //Add both object name and time to the array
    timestampLog.push(timestamp);
    //Save to local storage
    updateLocalStorage(timestampLog);
    updateCounter(className);
    //Update the display
    render();*/
}
function addEndTime(value) {
    let cell = document.getElementById(log.className+"_"+log.time)
    cell.innerHTML = value;
}
class Timestamp {
    constructor(id, className, time, endTime=NaN, rowData="") {
        this.id = id;
        this.className = className;
        this.time = time;
        this.endTime = endTime;
        this.rowData = rowData;
    }
}

// END EDIT

//Function Timestamp - EDIT: adds Timestamp with startTime from video
function addTimestamp(className, time=NaN, endTime=NaN){
    //Grab the current video time
    let video = document.getElementById("video");
    if (isNaN(time))
        time = video.currentTime;
    //EDIT
    add_row(className, time, endTime);
}

// START EDIT
//let ids = [];
//let numDeleted = 0;
//let numGenerated = 0;
function generateID() {
    if (countData.ids.length === 0) {
        countData.numGenerated++;
        for (var i=99; i>=1; i--)
            countData.ids.push(i);
    }
    return countData.ids.pop();
}
function deepCopy(object) {
    return JSON.parse(JSON.stringify(object));
}
function add_row(new_object=null, new_startTime=NaN, new_endTime=NaN)
{
    /*if (new_object === null && document.getElementById("new_object") && !(document.getElementById("new_object").value === null))
        new_object=document.getElementById("new_object").value;
    if (isNaN(new_startTime) && document.getElementById("new_startTime") && !(isNaN(document.getElementById("new_startTime").value)))
        new_startTime=document.getElementById("new_startTime").value;
    if (isNaN(new_endTime) && document.getElementById("new_endTime") && !(isNaN(document.getElementById("new_endTime").value)))
        new_endTime=document.getElementById("new_endTime").value;*/

    timestampLog = JSON.parse(localStorage.getItem("timestampLog"));
    rowNum = JSON.parse(localStorage.getItem("rowNum"));
    countData = JSON.parse(localStorage.getItem("countData"));
    buttonData = JSON.parse(localStorage.getItem("buttonData"));
    backupData();
    
    var table = document.getElementById(tableid);
    let id = `${generateID()}-${countData.numGenerated}-${countData.numDeleted}`;
    rowNum[id] = countData.table_len;

    if (table) {
        var row = table.insertRow(countData.table_len).innerHTML=`
        <tr id='row${id}'>
            <td id='object_row${id}'>${new_object}</td>
            <td id='startTime_row${id}'>${new_startTime}</td>
            <td id='endTime_row${id}'>${new_endTime}</td>
            <td><input type='button' id='end_button${id}' value='End' class='edit' onclick='end_event("${id}")'> <input type='button' id='save_button${id}' value='Save' class='save' style='display: none' onclick='save_row("${id}")'> <input type='button' value='Delete' class='delete' onclick='delete_row("${id}")'></td>
        </tr>
        `;
    }
    
    /*if (!(table === null)) {
        var rows = table.rows;
        var table_len = (rows===null) ? 0 : rows.length;
        var row = table.insertRow(table_len).outerHTML=`<tr id='row${id}'><td id='object_row${id}'>${new_object}</td><td id='startTime_row${id}'>${new_startTime}</td><td id='endTime_row${id}'>${new_endTime}</td><td><input type='button' id='edit_button${id}' value='Edit' class='edit' onclick='edit_row(${id})'> <input type='button' id='save_button${id}' value='Save' class='save' onclick='save_row(${id})'> <input type='button' value='Delete' class='delete' onclick='delete_row(${id})'></td></tr>`;
    } 
    else {
        var row = `<tbody id=tableid><tr id='row${id}'><td id='object_row${id}'>${new_object}</td><td id='startTime_row${id}'>${new_startTime}</td><td id='endTime_row${id}'>${new_endTime}</td><td><input type='button' id='edit_button${id}' value='Edit' class='edit' onclick='edit_row(${id})'> <input type='button' id='save_button${id}' value='Save' class='save' onclick='save_row(${id})'> <input type='button' value='Delete' class='delete' onclick='delete_row(${id})'></td></tr></tbody>`;
        table = row;
    }/*
    /*try{
        var table_len=(table.rows.length)-1+1;
    } catch {table_len = 0};*/

    //Create a new timestamp - EDIT: added id, endTime, rowData
    var timestamp = new Timestamp(id, new_object, new_startTime, new_endTime, row);
    //Add both object name and time to the array - EDIT: added attributes
    timestampLog.push(timestamp);
    countData.table_len++;
    buttonData.undoVisibility = "visibleFill";
    //Save to local storage
    updateLocalStorage(timestampLog, rowNum, countData, buttonData, lastData);
    updateCounter(timestamp.className);
    //Update the display
    render();

    /*document.getElementById("new_object").value="";
    document.getElementById("new_startTime").value="";
    document.getElementById("new_endTime").value="";*/

    //hide_save(id);
}
function hide_save(id) {
    document.getElementById(`save_button${id}`).style.display="none";
    //render();
}
function delete_row(id)
{
    timestampLog = JSON.parse(localStorage.getItem("timestampLog"));
    rowNum = JSON.parse(localStorage.getItem("rowNum"));
    countData = JSON.parse(localStorage.getItem("countData"));
    buttonData = JSON.parse(localStorage.getItem("buttonData"));
    backupData();
    row = rowNum[id];
    //found = false;
    for(var key in rowNum) {
        var value = rowNum[key];
        /*if (value === row) {
            id = key;*/
        if (key === id) {
            delete rowNum[key]; //rowNum.splice(key, 1);delete rowNum[key];
            //found = true;
        } else if (value > row) {
            rowNum[key]--;
        }
    }
    timestamp = searchForTimestamp(timestampLog, id);
    table = document.getElementById(tableid);
    table.deleteRow(row);
    //document.getElementById(`row${id}`).innerHTML="";
    timestampLog.splice(row, 1); //delete timestampLog[row];
    
    //Remove Timestamp from the array
    //timestampLog.pop(timestamp);
    countData.numDeleted++;
    countData.table_len--;
    buttonData.undoVisibility = "visibleFill";
    //Save to local storage
    updateLocalStorage(timestampLog, rowNum, countData, buttonData, lastData);
    subtractFromCounter(timestamp.className);
    //Update the display
    render();
}
function end_event(id)
{
    timestampLog = JSON.parse(localStorage.getItem("timestampLog"));
    rowNum = JSON.parse(localStorage.getItem("rowNum"));
    countData = JSON.parse(localStorage.getItem("countData"));
    buttonData = JSON.parse(localStorage.getItem("buttonData"));
    backupData();
        
    //Grab the current video time
    let video = document.getElementById("video");
    let new_endTime = video.currentTime;

    timestamp = searchForTimestamp(timestampLog, id);
    //update timestamp
    timestamp.rowData = `
    <tr id='row${id}'>
        <td id='object_row${id}'>${timestamp.className}</td>
        <td id='startTime_row${id}'>${timestamp.time}</td>
        <td id='endTime_row${id}'>${new_endTime}</td>
        <td><input type='button' id='end_button${id}' value='End' class='edit' style='display: none' onclick='end_event("${id}")'> <input type='button' id='save_button${id}' value='Save' class='save' style='display: none' onclick='save_row("${id}")'> <input type='button' value='Delete' class='delete' onclick='delete_row("${id}")'></td>
    </tr>
    `;

    /*var endTime = document.getElementById(`endTime_row${id}`);
    endTime.innerHTML = `<td id='endTime_row${id}'>${new_endTime}</td>`;*/
    timestamp.endTime = new_endTime;
    //update timestampLog
    row = rowNum[id];
    timestampLog[row] = timestamp;

    /*/EDIT
    add_row(className, time, endTime);
    
    var table = document.getElementById(tableid);
    rowNo = rowNum[id];
    
    if (table) {
        var row = table.insertRow(countData.table_len).innerHTML=`
        <tr id='row${id}'>
            <td id='object_row${id}'>${new_object}</td>
            <td id='startTime_row${id}'>${new_startTime}</td>
            <td id='endTime_row${id}'>${new_endTime}</td>
            <td><input type='button' id='edit_button${id}' value='Edit' class='edit' onclick='edit_row("${id}")'> <input type='button' id='save_button${id}' value='Save' class='save' style='display: none' onclick='save_row("${id}")'> <input type='button' value='Delete' class='delete' onclick='delete_row("${id}")'></td>
        </tr>
        `;
    }
        
    //Create a new timestamp - EDIT: added id, endTime, rowData
    var timestamp = new Timestamp(id, new_object, new_startTime, new_endTime, row);
    //Add both object name and time to the array - EDIT: added attributes
    timestampLog.push(timestamp);*/
    buttonData.undoVisibility = "visibleFill";
    //Save to local storage
    updateLocalStorage(timestampLog, rowNum, countData, buttonData, lastData);

    //Update the display
    render();
}
function edit_row(id)
{
    /*document.getElementById(`edit_button${id}`).style.display="none";
    document.getElementById(`save_button${id}`).style.display="block";*/
    /*if (table) {
        var row = table.insertRow(countData.table_len).innerHTML=`
        <tr id='row${id}'>
            <td id='object_row${id}'>${new_object}</td>
            <td id='startTime_row${id}'>${new_startTime}</td>
            <td id='endTime_row${id}'>${new_endTime}</td>
            <td><input type='button' id='edit_button${id}' value='Edit' class='edit' style='display: none' onclick='edit_row("${id}")'> <input type='button' id='save_button${id}' value='Save' class='save' style='display: block' onclick='save_row("${id}")'> <input type='button' value='Delete' class='delete' onclick='delete_row("${id}")'></td>
        </tr>
        `;
    }*/
	
    /*var object=document.getElementById(`object_row${id}`);
    var startTime=document.getElementById(`startTime_row${id}`);
    var endTime=document.getElementById(`endTime_row${id}`);*/
	
    var object_data=object.innerHTML;
    var startTime_data=startTime.innerHTML;
    var endTime_data=endTime.innerHTML;
	
    object.innerHTML=`<input type='text' id='object_text${id}' value='${object_data}'>`;
    startTime.innerHTML=`<input type='text' id='startTime_text${id}' value='${startTime_data}'>`;
    endTime.innerHTML=`<input type='text' id='endTime_text${id}' value='${endTime_data}'>`;
}
function save_row(id)
{
    /*var object_val=document.getElementById(`object_text${id}`).value;
    var startTime_val=document.getElementById(`startTime_text${id}`).value;
    var endTime_val=document.getElementById(`endTime_text${id}`).value;

    document.getElementById(`object_row${id}`).innerHTML=object_val;
    document.getElementById(`startTime_row${id}`).innerHTML=startTime_val;
    document.getElementById(`endTime_row${id}`).innerHTML=endTime_val;

    document.getElementById(`edit_button${id}`).style.display="block";
    document.getElementById(`save_button${id}`).style.display="none";

    table = document.getElementById(tableid);
    //Save to local storage
    updateLocalStorage(timestampLog, rowNum, countData);
    //subtractFromCounter(timestamp.className);
    //Update the display
    render();*/
}
function backupData() {
    timestampLog = JSON.parse(localStorage.getItem("timestampLog"));
    rowNum = JSON.parse(localStorage.getItem("rowNum"));
    countData = JSON.parse(localStorage.getItem("countData"));
    buttonData = JSON.parse(localStorage.getItem("buttonData"));
    lastData = new Object();
    lastData.timestampLog = deepCopy(timestampLog);
    lastData.rowNum = deepCopy(rowNum);
    lastData.countData = deepCopy(countData);
    lastData.buttonData = deepCopy(buttonData);
}
function undoLast() {
    timestampLog = JSON.parse(localStorage.getItem("timestampLog"));
    rowNum = JSON.parse(localStorage.getItem("rowNum"));
    countData = JSON.parse(localStorage.getItem("countData"));
    buttonData = JSON.parse(localStorage.getItem("buttonData"));
    lastData = JSON.parse(localStorage.getItem("lastData"));

    if (lastData) {
        timestampLog = lastData.timestampLog;
        rowNum = lastData.rowNum;
        countData = lastData.countData;
        buttonData = lastData.buttonData;
        lastData = null;
        buttonData.undoVisibility = "none";
    }
    updateLocalStorage(timestampLog, rowNum, countData, buttonData, lastData);
    render();
}

function removeTimestamp(){
    /*timestampLog = JSON.parse(localStorage.getItem("timestampLog"));
    //Remove last timestamp
    tmp = timestampLog.pop();
    className = tmp.className;
    //Save to local storage
    updateLocalStorage(timestampLog, rowNum, countData);
    subtractFromCounter(className);
    //Update the display
    render();*/
}
function subtractFromCounter(className) {
    try {
        let btn = document.getElementById(className);
        let counter = btn.value;
        counter--;
        btn.innerText = className + " - " + counter;
        btn.value = counter;
    } catch {};
}
function removeClass() {
    timestampLog = JSON.parse(localStorage.getItem("timestampLog"));
    rowNum = JSON.parse(localStorage.getItem("rowNum"));
    countData = JSON.parse(localStorage.getItem("countData"));
    buttonData = JSON.parse(localStorage.getItem("buttonData"));
    backupData();
    
    /*let className = document.getElementById("class-name");
    className = document.getElementById(className.value);
    className.remove();
    className.innerHTML="";*/

    let buttonContainer = document.getElementById("button-container");
    let className = document.getElementById("class-name");
    let html = `
        <button class="btn-primary" id="${className.value}" onclick="addTimestamp('${className.value}')">${className.value}</button>`;
    buttonContainer.innerHTML = buttonContainer.innerHTML.replace(html, "");
    
    //button = searchForTimestamp(buttonData.classNames, id);
    index = buttonData.classNames.indexOf(className.value);
    if (index>=0)
        buttonData.classNames.splice(className.value, 1);
    buttonData.undoVisibility = "visibleFill";
    buttonData.html = buttonContainer.innerHTML;
    
    updateLocalStorage(timestampLog, rowNum, countData, buttonData, lastData);
    render();
}
// END EDIT
function updateCounter(className) {
    try {
        let btn = document.getElementById(className);
        let counter = btn.value;
        counter++;
        btn.innerText = className + " - " + counter;
        btn.value = counter;
    } catch {};
}

function render(){
    let timestampsTable = document.getElementById(tableid);
    timestampLog = JSON.parse(localStorage.getItem("timestampLog"));
    //EDIT: added endTime
    try{
        const html = timestampLog.map(log => log.rowData).join('');
        timestampsTable.innerHTML = html;
    } catch {/*document.getElementById("new_object").value=`error rendering`*/};
        /*`<tr>
        </tr><th scope="row">${log.className}</th>
        <td>${log.time}</td>
        <td contenteditable='true', id="${log.className}_${log.time}">${log.endTime}</td>
        </tr>
        `).join('');*/
    //timestampsTable.outerHTML = html;
    //START EDIT
    //let cell = document.getElementById(log.className+"_"+log.time)
    //cell.setAttribute('onclick', addEndTime(1000));
    //END EDIT

    let buttonContainer = document.getElementById("button-container");
    buttonData = JSON.parse(localStorage.getItem("buttonData"));
    if (buttonData)
        buttonContainer.innerHTML = buttonData.html;

    try{
        //let html = buttonData.html;
        //buttonContainer.innerHTML = html;
        undoButton = document.getElementById("undo-button");
        oldHTML = undoButton.outerHTML;
        //oldHTML = oldHTML.replace(`input=""`, "input");
    
        if (buttonData && buttonData.undoVisibility === "none") {
            newHTML = `<button id="undo-button" class="btn btn-outline-warning" disabled="true">Undo Last</button>`;
        } else if (buttonData) {
            newHTML = `<button id="undo-button" class="btn btn-outline-warning" onclick="undoLast();">Undo Last</button>`;
        }
        undoButton.outerHTML = newHTML; //buttonData.html.replace(oldHTML, newHTML);
    } catch {};
}

function loadIGCTclasses() {
    timestampLog = JSON.parse(localStorage.getItem("timestampLog"));
    rowNum = JSON.parse(localStorage.getItem("rowNum"));
    countData = JSON.parse(localStorage.getItem("countData"));
    buttonData = JSON.parse(localStorage.getItem("buttonData"));
    backupData();

    buttonData.classNames = ["signal", "train", "traffic-car", "traffic-truck", "traffic-bus", "traffic-person", "traffic-bicycle", "trespassing-car", "trespassing-truck", "trespassing-bus", "trespassing-person", "trespassing-bicycle"];
    buttonData.undoVisibility = "visibleFill";

    //let buttonContainer = document.getElementById("button-container");
    let html = `
        <button class="btn-primary" id="signal" onclick="addTimestamp('signal')">signal</button>
        <spacer></spacer>
        <button class="btn-primary" id="train" onclick="addTimestamp('train')">train</button>
        <br>
        <button class="btn-primary" id="traffic-car" onclick="addTimestamp('traffic-car')">traffic-car</button>
        <spacer></spacer>
        <button class="btn-primary" id="traffic-truck" onclick="addTimestamp('traffic-truck')">traffic-truck</button>
        <spacer></spacer>
        <button class="btn-primary" id="traffic-bus" onclick="addTimestamp('traffic-bus')">traffic-bus</button>
        <spacer></spacer>
        <button class="btn-primary" id="traffic-person" onclick="addTimestamp('traffic-person')">traffic-person</button>
        <spacer></spacer>
        <button class="btn-primary" id="traffic-bicycle" onclick="addTimestamp('traffic-bicycle')">traffic-bicycle</button>
        <br>
        <button class="btn-primary" id="trespassing-car" onclick="addTimestamp('trespassing-car')">trespassing-car</button>
        <spacer></spacer>
        <button class="btn-primary" id="trespassing-truck" onclick="addTimestamp('trespassing-truck')">trespassing-truck</button>
        <spacer></spacer>
        <button class="btn-primary" id="trespassing-bus" onclick="addTimestamp('trespassing-bus')">trespassing-bus</button>
        <spacer></spacer>
        <button class="btn-primary" id="trespassing-person" onclick="addTimestamp('trespassing-person')">trespassing-person</button>
        <spacer></spacer>
        <button class="btn-primary" id="trespassing-bicycle" onclick="addTimestamp('trespassing-bicycle')">trespassing-bicycle</button>
        <br>
    `;
    buttonData.html = html;

    //Save to local storage
    updateLocalStorage(timestampLog, rowNum, countData, buttonData, lastData);
    //Update the display
    render();
}

//Factory Function Create Button
function addClassButton () {
    timestampLog = JSON.parse(localStorage.getItem("timestampLog"));
    rowNum = JSON.parse(localStorage.getItem("rowNum"));
    countData = JSON.parse(localStorage.getItem("countData"));
    buttonData = JSON.parse(localStorage.getItem("buttonData"));
    backupData();

    let buttonContainer = document.getElementById("button-container");
    let className = document.getElementById("class-name");
    if (!(buttonData.classNames.includes(className.value))) {
        let html = `
            <button class="btn-primary" id="${className.value}" onclick="addTimestamp('${className.value}')">${className.value}</button><spacer></spacer>`;
        buttonContainer.innerHTML += html;

        buttonData.classNames.push(className.value);
        buttonData.html += html;
    }
    buttonData.undoVisibility = "visibleFill";
    
    updateLocalStorage(timestampLog, rowNum, countData, buttonData, lastData);
    render();
};
window.onload = function () {
    initializeData();
    render();
  };

function clearLog () {
    timestampLog = JSON.parse(localStorage.getItem("timestampLog"));
    rowNum = JSON.parse(localStorage.getItem("rowNum"));
    countData = JSON.parse(localStorage.getItem("countData"));
    backupData();

    for(var id in rowNum) {
        timestamp = searchForTimestamp(timestampLog, id);
        subtractFromCounter(timestamp.className);
    }
    timestampLog = undefined;
    rowNum = undefined;
    countData = undefined;
    initializeData();
    render();
}

var slider = document.getElementById("playBackSpeed");
var output = document.getElementById("playBackSpeedDisplay");
var vid = document.getElementById("video");
output.innerHTML = "1x"; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    // var playbackRate = Math.round(Math.log(this.value));
    var playbackRate = this.value / 20;
    output.innerHTML = playbackRate + "x";
    vid.playbackRate = playbackRate;
}