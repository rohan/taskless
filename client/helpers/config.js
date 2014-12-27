Accounts.ui.config({
  requestPermissions: {
    google: ['email', 'https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/userinfo.profile'],
  },
  requestOfflineToken: {
    google: true
  },
  passwordSignupFields: 'USERNAME_ONLY'
});