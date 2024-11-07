import mongoose from 'mongoose';

const usersSchema = new mongoose.Schema({
    firstname:{
        type: String
    },
    lastname:{
        type: String
    },
    about:{
        type: String
    },
    profile_picture:{
        type: String
    },
    username: {
        type: String,
        unique: true,
        required: [true, "Username is required"], 
    },
    password: {
        type: String,
        min: [8,"Password must be 8 characters"],
        required: true
    },
    dateofbirth: {
        type: Date,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
    },
    provider_name: {
        type: String,
        required: false
    },
    provider_id: {
        type: String,
        required: false
    }
});
export default mongoose.model('users',usersSchema);