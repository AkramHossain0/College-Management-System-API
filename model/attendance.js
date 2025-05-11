import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    studentId: {type: String, required: true},
    name: {type: String, required: true},
    date: {type: Date, required: true},
    attendance: {type: String, required: true},
    day: {type: String, required: true},
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;