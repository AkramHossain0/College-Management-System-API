import Result from "../model/result.js";

const addResult = async (req, res) => {
    try {
        const { studentId, name, department, session, results } = req.body;
        
        if (!studentId || !name || !department || !session || !results || !results.length) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        let existingResult = await Result.findOne({ studentId });
        
        if (existingResult) {
            existingResult.results.push(...results);
            await existingResult.save();
            
            return res.status(200).json({ 
                success: true,
                message: "Results added successfully",
                data: existingResult
            });
        } else {
            const newResult = new Result({
                studentId,
                name,
                department,
                session,
                results
            });
            
            await newResult.save();
            
            return res.status(201).json({
                success: true,
                message: "Result created successfully",
                data: newResult
            });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getResult = async (req, res) => {
    try {
        const studentId = req.params.studentId || req.query.studentId;
        const { department, session } = req.query;
        let query = {};
        
        if (studentId) query.studentId = studentId;
        if (department) query.department = department;
        if (session) query.session = session;
        
        const results = Object.keys(query).length === 0 
            ? await Result.find().limit(100) 
            : await Result.find(query);
        
        if (!results || results.length === 0) {
            return res.status(404).json({ message: "No results found" });
        }
        
        return res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateResult = async (req, res) => {
    try {
        const { id } = req.params;
        const { resultId } = req.query;

        if (!id) {
            return res.status(400).json({ message: "Main result ID (params.id) is required" });
        }

        const existingResult = await Result.findById(id);
        if (!existingResult) {
            return res.status(404).json({ message: "Result document not found" });
        }

        if (resultId) {
            const result = existingResult.results.id(resultId);

            if (!result) {
                return res.status(404).json({ message: "Nested result entry not found" });
            }

            const {
                courseName, courseCode, examDate, examType,
                fulMark, passMark, obtainedMark, comment, submitBy
            } = req.body;

            if (courseName !== undefined) result.courseName = courseName;
            if (courseCode !== undefined) result.courseCode = courseCode;
            if (examDate !== undefined) result.examDate = examDate;
            if (examType !== undefined) result.examType = examType;
            if (fulMark !== undefined) result.fulMark = fulMark;
            if (passMark !== undefined) result.passMark = passMark;
            if (obtainedMark !== undefined) result.obtainedMark = obtainedMark;
            if (comment !== undefined) result.comment = comment;
            if (submitBy !== undefined) result.submitBy = submitBy;

            await existingResult.save();

            return res.status(200).json({
                success: true,
                message: "Nested result updated successfully",
                data: existingResult
            });
        }

        const { studentId, name, department, session, results } = req.body;

        if (studentId !== undefined) existingResult.studentId = studentId;
        if (name !== undefined) existingResult.name = name;
        if (department !== undefined) existingResult.department = department;
        if (session !== undefined) existingResult.session = session;

        if (results) {
            if (req.query.replace === 'true') {
                existingResult.results = results;
            } else {
                existingResult.results.push(...results);
            }
        }

        await existingResult.save();

        return res.status(200).json({
            success: true,
            message: "Result document updated successfully",
            data: existingResult
        });

    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" });
    }
};

const deleteResult = async (req, res) => {
    try {
        const { id } = req.params;
        const { resultId } = req.query;
        
        if (!id) {
            return res.status(400).json({ message: "Result ID is required" });
        }
        
        const existingResult = await Result.findById(id);
        if (!existingResult) {
            return res.status(404).json({ message: "Result not found" });
        }
        
        if (resultId) {
            const resultIndex = existingResult.results.findIndex(
                result => result._id.toString() === resultId
            );
            
            if (resultIndex === -1) {
                return res.status(404).json({ message: "Specific result entry not found" });
            }
            
            existingResult.results.splice(resultIndex, 1);
            await existingResult.save();
            
            return res.status(200).json({
                success: true,
                message: "Result entry deleted successfully",
                data: existingResult
            });
        }
        
        await Result.findByIdAndDelete(id);
        
        return res.status(200).json({
            success: true,
            message: "Result deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { addResult, getResult, updateResult, deleteResult };
