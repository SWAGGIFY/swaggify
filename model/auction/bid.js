const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Bid = mongoose.Schema({
	userid: {
		type: ObjectId
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

module.exports = mongoose.model('Bid', Bid);
