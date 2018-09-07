/*
 * routers
 */
var formidable = require('formidable');
var connection = require("../public/lib/mysql.js");
var fs = require('fs');
var https = require('https');
var querystring = require('querystring');
var grobalUrl = "http://111.230.228.102:3000/";
//计算时间差函数
var timeSpace = function(sDate1, sDate2) {
	var dateSpan,
		tempDate,
		iDays;
	sDate1 = new Date(sDate1);
	sDate2 = new Date(sDate2);
	dateSpan = sDate2 - sDate1;

	dateSpan = Math.abs(dateSpan);
	iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
	return iDays;
}

//时间格式处理
var format = function(yourDate, type) {
	var nowYear = new Date().getFullYear();
	var date = new Date(yourDate);
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();

	var hour = date.getHours();
	var minute = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();
	//var minute = date.getMinutes();
	var second = (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds();
	//var second = date.getSeconds();
	var time;
	switch(type) {
		case 1:
			time = year + '-' + month + '-' + day;

			break;

		case 2:

			time = year + '-' + month + '-' + day + " " + hour + ":" + minute + ":" + second + ":00";

			break;
		case 3:

			time = year + '-' + month + '-' + day + " " + hour + ":" + minute + ":" + second;

			break;
		case 4:

			time = year + '年' + month + '月' + day + "日";

			break;
		case 5:

			time = month + '/' + day;

			break;
		case 6:
			time = nowYear - year
	}
	return time;
};

module.exports = function(app) {
	//删除食物
	app.get('/deleteFood', function(req, res) {
		var obj = {
			success: true,
			data: {},
			msg: ""
		}
		var food_id = req.query.food_id || req.params.food_id;
		var sql = 'delete  from kaka_food_info where food_id ='+food_id;
		connection.query(sql, function(err, results) {
			if(err) {
				console.log(err) 
			} else if(results) {
				obj.msg = '删除成功'
			} else {
				obj.msg = '未知错误'
			}
			res.send(obj)
		})
	})
	
	//修改动态数据接口
	app.post('/updateFoodDetail', function(req, res) {
		var obj = {
			success: true,
			data: {},
			msg: ""
		}
		var food_id = req.body.food_id;
		var food_unit = req.body.food_unit;
		var food_pic = req.body.food_pic;
		var food_name = req.body.food_name;
		
		var sql = 'update kaka_food_info set food_unit = '+food_unit+',food_pic = "'+food_pic+'",food_name="'+food_name+'" where food_id = '+food_id;
		connection.query(sql, function(err, results) {
			if(err) {
				console.log(err)
			} else if(results) {
				
				obj.msg = '修改成功'
			} else {
				obj.msg = '修改错误'
			}
			res.send(obj)
		})
	})
	
	//删除动态
	app.get('/deleteDynamic', function(req, res) {
		var obj = {
			success: true,
			data: {},
			msg: ""
		}
		var dynamic_id = req.query.dynamic_id || req.params.dynamic_id;
		var sql = 'delete  from kaka_dynamic_info where dynamic_id ='+dynamic_id;
		connection.query(sql, function(err, results) {
			if(err) {
				console.log(err) 
			} else if(results) {
				obj.msg = '删除成功'
			} else {
				obj.msg = '未知错误'
			}
			res.send(obj)
		})
	})
	
	//修改动态数据接口
	app.post('/updateDynamicDetail', function(req, res) {
		var obj = {
			success: true,
			data: {},
			msg: ""
		}
		var dynamic_id = req.body.dynamic_id;
		var be_like_num = req.body.be_like_num;
		var isPrvite = req.body.isPrvite;
		var dynamic_details = req.body.dynamic_details;
		
		var sql = 'update kaka_dynamic_info set be_like_num = '+be_like_num+',isPrvite = "'+isPrvite+'",dynamic_details="'+dynamic_details+'" where dynamic_id = '+dynamic_id;
		connection.query(sql, function(err, results) {
			if(err) {
				console.log(err)
			} else if(results) {
				
				obj.msg = '修改成功'
			} else {
				obj.msg = '修改错误'
			}
			res.send(obj)
		})
	})
	
	//增加食物接口
	app.post('/addFood', function(req, res) {
		var obj = {
			success: true,
			data: {},
			msg: ""
		}
		var food_unit = req.body.food_unit;
		var food_pic = req.body.food_pic;
		var food_name = req.body.food_name;
		
		var sql = 'insert into kaka_food_info (food_unit,food_pic,food_name) values ('+food_unit+',"'+food_pic+'","'+food_name+'")';
		connection.query(sql, function(err, results) {
			if(err) {
				console.log(err)
			} else if(results) {
				
				obj.msg = '增加成功'
			} else {
				obj.msg = '增加失败'
			}
			res.send(obj)
		})
	})

	//上传食物图片的接口
	app.post('/uploadFoodImg', function(req, res) {
		var obj = {
			success: true,
			data: {},
			msg: ""
		}
		var form = new formidable.IncomingForm();
		form.uploadDir="./public/foods";//必须设置

		form.parse(req,function(error,fields,files){
			console.log(files.file.path);
			var filename = files.file.name
	        var nameArray = filename.split('.');
	        var type = nameArray[nameArray.length - 1];
	        var name = '';
	        for (var i = 0; i < nameArray.length - 1; i++) {
	            name = name + nameArray[i];
	        }
	        var date = new Date();
			var time = '_' + date.getFullYear() + "_" + date.getMonth() + "_" + date.getDay() + "_" + date.getHours() + "_" + date.getMinutes();
	        var avatarName = name + time + '.' + type;
	        var newPath = form.uploadDir + "/" + avatarName;
			fs.renameSync(files.file.path,newPath);
			obj.data.avatarName = avatarName
			res.send(obj);
		}
	);
	})

	//返回所有用户信息
	app.get('/getAllUsers', function(req, res) {
		var obj = {
			success: true,
			data: {},
			msg: ""
		}

		var sql = 'select * from kaka_user_info';
		connection.query(sql, function(err, results) {
			if(err) {
				console.log(err) 
			} else if(results) {

				obj.data = results
				for(var i in obj.data){
					obj.data[i].user_pic = grobalUrl + 'avatar/' + obj.data[i].user_pic
				}
			} else {
				obj.msg = '未知错误'
			}
			res.send(obj)
		})
	})

	//密码修改
	app.post('/updatePassWord', function(req, res) {
		var obj = {
			success: true,
			data: {},
			msg: ""
		}
		var user_id = req.body.user_id;
		var user_password = req.body.user_password;
		var sql = 'update kaka_user_info set user_password = ' + user_password + ' where user_id = ' + user_id;
		connection.query(sql, function(err, results) {
			if(err) {
				console.log(err)
			} else if(results) {
				console.log(results)
				obj.msg = '密码修改成功，您将退出登录!'
			} else {
				obj.msg = '密码修改失败'
			}
			res.send(obj)
		})
	})

	//获取用户个人动态
	app.get('/getUserDynamic', function(req, res) {
		var obj = {
			success: true,
			data: {},
			msg: ""
		}
		var user_id = req.query.user_id || req.params.user_id;
		var sql = 'select * from kaka_dynamic_info a left join (select * from  dynamic_pic_info group by dynamic_id) c on a.dynamic_id = c.dynamic_id where a.user_id = ' + user_id;
		connection.query(sql, function(err, results) {
			if(err) {
				console.log(err)
			} else if(results) {

				obj.data = results
				for(var i in obj.data) {
					obj.data[i].dynamic_pic = grobalUrl + "dynamic/" + obj.data[i].dynamic_pic;
				}
			} else {
				obj.success = false;
				obj.msg = '查询失败'
			}
			res.send(obj);
		})

	})

	//获取用户个人收藏
	app.get('/getUserCollect', function(req, res) {
		var obj = {
			success: true,
			data: {},
			msg: ""
		}
		var user_id = req.query.user_id || req.params.user_id;
		var sql = 'select * from (kaka_dynamic_collet a left join kaka_dynamic_info b on a.dynamic_id = b.dynamic_id ) left join (select * from  dynamic_pic_info group by dynamic_id) c on a.dynamic_id = c.dynamic_id where a.user_id = ' + user_id;
		connection.query(sql, function(err, results) {
			if(err) {
				console.log(err)
			} else if(results) {

				obj.data = results
				for(var i in obj.data) {
					obj.data[i].dynamic_pic = grobalUrl + "dynamic/" + obj.data[i].dynamic_pic;
				}
			} else {
				obj.success = false;
				obj.msg = '查询失败'
			}
			res.send(obj);
		})

	})
	//用户健康报告
	app.get('/userReport', function(req, res) {
		var obj = {
			success: true,
			data: {},
			msg: ""
		}
		var user_id = req.query.user_id || req.params.user_id;
		var sql = 'select * from kaka_user_info where user_id = ' + user_id;
		connection.query(sql, function(err, results) {
			if(err) {
				console.log(err)
			} else if(results) {
				obj.data.age = format(results[0].user_birth_date, 6);
				obj.data.BMI = results[0].user_weight / ((results[0].user_height / 100) * (results[0].user_height / 100));
				obj.data.BFR = results[0].user_sex == 1 ? 1.2 * obj.data.BMI + 0.23 * obj.data.age - 5.4 - 10.8 * 1 : 1.2 * obj.data.BMI + 0.23 * obj.data.age - 5.4;
				obj.data.perfect_height = (results[0].user_height / 100) * (results[0].user_height / 100) * obj.data.BMI;
				if(obj.data.BFR < 27) {
					obj.data.bodyAge = obj.data.age - 3
				} else if(obj.data.BFR > 27) {
					obj.data.bodyAge = obj.data.age + 3
				} else {
					obj.data.bodyAge = obj.data.age
				}
				obj.data.user_calorie = results[0].user_calorie
				if(obj.data.BMI == 18.5) {
					obj.data.healthPoint = 98;
					obj.data.level = 'S'
				}
				if(18.5 < obj.data.BMI && obj.data.BMI < 24.9 || obj.data.BMI == 24.9) {
					obj.data.healthPoint = 92;
					obj.data.level = 'A'

				}
				if(24.9 < obj.data.BMI && obj.data.BMI < 29.9 || obj.data.BMI == 29.9) {
					obj.data.healthPoint = 80;
					obj.data.level = 'B'
				}
				if(29.9 < obj.data.BMI && obj.data.BMI < 39.9 || obj.data.BMI == 39.9) {
					obj.data.healthPoint = 70;
					obj.data.level = 'C'
				}
				if(obj.data.BMI < 18.5 || obj.data.BMI > 39.9) {
					obj.data.healthPoint = 60;
					obj.data.level = 'F'

				}

			} else {
				obj.success = false;
				obj.msg = '修改失败'
			}
			res.send(obj);
		})

	})

	//修改用户性别和身高
	app.post('/updateUserInfo', function(req, res) {
		var obj = {
			success: true,
			data: {},
			msg: ""
		}

		var user_id = req.body.user_id,
			user_name = req.body.user_name,
			user_phone = req.body.user_phone,
			user_sex = req.body.user_sex,
			user_password = req.body.user_password,
			user_age = req.body.user_age,
			user_weight = req.body.user_weight,
			user_height = req.body.user_height
		user_target = req.body.user_target,
			user_birth_date = req.body.user_birth_date,
			user_finalweight = req.body.user_finalweight

		var sql1 = ' update  kaka_user_info set user_name = "' + user_name + '",user_phone = "' + user_phone +
			'",user_sex = ' + user_sex + ',user_password= "' + user_password +
			'",user_age = ' + user_age + ',user_weight= ' + user_weight +
			',user_target = "' + user_target + '",user_birth_date= "' + user_birth_date +
			'",user_finalweight= ' + user_finalweight + ',user_height= ' + user_height +
			' where user_id =' + user_id;

		var sql2 = 'select * from kaka_user_info where user_id = ' + user_id;
		var sql = sql1 + ';' + sql2
		connection.query(sql, function(err, results) {

			if(err) {
				console.log(err)
			} else if(results) {

				obj.data = results[1][0];
				obj.data.user_pic = grobalUrl + "avatar/" + obj.data.user_pic;
				obj.data.user_birth_date = obj.data.user_birth_date ? format(obj.data.user_birth_date, 1) : "";
				obj.data.user_final_time = obj.data.user_final_time ? format(obj.data.user_final_time, 1) : "";

			} else {
				obj.success = false;
				obj.msg = '修改失败'
			}
			res.send(obj);
		})

	})

	//插入动态图片接口
	app.post('/insertDynamicPic', function(req, res) {
		var dynamic_id = req.body.dynamic_id;
		if(req.body.imgData) {
			var avatar = req.body.imgData.replace(/^data:image\/\w+;base64,/, '');
			newBuff = new Buffer(avatar, 'base64');
			var AVATAR_UPLOAD_FOLDER = '/dynamic/'
			var avatarName = Math.random() + '.jpg';
			var domain = "http://" + req.headers.host;
			var newPath = './public' + AVATAR_UPLOAD_FOLDER + avatarName;
			var showUrl = domain + AVATAR_UPLOAD_FOLDER + avatarName;

			//将图片写入内存
			fs.writeFile(newPath, newBuff, 'binary', function(err) {
				if(err) {
					console.log(500)
					return res.send({
						"msg": '未知错误'
					});
				}
				connection.query("insert into  dynamic_pic_info (dynamic_pic,dynamic_id) values ('" + avatarName + "'," + dynamic_id + ")", function(error, results, fields) {
					var obj = {
						success: true,
						msg: "",
						picPath: ""
					}
					if(error) console.log(err);
					if(results) {
						obj.msg = "上传成功！"

					} else {
						obj.success = false;
						obj.msg = "上传失败！"
					}
					res.send(obj);
				});
			});
		} else {
			res.send({
				"msg": '未上传图片'
			});
		}

	})

	//插入动态接口
	app.post('/insertDynamic', function(req, res) {
		var obj = {
			success: true,
			data: {},
			msg: ""
		}
		var user_id = req.body.user_id;
		var dynamic_details = req.body.dynamic_details;
		var isPrvite = req.body.isPrvite ? req.body.isPrvite : 0;
		var sql = 'insert into kaka_dynamic_info (user_id,dynamic_details,be_like_num,isPrvite,create_date) values (' + user_id + ',"' + dynamic_details + '",0,' + isPrvite + ',now())';

		connection.query(sql, function(err, results) {

			if(err) {
				console.log(err)
			} else if(results) {

				obj.data.dynamic_id = results.insertId;

			} else {
				obj.success = false;
				obj.msg = '动态发布失败'

			}
			res.send(obj);
		})

	})

	//获取用户所有体重数据
	app.get('/getALLUserWeight', function(req, res) {
		var obj = {
			success: true,
			data: {},
			msg: ""
		}
		var user_id = req.query.user_id || req.params.user_id;

		var sql = "select weight_date,weight_num from kaka_weight_info where  user_id  =" + user_id;

		connection.query(sql, function(err, results) {

			if(err) {
				console.log(err)
			} else if(results.length > 0) {

				obj.data.weight_dates = [];
				obj.data.weight_nums = []
				for(var i in results) {
					obj.data.weight_dates.push(format(results[i].weight_date, 5));
					obj.data.weight_nums.push(results[i].weight_num);

				}

			} else {
				obj.success = false;
				obj.msg = '暂您的体重记录'

			}
			res.send(obj);
		})

	})

	//插入体重记录
	app.get('/insertWeight', function(req, res) {
		var obj = {
			success: true,
			data: {},
			msg: ""
		}

		var user_id = req.query.user_id || req.params.user_id;
		var weight_num = req.query.weight_num || req.params.weight_num;
		var sql = 'SELECT * FROM kaka_weight_info where user_id = ' + user_id + ' and DATEDIFF(weight_date,NOW()) =0';
		connection.query(sql, function(err, results) {

			if(err) {

				console.log(err)
			} else if(results.length > 0) {
				var weight_id = results[0].weight_id
				connection.query('update kaka_weight_info set weight_num = ' + weight_num + ', weight_date = now() where weight_id = ' + weight_id + '', function(err, results) {
					if(err) {

						console.log(err)
					} else {
						obj.msg = "修改成功";
						res.send(obj);
					}
				})

			} else {
				connection.query('insert into kaka_weight_info (weight_num,user_id,weight_date) values (' + weight_num + ',' + user_id + ',now())', function(err, results) {
					if(err) {

						console.log(err)
					} else {
						obj.msg = "插入成功";
						res.send(obj);
					}
				})
			}
			//			res.send(obj);
		})
	})

	//体重进度记录接口
	app.get('/weightDetail', function(req, res) {
		var obj = {
			success: true,
			data: {},
			msg: ""
		}
		var user_id = req.query.user_id || req.params.user_id;
		var sql1 = "(select a.*,b.user_target from kaka_weight_info a left join kaka_user_info b on a.user_id = b.user_id where a.user_id=" + user_id + ") order by weight_date asc limit 0,1";
		var sq2 = "(select a.*,b.user_target from kaka_weight_info a left join kaka_user_info b on a.user_id = b.user_id where a.user_id=" + user_id + ") order by weight_date desc limit 0,1";
		sql = sql1 + ";" + sq2
		connection.query(sql, function(err, results) {

			if(err) {
				console.log(err)
			} else if(results.length > 0) {

				obj.data.firest_weight = results[0][0];
				obj.data.fianl_weight = results[1][0];
				var date1 = format(obj.data.firest_weight.weight_date, 1);

				var date2 = format(obj.data.fianl_weight.weight_date, 1);

				obj.data.fianl_weight.daySpace = timeSpace(date1, date2);

				obj.data.firest_weight.weight_date = format(obj.data.firest_weight.weight_date, 4);

				obj.data.fianl_weight.weight_date = format(obj.data.fianl_weight.weight_date, 4);

			} else {
				obj.success = false;
				obj.msg = '暂无该体重记录'

			}
			res.send(obj);
		})

	})

	//搜索食物接口
	app.get('/searchFood', function(req, res) {
		var obj = {
			success: true,
			data: {},
			msg: ""
		}
		var food_name = req.query.food_name || req.params.food_name;

		var sql = "select *  from kaka_food_info where food_name like " + "'%" + food_name + "%'";
		connection.query(sql, function(err, results) {

			if(err) {
				console.log(err)
			} else if(results.length > 0) {

				obj.data = results;
				for(var i in obj.data) {
					obj.data[i].food_pic = grobalUrl + "foods/" + obj.data[i].food_pic;

				}

			} else {
				obj.success = false;
				obj.msg = '暂无该事物记录'

			}
			res.send(obj);
		})

	})

	//update某条饮食记录
	app.get('/updateDinnerInfo', function(req, res) {
		var obj = {
			success: true,
			data: {},
			msg: ""
		}
		var dinner_id = req.query.dinner_id || req.params.dinner_id;
		var food_weight = req.query.food_weight || req.params.food_weight;
		var total_calorie = req.query.total_calorie || req.params.total_calorie;
		var user_id = req.query.user_id || req.params.user_id;

		var sql = ' update  kaka_dinner_info set food_weight = ' + food_weight + ',total_calorie = ' + total_calorie + ',user_id = ' + user_id + ',create_date = now() where dinner_id = ' + dinner_id;
		connection.query(sql, function(err, results) {

			if(err) {
				console.log(err)
			} else if(results) {

				obj.msg = '修改成功';

			} else {
				obj.success = false;
				obj.msg = '修改失败'

			}
			res.send(obj);
		})

	})

	//获取某条食物记录
	app.get('/getDinnerDetail', function(req, res) {
		var obj = {
			success: true,
			data: {},
			msg: ""
		}
		var dinner_id = req.query.dinner_id || req.params.dinner_id;
		var sql = 'select  * from kaka_dinner_info a left join kaka_food_info b on a.food_id =b.food_id where dinner_id = ' + dinner_id;
		connection.query(sql, function(err, results) {

			if(err) {
				console.log(err)
			} else if(results[0]) {

				obj.data = results[0];
				obj.data.food_pic = grobalUrl + "foods/" + obj.data.food_pic;

			} else {
				obj.success = false;
				obj.msg = '该记录不存在'

			}
			res.send(obj);
		})

	})

	//插入饮食记录
	app.get('/insertDinner', function(req, res) {
		var obj = {
			success: true,
			data: {},
			msg: ""
		}
		var food_id = req.query.food_id || req.params.food_id;
		var dinner_type = req.query.dinner_type || req.params.dinner_type;

		var food_weight = req.query.food_weight || req.params.food_weight;
		var total_calorie = req.query.total_calorie || req.params.total_calorie;
		var user_id = req.query.user_id || req.params.user_id;
		var sql = "insert into  kaka_dinner_info (food_id,dinner_type,food_weight,total_calorie,user_id,create_date) values (" + food_id + ",'" + dinner_type + "','" + food_weight + "','" + total_calorie + "'," + user_id + ",now())";
		connection.query(sql, function(err, results) {

			if(err) {
				console.log(err)
			} else {

				obj.msg = '添加成功';

				res.send(obj);
			}
		})

	})

	//获取食物详情接口
	app.get('/getFoodDetail', function(req, res) {
		var obj = {
			success: true,
			data: {},
			msg: ""
		}
		var food_id = req.query.food_id || req.params.food_id;

		var sql = 'SELECT * FROM kaka_food_info where food_id = ' + food_id;
		connection.query(sql, function(err, results) {

			if(err) {
				console.log(err)
			} else {
				obj.data = results[0];
				obj.data.food_pic = grobalUrl + "foods/" + obj.data.food_pic;
				res.send(obj);
			}
		})

	})

	//获取食物列表接口
	app.get('/getFoodList', function(req, res) {
		var obj = {
			success: true,
			data: {},
			msg: ""
		}
		var page = req.query.page || req.params.page;
		var start = parseInt((page - 1) * 10);
		var sql = 'SELECT COUNT(*) FROM kaka_food_info; SELECT * FROM kaka_food_info  limit ' + start + ',10';
		connection.query(sql, function(err, results) {

			if(err) {
				console.log(err)
			} else {
				// 计算总页数
				var allCount = results[0][0]['COUNT(*)'];
				var allPage = parseInt(allCount) / 10;
				var pageStr = allPage.toString();
				// 不能被整除
				if(pageStr.indexOf('.') > 0) {
					allPage = parseInt(pageStr.split('.')[0]) + 1;
				}
				var List = results[1];
				for(var i in List) {
					List[i].food_pic = grobalUrl + "foods/" + List[i].food_pic;

				}
				res.send({
					msg: '操作成功',
					success: true,
					allCount: allCount,
					currentPage: page,
					data: List
				});
			}
		})

	})
	//饮食模块首页接口
	app.get('/getDinnerInfo', function(req, res) {
		var obj = {
			success: true,
			data: {},
			msg: ""
		}
		var user_id = req.query.user_id || req.params.user_id;
		var sql1 = 'select user_calorie from kaka_user_info where user_id = ' + user_id; //查询用户预算卡路里；
		var sql2 = 'select sum(total_calorie) from kaka_dinner_info  where user_id= ' + user_id + ' and  DATEDIFF(create_date,NOW()) =0 and dinner_type = 0;select * from kaka_dinner_info a left join kaka_food_info b on a.food_id =b.food_id where a.user_id= ' + user_id + ' and  DATEDIFF(create_date,NOW()) =0 and dinner_type = 0'; //查询早餐
		var sql3 = 'select sum(total_calorie) from kaka_dinner_info  where user_id= ' + user_id + ' and  DATEDIFF(create_date,NOW()) =0 and dinner_type = 1;select * from kaka_dinner_info a left join kaka_food_info b on a.food_id =b.food_id where a.user_id= ' + user_id + ' and  DATEDIFF(create_date,NOW()) =0 and dinner_type = 1'; //查询午餐餐
		var sql4 = 'select sum(total_calorie) from kaka_dinner_info  where user_id= ' + user_id + ' and  DATEDIFF(create_date,NOW()) =0 and dinner_type = 2;select * from kaka_dinner_info a left join kaka_food_info b on a.food_id =b.food_id where a.user_id= ' + user_id + ' and  DATEDIFF(create_date,NOW()) =0 and dinner_type = 2'; //查询晚餐

		var sql5 = 'select sum(total_calorie) from kaka_dinner_info  where user_id= ' + user_id + ' and  DATEDIFF(create_date,NOW()) =0 '; //查询用户摄入总得卡路里
		var sql = sql1 + ';' + sql2 + ';' + sql3 + ';' + sql4 + ';' + sql5;
		connection.query(sql, function(error, results, fields) {
			if(error) {
				console.log(err);

			} else if(results) {
				obj.data.user_calorie = results[0][0].user_calorie;
				obj.data.breakfirst_total_calorie = results[1][0]['sum(total_calorie)'];
				obj.data.breakfirst_list = results[2];
				obj.data.luanch_total_calorie = results[3][0]['sum(total_calorie)'];
				obj.data.luanch_list = results[4];
				obj.data.dinner_total_calorie = results[5][0]['sum(total_calorie)'];
				obj.data.dinner_list = results[6];
				obj.data.total_calorie = results[7][0]['sum(total_calorie)'];
				for(var i in obj.data.breakfirst_list) {

					if(obj.data.breakfirst_list[i].food_pic) {
						obj.data.breakfirst_list[i].food_pic = grobalUrl + 'foods/' + obj.data.breakfirst_list[i].food_pic;

					}

				}
				for(var i in obj.data.luanch_list) {
					if(obj.data.luanch_list[i].food_pic) {
						obj.data.luanch_list[i].food_pic = grobalUrl + 'foods/' + obj.data.luanch_list[i].food_pic;
					}
				}
				for(var i in obj.data.dinner_list) {
					if(obj.data.dinner_list[i].food_pic) {
						obj.data.dinner_list[i].food_pic = grobalUrl + 'foods/' + obj.data.dinner_list[i].food_pic;
					}
				}
				res.send(obj);
			}

		})
	})

	//添加评论的接口
	app.get('/setComments', function(req, res) {
		var obj = {
			success: true,
			data: {},
			msg: ""
		}
		var user_id = req.query.user_id || req.params.user_id;
		var parent_id = req.query.parent_id || req.params.parent_id;
		var be_returned_id = req.query.be_returned_id || req.params.be_returned_id;
		var dynamic_id = req.query.dynamic_id || req.params.dynamic_id;
		var comments_details = req.query.comments_details || req.params.comments_details;
		var belong_id = req.query.belong_id || req.params.belong_id;
		var type = req.query.type || req.params.type;

		var sql1 = "insert into kaka_comments_info (dynamic_id,comments_details,user_id,create_date) values (" + dynamic_id + ",'" + comments_details + "'," + user_id + ",now())"; //1:第一类评论
		var sql2 = "insert into kaka_comments_info (dynamic_id,comments_details,parent_id,user_id,belong_id,create_date) values (" + dynamic_id + ",'" + comments_details + "'," + parent_id + "," + user_id + "," + belong_id + ",now())"; //2:第二类评论
		var sql3 = "insert into kaka_comments_info (dynamic_id,comments_details,parent_id,be_returned_id,user_id,belong_id,create_date) values (" + dynamic_id + ",'" + comments_details + "'," + parent_id + "," + be_returned_id + "," + user_id + "," + belong_id + ",now())"; //3:第三类评论
		var sql = type == 1 ? sql1 : (type == 2 ? sql2 : sql3);
		connection.query(sql, function(error, results, fields) {

			if(error) {

				console.log(err);
			} else if(results) {

				obj.success = true;
				obj.msg = "评论成功";

			} else {
				obj.success = false;
				obj.msg = "评论失败";

			}
			res.send(obj);
		})
	})

	//获取评论接口
	app.get('/getComments', function(req, res) {
		var obj = {
			success: true,
			data: {},
			msg: ""
		}
		var dynamic_id = req.query.dynamic_id || req.params.dynamic_id;

		var sql = 'select * from kaka_comments_info a left join kaka_user_info b on a.user_id = b.user_id where belong_id is null and  dynamic_id =' + dynamic_id + ';select a.*,b.user_name as parent_user_name,b.user_id as parent_user_id,c.user_name as returned_user_name ,c.user_id as returned_user_id  from (kaka_comments_info a left join kaka_user_info b on a.parent_id = b.user_id) left join kaka_user_info c on a.be_returned_id = c.user_id where  belong_id is not null and  dynamic_id =' + dynamic_id;

		connection.query(sql, function(error, results, fields) {

			if(error) {
				console.log(err);
			} else {
				//				console.log(results);
				var results0 = results[0];
				var results1 = results[1];
				obj.data = []
				for(var i in results0) {
					var tmp = {};
					tmp.parentComment = results0[i];
					tmp.parentComment.user_pic = grobalUrl + 'avatar/' + tmp.parentComment.user_pic;
					tmp.parentComment.create_date = format(tmp.parentComment.create_date, 1);
					tmp.childComment = [];
					for(var j in results1) {

						if(tmp.parentComment.comments_id == results1[j].belong_id) {

							tmp.childComment.push(results1[j]);

						}
					}
					obj.data.push(tmp);
				}
				res.send(obj);
			}

		})
	})

	//取消收藏，收藏接口
	app.get('/collect', function(req, res) {
		var obj = {
			success: true,
			data: {},
			msg: ""
		}
		var user_id = req.query.user_id || req.params.user_id;
		var dynamic_id = req.query.dynamic_id || req.params.dynamic_id;
		var type = req.query.type || req.params.type; //0表示取消收藏，1表示收藏
		var sql = 'select * from kaka_dynamic_collet where user_id=' + user_id + ' and dynamic_id =' + dynamic_id;
		var sql1;
		connection.query(sql, function(error, results, fields) {

			if(error) {
				console.log(err);
			} else if(results.length == 0) {

				sql1 = 'insert into kaka_dynamic_collet (user_id,dynamic_id) values (' + user_id + ',' + dynamic_id + ');select count(dynamic_id) from kaka_dynamic_collet where dynamic_id=' + dynamic_id;
				obj.msg = "收藏成功";
			} else {
				if(type == 0) {
					sql1 = 'delete from  kaka_dynamic_collet where user_id = ' + user_id + ' and dynamic_id= ' + dynamic_id + ';select count(dynamic_id) from kaka_dynamic_collet where dynamic_id=' + dynamic_id;
					obj.msg = "已取消收藏";
				} else {
					obj.success = false;
					obj.msg = "您已收藏该动态";
					return res.send(obj);
				}
			}
			connection.query(sql1, function(error, results, fields) {
				if(error) {
					console.log(err);
				} else {
					obj.data.collect_num = results[1][0]['count(dynamic_id)'];

					res.send(obj);
				}
			})
		})
	})

	//点赞接口
	app.get('/thumbUp', function(req, res) {
		var obj = {
			success: true,
			data: {},
			msg: ""
		}
		var user_id = req.query.user_id || req.params.user_id;
		var dynamic_id = req.query.dynamic_id || req.params.dynamic_id;
		var type = req.query.type || req.params.type; //0表示取消点赞，1表示点赞
		var sql = type == 1 ? 'update kaka_dynamic_info set be_like_num =be_like_num +1 where dynamic_id=' + dynamic_id + ' and user_id =' + user_id + ';select be_like_num from kaka_dynamic_info where dynamic_id=' + dynamic_id + ' and user_id =' + user_id : 'update kaka_dynamic_info set be_like_num =be_like_num -1 where dynamic_id=' + dynamic_id + ' and user_id =' + user_id + ';select be_like_num from kaka_dynamic_info where dynamic_id=' + dynamic_id + ' and user_id =' + user_id
		connection.query(sql, function(error, results, fields) {
			if(error) {
				console.log(err);
			} else {

				obj.data = results[1][0];
				res.send(obj);

			}
		})
	})

	//动态详情接口
	app.get('/dynamicDetail', function(req, res) {
		var obj = {
			success: true,
			data: {},
			msg: ""
		}
		var user_id = req.query.user_id || req.params.user_id;
		var handle_user_id = req.query.handle_user_id || req.params.handle_user_id;
		var dynamic_id = req.query.dynamic_id || req.params.dynamic_id;
		connection.query('select dynamic_pic from dynamic_pic_info where dynamic_id=' + dynamic_id + ';SELECT * FROM kaka_dynamic_info a left join kaka_user_info b on 	a.user_id = b.user_id  WHERE a.dynamic_id = ' + dynamic_id + ';select count(dynamic_id) from kaka_dynamic_collet where dynamic_id=' + dynamic_id + ';select * from kaka_dynamic_collet where dynamic_id=' + dynamic_id + ' and user_id =' + handle_user_id, function(error, results, fields) {
			if(error) {
				console.log(err);
			} else {

				obj.data.picList = results[0];
				obj.data.dymanicDetail = results[1][0];
				obj.data.collect_num = results[2][0]['count(dynamic_id)'];
				obj.data.has_collect = results[3].length > 0 ? true : false;
				obj.data.dymanicDetail.user_pic = grobalUrl + 'avatar/' + obj.data.dymanicDetail.user_pic;
				obj.data.dymanicDetail.create_date = format(obj.data.dymanicDetail.create_date, 2);
				for(var i in obj.data.picList) {
					obj.data.picList[i].dynamic_pic = grobalUrl + 'dynamic/' + obj.data.picList[i].dynamic_pic;
				}
				res.send(obj);

			}
		})
	})

	//获取动态列表接口
	app.get('/dynamicList', function(req, res) {
		var obj = {
			success: true,
			data: "",
			msg: ""
		}
		var type = req.query.type || req.params.type;//0代表用户的请求，1代表管理后台的请求
		var page = req.query.page || req.params.page;
		var start = parseInt((page - 1) * 15);
		var sql1 = 'SELECT COUNT(*) FROM kaka_dynamic_info ; SELECT * FROM (kaka_dynamic_info a left join kaka_user_info b on a.user_id = b.user_id) left join (select * from  dynamic_pic_info group by dynamic_id) c on a.dynamic_id = c.dynamic_id  limit ' + start + ',15';
		var sql2 = 'SELECT COUNT(*) FROM kaka_dynamic_info where isPrvite="0"; SELECT * FROM (kaka_dynamic_info a left join kaka_user_info b on a.user_id = b.user_id) left join (select * from  dynamic_pic_info group by dynamic_id) c on a.dynamic_id = c.dynamic_id where a.isPrvite="0" limit ' + start + ',15';
		var sql = type==1?sql1:sql2
		connection.query(sql, function(err, results) {

			if(err) {
				console.log(err)
			} else {
				// 计算总页数
				var allCount = results[0][0]['COUNT(*)'];
				var allPage = parseInt(allCount) / 15;
				var pageStr = allPage.toString();
				// 不能被整除
				if(pageStr.indexOf('.') > 0) {
					allPage = parseInt(pageStr.split('.')[0]) + 1;
				}
				var List = results[1];
				for(var i in List) {
					List[i].dynamic_pic = grobalUrl + "dynamic/" + List[i].dynamic_pic;
					List[i].user_pic = grobalUrl + 'avatar/' + List[i].user_pic;
				}
				res.send({
					msg: '操作成功',
					success: true,
					allCount: allCount,
					currentPage: page,
					data: List
				});
			}
		})

	})

	//获取短信验证码接口
	app.get('/VerificationCode', function(req, res) {
		var code = Math.floor((Math.random() * 999999) + 111111);
		var user_id = 1;
		var postData = {
			mobile: '18826107953',
			message: '验证码:' + code + '【铁壳测试】'
		};

		var content = querystring.stringify(postData);

		var options = {
			host: 'sms-api.luosimao.com',
			path: '/v1/send.json',
			method: 'POST',
			auth: 'api:key-553828aa4f6e5ed3a68e897c6a0060df',
			agent: false,
			rejectUnauthorized: false,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': content.length
			}
		};

		var req = https.request(options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function(chunk) {
				console.log(JSON.parse(chunk));
				if(JSON.parse(chunk).error == 0) {
					connection.query('insert into kaka_code (verification_code,user_id) values (' + code + ',' + user_id + ') ', function(error, results, fields) {
						if(error) {
							console.log(err);
						}
					})
				}
			});
			res.on('end', function() {
				console.log('over');
			});
		});

		req.write(content);
		req.end();
	});

	//注册接口
	app.post('/register', function(req, res) {
		var user_phone = req.body.user_phone;
		var user_password = req.body.user_password;
		var obj = {
			success: true,
			data: "",
			msg: ""
		}
		connection.query('SELECT * from kaka_user_info where user_phone=' + user_phone, function(error, results, fields) {
			console.log(results[0]);
			if(results[0]) {
				obj.success = false;
				obj.msg = "该用已存在！";
				return res.send(obj);
			} else {
				var user_name = "用户" + Math.floor(Math.random() * 100000);
				var user_pic = 'default.jpg';
				connection.query("insert into kaka_user_info (user_phone,user_password,user_pic,user_name,user_sex,user_age,user_weight,user_height,user_finalweight,user_calorie,user_target,user_birth_date) values (" + user_phone + "," + user_password + ",'" + user_pic + "','" + user_name + "',0,0,60,150,60,700,0,now())", function(error, results, fields) {
					console.log(results);
					if(results) {
						obj.msg = "注册成功！";
						res.send(obj);
					} else {
						console.log(err);
					}
				})
			}

		})

	});

	//登录接口
	app.post('/login', function(req, res) {

		var user_phone = req.body.user_phone;
		var user_password = req.body.user_password;

		connection.query('SELECT * from kaka_user_info where user_phone=' + user_phone + ' and user_password=' + user_password, function(error, results, fields) {
			var obj = {
				success: true,
				data: ""
			}
			if(error) console.log(err);
			if(results[0]) {
				obj.data = results[0];
				obj.data.user_pic = grobalUrl + "avatar/" + results[0].user_pic;
				obj.data.user_birth_date = results[0].user_birth_date ? format(results[0].user_birth_date, 1) : "";
				obj.data.user_final_time = results[0].user_final_time ? format(results[0].user_final_time, 1) : "";

			} else if(results.length == 0) {
				obj.success = false;

			}
			res.send(obj);
		});

	});

	//更换头像图片接口
	app.post('/upload', function(req, res) {
		var user_id = req.body.user_id;
		if(req.body.imgData) {
			var avatar = req.body.imgData.replace(/^data:image\/\w+;base64,/, '');
			newBuff = new Buffer(avatar, 'base64');
			var AVATAR_UPLOAD_FOLDER = '/avatar/'
			var avatarName = Math.random() + '.jpg';
			var domain = "http://" + req.headers.host;
			var newPath = './public' + AVATAR_UPLOAD_FOLDER + avatarName;
			var showUrl = domain + AVATAR_UPLOAD_FOLDER + avatarName;
			//更换头像前，查询是否有图片，做删除操作
			connection.query("select user_pic from kaka_user_info where user_id =" + user_id, function(error, results, fields) {
				console.log(results[0].user_pic)

				if(results[0].user_pic && results[0].user_pic != "default.jpg") {

					fs.unlink('./public/avatar/' + results[0].user_pic, function(err) {
						if(err) console.log(err);

					})
				}

			});
			//更换头像,写入内存
			fs.writeFile(newPath, newBuff, 'binary', function(err) {
				if(err) {
					console.log(500)
					return res.send({
						"msg": '未知错误'
					});
				}
				connection.query("UPDATE kaka_user_info SET user_pic='" + avatarName + "' where user_id = " + user_id, function(error, results, fields) {
					var obj = {
						success: true,
						msg: "",
						picPath: ""
					}
					if(error) console.log(err);
					if(results) {
						obj.msg = "修改成功！"
						obj.picPath = showUrl;
					} else {
						obj.success = false;
						obj.msg = "修改失败！"
					}
					res.send(obj);
				});
			});
		} else {
			res.send({
				"msg": '未上传图片'
			});
		}

	})

	//接口首页
	app.get('/', function(req, res) {
		var jsonName = './public/jsonfile/ajaxapilist.json';
		var read = new Promise(function(resolve, reject) {
			resolve(fs.readFileSync(jsonName))
		});
		read.then(function(response) {
			response = JSON.parse(response);
			if(response.dataList) {
				res.render('index', {
					haveList: true,
					list: response.dataList
				})
			} else {
				res.render('index', {
					haveList: false,
					list: []
				})
			}
		}).catch(function(response) {
			res.render('index', {
				haveList: false,
				list: []
			})
		})
	})

}