const Thread = require("../models/Thread");
const Comment = require("../models/Comment");
const User = require("../models/User");

const getAllThreadsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, category } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    if (category) {
      query.category = category;
    }

    if (status === 'locked') {
      query.isLocked = true;
    } else if (status === 'unlocked') {
      query.isLocked = false;
    }

    const threads = await Thread.find(query)
      .populate("author", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("commentCount");

    const total = await Thread.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        threads,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
        },
      },
    });
  } catch (error) {
    console.error("Get all threads admin error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching threads",
    });
  }
};

const deleteCommentAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Hard delete for admin (not soft delete)
    await Comment.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Comment deleted by admin",
    });
  } catch (error) {
    console.error("Delete comment admin error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting comment",
    });
  }
};

const lockThread = async (req, res) => {
  try {
    const { id } = req.params;
    const { isLocked } = req.body;

    const thread = await Thread.findById(id);
    if (!thread) {
      return res.status(404).json({
        success: false,
        message: "Thread not found",
      });
    }

    const updatedThread = await Thread.findByIdAndUpdate(
      id,
      { isLocked },
      { new: true, runValidators: true }
    ).populate("author", "name email");

    res.status(200).json({
      success: true,
      message: `Thread ${isLocked ? 'locked' : 'unlocked'} successfully`,
      data: { thread: updatedThread },
    });
  } catch (error) {
    console.error("Lock thread error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating thread",
    });
  }
};

const pinThread = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPinned } = req.body;

    const thread = await Thread.findById(id);
    if (!thread) {
      return res.status(404).json({
        success: false,
        message: "Thread not found",
      });
    }

    const updatedThread = await Thread.findByIdAndUpdate(
      id,
      { isPinned },
      { new: true, runValidators: true }
    ).populate("author", "name email");

    res.status(200).json({
      success: true,
      message: `Thread ${isPinned ? 'pinned' : 'unpinned'} successfully`,
      data: { thread: updatedThread },
    });
  } catch (error) {
    console.error("Pin thread error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating thread",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, isActive } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    if (role) {
      query.role = role;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
        },
      },
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching users",
    });
  }
};

module.exports = {
  getAllThreadsAdmin,
  deleteCommentAdmin,
  lockThread,
  pinThread,
  getAllUsers,
};
