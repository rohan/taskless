Projects = new Mongo.Collection("projects");

Projects.allow({
  update: function(userId, p) { return ownsDocument(userId, p); },
  remove: function(userId, p) { return ownsDocument(userId, p); },
});