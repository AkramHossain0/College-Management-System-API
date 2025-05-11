import mongoose from "mongoose";

const teacherAuthSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    number: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        enum: [true, false],
        default: false
    },
    profileImage: {
        type: String,
        required: true,
    }
});

const TeacherAuth = mongoose.model("TeacherAuth", teacherAuthSchema);

export default TeacherAuth;