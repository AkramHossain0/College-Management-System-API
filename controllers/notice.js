import Notice from "../model/notice.js";

const createNotice = async (req, res) => {
    const { title, description, postedBy } = req.body;
    
    try {
        const notice = new Notice({
        title,
        description,
        postedBy,
        });
    
        await notice.save();
        res.status(201).json({ message: "Notice created successfully", notice });
    } catch (error) {
        res.status(500).json({ message: "Error creating notice", error });
    }
    };
const getNotices = async (req, res) => {
    try {
        const notices = await Notice.find();
        res.status(200).json(notices);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notices", error });
    }
}

const getNoticeById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const notice = await Notice.findById(id);
        if (!notice) {
            return res.status(404).json({ message: "Notice not found" });
        }
        res.status(200).json(notice);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notice", error });
    }
}

const updateNotice = async (req, res) => {
    const { id } = req.params;
    const { title, description, postedBy } = req.body;
    
    try {
        const notice = await Notice.findByIdAndUpdate(
            id,
            { title, description, postedBy },
            { new: true }
        );
        if (!notice) {
            return res.status(404).json({ message: "Notice not found" });
        }
        res.status(200).json({ message: "Notice updated successfully", notice });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating notice", error });
    }
};

const deleteNotice = async (req, res) => {
    const { id } = req.params;
    
    try {
        const notice = await Notice.findByIdAndDelete(id);
        if (!notice) {
            return res.status(404).json({ message: "Notice not found" });
        }
        res.status(200).json({ message: "Notice deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting notice", error });
    }
}
export { createNotice, getNotices, getNoticeById, updateNotice, deleteNotice };