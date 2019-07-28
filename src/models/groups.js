const { model, Schema } = require('mongoose');

const GroupSchema = new Schema({
  name: String,
  isActive: {
    type: Boolean,
    default: true
  },
  contactsList: [{
    type: Schema.Types.ObjectId,
    ref: 'Contacts'
  }]
}, {
  collection: 'Groups',
  timestamps: true
});

module.exports = model('Groups', GroupSchema);
