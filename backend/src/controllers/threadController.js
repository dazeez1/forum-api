const Thread = require("../models/Thread");
const Comment = require("../models/Comment");

const createThread = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    const thread = new Thread({
      title,
      content,
      author: req.user._id,
      category: category || "general",
      tags: tags || [],
    });

    await thread.save();
    await thread.populate("author", "name email");

    res.status(201).json({
      success: true,
      message: "Thread created successfully",
      data: { thread },
    });
  } catch (error) {
    console.error("Create thread error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating thread",
    });
  }
};

const getAllThreads = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const threads = await Thread.find(query)
      .populate("author", "name email")
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
    console.error("Get threads error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching threads",
    });
  }
};

const getThreadById = async (req, res) => {
  try {
    const { id } = req.params;

    const thread = await Thread.findById(id)
      .populate("author", "name email")
      .populate("commentCount");

    if (!thread) {
      return res.status(404).json({
        success: false,
        message: "Thread not found",
      });
    }

    // Increment view count
    await Thread.findByIdAndUpdate(id, { $inc: { views: 1 } });

    // Get nested comments
    const comments = await Comment.find({ thread: id, parentComment: null })
      .populate("author", "name email")
      .sort({ createdAt: 1 });

    // Populate nested replies recursively
    const populateReplies = async (comments) => {
      for (let comment of comments) {
        const replies = await Comment.find({ parentComment: comment._id })
          .populate("author", "name email")
          .sort({ createdAt: 1 });

        if (replies.length > 0) {
          comment.replies = await populateReplies(replies);
        }
      }
      return comments;
    };

    const nestedComments = await populateReplies(comments);

    res.status(200).json({
      success: true,
      data: {
        thread,
        comments: nestedComments,
      },
    });
  } catch (error) {
    console.error("Get thread error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching thread",
    });
  }
};

const deleteThread = async (req, res) => {
  try {
    const { id } = req.params;

    const thread = await Thread.findById(id);
    if (!thread) {
      return res.status(404).json({
        success: false,
        message: "Thread not found",
      });
    }

    // Check if user is admin or thread author
    if (
      req.user.role !== "admin" &&
      thread.author.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. You can only delete your own threads or be an admin.",
      });
    }

    // Delete all comments associated with this thread
    await Comment.deleteMany({ thread: id });

    // Delete the thread
    await Thread.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Thread deleted successfully",
    });
  } catch (error) {
    console.error("Delete thread error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting thread",
    });
  }
};

const updateThread = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, tags } = req.body;

    const thread = await Thread.findById(id);
    if (!thread) {
      return res.status(404).json({
        success: false,
        message: "Thread not found",
      });
    }

    // Check if user is thread author
    if (thread.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only edit your own threads.",
      });
    }

    const updatedThread = await Thread.findByIdAndUpdate(
      id,
      { title, content, category, tags },
      { new: true, runValidators: true }
    ).populate("author", "name email");

    res.status(200).json({
      success: true,
      message: "Thread updated successfully",
      data: { thread: updatedThread },
    });
  } catch (error) {
    console.error("Update thread error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating thread",
    });
  }
};

module.exports = {
  createThread,
  getAllThreads,
  getThreadById,
  deleteThread,
  updateThread,
};
