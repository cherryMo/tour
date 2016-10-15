var express = require('express');
var router = express.Router();
var orm = require('orm');
var mysql = require('../mysql/mysql')(router);
var util = require('./util.js');
var md5Hash = util.md5Hash;
var checkAdminLogin = util.checkAdminLogin;
var isLegalName = util.isLegalName;
var async = require('async');

//检测登录/添加管理员表单字段
function checkForm(req, res, next){
	var account = req.body.account;
	var password = req.body.password;
	if(!account || !password){
		return res.status(403).json({error: '用户名或密码不能为空'});
	}
	next();
}


//管理端控制台  '/console'
router.get('/', checkAdminLogin, function(req, res) {
  res.render('console/index', {user: req.session.user});
});


//管理端登录 '/console/login'
router
	.route('/login')
	.get(function(req, res){
		res.render('console/login', {user: req.session.user});
	})
	.post(checkForm, function(req, res){

		req.models.user.find({account: req.body.account}, function(err, data){
				if(err){
					console.log(err);
					return res.status(403).json({error:'数据库错误！'});
				}
				if(!data){
					return res.status(403).json({error:'用户不存在！'});
				}
				console.log(req.body.password+' ', md5Hash(req.body.password)+' ', data[0].password);
				if(md5Hash(req.body.password)!=data[0].password){
					return res.status(403).json({error:'用户名或密码错误！'});
				}
				console.log(data);
				req.session.user = data[0];
				res.status(200).json({success:'登录成功'});
			});
	});


//管理端登出 '/console/logout'
router.get('/logout', function(req, res){
	req.session.user = null;
	res.redirect('/console/login');
});


//用户设置
router.get('/userSet', checkAdminLogin, function(req, res){
	req.models.user.find(function(err, data){
		if(err){
			console.log(err);
			return res.redirect('back');
		}
		res.render('console/userSet', {data: data, user:req.session.user});
	});
	
});

router.post('/addUser', checkAdminLogin, checkForm,function(req, res){
	var account = req.body.account;
	var password = req.body.password;

	req.models.user.find({account:account}, function(err, data){
		if(err){
			return res.status(403).json({error: '数据库错误！'});
		}
		console.log(data);
		if(data[0]){
			return res.status(403).json({error: '账号已存在！'});
		}

		if(!isLegalName(account)){
			return res.status(403).json({error: '不合法账号名！'});
		};

		var newUser = {
			account: account,
			password: md5Hash(password),
			time:new Date()
		}
		req.models.user.create(newUser, function(err, data){
			if(err){
				return res.status(403).json({error: '数据库错误！'});
			}
			return res.status(200).json({success: '添加成功！'});
		});
	});
});

//删除管理员
router.get('/delUser/:id', checkAdminLogin, function(req, res){
	req.models.user.get(req.params.id, function(err, user){
		if(user){
			user.remove(function(err){
				if(err){
					throw err;
				}else{
					console.log('delete user success:'+ req.params.id);
				}
			});
		}
		res.redirect('back');
	})
});


//安全中心(修改密码)
router.get('/secure', checkAdminLogin, function(req, res){
	res.render('console/secure', {user: req.session.user});
});


//管理员修改密码
router.post('/secure', checkAdminLogin, function(req, res){
	var oldPwd = req.body.oldPwd;
	var newPwd = req.body.firstNewPwd;
	var reNewPwd = req.body.secordNewPwd;
	if(newPwd != reNewPwd){
		return res.status(403).json({error:'两次密码不一致！'});
	}
	req.models.user.get(req.session.user.id, function(err, data){
		if(md5Hash(oldPwd) != data.password){
			return res.status(403).json({error:'原密码错误！'});
		}
		data.password = md5Hash(newPwd);
		data.save(function(err){
			if(err){
				return res.status(403).json({error:'数据库错误！'});
			}
			res.status(200).json({success:'修改成功！'});
		})
	})
})


//签证设置
router.get('/visaSet', checkAdminLogin, mysql.country, function(req, res){
	res.render('console/visaSet', {user: req.session.user, country:res.locals.country});
});

//签证进度
router.get('/inform', checkAdminLogin, function(req, res){
	res.render('console/visaProcess', {user:req.session.user});
});

//留言
router.get('/message',checkAdminLogin,function(req, res){
	req.models.message.find(function(err, data){
		if(err){
			throw err;
		}
		async.map(data, function(obj, callback){
			req.models.custom.get(obj.customId, function(err,custom){
				obj.name = custom.name || custom.account || '';
				obj.time = obj.time.toLocaleString();
				callback(err,obj);
			});
		}, function(err, results){
			if(err){
				throw err;
			}
			res.render('console/message',{data:results, user:req.session.user});
		});
	});
});

//投诉
router.get('/complain',checkAdminLogin ,function(req, res){

	req.models.complain.find(function(err, data){
		if(err){
			throw err;
		}
		async.map(data, function(obj1, callback){
			req.models.custom.get(obj1.customId, function(err,custom){
				obj1.name = custom.name || custom.account || '';
				obj1.time = obj1.time.toLocaleString();
				callback(err,obj1);
			});
		}, function(err, results){
			if(err){
				throw err;
			}
			async.map(data, function(obj2, callback){
				req.models.user.get(obj2.complaint, function(err, user){
					obj2.complaint = user.account;
					callback(err, obj2);
				});
			}, function(err, result){
				if(err){
					throw err;
				}
				res.render('console/complain',{data:results, user:req.session.user});
			});
		});
	});
});


module.exports = router;