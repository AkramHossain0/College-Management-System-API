import mongoose from "mongoose";

const studentManagementSchema = new mongoose.Schema({
    student_id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true,
    },
    nationality: {
        type: String,
        required: true,
    },
    religion: {
        type: String,
    },
    blood_group: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    },
    student_nid: {
        type: String,
        required: true,
    },
    student_birth_certificate: {
        type: String,
        required: true,
    },
    student_address: {
        type: String,
        required: true,
    },
    student_image: {
        type: String,
        required: true,
    },
    admission_date: {
        type: Date,
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
    roll_number: {
        type: String,
        required: true,
        unique: true,
    },
    board_roll: {
        type: String,
        required: true,
    },
    board_registration_no: {
        type: String,
        required: true,
    },
    father_name: {
        type: String,
        required: true,
    },
    father_nid: {
        type: String,
        required: true,
    },
    father_phone: {
        type: String,
        required: true,
    },
    mother_name: {
        type: String,
        required: true,
    },
    mother_nid: {
        type: String,
        required: true,
    },
    mother_phone: {
        type: String,
        required: true,
    },
    guardian_name: {
        type: String,
        required: true,
    },
    guardian_nid: {
        type: String,
        required: true,
    },
    guardian_phone: {
        type: String,
        required: true,
    },
    guardian_relation: {
        type: String,
        required: true,
    },
    emergency_contact: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        relation: { type: String, required: true },
    },
    status: {
        type: String,
        enum: ["Active", "Inactive", "Graduated", "Suspended"],
        default: "Active",
    },
}, {timestamps: true,});

const StudentManagement = mongoose.model("student_management", studentManagementSchema);

export default StudentManagement;
