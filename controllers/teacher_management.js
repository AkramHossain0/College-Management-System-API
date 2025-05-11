import TeacherManagement from "../model/teacher_management.js";

const addTeacher = async (req, res) => {
    try {
        const {
            employee_id, name, email, phone, gender, dob, qualification, experience,
            designation, department, salary, address, emergency_contact,
            blood_group, nationality, joining_date, image
        } = req.body;

        if (!employee_id || !name || !email || !phone || !gender || !dob || !qualification || !experience ||
            !designation || !department || !salary || !address || !emergency_contact ||
            !blood_group || !nationality || !joining_date || !image) {
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

        const existingTeacher = await TeacherManagement.findOne({ $or: [{ employee_id }, { email }] });
        if (existingTeacher) {
            return res.status(400).json({
                message: `Teacher with ${existingTeacher.employee_id === employee_id ? 'Employee ID' : 'Email'} already exists`
            });
        }

        const newTeacher = new TeacherManagement({
            employee_id: employee_id.trim(),
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            gender,
            dob,
            qualification: qualification.trim(),
            experience,
            designation: designation.trim(),
            department: department.trim(),
            salary,
            address: address.trim(),
            emergency_contact,
            blood_group: blood_group.trim(),
            nationality: nationality.trim(),
            joining_date,
            status: 'Active',
            image
        });

        await newTeacher.save();
        return res.status(201).json({ message: "Teacher added successfully", teacher: newTeacher });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

const updateTeacher = async (req, res) => {
    try {
        const { id } = req.params; 
        const updates = req.body;

        const existingTeacher = await TeacherManagement.findOne({ employee_id: id });
        if (!existingTeacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        if (updates.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(updates.email)) {
                return res.status(400).json({ message: "Invalid email format" });
            }

            const emailExists = await TeacherManagement.findOne({ email: updates.email, employee_id: { $ne: id } });
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

        const updatedTeacher = await TeacherManagement.findOneAndUpdate(
            { employee_id: id },
            { $set: updates },
            { new: true, runValidators: true }
        );

        return res.status(200).json({ message: "Teacher updated successfully", teacher: updatedTeacher });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

const deleteTeacher = async (req, res) => {

    try{
        const { id } = req.params;
        const existingTeacher = await TeacherManagement.findOne({ employee_id: id });
        if (!existingTeacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        await TeacherManagement.deleteOne({ employee_id: id });
        return res.status(200).json({ message: "Teacher deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

const getTeacher = async (req, res) => {
    try {
        const teachers = await TeacherManagement.find();
        return res.status(200).json({ teachers });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

export { addTeacher, updateTeacher, deleteTeacher, getTeacher };