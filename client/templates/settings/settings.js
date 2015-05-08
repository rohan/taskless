Template.changeSettings.helpers({
  calendars: function() {
    return Calendars.find().fetch();
  },
  options: function() {
    return [{value: 5}, {value: 10}, {value: 15}, {value: 30}, {value: 60}];
  }
});

Template.changeSettings.rendered = function() {

}