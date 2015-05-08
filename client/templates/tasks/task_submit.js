Template.taskSubmit.events({
  "click #submit-toggle": function(e) {
    bootbox.dialog({
      title: "Add a Task",
      message: renderTemplate(Template.taskSubmitForm),
      buttons: {
        "cancel": {
          className: "btn btn-danger",
          label: "Cancel",
        },
        "submit": {
          className: "btn btn-primary",
          label: "Submit",
          callback: function(e) {
            var input = $("#taskSubmitForm").serializeArray();
            // input is of the form [{name: "x", value: "y"}]
            input = arrayToObject(input);
            input.tags = $("#tags").tagsinput('items');
            input.tags.add("Inbox");
            console.log(input);

            var date = Date.create(input.date);

            if (!date.isValid() || input.title === "" || input.length == NaN) {
              console.log("you dun goofed");
              $("#taskSubmitErrorAlert").show();
              return false;
            }

            var task = {
              title: input.title,
              date: date,
              length: parseInt(input.length),
              tags: input.tags,
            };

            console.log("[client] about to insert task", task);

            Meteor.call('taskInsert', task, function(error, result) {
              // display the error to the user and abort
              if (error) {
                console.log(error.reason);
              }
            });

            $("#taskSubmitForm")[0].reset();
            return true;
          },
        },
      },
    })
  }
});

Template.taskSubmitForm.rendered = function () {
  $("#tags").tagsinput();
}