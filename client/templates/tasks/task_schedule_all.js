// Template.taskScheduleAll.helpers({
//   parentTasks: function() {
//     return Tasks.find({checked: false}, {sort : {date: 1}});
//   },
//   areTasks: function() {
//     return Tasks.find({checked: false}).fetch().length != 0;
//   }
// });

// Template.taskScheduleAll.rendered = function () {
//   Sortable.create(document.getElementById('sortedList'));
// };

// Template.taskScheduleAll.events({
//   "click .delete": function() {
//     // remove it from list
//   },

//   "click .submit": function(e) {
//     e.preventDefault();
//     // var children = $("#sortedList").children();
//     // var length = children.length;
//     for (var i = 0; i < length; i++) {
//       // var id = $(children[i]).data('id');
//       Meteor.call("taskSchedule", id, function(error, result) {
//         if (error)
//           return console.log(error.reason);
//         else if (result == this.date) {
//           console.log("unable to find time");
//         } else {
//           console.log("time: " + result);
//         }      
//       });
//     }
//     $('#scheduleAllModal').modal('toggle');
//   }
// })