var express = require('express');
var router = express.Router();
var orm = require('orm');
var mysql = require('../mysql/mysql')(router);
var util = require('./util.js');
var md5Hash = util.md5Hash;
var checkUserLogin = util.checkUserLogin;
var isLegalName = util.isLegalName;
var async = require('async');

//检测用户注册、登录表单字段
function checkForm(req, res, next){
	var account = req.body.account;
	var password = req.body.password;
	if(!account || !password){
		return res.status(403).json({error: '用户名或密码不能为空'});
	}
	next();
}

//注册
router.get('/register', function(req, res){
	res.render('client/register');
});

//处理注册
router.post('/register',checkForm, function(req, res){

	var account = req.body.account;
	var password = req.body.password;
	req.models.custom.find({account:account}, function(err, data){
		if(err){
			console.log('error:',err);
			return res.status(403).json({error: '数据库错误！'});
		}
		// console.log(data);
		if(data[0]){
			return res.status(403).json({error: '账号已存在！'});
		}

		if(!isLegalName(account)){
			return res.status(403).json({error: '不合法账号名！'});
		};

		var newCustom = {
			account: account,
			password: md5Hash(password),
			time:new Date()
		}
		req.models.custom.create(newCustom, function(err, data){
			if(err){
				console.log('create error:',err);
				return res.status(403).json({error: '数据库错误！'});
			}
			req.session.custom = data;
			return res.status(200).json({success: '注册成功！'});
		});
	});
})

//登录
router.get('/login', function(req, res){
	res.render('client/login');
});

router.post('/login', checkForm, function(req, res){

	req.models.custom.find({account: req.body.account}, function(err, data){
			if(err){
				console.log(err);
				return res.status(403).json({error:'数据库错误！'});
			}
			if(!data[0]){
				return res.status(403).json({error:'用户不存在！'});
			}
			if(md5Hash(req.body.password)!=data[0].password){
				return res.status(403).json({error:'用户名或密码错误！'});
			}
			// console.log(data);
			req.session.custom = data[0];
			res.status(200).json({success:'登录成功'});
		});
});



//登出
router.get('/logout', function(req, res){
	req.session.custom = null;
	res.render('client/login');
});

//个人中心
router.get('/center', checkUserLogin, mysql.country, mysql.user,function(req, res){
	var custom = req.session.custom;
	req.models.custom.get(custom.id, function(err, data){
		if(err){
			console.log(err);
			return res.redirect('back');
		}
		res.render('client/center',
			{	custom:req.session.custom, 
				user:res.locals.user,
				data:data,
				country:res.locals.country,
				success:req.flash('success').toString(),
				error: req.flash('error').toString()
			});
	})
	
});


//修改个人信息
router.post('/center', checkUserLogin, function(req, res){
	var custom = req.session.custom;
	var curAccount = req.body.account;

	//账号查重
	req.models.custom.find({account: curAccount}, function(err, data){
		if(err){
			throw err;
		}
		console.log('data.length:', data.length);
		if(curAccount != custom.account && data.length > 0){
			req.flash('error', '用户名已被占用！');
			return res.redirect('back');
		}

		//修改信息
		req.models.custom.get(custom.id, function(err, data){
			if(err){
				console.log(err);
				return res.redirect('back');
			}
			for(key in req.body){
				if(req.body.hasOwnProperty(key)){
					data[key] = req.body[key];
				};
			}
			// console.log(data);
			data.save(function(err, data){
				if(err){
					throw err;
				}
				req.session.custom = data;
				res.redirect('/client/center');
			})
		})

	});
	
});

//个人中心修改密码
router.post('/changePsw', checkUserLogin, function(req, res){
	var oldPwd = req.body.oldPwd;
	var newPwd = req.body.firstNewPwd;
	var reNewPwd = req.body.secordNewPwd;
	if(newPwd != reNewPwd){
		return res.status(403).json({error:'两次密码不一致！'});
	}
	req.models.custom.get(req.session.custom.id, function(err, data){
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



//留言
router.get('/leaveMsg',checkUserLogin, function(req, res){
	res.render('client/leaveMsg', {custom: req.session.custom});
});
router.post('/leaveMsg',checkUserLogin, function(req,res){
	var newMessage = {
		customId: req.session.custom.id,
		content: req.body.content,
		time:new Date()
	};
	req.models.message.create(newMessage, function(err ,data){
		if(err){
			res.status(403).json({error:'数据库错误！'});
		}
		res.status(200).json({success:'留言成功！'});
	})
});

//投诉
router.get('/complain',checkUserLogin, function(req, res){
	req.models.user.find(function(err, data){
		if(err){
			throw err;
		}
		res.render('client/complain', {
			custom: req.session.custom,
			data: data
		});
	});
});

router.post('/complain', checkUserLogin, function(req, res){
	var newComplain = {
		customId: req.session.custom.id,
		complaint: req.body.complaint,
		reason:req.body.reason,
		detail:req.body.detail,
		time:new Date()
	};
	req.models.complain.create(newComplain, function(err, data){
		if(err){
			console.log(err);
			res.status(403).json({error: '数据库错误！'});
		}
		res.status(200).json({success:'投诉成功！'});
	})
})

//申请签证
router.post('/applyVisa', checkUserLogin, function(req, res){
	console.log('in applyVisa post');
	var custom = req.session.custom;
	var country = req.body.country;
	if(!custom.name || !custom.id_number || !custom.tel){
		return res.status(403).json({error:'申请签证前请先完善个人信息！'});
	}
	var time = new Date().toLocaleString();
	var newEvent = {
		customId:custom.id,
		country:country,
		date:time,
		ord:'0',
		update_time:time,
		admin_name:'admin'
	};
	req.models.event.create(newEvent, function(err, data){
		if(err){
			res.status(403).json({error:'数据库错误！'});
		}
		res.status(200).json({success:'申请成功！'});
	})

})


//签证进度查询
router.get('/search', checkUserLogin,function(req, res){
	res.render('client/visaSearch', {custom: req.session.custom});
});


router.post('/search', checkUserLogin,mysql.process, function(req, res){
	var id_number = req.body.id_number;
	if(!id_number){
		return res.status(403).json({error:'请输入身份证号！'});
	}
	req.models.custom.find({id_number:id_number}, function(err, objs){
		//objs=[{}, {}]  custom array
		if(err){
			return res.status(403).json({error:'数据库错误！'});
		}
		async.map(objs, function(obj,callback){
			// console.log('obj', obj.id, obj);
			req.models.event.find({customId:obj.id}, function(err, event){
				if(err){
					return res.status(403).json({error:'数据库错误！'});
				}
				event.forEach(function(o,i){
					o.id_number = obj.id_number;
					o.name=obj.name || '';
					o.tel = obj.tel || '';
					o.process = null;

					res.locals.process.forEach(function(p,i){
						if(p.country === o.country && p.order === o.ord){
							o.process = p.process;
							return;
						}
					});

				})
				
				callback(null, event);
				
			});
		}, function(err, resusts){
			if(err){
				return res.status(403).json({error:'数据库错误！'});
			}
			console.log(resusts);//[[], []]
			return res.status(200).json({data:resusts});
		})
	})
})

module.exports = router;