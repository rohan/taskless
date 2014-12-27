Meteor.publish('tasks', function() {
  return Tasks.find({userId: this.userId});
});

Meteor.publish('calendars', function() {
  return Calendars.find({userId: this.userId});
});