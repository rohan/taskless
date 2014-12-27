Template.taskSubmit.events({
  "click #modal-toggle": function(e) {
    console.log("I'm here");
    Meteor.call("updateSettings", {arg : "parent_id", val: ""});
  }
})