module.exports = function(app, mongoose) {

  var questionAnswerSchema = mongoose.Schema({ 
    "_id" : {type : Number},
    "questions" : {type: String},
	  "answer": [{
		 "answerId" : {type: Number},
		 "answerString" : {type: String}
	  }],
    "correctAnswer" : {type : Number},
    "available" : {type : Boolean, default : false}
  });

  var questionanswers = mongoose.model('questionanswers', questionAnswerSchema);
  app.schema.questionanswers = questionanswers;
};

