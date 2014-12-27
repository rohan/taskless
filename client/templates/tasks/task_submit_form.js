Template.taskSubmitForm.events({
  "submit form": function(e) {
    e.preventDefault();

    var tags = $(e.target).find('[name=tags]').tagsinput('items').itemsArray;
    console.log(tags);

    var task = {
      date: moment.tz($(e.target).find('[name=date]').val(), getTimeZone()).toISOString(),
      title: $(e.target).find('[name=title]').val(),
      length: parseInt($(e.target).find('[name=length]').val()),
      checked: false,
      //tags: tags,
    };

    Meteor.call('taskInsert', task, function(error, result) {
      // display the error to the user and abort
      if (error)
        return alert(error.reason);
    });

    $(e.target).find('[name=tags]').tagsinput('removeAll');
    document.getElementById("submitForm").reset();
    $("#addModal").modal('hide');
    return false;
  }
});

Template.taskSubmitForm.rendered = function() {
  $('.date-picker').datepicker({
    autoclose: true,
    todayHighlight: true,
    clearBtn: true,
  });

  console.log("rendered datepicker");
}

// gets current time zone by calling new Date() and figuring out what's inside the parentheses
// ugly regex from stackoverflow
function getTimeZone() {
  var tz = jstz.determine();
  return tz.name();
}