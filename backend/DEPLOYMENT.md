# Render Deployment Guide

## Prerequisites

- GitHub repository with your code
- MongoDB Atlas cluster
- Render account

## Step 1: Prepare Your Repository

1. **Environment Variables**: Create a `.env.production` file with:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-jwt-secret-key-for-production-use-only
PORT=10000
NODE_ENV=production
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

2. **Update CORS**: In `server.js`, update the CORS origin for production:

```javascript
origin: process.env.NODE_ENV === "production"
  ? ["https://your-frontend-domain.com"]
  : ["http://localhost:3000", "http://localhost:3001"],
```

## Step 2: Deploy on Render

1. **Connect Repository**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` folder as root directory

2. **Configure Service**:
   - **Name**: `forum-api-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Node Version**: `18`

3. **Set Environment Variables**:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Strong secret key (32+ characters)
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render's default)
   - `RATE_LIMIT_WINDOW_MS`: `900000`
   - `RATE_LIMIT_MAX_REQUESTS`: `100`

4. **Deploy**:
   - Click "Create Web Service"
   - Render will build and deploy your application
   - Your API will be available at: `https://your-service-name.onrender.com`

## Step 3: Update Postman Collection

Update the `baseUrl` variable in your Postman collection to:

```
https://your-service-name.onrender.com
```

## Step 4: Test Deployment

1. **Health Check**: `GET https://your-service-name.onrender.com/health`
2. **User Signup**: Test with the new production URL
3. **Admin Signup**: Create admin user with `"role": "admin"`
4. **All Endpoints**: Verify all API endpoints work

## Step 5: MongoDB Atlas Configuration

1. **Network Access**: Add `0.0.0.0/0` to allow all IPs (or Render's IP range)
2. **Database User**: Create a user with read/write permissions
3. **Connection String**: Use the connection string in your environment variables

## Production Considerations

- **Security**: Use strong JWT secrets
- **CORS**: Configure for your frontend domain
- **Rate Limiting**: Adjust based on expected traffic
- **Monitoring**: Set up health checks and monitoring
- **Logs**: Monitor application logs in Render dashboard

## Troubleshooting

- **Build Failures**: Check Node version and dependencies
- **Database Connection**: Verify MongoDB Atlas network access
- **CORS Issues**: Update CORS configuration for production domain
- **Environment Variables**: Ensure all required variables are set
