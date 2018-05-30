module.exports = function(app, mongoose) {

  var userSchema = mongoose.Schema({
  	"_id" : {type : Number},
    "name" : {type : String, default : ''},
    "phoneNumber" : {type : String, unique: true},
    "password" : {type : String},
    "salt" : {type : String},
    "scorePoint" : {type : Number, default : 0},
    "roles" : {type : Number, default : 2}, // roles -> 1 - supervisor , 2 - player
    "assignQuestion" : [{
      "_id" : {type : Number},
      "questions" : {type: String},
      "answer": [{
        "answerId" : {type: Number},
        "answerString" : {type: String}
      }],
      "correctAnswer" : {type : Number},
      "available" : {type : Boolean, default : false}
    }],
    "assignAnswer" : [{
      "questionId" : {type : Number},
    	"answerId" : {type : Number},
    	"correctAnswer" : {type : Boolean}
    }],
    "dateTime" : Date,
    "startQuize" : {type : Boolean, default : false},
    "activeStatus" : {type : Boolean, default : true}
  });

  var users = mongoose.model('users', userSchema);
  app.schema.users = users;
};