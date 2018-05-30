module.exports = { 
	MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/adecco',
	TOKEN_SECRET: process.env.TOKEN_SECRET || 'YOUR_UNIQUE_JWT_TOKEN_SECRET',
};