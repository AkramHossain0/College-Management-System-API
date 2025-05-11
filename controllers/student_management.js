import StudentManagement from "../model/student_management.js";

const newStudent = async (req, res) => {
    try {
        const {
            student_id, name, email, phone, dob, gender, nationality, religion, blood_group,
            student_nid, student_birth_certificate, student_address, student_image, admission_date,
            session, department, roll_number, board_roll, board_registration_no, father_name,
            father_nid, father_phone, mother_name, mother_nid, mother_phone, guardian_name,
            guardian_nid, guardian_phone, guardian_relation, emergency_contact
        } = req.body;

        if (!student_id || !name || !email || !phone || !dob || !gender || !nationality || !student_nid ||
            !student_birth_certificate || !student_address || !student_image || !admission_date || !session ||
            !department || !roll_number || !board_roll || !board_registration_no || !father_name || !father_nid ||
            !father_phone || !mother_name || !mother_nid || !mother_phone || !guardian_name || !guardian_nid ||
            !guardian_phone || !guardian_relation || !emergency_contact) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ message: "Invalid phone number format" });
        }

        if (typeof emergency_contact !== 'object' || !emergency_contact.name || !emergency_contact.phone || !emergency_contact.relation) {
            return res.status(400).json({ message: "Invalid emergency contact details" });
        }

        const existingStudent = await StudentManagement.findOne({ $or: [{ student_id }, { email }] });
        if (existingStudent) {
            return res.status(400).json({
                message: `Student with ${existingStudent.student_id === student_id ? 'Student ID' : 'Email'} already exists`
            });
        }

        const newStudent = new StudentManagement({
            student_id: student_id.trim(),
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            dob,
            gender,
            nationality: nationality.trim(),
            religion: religion ? religion.trim() : undefined,
            blood_group: blood_group ? blood_group.trim() : undefined,
            student_nid: student_nid.trim(),
            student_birth_certificate: student_birth_certificate.trim(),
            student_address: student_address.trim(),
            student_image: student_image.trim(),
            admission_date,
            session: session.trim(),
            department: department.trim(),
            roll_number: roll_number.trim(),
            board_roll: board_roll.trim(),
            board_registration_no: board_registration_no.trim(),
            father_name: father_name.trim(),
            father_nid: father_nid.trim(),
            father_phone: father_phone.trim(),
            mother_name: mother_name.trim(),
            mother_nid: mother_nid.trim(),
            mother_phone: mother_phone.trim(),
            guardian_name: guardian_name.trim(),
            guardian_nid: guardian_nid.trim(),
            guardian_phone: guardian_phone.trim(),
            guardian_relation: guardian_relation.trim(),
            emergency_contact
        });

        await newStudent.save();
        return res.status(201).json({ message: "Student added successfully", student: newStudent });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

const getStudent = async (req, res) => {
    try {
        const students = await StudentManagement.find();
        return res.status(200).json({ students });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const existingStudent = await StudentManagement.findOne({ student_id: id });
        if (!existingStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        if (updates.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(updates.email)) {
                return res.status(400).json({ message: "Invalid email format" });
            }

            const emailExists = await StudentManagement.findOne({ email: updates.email, student_id: { $ne: id } });
            if (emailExists) {
                return res.status(400).json({ message: "Email is already in use" });
            }
        }

        if (updates.phone) {
            const phoneRegex = /^[0-9]{10,15}$/;
            if (!phoneRegex.test(updates.phone)) {
                return res.status(400).json({ message: "Invalid phone number format" });
            }
        }

        if (updates.emergency_contact) {
            if (typeof updates.emergency_contact !== 'object' || !updates.emergency_contact.name ||
                !updates.emergency_contact.phone || !updates.emergency_contact.relation) {
                return res.status(400).json({ message: "Invalid emergency contact details" });
            }
        }

        for (let key in updates) {
            if (typeof updates[key] === 'string') {
                updates[key] = updates[key].trim();
            }
        }

        const updatedStudent = await StudentManagement.findOneAndUpdate(
            { student_id: id },
            { $set: updates },
            { new: true, runValidators: true }
        );

        return res.status(200).json({ message: "Student updated successfully", student: updatedStudent });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const existingStudent = await StudentManagement.findOne({ student_id: id });
        if (!existingStudent) {
            console.log(`Student with ID: ${id} not found`);
            return res.status(404).json({ message: "Student not found" });
        }
        await StudentManagement.deleteOne({ student_id: id });
        return res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        console.error(`Error deleting student with ID: ${id}`, error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export { newStudent, getStudent, updateStudent, deleteStudent };