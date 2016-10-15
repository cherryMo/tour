
'use strict';
var express = require('express');
var orm = require('orm');
var mysql = require('../settings.js').mysql;
var md5Hash = require('../routes/util.js').md5Hash;
var dbAddress = "mysql://"+mysql.username+":"+mysql.password+"@"+mysql.host+"/"+ mysql.database;
var async = require('async');

module.exports = function(router) {
	// 连接数据库
	router.use(orm.express(dbAddress, {
		define: function(db, models, next) {
			models.inform = db.define("inform", {
				Id: {
					type: "serial",
					key: true
				},
				name: String,
				country: String,
				date: String,
				step: String
			});
			models.event = db.define("event", {
				id: Number,
				customId: Number,
				country: String,
				date: String,
				ord: String,
				update_time: String,
				admin_name: String
			});
			models.process = db.define("process", {
				id: Number,
				country: String,
				process: String,
				descript: String,
				order: String,
				add_time:Date,
			});
			//管理员
			models.user = db.define("user", { 
				id: Number,
	            account: String,
	            password: String,
	            time: Date
        	});

			//用户
	        models.custom = db.define("custom", {
	        	id: Number,
	        	account: String,
	        	password: String,
	        	name: String,
	        	sex: String,
	        	id_number: String,
	        	tel: String,
	        	time: Date
	        });

			models.message = db.define("message",{
				id: Number,
				customId: Number,
				content: String,
				time: Date
			});

			models.complain = db.define("complain", {
				id: Number,
				customId: Number,
				complaint: Number,
				reason: String,
				detail: String,
				time: Date
			});

			models.country = db.define("country", {
				id:Number,
				country:String,
				time:Date
			})

			next();
		}
	}));
	var mysql = {
		//根据用户名查找user表中的内容
		message: function(req, res, next) {
			req.models.user.find({
				account: req.query.user
			}, function(err, data) {
				if (err) throw err;
				res.locals.data = data;
				next();
			});
		},
		//查找country表中内容
		country: function(req, res, next){
			req.models.country.find(function(err, data){
				if(err){
					throw err;
				}
				res.locals.country = data;
				next();
			});
		},
		//查找event表中的内容
		event: function(req, res, next) {
			req.models.event.find(function(err, data) {
				if (err) throw err;
				res.locals.event = data;
				// console.log(data[1].value)
				next();
			});
		},
		//根据country和order查找process的内容
		process: function(req, res, next) {
			req.models.process.find(function(err, data) {
				if (err) throw err;
				res.locals.process = data;
				next();
			});
		},
		//根据身份证号码查询custom中的内容
		custom: function(req, res, next) {
			req.models.custom.find(function(err, data) {
				if (err) throw err;
				res.locals.custom = data;
				next();
			});
		},
		user: function(req, res, next){
			req.models.user.find(function(err, data) {
				if (err) throw err;
				res.locals.user = data;
				next();
			});
		},
		//向custom中插入数据
		insert_custom:function(req,res,next){
			req.models.custom.create({
				account: req.body.tel,
				password: md5Hash(req.body.id_number.slice(-6)),
				name:req.body.name,
				sex:req.body.sex,
				id_number:req.body.id_number,
				tel:req.body.tel,
				time:new Date()
			},function(err,data){
				if(err) throw err;
				res.locals.data=data;
				next();
			})
		},
		//向event表中插入数据
		insert_event:function(req,res,next){
			req.models.event.create({
				customId:req.body.customId,
				country:req.body.country,
				date:req.body.date,
				ord:req.body.ord,
				update_time:req.body.update_time,
				admin_name:req.body.admin_name
			},function(err,data){
				if(err) throw err;
				res.locals.data=data;
				next();
			});
		},
		//更新数据
		update:function(req,res,next){
				req.models.event.find({id: req.body.eventId}, function(err,data){
					data[0].save({						
						ord:req.body.ord,
						update_time:req.body.update_time,
						admin_name: req.session.user.account,
					},function(err){
						if(err) throw err;
						res.locals.data="success";
						next();
					});
				});
		},
		//删除数据
		delete_event:function(req,res,next){
			req.models.event.get(req.body.id,function(err,data){
				data.remove(function(err){
					if(err) throw err;
					res.locals.event="success";
					next();
				});
			});
		},
		delete_cus:function(req,res,next){
			req.models.custom.get(req.body.name,function(err,data){
				data.remove(function(err){
					if(err) throw err;
					res.locals.data="success";
					next();
				});
			});
		},
		delete_msg:function(req, res,next){
			req.models.message.get(req.body.id, function(err, data){
				data.remove(function(err){
					if(err){
						throw err;
					}
					res.locals.msg = 'success';
					next();
				})
			})
		},
		delete_complain:function(req, res,next){
			req.models.complain.get(req.body.id, function(err, data){
				data.remove(function(err){
					if(err){
						throw err;
					}
					res.locals.msg = 'success';
					next();
				})
			})
		},
		//向process表中添加签证国家
		insert_coun:function(req,res,next){
			req.models.process.create({
				country:req.body.country,
				add_time:req.body.add_time,
				// process:"开始",
				// order:"0",
				// descript:"开始办理"
			},function(err,data){
				if(err) throw err;
				res.locals.data=data;
				next();
			});
		},
		//添加国家
		insert_country: function(req, res, next){
			req.models.country.create({
				country:req.body.country,
				time:new Date()
			}, function(err, data){
				if(err) {
					throw err;
				}
				res.locals.country = data;
				next();
			})
		},
		delete_country:function(req, res,next){
			req.models.country.get(req.body.id, function(err, data){
				data.remove(function(err){
					if(err){
						throw err;
					}
					res.locals.msg = 'success';
					next();
				})
			})
		},
		//更新签证流程次序
		modifyOrder: function(req, res, next){
			req.models.process.find({country:req.body.country}, function(err, data){
				async.map(data, function(obj,callback){
					if(obj.order>=req.body.order){
						obj.order++;
					}
					obj.save(callback);
				}, function(err, results){
					if(err){
						throw err;
					}
					next();
				})
			})
		}, 
		insert_process: function(req, res, next){
			req.body.add_time = new Date().toLocaleString();
			req.models.process.create(req.body, function(err, data){
				if(err){
					throw err;
				}
				next();
			})
		},
		delete_process:function(req, res,next){
			console.log(req.body.id);
			req.models.process.get(req.body.id, function(err, data){
				console.log('get process data', data);
				data.remove(function(err){
					if(err){
						throw err;
					}
					console.log('removing');
					res.locals.msg = 'success';
					next();
				})
			})
		}
		
	}
	return mysql;
}