//
//
// Local Notification Sample application
//
// https://wiki.appcelerator.org/display/guides2/iOS+Local+Notifications
//

// open the view
$.index.open();


//-------------------------------------------------------------------------------
// Set up the slider which tracks the duration
// of the Notification
//-------------------------------------------------------------------------------
$.slider.text = $.slider.value;

function updateLabel(e) {
  if ($.useHours === true) {
    $.label.text = Math.round(e.value) + " h";
  } else {
    $.label.text = Math.round(e.value) + " m";
  }

  // save the value
  $.label.hours = Math.round(e.value);
  $.label.mins = Math.round(e.value)
}
//-------------------------------------------------------------------------------


//-------------------------------------------------------------------------------
// The following action launches the application in the foreground and requires
// the device to be unlocked
//-------------------------------------------------------------------------------
var acceptAction = Ti.App.iOS.createUserNotificationAction({
  identifier: "ACCEPT_IDENTIFIER",
  title: "Accept",
  activationMode: Ti.App.iOS.USER_NOTIFICATION_ACTIVATION_MODE_FOREGROUND,
  destructive: false,
  authenticationRequired: true
});

//-------------------------------------------------------------------------------
// The following action will only activate the application in the background,
// requires the device to be unlocked, and may have a red background.
//-------------------------------------------------------------------------------
var rejectAction = Ti.App.iOS.createUserNotificationAction({
  identifier: "REJECT_IDENTIFIER",
  title: "Reject",
  activationMode: Ti.App.iOS.USER_NOTIFICATION_ACTIVATION_MODE_FOREGROUND,
  destructive: true,
  authenticationRequired: true
});

// Create a notification category
var testContent = Ti.App.iOS.createUserNotificationCategory({
  identifier: "TEST_CONTENT",
  actionsForDefaultContext: [acceptAction, rejectAction]
});

// Register for user notifications and categories
Ti.App.iOS.registerUserNotificationSettings({
  types: [
    Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
    Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE,
    Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND
  ],
  categories: [testContent]
});

//-------------------------------------------------------------------------------
// Monitor notifications received while app is in the background
//-------------------------------------------------------------------------------
Ti.App.iOS.addEventListener('localnotificationaction', function(e) {
  console.log("localnotificationaction - payload", e);

  $.payload.text = JSON.stringify(e, null, 2)

  if (e.category == "TEST_CONTENT" && e.identifier == "ACCEPT_IDENTIFIER") {
    alert("user accepted the alert");
  } else if (e.category == "TEST_CONTENT" && e.identifier == "ACCEPT_IDENTIFIER") {
    alert("user rejected the alert");
  }
});

//-------------------------------------------------------------------------------
// Monitor notifications received while app is in the foreground
//-------------------------------------------------------------------------------
Ti.App.iOS.addEventListener('notification', function(e) {
  console.log("notification - payload", e);

  $.payload.text = JSON.stringify(e, null, 2)

  if (e.category == "TEST_CONTENT" && e.identifier == "ACCEPT_IDENTIFIER") {
    alert("user accepted the alert");
  } else if (e.category == "TEST_CONTENT" && e.identifier == "REJECT_IDENTIFIER") {
    alert("user rejected the alert");
  }
});

//-------------------------------------------------------------------------------
// clicking on the label will toggle between using minutes and hours
// when testing the alerts
//-------------------------------------------------------------------------------
$.label.addEventListener('click', function adjust() {

  $.useHours = !$.useHours;

  alert("Using " + ($.useHours ? "hours" : "minutes"));

  if ($.useHours === false) {
    $.slider.min = 1;
    $.slider.max = 60;
  } else {
    $.slider.min = 1;
    $.slider.max = 12;
  }
  $.slider.value = 1;
});


//-------------------------------------------------------------------------------
// click on the button to create the local notification based on the information
// provided in the UI
//-------------------------------------------------------------------------------
$.addNotificationBtn.addEventListener('click', function(e) {
  // Send a notification in 3 seconds


  var params = {
    alertBody: $.alertMessage.value,
    badge: 1,
    userInfo: {
      "data1": $.data1.value,
      "data2": $.data2.value
    },
    category: "TEST_CONTENT"
  };


  if ($.useHours === true) {
    var hours = 1000 * 3600;
    params.date = new Date(new Date().getTime() + ($.label.hours * hours));
  } else {
    var minutes = 1000 * 60;
    params.date = new Date(new Date().getTime() + ($.label.mins * minutes));
  }

  var note = Ti.App.iOS.scheduleLocalNotification(params);
  //alert("notification\n" + JSON.stringify(params, null, 2))
  console.log("notification\n" + JSON.stringify(params, null, 2))

  $.notification.text = "Logged at " + params.date + " " + JSON.stringify(params, null, 2)
  $.payload.text = ""
});
