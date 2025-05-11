import mongoose from "mongoose";

const studentAuthSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    number: {
        type: Number,
        required: true,
    },
    id: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        enum: [true, false],
        default: false,
    },
    name: {
        type: String,
        required: true,
    },
    session: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        required: true,
    }
});


const StudentAuth = mongoose.model('StudentAuth', studentAuthSchema);

export default StudentAuth;