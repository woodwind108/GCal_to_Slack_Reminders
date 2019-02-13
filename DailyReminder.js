function setTrigger() {
  var triggerDay = new Date();
  triggerDay.setHours(8);
  triggerDay.setMinutes(0);
  ScriptApp.newTrigger("DailyReminder").timeBased().at(triggerDay).create();
}

function deleteTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for(var i=0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() == "DailyReminder") {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}

function DailyReminder() {
  deleteTrigger();
  
  var myCals = CalendarApp.getCalendarById("<your gmail address>");
  var today = new Date();
  var myEvents = myCals.getEventsForDay(today);
  
  if(myEvents.length == 0) return 0;
  
  var token = "<your slack token>"
  var channel = "<your slack channel>"
  
  var day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][today.getDay()];
  var strBody = MMdd(today) + "(" + day + ")";
  
  for(var i = 0; i < myEvents.length; i++){
    strBody += "\n*" + myEvents[i].getTitle() + "* ";
    if(HHmm(myEvents[i].getStartTime()) == "00:00"){
      strBody += "終日";
    }
    else{
      strBody += HHmm(myEvents[i].getStartTime());
    }
    if(myEvents[i].getLocation() != ""){
      strBody += " at " + myEvents[i].getLocation();
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

//日付表記を 'M/d' 形式に
function MMdd(date){
  return Utilities.formatDate(date, 'JST', 'M/d');
}

//時刻表記を 'HH:mm' 形式に
function HHmm(date){
  return Utilities.formatDate(date, 'JST', 'HH:mm');
}
