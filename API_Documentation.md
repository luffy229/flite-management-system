# Fly Connect Sky API Documentation

## Overview
The Fly Connect Sky API is a comprehensive REST API for flight booking and management system built with Node.js, Express, and MongoDB. It provides secure authentication, flight search, seat management, and booking operations.

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```


## How To Use
1. Import Postman Collection:
    *Open Postman
    *Click "Import"
    *Select Fly_Connect_Sky_API.postman_collection.json

2. Set Environment Variables:
    *Set base_url to your API endpoint (e.g., http://localhost:5000/api)
    *Login to get a JWT token and set auth_token
    
3. Test Endpoints:
    *Start with authentication endpoints
    *Use the token for protected routes
    *Test flight search and booking operations