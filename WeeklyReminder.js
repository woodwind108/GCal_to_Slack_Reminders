function setTrigger() {
  var triggerDay = new Date();
  triggerDay.setHours(10);
  triggerDay.setMinutes(0);
  ScriptApp.newTrigger("WeeklyReminder").timeBased().at(triggerDay).create();
}

function deleteTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for(var i=0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() == "WeeklyReminder") {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}

function WeeklyReminder() {
  deleteTrigger();
  
  var myCals = CalendarApp.getCalendarById("<your gmail address>");
  var date = new Date();
  
  var token = "<your token>";
  var channel = "<your channel>";
  
  var strBody = "Good morning!";
  
  for(var i = 0; i < 7; i++) {
    date.setDate(date.getDate() + 1);
    var events = myCals.getEventsForDay(date);
    if(events.length != 0){
      var day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];
      strBody += "\n" + MMdd(date) + "(" + day + ")";
      
      for(var j = 0; j < events.length; j++){
        strBody += "\n・ *" + events[j].getTitle() + "* ";
        if(HHmm(events[j].getStartTime()) == "00:00"){
          strBody += "終日"
        }
        else{
          strBody += HHmm(events[j].getStartTime());
        }
        if(events[j].getLocation() != ""){
          strBody += " at " + events[j].getLocation();
        }
      }
    }
  }
  
  var Arguments = {
    token : token,
    channel : channel,
    text : strBody
  };
  
  var options = {
    'method' : 'post',
    'payload' : Arguments
  };
  
  var url = 'https://slack.com/api/chat.postMessage';
  var response = UrlFetchApp.fetch(url, options);
  Logger.log(response.getContentText());
}

//day -> 'M/d'
function MMdd(date){
  return Utilities.formatDate(date, 'JST', 'M/d');
}

//time -> 'HH:mm'
function HHmm(date){
  return Utilities.formatDate(date, 'JST', 'HH:mm');
}
