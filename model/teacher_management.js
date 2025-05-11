import mongoose from 'mongoose';

const teacherManagementSchema = new mongoose.Schema({
    employee_id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
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
    salary: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    emergency_contact: {
        name: String,
        relation: String,
        phone: String
    },
    blood_group: {
        type: String
    },
    nationality: {
        type: String,
        required: true
    },
    joining_date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Leave'],
        default: 'Active',
        required: true
    },
    image: {
        type: String,
        required: true
    },
});

const TeacherManagement = mongoose.model('TeacherManagement', teacherManagementSchema);

export default TeacherManagement;
