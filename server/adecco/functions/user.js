var moment = require('moment');
var jwt = require('jwt-simple');

exports.randomJwt = function createJWT(user, app) {
	user.exp = moment().add(14, 'days').unix();
	user.createdTime = moment().unix();
	return jwt.encode(user, app.config.TOKEN_SECRET);
};

exports.updatePlayerFunc = function(playerId, toUpdateDoc, app, callback) {
	console.log("toUpdateDoc : ",toUpdateDoc);
	let collection = app.schema.users, options = {}, selection = {}, populateDoc = "";
	let query = {
		"_id" : playerId
	}
	app.crud.updateDocument(query, toUpdateDoc, collection, options, populateDoc, app, function (err, resData) {
		if (err) {
			callback("Error occured", "");
		} else {
			callback("", "success");
		}
	});
}