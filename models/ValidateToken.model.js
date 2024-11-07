import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const validateTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    token: [{
        type: String,
        required: false
    }],
}, { timestamps: true });

export default model('token', validateTokenSchema);