const Comment = require("../models/Comment");
const Thread = require("../models/Thread");

const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // Check if thread exists
    const thread = await Thread.findById(id);
    if (!thread) {
      return res.status(404).json({
        success: false,
        message: "Thread not found",
      });
    }

    // Check if thread is locked
    if (thread.isLocked) {
      return res.status(403).json({
        success: false,
        message: "Thread is locked. Comments are not allowed.",
      });
    }

    const comment = new Comment({
      content,
      author: req.user._id,
      thread: id,
    });

    await comment.save();
    await comment.populate("author", "name email");

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: { comment },
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding comment",
    });
  }
};

const replyToComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // Check if parent comment exists
    const parentComment = await Comment.findById(id);
    if (!parentComment) {
      return res.status(404).json({
        success: false,
        message: "Parent comment not found",
      });
    }

    // Check if thread is locked
    const thread = await Thread.findById(parentComment.thread);
    if (thread.isLocked) {
      return res.status(403).json({
        success: false,
        message: "Thread is locked. Comments are not allowed.",
      });
    }

    // Check nesting depth
    if (parentComment.depth >= 5) {
      return res.status(400).json({
        success: false,
        message: "Maximum nesting depth reached",
      });
    }

    const reply = new Comment({
      content,
      author: req.user._id,
      thread: parentComment.thread,
      parentComment: id,
      depth: parentComment.depth + 1,
    });

    await reply.save();
    await reply.populate("author", "name email");

    res.status(201).json({
      success: true,
      message: "Reply added successfully",
      data: { comment: reply },
    });
  } catch (error) {
    console.error("Reply to comment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding reply",
    });
  }
};

const getCommentsByThread = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    // Check if thread exists
    const thread = await Thread.findById(id);
    if (!thread) {
      return res.status(404).json({
        success: false,
        message: "Thread not found",
      });
    }

    // Get top-level comments (no parent)
    const comments = await Comment.find({ thread: id, parentComment: null })
      .populate("author", "name email")
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(parseInt(limit));

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
    const total = await Comment.countDocuments({
      thread: id,
      parentComment: null,
    });

    res.status(200).json({
      success: true,
      data: {
        comments: nestedComments,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
        },
      },
    });
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching comments",
    });
  }
};

const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check if user is comment author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only edit your own comments.",
      });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      {
        content,
        isEdited: true,
        editedAt: new Date(),
      },
      { new: true, runValidators: true }
    ).populate("author", "name email");

    res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      data: { comment: updatedComment },
    });
  } catch (error) {
    console.error("Update comment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating comment",
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check if user is comment author or admin
    if (
      comment.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. You can only delete your own comments or be an admin.",
      });
    }

    // Soft delete - mark as deleted instead of removing
    await Comment.findByIdAndUpdate(id, {
      isDeleted: true,
      content: "[This comment has been deleted]",
    });

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting comment",
    });
  }
};

module.exports = {
  addComment,
  replyToComment,
  getCommentsByThread,
  updateComment,
  deleteComment,
};
