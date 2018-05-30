exports = module.exports = function (app, mongoose) {

	// Schemas
	require('./schemas/userSchema')(app, mongoose);
	require('./schemas/questionAnswerSchema')(app, mongoose);
};