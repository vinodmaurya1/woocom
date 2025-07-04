# WooCom Project

## Overview

This repository contains a full-stack application with a Node.js backend and React.js frontend. The backend connects to a MongoDB database, and the frontend communicates with the backend via a configurable URL.

---

## Prerequisites

- Node.js and npm installed
- MongoDB installed and running locally
- Basic knowledge of running commands in terminal/PowerShell

---

## Backend Setup

1. **Navigate to the root directory**

   Open your terminal and run:

 npm install

mongo
> use woocom

mongodb://localhost:27017/woocomdb

npm start


## Frontend  Setup

1. **Navigate to the frontend directory**

     cd frontend

2. **Install frontend dependencies**

       npm install


3.  **Update backend URL**

    Open the file frontend/config/Contant.jsx.

**Locate the backend URL configuration.**

**Change the URL to match your running backend server, for example:**

    export const BASE_URL = 'http://localhost:5000';


5.  **Start the frontend development server**

   npm run dev
