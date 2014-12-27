Template.minutesOptions.minutesOptions = function() {
  return Options.find({});
}

Template.minutesOptions.rendered = function(){
  $('#minutesOptions').selectpicker();
};

Template.minutesOptions.events({
  'change #minutesOptions': function(e) {
    var option = $("#minutesOptions").val();
    console.log(option);
  }
});