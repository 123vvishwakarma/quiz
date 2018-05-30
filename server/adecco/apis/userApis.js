var crypto = require('crypto');
var events = require('events');

exports.login = function (req, res) {
	function checkPhoneExist() {
		return new Promise(function(resolve, reject) {
			let userCollection = req.app.schema.users, selection = {}, populateDoc = "";
			let query = {
				"phoneNumber": req.body.phoneNumber
			};
			req.app.crud.getOneDoc(query, userCollection, selection, populateDoc, req.app, function (err, resultData) {
				if (err) {
					reject("Error occured");
				} else if (resultData) {
					console.log("resultData 345: ",resultData);
					if (resultData.activeStatus == true || resultData.activeStatus == "true") {
						resolve(resultData);
					} else {
						reject("User is inactive");
					}
				} else {
					console.log("resultData : ",resultData);
					reject("No record found");
				}
			});
		});
	}

 	let existance = checkPhoneExist();
	existance.then(function(result) {
		console.log("result : ",result);
		let temp = result.salt, responseData = {};
		let hash_db = result.password;
		let newpass = temp + req.body.password;
		let hashed_password = crypto.createHash('sha512').update(newpass).digest("hex");
		if (hash_db == hashed_password) {
			let randomJwtData = {}
			randomJwtData.id = result._id;
			randomJwtData.phoneNumber = result.phoneNumber;
			randomJwtData.email = "vvishwakarma123@gmail.com";
			randomJwtData.role = result.roles;
			let token = "Bearer" + " " + req.app.user.randomJwt(randomJwtData, req.app);
			responseData.token = token;
			responseData.name = result.name;
			responseData._id = result._id;
			responseData.scorePoint = result.scorePoint;
			responseData.dateTime = result.dateTime;
			responseData.startQuize = result.startQuize;
			responseData.roles = result.roles;
			responseData.phoneNumber = result.phoneNumber;
			res.status(200).json({
				message: "success",
				data: responseData,
				res: true
			});
		} else {
			res.status(500).json({
				message: "Invalid Password",
				data: {},
				res: false
			});
		}
	}, function(err) {
        res.status(500).json({
			message: err,
			data: {},
			res: false
		});
    });
}

exports.playerList = function(req, res) {
	async function playerList() {
		console.log("inside");
		let userCollection = req.app.schema.users, selection = {};
		let query = {
			"roles": 2
		};
		await req.app.crud.getAll(query, userCollection, selection, req.app, function (err, resultData) {
			if (err) {
				res.status(500).json({
					message: "Error occured",
					data: {},
					res: false
				});
			} else if (resultData.length > 0) {
				res.status(200).json({
					message: "success",
					data: resultData,
					res: true
				});
			} else {
				res.status(500).json({
					message: "No record found",
					data: {},
					res: false
				});
			}
		});
	}

	playerList();

}

exports.questionList = function(req, res) {
	let eventEmitter = new events.EventEmitter();
	let query = [
			{
				$match: {
					available : false
				}
			},
			{
				$sample : {
					size : 5
				}
			}
		];
	let collection = req.app.schema.questionanswers;

	eventEmitter.on('checkUserActive', function(playerId) {
		let userCollection = req.app.schema.users, selection = {}, populateDoc = "";
		let query = {
			"_id": playerId
		};
		req.app.crud.getOneDoc(query, userCollection, selection, populateDoc, req.app, function (err, resultData) {
			if (err) {
				res.status(500).json({
					message: "Error occured",
					data: {},
					res: false
				});
			} else if (resultData) {
				if (resultData.activeStatus == true || resultData.activeStatus == "true") {
					eventEmitter.emit('getQuestionList', playerId);
				} else {
					res.status(500).json({
						message: "User can not give quize for now.",
						data: {},
						res: false
					});
				}
			} else {
				console.log("inside");
				res.status(500).json({
					message: "No record found",
					data: {},
					res: false
				});
			}
		});
	});
	eventEmitter.on('getQuestionList', function(playerId) {
		req.app.crud.getAllDocsbyGroup(query, collection, req.app, function (err, questionList) {
			if (err) {
				res.status(500).json({
					message: "Error occured",
					data: {},
					res: false
				});
			} else if (questionList.length > 0) {
				res.status(200).json({
					message: "success",
					data: questionList,
					res: true
				});
				eventEmitter.emit('updatePlayer', playerId, questionList);
			} else {
				res.status(500).json({
					message: "Quize ended!",
					data: {},
					res: false
				});
			}
		});
	});

	eventEmitter.on('updatePlayer', function(playerId, questionList) {
		let toUpdateDoc = {
			$set : {
				"startQuize" : true,
				"assignQuestion" : questionList
			}
		}
		req.app.user.updatePlayerFunc(playerId, toUpdateDoc, req.app, function(err, response) {
			if (err) {
				console.log("Error in Updating users collection", err);
			} else {
				console.log("update user collection");
			}
		});
	});

	eventEmitter.emit('checkUserActive', req.query.playerId);
}


