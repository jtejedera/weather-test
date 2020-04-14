import mongoose from 'mongoose';
import config from './config'

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

var exports = module.exports = {};

exports.connectToDb = async () => {
    try {
        await mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });        
    }
    catch (err) {
      console.log(err);
    }
}
