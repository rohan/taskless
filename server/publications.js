Meteor.publish('tasks', function() {
  return Tasks.find({userId: this.userId});
});

Meteor.publish('calendars', function() {
  Meteor.call("updateCalendars");
  return Calendars.find({userId: this.userId});
});

Meteor.publish('tags', function() {
  return Tags.find({userId: this.userId});
});