import redis from 'redis';
import config from './../config/config'
const client = redis.createClient(config.redis);

client.on('error', (err)=> {
    console.log(err)
})
var exports = module.exports = {};

exports.setAddress = (address,status) => {
    return new Promise((resolve,reject) => {
        client.set(address, JSON.stringify(status), 'EX', 43200, (err, reply) => {
           if (err)  reject(err);
           else resolve(reply);
        })    
    })
};

exports.getAddress = (address) => {
    return new Promise((resolve,reject) => {
        client.get(address, (err, reply) => {
            if(err) reject({
                success: false,
                data: {},
                message: 'Error getting data'
            });
            resolve(reply);
        })
    })
};