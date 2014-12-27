Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() {
    return Meteor.subscribe('tasks') && Meteor.subscribe('calendars');
  }
});

Router.route('/', {name: 'tasksList', yieldTemplates: {
    'settings': {to: 'settings', waitOn: function() { return Meteor.subscribe('calendars'); }},
  }
});
// Router.route('/tasks/:_id', {
//   name: 'taskPage',
//   data: function() { return Tasks.findOne(this.params._id); }
// });
// Router.route('/tasks/:_id/edit', {
//   name: 'taskEdit',
//   data: function() { return Tasks.findOne(this.params._id); }
// })

Router.route('/submit', {name: 'taskSubmit'});

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}

var introduction = function() {
  if (!Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('welcome');
    }
  } else {
    this.next();
  }
}

Router.onBeforeAction('dataNotFound', {only: 'taskPage'});
Router.onBeforeAction(introduction, {only: 'tasksList'});
