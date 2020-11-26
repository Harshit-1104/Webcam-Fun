var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Photo = new Schema({
  link: {
    type: String,
    required: true
  },
  alt: {
    type: String
  }
})

var Album = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  photos: [Photo],
  noOfImages: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('album', Album);