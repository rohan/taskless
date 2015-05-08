Template.loginUI.events({
  "click #logoutButton": function (e) {
    e.preventDefault();
    //Meteor.logoutOtherClients();
    Meteor.logout();
  },
  "click #loginButton": function (e) {
    e.preventDefault();
    Meteor.loginWithGoogle({requestPermissions: ['email',
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/userinfo.profile'],
      requestOfflineToken: true,
    }, function(error, result) {
      console.log("error:", error);
      console.log("result:", result);
    });
  },
  "click #openSettingsModal": function() {
    console.log("clicked the button");
    bootbox.dialog({
      title: "Change Settings",
      message: renderTemplate(Template.changeSettings),
      buttons: {
        "cancel": {
          className: "btn btn-danger",
          label: "Cancel",
        },
        "submit": {
          className: "btn btn-primary",
          label: "Submit",
          callback: function(e) {
            // this is here in case I add stuff in the future
            // var input = $("#changeSettingsForm").serializeArray();
            // // input is of the form [{name: "x", value: "y"}]
            // input = arrayToObject(input);

            // console.log(input);

            // $("#changeSettingsForm")[0].reset();
            // return true;
          },
        },
      },
    })
  }
});

Template.loginUI.helpers({
  username: function() {
    return Meteor.user().profile.name;
  }
})