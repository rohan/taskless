var Schemas = {};

Schemas.Task = new SimpleSchema({
  title: {
    type: String
  },
  date: {
    type: Date,
  },
  dateString: {
    // for form purposes only!
    type: String,
    optional: true,
  },
  scheduledDate: {
    type: Date,
    optional: true,
  },
  calendarId: {
    type: String,
    optional: true,
  },
  length: {
    type: Number,
  },
  checked: {
    type: Boolean
  },
  author: {
    type: String,
    optional: true,
  },
  submittedDate: {
    type: Date,
  },
  userId: {
    type: String,
  },
  tags: {
    type: [String],
  }
});

Tasks.attachSchema(Schemas.Task);

Schemas.Tag = new SimpleSchema({
  summary: {
    type: String,
  },
  author: {
    type: String,
    optional: true,
  },
  submittedDate: {
    type: Date,
  },
  userId: {
    type: String,
  },
});

Tags.attachSchema(Schemas.Tag);