exports.userActive = function(req, res) {
	let toUpdateDoc = {
		$set : {
			"activeStatus" : true
		}
	}
	req.app.user.updatePlayerFunc(req.body.playerId, toUpdateDoc, req.app, function(err, response) {
		if (err) {
			res.status(500).json({
				message: err,
				data: {},
				res: false
			});
		} else {
			res.status(200).json({
				message: response,
				data: {},
				res: true
			});
		}
	});
}

exports.userInactive = function(req, res) {
	let toUpdateDoc = {
		$set : {
			"activeStatus" : false
		}
	}
	req.app.user.updatePlayerFunc(req.body.playerId, toUpdateDoc, req.app, function(err, response) {
		if (err) {
			res.status(500).json({
				message: err,
				data: {},
				res: false
			});
		} else {
			res.status(200).json({
				message: response,
				data: {},
				res: true
			});
		}
	});
}

exports.leaderBoard = function(req, res) {
	let query = {
		"roles" : 2
	}, selection = {}, populateDoc = "";
	let sort = ({
		scorePoint: -1
	}); 
	let collection = req.app.schema.users;
	req.app.crud.getAllSort(query, collection, selection, populateDoc, sort, req.app, function(err, response) {
		if (err) {
			res.status(500).json({
				message: "Error occured",
				data: {},
				res: false
			});
		} else {
			res.status(200).json({
				message: "success",
				data: response,
				res: true
			});
		}
	});
}

exports.endQuize = function(req, res) {
	let toUpdateDoc = {
		$set : {
			"startQuize" : false,
			"activeStatus" : false
		}
	}
	req.app.user.updatePlayerFunc(req.body.playerId, toUpdateDoc, req.app, function(err, response) {
		if (err) {
			res.status(500).json({
				message: err,
				data: {},
				res: false
			});
		} else {
			res.status(200).json({
				message: response,
				data: {},
				res: true
			});
		}
	});
}

exports.correctAnswer = function(req, res) {
	let eventEmitter = new events.EventEmitter();
	eventEmitter.on('getUserInfo', function(clientOptions) {
		let userCollection = req.app.schema.users, selection = {}, populateDoc = "";
		let query = {
			"_id": clientOptions.playerId
		};
		req.app.crud.getOneDoc(query, userCollection, selection, populateDoc, req.app, function (err, resultData) {
			if (err) {
				res.status(500).json({
					message: "Error occured",
					data: {},
					res: false
				});
			} else if (resultData) {
				clientOptions.resultData = resultData;
				eventEmitter.emit('checkAnswer', clientOptions);
			} else {
				res.status(500).json({
					message: "No record found",
					data: {},
					res: false
				});
			}
		});
	});

	eventEmitter.on('checkAnswer', function(clientOptions) {
		let userCollection = req.app.schema.questionanswers, selection = {}, populateDoc = "";
		let query = {
			"_id": clientOptions.questionId,
			"correctAnswer" : clientOptions.answerId
		};
		req.app.crud.getOneDoc(query, userCollection, selection, populateDoc, req.app, function (err, resultData) {
			if (err) {
				res.status(500).json({
					message: "Error occured",
					data: {},
					res: false
				});
			} else if (resultData) {
				let scorePoint = parseInt(clientOptions.resultData.scorePoint) + 2;
				console.log("scorePoint : ",scorePoint);
				clientOptions.score = scorePoint;
				clientOptions.correctAnswer = true;
				eventEmitter.emit('updateUserInfo', clientOptions);
			} else {
				let scorePoint = parseInt(clientOptions.resultData.scorePoint) - 1;
				clientOptions.score = scorePoint;
				clientOptions.correctAnswer = false;
				eventEmitter.emit('updateUserInfo', clientOptions);
			}
		});
	});

	eventEmitter.on('updateUserInfo', function(clientOptions) {
		console.log("clientOptions : ",clientOptions);
		let toUpdateDoc = {
			$set : {
				"scorePoint" : clientOptions.score
			},
			$push : {"assignAnswer" : {"questionId" : clientOptions.questionId, "answerId" : clientOptions.answerId, "correctAnswer" : clientOptions.correctAnswer}}
		}
		req.app.user.updatePlayerFunc(clientOptions.playerId, toUpdateDoc, req.app, function(err, response) {
			if (err) {
				res.status(500).json({
					message: err,
					data: {},
					res: false
				});
			} else {
				res.status(200).json({
					message: response,
					data: {},
					res: true
				});
			}
		});
	});
	eventEmitter.emit('getUserInfo', req.body);
}