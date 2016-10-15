var express = require('express');
var router = express.Router();
var orm = require('orm');
var mysql = require('../mysql/mysql')(router);
var checkAdminLogin = require('./util.js').checkAdminLogin;
var md5Hash = require('./util.js').md5Hash;
var superAdmin = require('../settings.js').superAdmin;
var async = require('async');

/* GET home page. */
router.get('/', function(req, res){
	res.render('client/index',{custom:req.session.custom});
})

//从event、process、custom三表中取信息
router.get('/inform/event',mysql.event,mysql.process,mysql.custom,function(req,res,next){
	var data = {};
	data.event = res.locals.event;
	data.process=res.locals.process;
	data.custom=res.locals.custom;
	res.json(data);
});

//向custom表中插入数据
router.post("/inform/insert/custom",mysql.insert_custom,function(req,res,next){
	console.log(res.locals.data);
	res.json(res.locals.data);
});
//向event表中插入数据
router.post("/inform/insert/event",mysql.insert_event,function(req,res,next){
	res.json(res.locals.data);
});
//更新数据表中的信息
router.post("/inform/update",mysql.update,function(req,res,next){
	res.json(res.locals.data);
});
//删除信息
router.post("/event/delete",mysql.delete_event,function(req,res,next){
	var data={};
	data.event=res.locals.event;
	res.json(data);

});

//添加国家
router.post('/country/insert', mysql.insert_country, function(req, res, next){
	res.json(res.locals.country);
});

//删除国家
router.post('/country/delete', mysql.delete_country, function(req, res, next){
	//TODO 删除国家后同时删除该国家的流程
	res.json(res.locals.msg);
})

//添加特定国家签证流程
router.post('/process/insert',checkAdminLogin, mysql.modifyOrder, mysql.insert_process,function(req, res){
	res.json('success');
})

//删除特定国家流程
router.post('/process/delete', checkAdminLogin, mysql.delete_process, function(req, res){
	res.json(res.locals.msg);
})

//查看特定国家的签证流程
router.post('/process/show', checkAdminLogin, function(req, res){
	req.models.process.find({country:req.body.country}, ["order","A"] ,function(err, data){
		if(err){
			throw err;
		}
		// console.log(data);
		return res.json(data);
	})
})

//向process表中添加签证国家
router.post("/inform/insert_coun",mysql.insert_coun,function(req,res,next){
	res.json(res.locals.data);
});

//留言删除
router.post('/message/delete', checkAdminLogin, mysql.delete_msg, function(req, res){
 	res.json(res.locals.data);
});

//投诉删除
router.post('/complain/delete', checkAdminLogin, mysql.delete_complain, function(req, res){
 	res.json(res.locals.data);
})

router.get('/init/1234567890', function(req, res){
	req.models.user.find({account:superAdmin.account}, function(err, data){
		if(err){
			throw err;
		}
		if(data[0]){
			return res.send('inited before');
		}
		req.models.user.create({
			account:superAdmin.account,
			password:md5Hash(superAdmin.password),
			time:new Date()
		}, function(err){
			if(err){
				throw err;
			}
			return res.send('init success');
		})

	})
})

module.exports = router;

