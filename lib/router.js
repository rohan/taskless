Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() {
    return Meteor.subscribe('tasks') && Meteor.subscribe('calendars');
  }
});

Router.route('/', {name: 'tasksList'});
Router.route('/settings', {name: 'changeSettings'});

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

Router.onBeforeAction(introduction, {only: 'tasksList'});
