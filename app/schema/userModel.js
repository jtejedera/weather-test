import mongoose from 'mongoose';
const Schema = mongoose.Schema;

var addressesSchema = new Schema({
  address: {
    type: String
  },
  rawAddress: {
    street: {
      type: String
    },
    streetNumber: {
      type: String
    },
    town: {
      type: String
    },
    postalCode: {
      type: String
    },
    country: {
      type: String
    }
  }
  
})

const UserSchema = new Schema({
    _id: {
      required: true,
      unique: true,
      type: String
    },  
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true
    },
    notifications: {
      active: {
        type: Boolean,
        default: true
      },
      timeFrame: {
        type: String,
        default: '08:00 AM to 08:00 PM'
      }
    },
    addresses: [addressesSchema]
});

module.exports = mongoose.model('User', UserSchema);
