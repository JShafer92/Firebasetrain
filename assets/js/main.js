var name;
var destination;
var firstArrival;
var frequency;
var database;
var trainFirebaseData;
var newFirebaseData;
var time;
var clock;

$(document).ready(function() {
   //Clock function
    function runningClock() {
        time = moment().format("hh:mm:ss A");
        $("#time").text(time);
    }
    //  Call function with setInterval
    clock = setInterval(runningClock , 1000);

    var config = {
        apiKey: "AIzaSyDFQINzNw3spKVU_WH8iszo0FnWtxr6E_w",
        authDomain: "fir-train-587b0.firebaseapp.com",
        databaseURL: "https://fir-train-587b0.firebaseio.com",
        projectId: "fir-train-587b0",
        storageBucket: "",
        messagingSenderId: "1044106671220"
      };
      firebase.initializeApp(config);
      
    database = firebase.database();

    $("#submitButton").on("click", function (event) {

        event.preventDefault();

        // Input values if the conditon above is true
        name = $("#trainNameIn").val().trim();
        destination = $("#destinationIn").val().trim();
        firstArrival = $("#firstTrainTimeIn").val().trim();
        frequency = $("#frequencyIn").val().trim();
    });
    trainFirebaseData = {
        DatatrainName: name,
        Datadest: destination,
        DatafirstArrival: firstArrival,
        Datafrequency: frequency,
        TimeStamp: firebase.database.ServerValue.TIMESTAMP
    };

    //    Variable for firebase to link train easier
    database.ref().push(trainFirebaseData);

//  Make sure fields are back to blank after adding a train
    clear();

});

database.ref().on("child_added", function (childSnapshot) {
    //  make variable to ease reference
    var snapName = childSnapshot.val().DatatrainName;
    var snapDest = childSnapshot.val().Datadest;
    var snapFreq = childSnapshot.val().Datafrequency;
    var snapArrival = childSnapshot.val().DatafirstArrival;

    //  current time
    var timeIs = moment();
    //  Convert Time and configure for Future use by pushing firstArrival back 1 year
    var faConveted = moment(snapArrival , "HH:mm A").subtract(1, "years");
    //  current time by now since first
    var diff = moment().diff(moment(faConveted) , "minutes");
    var left = diff % snapFreq;
    //  when does the next train arrive
    var timeLeft = snapFreq - left;
    var newArrival = moment().add(timeLeft , "m").format("HH:mm: A");

    $("#table-info").append("<tr><td>" + snapName +"</td><td>" + snapDest + "</td><td>" + snapFreq + "</td><td>" +
                                newArrival + "</td><td>" + timeLeft + "</td></tr>");


});
// clear the table
function clear() {
    $("#trainNameIn").val("");
    $("#destinationIn").val("");
    $("#firstTrainTimeIn").val("");
    $("#frequencyIn").val("");
}


