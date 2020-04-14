import User from '../schema/userModel';
import * as serviceAccount from '../utilities/serviceAccountKey.json';
import * as serviceAppSnippet from '../utilities/serviceAppSnippet.json';
import * as admin from 'firebase-admin';
import firebase from 'firebase/app';
import auth from 'firebase/auth';
import async from 'async';

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
firebase.initializeApp(serviceAppSnippet);

var exports = module.exports = {};

exports.checkToken = token => {
	return new Promise((resolve,reject) => {
		if(token){
			admin.auth().verifyIdToken(token)
			.then(decodedToken => {
				resolve(decodedToken)
			})
			.catch(error => {
				switch(error.code){
					case 'auth/argument-error':
						reject('argument-error')
						break;
					case 'auth/id-token-expired':
						reject('expired');
						break;
					case 'auth/id-token-revoked':
						reject('revoked');
						break; 
					default:
						reject(error);
						break;
				}				
			})
		}else{
			reject('noToken')
		}
	})
}

exports.signUp = userData => {
	return new Promise((resolve,reject) => {
		async.series([
			(cb) => {
				User.findOne({email: userData.email}).exec()
				.then( result => {
					if(result){
						cb({
							success: false,
							data: {},
							message: "User already exist"},null)
					}else{
						cb()
					}
					
				})
				.catch( err => {
					cb({
						success: false,
						data: {},
						message: err.errmsg},null)
				})							
			},
			(cb) =>{
				admin.auth().createUser({
					email: userData.email,
					password: userData.password
				}).then( newUser => {
					let user = new User();
			
					user._id = newUser.uid
					user.email = userData.email;
			
					user.save()
					.then( result => {
						cb(null,{
							success: true,
							data: {},
							message: "User created"})				
					})
					.catch( err => { 
						if (err && err.code == 11000) cb({
							success: false,
							data: {},
							message: 'User create successfully'}, null);								
						else if (err && err.code != 11000) cb({
							success: false,
							data: {},
							message: err.errmsg}, null);
					})			
				}).catch( error => {
					reject({
						success: false,
						data: {},
						message: error}, null);
				});					
			},
			],(err, res) => {
				if(err) reject(err);
				else resolve(res);
		});					
	});
}

exports.signIn = userData => {
	return new Promise((resolve,reject) => {
		async.series([
			(cb) =>{
				User.findOne({email: userData.email}).exec()
				.then( result => {
					if(result){
						cb()
					}else{
						cb({
							success: false,
							data: {},
							message: "User not exist"})
					}
					
				})
				.catch( err => {
					cb({
						success: false,
						data: {},
						message: err.errmsg},null)
				})					
			},
			(cb) => {
				firebase.auth().signInWithEmailAndPassword(userData.email, userData.password)
				.then( result => {
					cb({
						success: true,
						data: {token: result.user.xa},
						message: "User Logged In"})
				})
				.catch( error =>  {
					cb({
						success: false,
						data: {},
						message: error.message}, null)
				});				
			}
		], (err, res) => {
			if(err) reject(err);
			else resolve(res);
		})
	})
}