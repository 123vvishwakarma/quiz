module.exports = function (app) {    
    //Get api
    app.get('/user/playerList', require('../adecco/apis/userApis').playerList);
    app.get('/user/questionList', require('../adecco/apis/userApis').questionList);
    app.get('/user/leaderBoard', require('../adecco/apis/userApis').leaderBoard);

    //Post api
    app.post('/user/login', require('../adecco/apis/userApis').login);
    app.post('/user/userActive', require('../adecco/apis/userApis').userActive);
    app.post('/user/userInactive', require('../adecco/apis/userApis').userInactive);
    app.post('/user/endQuize', require('../adecco/apis/userApis').endQuize);
    app.post('/user/correctAnswer', require('../adecco/apis/userApis').correctAnswer);
};