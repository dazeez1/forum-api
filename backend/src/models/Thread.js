const mongoose = require("mongoose");

const threadSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Thread title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters long"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Thread content is required"],
      trim: true,
      minlength: [10, "Content must be at least 10 characters long"],
      maxlength: [5000, "Content cannot exceed 5000 characters"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: ["general", "tech", "science", "arts", "sports", "politics"],
      default: "general",
    },
    tags: [
      {
        type: String,
        trim: true,
        maxlength: [20, "Tag cannot exceed 20 characters"],
      },
    ],
    isLocked: {
      type: Boolean,
      default: false,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
threadSchema.index({ title: "text", content: "text" });
threadSchema.index({ author: 1, createdAt: -1 });
threadSchema.index({ category: 1, createdAt: -1 });

// Virtual for comment count
threadSchema.virtual("commentCount", {
  ref: "Comment",
  localField: "_id",
  foreignField: "thread",
  count: true,
});

// Ensure virtual fields are serialized
threadSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Thread", threadSchema);
