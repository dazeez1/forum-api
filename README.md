# Forum API Backend

A robust and scalable backend API for a forum application with support for threaded/nested comments, user authentication, and real-time interactions.

## Features

- **Threaded Comments**: Support for nested comment structures with unlimited depth
- **User Authentication**: Secure user registration, login, and session management
- **RESTful API**: Clean and intuitive API endpoints following REST principles
- **Real-time Updates**: WebSocket support for live comment updates
- **Moderation Tools**: Built-in content moderation and user management
- **Scalable Architecture**: Designed for horizontal scaling and high performance
- **Comprehensive Testing**: Full test coverage with automated testing suite
- **API Documentation**: Interactive API documentation with examples

## Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi for request validation
- **Testing**: Jest for unit and integration tests
- **Documentation**: Swagger/OpenAPI
- **Real-time**: Socket.io
- **Environment**: dotenv for configuration management

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers and business logic
│   ├── models/         # Database models and schemas
│   ├── routes/         # API route definitions
│   ├── middleware/     # Custom middleware functions
│   ├── utils/          # Utility functions and helpers
│   └── config/         # Configuration files
├── tests/              # Test files and test utilities
├── docs/               # API documentation
├── server.js           # Main application entry point
├── package.json        # Project dependencies and scripts
└── .gitignore          # Git ignore rules
```

## Installation & Usage

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- MongoDB database

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <repository-url>
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
   # Ensure MongoDB is running
   # Update connection string in .env file
   ```

5. **Run the application**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

6. **Run tests**
   ```bash
   npm test
   npm run test:watch
   ```

## API Endpoints

The API will provide the following main endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/posts` - Retrieve forum posts
- `POST /api/posts` - Create new forum post
- `GET /api/posts/:id/comments` - Get comments for a post
- `POST /api/posts/:id/comments` - Add comment to a post
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

## Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Code Style

- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages
- Include tests for new features

## License

This project is licensed under the ISC License.

## Author

**Azeez Damilare Gbenga** - [GitHub Profile](https://github.com/dazeez1)

## Support

For support and questions:

- Create an issue in the GitHub repository
- Contact: d.azeez@alustudent.com

---
