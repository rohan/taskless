Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

Meteor.methods({
  taskInsert: function(taskAttributes) {
    console.log("testing");
    check(Meteor.userId(), String);

    // this is now handled by schema validation
    // check(taskAttributes, {
    //   title: String,
    //   date: String,
    //   // dateString: String,
    //   length: Number,
    // });
 
    var user = Meteor.user();

    var parent_id = Constants.find({key: "parent_id"}).fetch()[0].value;

    var tags = taskAttributes.tags;
    var len = tags.length;
    for (var i = 0; i < len; i++) {
      if (Tags.find({summary: tags[i]}).fetch().length !== 0) continue;
      var tag = {
        summary: tags[i],
        userId: user._id,
        author: user.profile.name,
        submittedDate: Date.create(),
      }

      Tags.insert(tag);
    }

    var task = _.extend(taskAttributes, {
      checked: false,
      userId: user._id,
      author: user.profile.name, 
      submittedDate: Date.create(),
    });

    console.log(task);

    var taskId = Tasks.insert(task);
    console.log("inserted task with id " + taskId);

    return {
      _id: taskId
    };
  },

  taskDelete: function(taskId) {
    console.log("[server] looking for id " + taskId);
    Tasks.remove(taskId);
  },

  taskSchedule: function(taskId) {
    var task = Tasks.findOne(taskId);
    var nowDate = new Date();
    var events = [];

    var calendars = Calendars.find({checked : true}).fetch();
    console.log("got calendars");
    var cal_length = calendars.length;

    var taskless_calendar_id = Constants.findOne({key : "taskless_calendar_id"}).value;
    var auth = Constants.findOne({key : "auth"}).value;

    if (cal_length == 0) {
      alert("Please select at least one calendar.");
      return task.date;
    }

    for (var i = 0; i < cal_length; i++) {
      var id = calendars[i].id;
      var request_url = "/calendar/v3/calendars/" + id + "/events";
      var ev = GoogleApi.get(request_url,
        { params : {
          timeMin: nowDate.toISOString(),
          timeMax: new Date(task.date).toISOString(), // converts to UTC
          orderBy: "startTime",
          singleEvents: true
        }});

      ev = ev.items;
      var ev_length = ev.length;
      for (var j = 0; j < ev_length; j++) {
        var e = ev[j];
        if (e.start == undefined || e.end == undefined) {
          console.log(e.summary);
          break;
        }
        if (e.start.dateTime == undefined || e.end.dateTime == undefined) break;
        var entry = { start : new Date(e.start.dateTime), end : new Date(e.end.dateTime), name : e.summary };
        events.push(entry);
      }
    }

    events.sort(function(a,b) {
      return a.start - b.start;
    });

    // add a new event to represent the last time

    events.push({ start : new Date(task.date),
      end : new Date(task.date).getTime() + 1000*60,
      name : "__END__"});

    var gaps_list = {};

    var length = events.length;
    for (var i = 1; i < length; i++) {
      var gap = events[i].start.getTime() - events[i-1].end.getTime();
      if (gap <= 0) continue;
      gap /= 1000*60;
      if (!(gap in gaps_list)) {
        gaps_list[gap] = [];
      }

      gaps_list[gap].push(events[i-1].end);
    }

    var index = Infinity;

    console.log(gaps_list);
    console.log(Object.size(gaps_list));

    for (var key in gaps_list) {
      if (gaps_list.hasOwnProperty(key)) {
        console.log(key + " " + task.length + " " + index);
        if (parseInt(key) >= task.length && parseInt(key) < index) {
          index = parseInt(key);
          console.log(index);
        }
      }
    }
    // index should be the shortest gap start time
    if (index == Infinity && Object.size(gaps_list) != 0) { // if it can't find a gap big enough AND there are gaps
      // this gets here if gaps_list is empty
      return task.date; // no time found
    }

    var round_minutes = Constants.findOne({key : "round_minutes"});
    if (round_minutes === undefined) {
      Constants.insert({key : "round_minutes", value : 15});
      round_minutes = Constants.findOne({key : "round_minutes"});
    }

    round_minutes = round_minutes.value;

    var time;
    if (index == Infinity && Object.size(gaps_list) == 0) {
      time = new Date(Math.ceil(nowDate.getTime() / (round_minutes*60*1000)) * (round_minutes*60*1000));
    } else {
      var times = gaps_list[index];
      time = times[0];
    }
    console.log(task.length + " " + index + " " + time);

    if (taskless_calendar_id === null) { // if the taskless calendar doesn't exist, create it
      console.log("getting cal id");
      var id = GoogleApi.post("/calendar/v3/calendars", { "data" : { "summary" : "Taskless" } });
      taskless_calendar_id = id.id;
    }

    request_url = "/calendar/v3/calendars/" + taskless_calendar_id + "/events";
    var end = new Date(time.getTime() + task.length * 60 * 1000);
    
    var result = GoogleApi.post(request_url, {
      data : { 
        summary : task.title, 
        start : { dateTime : time.toISOString() }, 
        end: { dateTime: end.toISOString() } 
      }
    });

    var final_id = result.id;
    var out = Date.create(result.start.dateTime);
    Tasks.update(taskId, {$set : {scheduledDate : out, calendarId: final_id }});
    return out;
  },

  unscheduleTask: function(taskId) {
    var task = Tasks.findOne(taskId);
    var taskless_calendar_id = Constants.findOne({key : "taskless_calendar_id"}).value;
    var request_url = "/calendar/v3/calendars/" + taskless_calendar_id + "/events/" + task.calendarId;
    console.log(request_url);
    try {
      GoogleApi.delete(request_url);
    } catch (e) {
      console.log("resource has already been deleted");
    }
    Tasks.update(taskId, {$set : {scheduledDate : null, calendarId : ""}}, {filter: false});
    return true;
  },

  updateCalendars: function() {
    // var time = Meteor.user().services.google.expiresAt;
    // auth = "Bearer " + Meteor.user().services.google.accessToken;
    // console.log("auth: " + JSON.stringify(Meteor.user().services.google));
    // Constants.update({key : "auth"}, {key: "auth", value: auth}, {upsert: true});
    url = "/calendar/v3/users/me/calendarList";
    var calendars = GoogleApi.get(url);

    calendars = calendars.items;
    var cal_length = calendars.length;

    for (var i = 0; i < cal_length; i++) {
      var id = calendars[i].id;
      if (id.indexOf("#") > -1) continue; // contacts calendar is buggy
      if (calendars[i].summary === "Taskless") {
        Constants.update({key : "taskless_calendar_id"},
          {key : "taskless_calendar_id", value: calendars[i].id}, {upsert: true});
      }

      var calendar = {
        summary : calendars[i].summary,
        id : calendars[i].id,
        userId : Meteor.user()._id,
        submitted : new Date(),
        checked : true,
      }

      Calendars.update({summary : calendars[i].summary, userId : Meteor.user()._id}, calendar, {upsert: true});
    }

    return true;
  },

  updateSettings: function (arg) {
    Constants.update({key : arg.arg}, {key : arg.arg, value : arg.val}, {$upsert: true});
  },

  getSettings: function (arg) {
    var out = Constants.find({key : arg.arg}).fetch()[0].value;
    console.log("returning " + out);
    return out;
  },
});

function verify_sorted(l) {
  var len = l.length;
  for (var i = 1; i < len; i++) {
    if (l[i] > l[i-1]) return false;
  }

  return true;
}

function getTimeZone() {
  var tz = jstz.determine();
  return tz.name();
}
