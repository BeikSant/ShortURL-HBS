const mongoose = require('mongoose');
const { Schema } = mongoose

const forgoutSchema = new Schema({
    token: {
        type: 'string',
        unique: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    state: {
        type: Boolean,
        required: true,
        default: true,
    }

})

const Forgout = mongoose.model('Forgout', forgoutSchema);
module.exports = Forgout;