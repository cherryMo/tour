var crypto = require('crypto');

exports.md5Hash = function(str){
	return crypto.createHash('md5').update(str).digest('hex');
}

exports.checkUserLogin = function(req, res, next){
	if(!req.session.custom){
		return res.redirect('/client/login');
	}
	next();
}

exports.checkAdminLogin = function(req, res, next){
	if(!req.session.user){
		return res.redirect('/console/login');
	}
	next();
}

exports.isLegalName = function(name){
	if(name=='session' || name=="admin"){
		return false;
	}else{
		return true;
	}
}