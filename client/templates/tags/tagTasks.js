Template.tagTasks.helpers({
  tasks: function() {
    return Tasks.find({tags: this.summary}).fetch();
  },
})