Calendars = new Mongo.Collection("calendars");

Calendars.allow({
  update: function(userId, cal) { return ownsDocument(userId, cal); },
  remove: function(userId, cal) { return ownsDocument(userId, cal); },
});