Events = new Mongo.Collection('events');

Events.allow({
  update: function(userId, event) { return ownsDocument(userId, event); },
  remove: function(userId, event) { return ownsDocument(userId, event); },
});
