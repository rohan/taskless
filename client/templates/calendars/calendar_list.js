Template.calendarList.helpers({
  calendars: function() {
    return Calendars.find();
  }
});

Template.calendarItem.events({
  "click .toggle-checked": function (e) {
    e.preventDefault();
    Calendars.update(this._id, {$set: {checked: ! this.checked}});
    return false;
  },
});