import TeacherManagement from '../model/teacher_management.js';
import StudentManagement from '../model/student_management.js';
import Attendance from '../model/attendance.js';

const getDashboardData = async (req, res) => {
    try {
        const totalTeachers = await TeacherManagement.countDocuments();
        const totalStudents = await StudentManagement.countDocuments();
        const todayAttendance = await Attendance.countDocuments({ date: new Date().toISOString().split('T')[0] });
        const totalActiveStudents = await StudentManagement.countDocuments({ status: "Active" });
        const totalInactiveStudents = await StudentManagement.countDocuments({ status: "Inactive" });
        const totalGraduatedStudents = await StudentManagement.countDocuments({ status: "Graduated" });
        const totalSuspendedStudents = await StudentManagement.countDocuments({ status: "Suspended" });
        const totalTeachersOnLeave = await TeacherManagement.countDocuments({ status: "Leave" });
        const totalTeachersActive = await TeacherManagement.countDocuments({ status: "Active" });
        const totalTeachersInactive = await TeacherManagement.countDocuments({ status: "Inactive" });
        const totalStudentsCST = await StudentManagement.countDocuments({ department: "CST" });
        const totalStudentsET = await StudentManagement.countDocuments({ department: "ET" });
        const totalStudentsCT = await StudentManagement.countDocuments({ department: "CT" });
        const totalStudentsMT = await StudentManagement.countDocuments({ department: "MT" });
        
        res.status(200).json({
            totalTeachers,
            totalStudents,
            todayAttendance,
            studentStatus: {
                active: totalActiveStudents,
                inactive: totalInactiveStudents,
                graduated: totalGraduatedStudents,
                suspended: totalSuspendedStudents
            },
            teacherStatus: {
                active: totalTeachersActive,
                inactive: totalTeachersInactive,
                onLeave: totalTeachersOnLeave
            },
            departmentDistribution: {
                CST: totalStudentsCST,
                ET: totalStudentsET,
                CT: totalStudentsCT,
                MT: totalStudentsMT
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching dashboard data", error: error.message });
    }
}

export { getDashboardData };