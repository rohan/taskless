Template.taskItem.helpers({
  ownTask: function() {
    return this.userId === Meteor.userId();
  },

  shouldISpin: function() {
    return Session.get("shouldISpin" + this._id);
  },

  dateString: function() {
    return Date.create(this.date).format("{Weekday}, {Month} {day}");
  },

  isScheduled: function() {
    console.log("is scheduled:", this.scheduledDate != null);
    return this.scheduledDate != null;
  },

  scheduledDateString: function() {
    var out = Date.create(this.scheduledDate).format("{Weekday}, {Month} {day} at {12hr}:{mm} {TT}");
    console.log(out);
    return out;
  },
});

Template.taskItem.events({
	"click .toggle-checked": function (e, b) {
		e.preventDefault();
    if (b.data._id === this._id)
      Tasks.update(this._id, {$set: {checked: ! this.checked}});
    return false;
	},

	"click .delete": function (e, b) {
		e.preventDefault();
    if (b.data._id === this._id) {
      Meteor.call('taskDelete', this._id, function (error, result) {
        if (error)
          return alert(error.reason);
      });
    }
	},

  "click .schedule": function (e,b) {
    e.preventDefault();
    Session.set("shouldISpin" + this._id, true);
    if (this._id === b.data._id) {
      Meteor.call('taskSchedule', this._id, function(error, result) {
        if (error)
          return console.log(error.reason);
        else if (result == this.date) {
          console.log("unable to find time");
        } else {
          console.log("time: " + result);
        }

        Session.set("shouldISpin" + this._id, false);
      });
    }
    
  },

  "click .unschedule": function(e,b) {
    Session.set("shouldISpin" + this._id, false);
    e.preventDefault();
    if (this._id === b.data._id)
      Meteor.call('unscheduleTask', this._id, function(error, result) {
        if (error) return console.log(error.reason);
        else console.log("successfully unscheduled");
      });
  },
});

Template.taskItem.rendered = function() {
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  });
}
