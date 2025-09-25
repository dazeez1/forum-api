const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
      minlength: [1, "Comment cannot be empty"],
      maxlength: [2000, "Comment cannot exceed 2000 characters"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    thread: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
      required: true,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    depth: {
      type: Number,
      default: 0,
      max: [5, "Maximum nesting depth is 5 levels"],
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
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
commentSchema.index({ thread: 1, createdAt: 1 });
commentSchema.index({ parentComment: 1, createdAt: 1 });
commentSchema.index({ author: 1, createdAt: -1 });

// Virtual for reply count
commentSchema.virtual("replyCount", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parentComment",
  count: true,
});

// Ensure virtual fields are serialized
commentSchema.set("toJSON", { virtuals: true });

// Pre-save middleware to calculate depth
commentSchema.pre("save", async function (next) {
  if (this.parentComment) {
    const parent = await this.constructor.findById(this.parentComment);
    if (parent) {
      this.depth = parent.depth + 1;
    }
  }
  next();
});

// Pre-save middleware to update parent comment's replies array
commentSchema.post("save", async function (doc) {
  if (doc.parentComment) {
    await this.constructor.findByIdAndUpdate(doc.parentComment, {
      $addToSet: { replies: doc._id },
    });
  }
});

module.exports = mongoose.model("Comment", commentSchema);
