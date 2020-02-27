const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Autobid = mongoose.Schema({
	userid: {
		type: ObjectId
	},
	email: {
		type: String
	},
	value: {
		type: Number,
		min: 0
	},
	blocked: {
		type: Boolean,
		default: false
	}
}, { timestamps: true });

module.exports = mongoose.model('Autobid', Autobid);
