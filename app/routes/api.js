import validator from '../utilities/validations';
import * as functions from '../functions/generalFunctions'
import auth from '../functions/authFunctions';

module.exports = (express) => {

	const apiRouter = express.Router();

	apiRouter.post('/address/validate', (req, res) => {		
		validator(req.body)
		.then( result => { res.status(200).json(result); })
		.catch( err => { res.status(400).json(err); });
	});

	apiRouter.post('/address/validate/check-weather', (req, res) => {
		functions.checkWeather(req.body)
		.then( result => { res.status(200).json(result); })
		.catch( err => { res.status(400).json(err); });
	});

	apiRouter.post('/user/signup', (req, res) => {
		auth.signUp(req.body)
		.then( result => { res.status(200).json(result); })
		.catch( err => { res.status(400).json(err); });
	});

	apiRouter.post('/user/signin', (req, res) => {
		auth.signIn(req.body)
		.then( result => { res.status(200).json(result); })
		.catch( err => { res.status(400).json(err); });
	});	

	apiRouter.use(function(req, res, next) {
		let token = req.body.token || req.query.token || req.headers['x-access-token'];
	
		if (token) {
			auth.checkToken(token)
			.then(returnValues => {
				req.query = returnValues.uid;
				next();
			}).catch(err => {
				return res.status(400).json({ success: false, code: 'noAuth', message: err.message});
			});
		} else {
			return res.status(400).json({ code: 'noAuth', success: false, message: "No token provided, please, login again"});	
		}
	});

	apiRouter.route('/address')
	.post((req, res) => {		
		functions.addAddress(req)
		.then( result => { res.status(200).json(result); })
		.catch( err => {  res.status(400).json(err); });
	})
	.get((req, res) => {		
		functions.getAddresses(req)
		.then( result => { res.status(200).json(result); })
		.catch( err => { res.status(400).json(err); });
	})
	.put((req, res) => {		
		functions.updateAddress(req)
		.then( result => { res.status(200).json(result); })
		.catch( err => { res.status(400).json(err); });
	})
	.delete((req, res) => {		
		functions.delAddress(req)
		.then( result => { res.status(200).json(result); })
		.catch( err => { res.status(400).json(err); });
	});		

	apiRouter.route('/notifications')
	.get((req, res) => {		
		functions.getNotifications(req.query)
		.then( result => { res.status(200).json(result); })
		.catch( err => { res.status(400).json(err); });
	})
	.put((req, res) => {		
		functions.updateNotifications(req)
		.then( result => { res.status(200).json(result); })
		.catch( err => { res.status(400).json(err); });
	})


	return apiRouter;
}

