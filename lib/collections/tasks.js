Tasks = new Mongo.Collection('tasks');

Tasks.allow({
  update: function(userId, task) { return ownsDocument(userId, task); },
  remove: function(userId, task) { return ownsDocument(userId, task); },
});