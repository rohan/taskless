Template.taskItem.helpers({
  ownTask: function() {
    return this.userId === Meteor.userId();
  },

  t_children: function() {
    var out = [];
    var length = this.children.length;
    for (var i = 0; i < length; i++) {
      console.log("got child " + this.children[i]);
      out.push(Tasks.findOne(this.children[i]));
    }

    return out;
  }
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
    console.log(b.data._id + " " + this._id);
    if (b.data._id === this._id) {
      Meteor.call('taskDelete', this._id, function (error, result) {
        if (error)
          return alert(error.reason);
      });
    }
	},

  "click .schedule": function (e,b) {
    e.preventDefault();
    if (this._id === b.data._id) {
      Meteor.call('taskSchedule', this._id, function(error, result) {
        if (error)
          return console.log(error.reason);
        else if (result == this.date) {
          console.log("unable to find time");
        } else {
          console.log("time: " + result);
        }
      });
    }
    
  },

  "click .unschedule": function(e,b) {
    e.preventDefault();
    if (this._id === b.data._id)
      Meteor.call('unscheduleTask', this._id, function(error, result) {
        if (error) return console.log(error.reason);
        else console.log("successfully unscheduled");
      });
  },

  "click .addSubtask": function (e,b) {
    e.preventDefault();
    if (this._id === b.data._id) {
      Meteor.call('updateSettings', { arg : 'parent_id', val : this._id });
      $("#addModal").modal('show');
    }
  },

  "click .edit": function (e,b) {
    e.preventDefault();
    if (this._id === b.data._id) {
      Tasks.update({_id: this._id}, {$set: {edit_mode: true}});
      console.log(this.date);
      $('.edit-form>.date-picker').datepicker({
        autoclose: true,
        todayHighlight: true,
        clearBtn: true,
      });
      $('.edit-form>.date-picker').datepicker("setDate", new Date());
    }
  },

  "click .deletechanges": function(e) {
    e.preventDefault();
    Tasks.update({_id: this._id}, {$set: {edit_mode: false}});
  },

  "submit form": function(e) {
    e.preventDefault();
    var update = {
      edit_mode: false,
      title: $(e.target).find('[name=title]').val(),
      length: parseInt($(e.target).find('[name=length]').val()),
      date: moment.tz($(e.target).find('[name=date]').val(), getTimeZone()).toISOString()
    }

    console.log(update);

    Tasks.update({_id: this._id}, {$set: update});
    console.log("updated task!");
  }
});

Template.taskItem.rendered = function() {
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  });
  console.log("(edit) rendered datepicker");
}

function getTimeZone() {
  var tz = jstz.determine();
  return tz.name();
}