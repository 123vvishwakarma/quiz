// Function to insert document 
exports.createDocument = function (toSaveDoc, collection, app, callback) {
	var newDoc = new collection(toSaveDoc);
	newDoc.save(function (err, doc) {
		if (err) {
			callback(err, "");
		} else {
			callback("", doc);
		}
	});
};

// Function to get document
exports.getOneDoc = function (query, collection, selection, populateDoc, app, callback) {
	collection.findOne(query, selection).populate(populateDoc).exec(function (err, doc) {
		if (err) {
			callback(err, "");
		} else {
			callback("", doc);
		}
	});
};

// Function to update document
exports.updateDocument = function (query, toUpdateDoc, collection, options, populateDoc, app, callback) {
	options.new = true;
	collection.findOneAndUpdate(query, toUpdateDoc, options).populate(populateDoc).exec(function (err, doc) {
		if (err) {
			callback(err, "");
		} else {
			callback("", doc);
		}
	});
};

// Function to get all document
exports.getAll = function (query, collection, selection, app, callback) {
	collection.find(query, selection).sort({dateTime: -1}).exec(function (err, doc) {
		if (err) {
			callback(err, "");
		} else {
			callback("", doc);
		}
	});
};

// Function to get data as aggregate function & group by & sort
exports.getAllDocsbyGroup = function (query, collection, app, callback) {
	collection.aggregate(query, function (err, doc) {
		if (err) {
			callback(err, "");
		} else {
			callback("", doc);
		}
	});
};

//  Function to get Data using sort and limit
exports.getAllSort = function (query, collection, selection, populateDoc, sorting, app, callback) {
	collection.find(query, selection).populate(populateDoc).sort(sorting).lean().exec(function (err, doc) {
		if (err) {
			callback(err, "");
		} else {
			callback("", doc);
		}
	});
};
