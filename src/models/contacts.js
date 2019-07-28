const { model, Schema } = require('mongoose');

const Phone = new Schema({
  phoneNo: String,
  tag: {
    type: String,
    required: true,
    default: 'work',
    enum: ['work', 'personal']
  }
});

const Email = new Schema({
  emailId: String,
  tag: {
    type: String,
    required: true,
    default: 'work',
    enum: ['work', 'personal']
  }
});

const ContactsSchema = new Schema({
  phone: [Phone],
  isActive: {
    type: Boolean,
    default: true
  },
  email: [Email],
  lastContacted: Date,
  name: {
    firstName: {
      type: String,
      required: true
    },
    middleName: String,
    lastName: String
  }
}, {
  collection: 'Contacts',
  timestamps: true
});

module.exports = model('Contacts', ContactsSchema);
