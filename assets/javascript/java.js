 $(document).ready(function() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDEaO3L_l-bms0zzdFH1ICYjEFyzshergU",
    authDomain: "trainscheduler-67e4e.firebaseapp.com",
    databaseURL: "https://trainscheduler-67e4e.firebaseio.com",
    projectId: "trainscheduler-67e4e",
    storageBucket: "trainscheduler-67e4e.appspot.com",
    messagingSenderId: "254954341690"
  };
  firebase.initializeApp(config);
    // Create a variable to reference the database.
    var database = firebase.database();
    // Initial Values
    var trainName = "";
    var Tdestination = "";
    var firstTime = "";
    var Tfrequency = "";


    $("#submitButton").on("click", function(event) {
      event.preventDefault(); 
      // Grabbed values from text boxes
      trainName = $("#trainName").val().trim();
      TDestination = $("#Tdestination").val().trim();
      firstTime = $("#firstTime").val().trim();
      Tfrequency = $("#Tfrequency").val().trim();
      // Code for handling the push
      database.ref().push({
        trainName: trainName,
        TDestination: TDestination,
        firstTime: firstTime,
        Tfrequency: Tfrequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
      return false;
    });
   // Firebase watcher + initial loader + order/limit HINT: .on("child_added"
   
    // Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
    database.ref().on("child_added", function(childSnapshot) {

      // Log everything that's coming out of snapshot
      console.log(childSnapshot.val().trainName);
      console.log(childSnapshot.val().TDestination);
      console.log(childSnapshot.val().firstTime);
      console.log(childSnapshot.val().Tfrequency);

      //below the code produces what is necessary to calculate next train time and minutes until next train using the first train time and frequency
      var firstTimeConverted = moment(childSnapshot.val().firstTime, "hh:mm").subtract(1, "years");

    //diffTime calculates the difference between the current time(found by moment()) and the time of the first train of the day
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    //we then calculate the remainder between the time difference and the frequency of trains and call it tRemainder
    var tRemainder = diffTime % childSnapshot.val().Tfrequency;
    console.log(tRemainder);
    
    //Using the frequency minus the remainder, we then can know how many minutes are left until the next train.
    var tMinutesTillTrain = childSnapshot.val().Tfrequency - tRemainder;

    //we then add the minutes left until the next train to the current time(found by moment()) and we have our next train arrival time.
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");


      // full list of items to the well
      $("#trainTable").append("<tr><td id='table-trainName'>" + childSnapshot.val().trainName+
        "</td><td><span id='table-TDestination'> " + childSnapshot.val().TDestination +
        " </span></td><td><span id='table-Tfrequency'> " + childSnapshot.val().Tfrequency +
        " </span></td><td><span id='table-nextTrain'> " +  moment(nextTrain).format("hh:mm") + " </span></td><td><span id='table-minutesAway'> " + tMinutesTillTrain + " </span></td></tr></div>");

    // Handle the errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });

    // dataRef.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {

    //   // Change the HTML to reflect
    //   $("#name-display").html(snapshot.val().name);
    //   $("#email-display").html(snapshot.val().role);
    //   $("#age-display").html(snapshot.val().startDate);
    //   $("#comment-display").html(snapshot.val().monthlyRate);
    // });



});