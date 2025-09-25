#!/bin/bash

echo "=== Forum API Endpoint Tests ==="
echo ""

# Wait for server to start
sleep 3

echo "1. Health Check:"
curl -s http://localhost:3000/health
echo -e "\n"

echo "2. User Signup:"
curl -s -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
echo -e "\n"

echo "3. User Login:"
curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
echo -e "\n"

echo "4. Get All Threads (Public):"
curl -s http://localhost:3000/api/threads
echo -e "\n"

echo "5. Create Thread (requires auth - will fail without token):"
curl -s -X POST http://localhost:3000/api/threads \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Thread",
    "content": "This is a test thread",
    "category": "General"
  }'
echo -e "\n"

echo "6. Get Comments for Thread (requires thread ID - will show empty):"
curl -s http://localhost:3000/api/comments/thread/507f1f77bcf86cd799439011
echo -e "\n"

echo "=== Tests Complete ==="
