const Thread = require("../models/Thread");
const Comment = require("../models/Comment");

const voteThread = async (req, res) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body; // 'upvote' or 'downvote'
    const userId = req.user._id;

    if (!['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({
        success: false,
        message: "Vote type must be 'upvote' or 'downvote'",
      });
    }

    const thread = await Thread.findById(id);
    if (!thread) {
      return res.status(404).json({
        success: false,
        message: "Thread not found",
      });
    }

    // Check if user already voted
    const hasUpvoted = thread.likes.includes(userId);
    const hasDownvoted = thread.dislikes.includes(userId);

    if (voteType === 'upvote') {
      if (hasUpvoted) {
        // Remove upvote
        await Thread.findByIdAndUpdate(id, {
          $pull: { likes: userId }
        });
        return res.status(200).json({
          success: true,
          message: "Upvote removed",
          data: { voteType: 'removed' }
        });
      } else {
        // Add upvote, remove downvote if exists
        await Thread.findByIdAndUpdate(id, {
          $addToSet: { likes: userId },
          $pull: { dislikes: userId }
        });
        return res.status(200).json({
          success: true,
          message: "Thread upvoted",
          data: { voteType: 'upvote' }
        });
      }
    } else {
      if (hasDownvoted) {
        // Remove downvote
        await Thread.findByIdAndUpdate(id, {
          $pull: { dislikes: userId }
        });
        return res.status(200).json({
          success: true,
          message: "Downvote removed",
          data: { voteType: 'removed' }
        });
      } else {
        // Add downvote, remove upvote if exists
        await Thread.findByIdAndUpdate(id, {
          $addToSet: { dislikes: userId },
          $pull: { likes: userId }
        });
        return res.status(200).json({
          success: true,
          message: "Thread downvoted",
          data: { voteType: 'downvote' }
        });
      }
    }
  } catch (error) {
    console.error("Vote thread error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while voting on thread",
    });
  }
};

const voteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body; // 'upvote' or 'downvote'
    const userId = req.user._id;

    if (!['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({
        success: false,
        message: "Vote type must be 'upvote' or 'downvote'",
      });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check if user already voted
    const hasUpvoted = comment.likes.includes(userId);
    const hasDownvoted = comment.dislikes.includes(userId);

    if (voteType === 'upvote') {
      if (hasUpvoted) {
        // Remove upvote
        await Comment.findByIdAndUpdate(id, {
          $pull: { likes: userId }
        });
        return res.status(200).json({
          success: true,
          message: "Upvote removed",
          data: { voteType: 'removed' }
        });
      } else {
        // Add upvote, remove downvote if exists
        await Comment.findByIdAndUpdate(id, {
          $addToSet: { likes: userId },
          $pull: { dislikes: userId }
        });
        return res.status(200).json({
          success: true,
          message: "Comment upvoted",
          data: { voteType: 'upvote' }
        });
      }
    } else {
      if (hasDownvoted) {
        // Remove downvote
        await Comment.findByIdAndUpdate(id, {
          $pull: { dislikes: userId }
        });
        return res.status(200).json({
          success: true,
          message: "Downvote removed",
          data: { voteType: 'removed' }
        });
      } else {
        // Add downvote, remove upvote if exists
        await Comment.findByIdAndUpdate(id, {
          $addToSet: { dislikes: userId },
          $pull: { likes: userId }
        });
        return res.status(200).json({
          success: true,
          message: "Comment downvoted",
          data: { voteType: 'downvote' }
        });
      }
    }
  } catch (error) {
    console.error("Vote comment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while voting on comment",
    });
  }
};

module.exports = {
  voteThread,
  voteComment,
};
