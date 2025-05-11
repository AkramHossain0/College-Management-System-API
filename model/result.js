import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    name: { type: String, required: true },
    department: { type: String, required: true },
    session: { type: String, required: true },
    results: [
        {
            courseName: { type: String, required: true },
            courseCode: { type: String, required: true },
            examDate: { type: Date, required: true },
            examType: { type: String, required: true },
            fulMark: { type: Number, required: true },
            passMark: { type: Number, required: true },
            obtainedMark: { type: Number, required: true },
            comment: { type: String, required: true },
            submitBy: { type: String, required: true },
        }
    ]
});

const Result = mongoose.model('Result', resultSchema);

export default Result;
