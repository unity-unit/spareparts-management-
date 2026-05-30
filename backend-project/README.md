# PSSMS Backend

## Overview
This backend is a Node.js + Express API for the Parking Sales Management System. It connects to a MySQL database and exposes CRUD endpoints for the parking management entities.

## Database
The backend now initializes the database automatically if it does not exist.

## Setup
1. Copy `.env.example` to `.env` and set your MySQL credentials.
2. Install dependencies:
```bash
npm install
```
3. Initialize the database manually if needed:
```bash
npm run init-db
```
4. Start the server:
```bash
npm run dev
```

## API Endpoints
- POST `/api/cars` - insert a car
- POST `/api/slots` - insert a parking slot
- POST `/api/payments` - insert payment
- GET `/api/records` - retrieve parking records
- POST `/api/records` - insert parking record
- PUT `/api/records/:id` - update parking record
- DELETE `/api/records/:id` - delete parking record

