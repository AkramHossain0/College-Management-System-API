import Attendance from "../model/attendance.js";

const addAttendance = async (req, res) => {
    try {
        const { studentId, name, date, attendance, day } = req.body;

        if (!studentId || !name || !date || !attendance || !day) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newAttendance = new Attendance({ studentId, name, date, attendance, day });
        await newAttendance.save();

        res.status(201).json({
            message: "Attendance added successfully",
            data: newAttendance,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while adding attendance",
            error: error.message,
        });
    }
};

const getAllAttendance = async (req, res) => {
    try {
        const attendanceRecords = await Attendance.find();
        res.status(200).json(attendanceRecords);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching attendance records", error: error.message });
    }
};

const getAttendanceByStudentId = async (req, res) => {
    const { studentId } = req.params;
    try {
        const attendanceRecords = await Attendance.find({ studentId });
        if (attendanceRecords.length === 0) {
            return res.status(404).json({ message: "No attendance found for this student" });
        }
        res.status(200).json(attendanceRecords);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching attendance records", error: error.message });
    }
};

const getAttendanceByDate = async (req, res) => {
    const { date } = req.params;
    try {
        const attendanceRecords = await Attendance.find({ date: new Date(date) });
        if (attendanceRecords.length === 0) {
            return res.status(404).json({ message: "No attendance found for this date" });
        }
        res.status(200).json(attendanceRecords);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching attendance records", error: error.message });
    }
};

const updateAttendance = async (req, res) => {
    const { id } = req.params;
    const { attendance, day } = req.body;

    try {
        const updatedAttendance = await Attendance.findByIdAndUpdate(id, { attendance, day }, { new: true });
        if (!updatedAttendance) {
            return res.status(404).json({ message: "Attendance record not found" });
        }
        res.status(200).json({ message: "Attendance updated successfully", data: updatedAttendance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating attendance record", error: error.message });
    }
};

const deleteAttendance = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedAttendance = await Attendance.findByIdAndDelete(id);
        if (!deletedAttendance) {
            return res.status(404).json({ message: "Attendance record not found" });
        }
        res.status(200).json({ message: "Attendance deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting attendance record", error: error.message });
    }
};

export {
    addAttendance,
    getAllAttendance,
    getAttendanceByStudentId,
    getAttendanceByDate,
    updateAttendance,
    deleteAttendance
};
