const { buildSchema } = require('graphql');
const Thread = require('../models/Thread');
const Comment = require('../models/Comment');
const User = require('../models/User');

// GraphQL Schema
const schema = buildSchema(`
  type User {
    _id: ID!
    name: String!
    email: String!
    role: String!
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Comment {
    _id: ID!
    content: String!
    author: User!
    thread: ID!
    parentComment: ID
    replies: [Comment!]!
    depth: Int!
    likes: [ID!]!
    dislikes: [ID!]!
    isEdited: Boolean!
    editedAt: String
    isDeleted: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Thread {
    _id: ID!
    title: String!
    content: String!
    author: User!
    category: String!
    tags: [String!]!
    isLocked: Boolean!
    isPinned: Boolean!
    views: Int!
    likes: [ID!]!
    dislikes: [ID!]!
    commentCount: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    # Thread queries
    threads(page: Int, limit: Int, category: String, search: String): ThreadsResult!
    thread(id: ID!): Thread
    
    # Comment queries
    comments(threadId: ID!, page: Int, limit: Int): CommentsResult!
    comment(id: ID!): Comment
    
    # User queries
    users(page: Int, limit: Int, role: String): UsersResult!
    user(id: ID!): User
  }

  type ThreadsResult {
    threads: [Thread!]!
    pagination: Pagination!
  }

  type CommentsResult {
    comments: [Comment!]!
    pagination: Pagination!
  }

  type UsersResult {
    users: [User!]!
    pagination: Pagination!
  }

  type Pagination {
    current: Int!
    pages: Int!
    total: Int!
  }
`);

// GraphQL Resolvers
const root = {
  // Thread resolvers
  threads: async ({ page = 1, limit = 10, category, search }) => {
    try {
      const skip = (page - 1) * limit;
      let query = {};

      if (category) {
        query.category = category;
      }

      if (search) {
        query.$text = { $search: search };
      }

      const threads = await Thread.find(query)
        .populate('author', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('commentCount');

      const total = await Thread.countDocuments(query);

      return {
        threads,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
        },
      };
    } catch (error) {
      throw new Error('Failed to fetch threads');
    }
  },

  thread: async ({ id }) => {
    try {
      const thread = await Thread.findById(id)
        .populate('author', 'name email role')
        .populate('commentCount');
      
      return thread;
    } catch (error) {
      throw new Error('Failed to fetch thread');
    }
  },

  // Comment resolvers
  comments: async ({ threadId, page = 1, limit = 20 }) => {
    try {
      const skip = (page - 1) * limit;

      const comments = await Comment.find({ thread: threadId, parentComment: null })
        .populate('author', 'name email role')
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(parseInt(limit));

      // Populate nested replies recursively
      const populateReplies = async (comments) => {
        for (let comment of comments) {
          const replies = await Comment.find({ parentComment: comment._id })
            .populate('author', 'name email role')
            .sort({ createdAt: 1 });

          if (replies.length > 0) {
            comment.replies = await populateReplies(replies);
          }
        }
        return comments;
      };

      const nestedComments = await populateReplies(comments);
      const total = await Comment.countDocuments({
        thread: threadId,
        parentComment: null,
      });

      return {
        comments: nestedComments,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
        },
      };
    } catch (error) {
      throw new Error('Failed to fetch comments');
    }
  },

  comment: async ({ id }) => {
    try {
      const comment = await Comment.findById(id)
        .populate('author', 'name email role');
      
      return comment;
    } catch (error) {
      throw new Error('Failed to fetch comment');
    }
  },

  // User resolvers
  users: async ({ page = 1, limit = 20, role }) => {
    try {
      const skip = (page - 1) * limit;
      let query = {};

      if (role) {
        query.role = role;
      }

      const users = await User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await User.countDocuments(query);

      return {
        users,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
        },
      };
    } catch (error) {
      throw new Error('Failed to fetch users');
    }
  },

  user: async ({ id }) => {
    try {
      const user = await User.findById(id).select('-password');
      return user;
    } catch (error) {
      throw new Error('Failed to fetch user');
    }
  },
};

module.exports = { schema, root };
