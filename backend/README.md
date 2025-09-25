# Forum API Backend

A robust and scalable backend API for a forum application with support for threaded/nested comments, user authentication, and real-time interactions.

## 🚀 Features

- **Threaded Comments**: Support for nested comment structures with up to 5 levels of depth
- **User Authentication**: Secure user registration, login, and JWT-based session management
- **RESTful API**: Clean and intuitive API endpoints following REST principles
- **Thread Management**: Create, read, update, and delete forum threads
- **Comment System**: Add comments to threads and reply to existing comments
- **Security**: Rate limiting, input validation, and secure password hashing
- **Scalable Architecture**: Designed for horizontal scaling and high performance

## 🛠️ Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Testing**: Jest with supertest
- **Security**: helmet, cors, express-rate-limit
- **Environment**: dotenv for configuration management

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers and business logic
│   │   ├── authController.js
│   │   ├── threadController.js
│   │   └── commentController.js
│   ├── models/          # Database models and schemas
│   │   ├── User.js
│   │   ├── Thread.js
│   │   └── Comment.js
│   ├── routes/          # API route definitions
│   │   ├── auth.js
│   │   ├── threads.js
│   │   └── comments.js
│   ├── middleware/      # Custom middleware functions
│   │   ├── auth.js
│   │   └── validation.js
│   ├── utils/           # Utility functions and helpers
│   │   └── helpers.js
│   └── config/          # Configuration files
│       └── database.js
├── tests/               # Test files and test utilities
│   └── api.test.js
├── server.js            # Main application entry point
├── package.json         # Project dependencies and scripts
├── .env.example         # Environment variables template
└── .gitignore           # Git ignore rules
```

## 🚀 Installation & Usage

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- MongoDB Atlas account (cloud database)

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/dazeez1/forum-api.git
   cd forum-api/backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database Setup**

   ```bash
   # Create a MongoDB Atlas cluster
   # Get your connection string from Atlas
   # Update MONGO_URI in .env file with your Atlas connection string
   ```

5. **Run the application**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 📚 API Endpoints

### Authentication Endpoints

| Method | Endpoint            | Description         | Auth Required |
| ------ | ------------------- | ------------------- | ------------- |
| POST   | `/api/auth/signup`  | Register a new user | No            |
| POST   | `/api/auth/login`   | Login user          | No            |
| GET    | `/api/auth/profile` | Get user profile    | Yes           |

### Thread Endpoints

| Method | Endpoint           | Description                     | Auth Required     |
| ------ | ------------------ | ------------------------------- | ----------------- |
| GET    | `/api/threads`     | Get all threads                 | No                |
| GET    | `/api/threads/:id` | Get single thread with comments | No                |
| POST   | `/api/threads`     | Create new thread               | Yes               |
| PUT    | `/api/threads/:id` | Update thread                   | Yes (Owner)       |
| DELETE | `/api/threads/:id` | Delete thread                   | Yes (Owner/Admin) |

### Comment Endpoints

| Method | Endpoint                   | Description             | Auth Required     |
| ------ | -------------------------- | ----------------------- | ----------------- |
| GET    | `/api/comments/thread/:id` | Get comments for thread | No                |
| POST   | `/api/comments/thread/:id` | Add comment to thread   | Yes               |
| POST   | `/api/comments/:id/reply`  | Reply to comment        | Yes               |
| PUT    | `/api/comments/:id`        | Update comment          | Yes (Owner)       |
| DELETE | `/api/comments/:id`        | Delete comment          | Yes (Owner/Admin) |

## 📝 API Usage Examples

### User Registration

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### User Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Thread

```bash
curl -X POST http://localhost:3000/api/threads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My First Thread",
    "content": "This is the content of my thread",
    "category": "general"
  }'
```

### Add Comment

```bash
curl -X POST http://localhost:3000/api/comments/thread/THREAD_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "content": "This is my comment"
  }'
```

### Reply to Comment

```bash
curl -X POST http://localhost:3000/api/comments/COMMENT_ID/reply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "content": "This is my reply"
  }'
```

## 🔧 Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode

### Environment Variables

Create a `.env` file with the following variables:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
PORT=3000
NODE_ENV=development
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Database Models

#### User Model

- `name`: String (required, 2-50 chars)
- `email`: String (required, unique, valid email)
- `password`: String (required, min 6 chars, hashed)
- `role`: String (enum: 'user', 'admin', default: 'user')
- `isActive`: Boolean (default: true)

#### Thread Model

- `title`: String (required, 5-200 chars)
- `content`: String (required, 10-5000 chars)
- `author`: ObjectId (ref: User)
- `category`: String (enum: 'general', 'tech', 'science', 'arts', 'sports', 'politics')
- `tags`: Array of Strings
- `views`: Number (default: 0)
- `likes`: Array of ObjectIds (ref: User)
- `dislikes`: Array of ObjectIds (ref: User)

#### Comment Model

- `content`: String (required, 1-2000 chars)
- `author`: ObjectId (ref: User)
- `thread`: ObjectId (ref: Thread)
- `parentComment`: ObjectId (ref: Comment, for replies)
- `depth`: Number (max 5 levels)
- `replies`: Array of ObjectIds (ref: Comment)
- `likes`: Array of ObjectIds (ref: User)
- `dislikes`: Array of ObjectIds (ref: User)

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevents abuse with configurable limits
- **Input Validation**: Comprehensive validation using express-validator
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet**: Security headers for Express.js
- **Error Handling**: Secure error responses without sensitive data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Azeez Damilare Gbenga** - [GitHub Profile](https://github.com/dazeez1)

## 📞 Support

For support and questions:

- Create an issue in the GitHub repository
- Contact: d.azeez@alustudent.com

---

**Status**: ✅ Complete implementation with authentication, threads, and nested comments system ready for production use.
