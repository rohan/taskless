Tags = new Mongo.Collection("tags");

Tags.allow({
  update: function(userId, t) { return ownsDocument(userId, t); },
  remove: function(userId, t) { return ownsDocument(userId, t); },
});