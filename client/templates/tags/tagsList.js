Template.tagsList.helpers({
  areTags: function() {
    return Tags.find().fetch().length != 0;
  },

  tags: function() {
    return Tags.find().fetch();
  }
});