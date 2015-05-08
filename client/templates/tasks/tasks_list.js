Template.tasksList.helpers({
  tasks: function() {
    // return Tasks.find({parent: "", checked: false}, {sort: {submitted: -1}});
    return Tasks.find({checked: false}, {sort: {submitted: -1}});
  },

  completedTasks: function() {
    //return Tasks.find({parent: "", checked: true}, {sort: {submitted: -1}});
    return Tasks.find({checked: true}, {sort: {submitted: -1}});

  },
  
  areTasks: function() {
    return Tasks.find({}).fetch().length != 0;
  },

  completeVisible: function() {
    return Session.get("completeVisible");
  },

  completedTasksExist: function() {
    return Tasks.find({checked: true}).fetch().length != 0;
  }
});

Template.tasksList.events({
  "click .showComplete": function() {
    $("#completed").show();
    Session.set("completeVisible", true);
  },
  "click .hideComplete": function() {
    $("#completed").hide();
    Session.set("completeVisible", false);
  }
})