🛍️ Afrowear - E-Commerce Quote Request System
This project provides a functional, modern e-commerce front-end and a dedicated Node.js API designed to showcase products and handle customer quote requests, rather than processing direct payments.

🌟 Key Features
Front-End (Client-Side)
Quote Request Workflow: Customers add items to a persistent shopping cart and submit a detailed quote request form.

Product Interactivity: Features a Quick View modal and a like/wishlist button that reorders the product grid to show liked items first.

Local Persistence: Uses Local Storage to save the shopping cart (luxeCart) and liked products (likedProducts) between sessions.

Navigation: Smooth single-page navigation between Home, Products, About, and Contact sections using hash routing.

Back-End (API Server)
Product Retrieval: Serves product data to the front-end.

Quote Management: Processes and saves customer quote requests.

Contact Management: Receives and saves messages submitted via the contact form.

🛠️ Technology Stack
This project is structured into two main components that must be run independently:

Component Technology Description
Front-End HTML5, CSS3, Vanilla JavaScript The user interface and client-side logic.
Back-End API Node.js, Express.js The core server handling API routes and data persistence.
Database MongoDB (NoSQL) Used to store products, submitted quotes, and contact messages.

Export to Sheets

🚀 Installation and Setup Guide
To run this website locally, you must successfully set up both the back-end server and configure the front-end to connect to it.

Prerequisites
You must have the following installed on your system:

Node.js and npm (Node Package Manager).

MongoDB Server: A running instance (local via MongoDB Community Server or cloud via MongoDB Atlas).

Step 1: Project Initialization
Unzip the project.

Navigate into the main project directory in your terminal:

Bash

cd Afrowear
Locate the Back-End folder (which contains server.js and package.json) and the Front-End folder (which contains index.html and script.js).

Step 2: Back-End API Setup and Run
Navigate into the back-end directory:

Bash

cd backend-folder-name # Replace with your actual backend folder name
Install all necessary Node.js dependencies:

Bash

npm install
Configure MongoDB:

Locate the database connection code in your main back-end file (e.g., server.js).

Crucially, update the MongoDB Connection String (URI) to point to your specific database instance.

Example URI: mongodb+srv://user:password@cluster0.abcde.mongodb.net/afrowear-db

Start the API server:

Bash

node server.js
The back-end API should now be running locally and listening on http://localhost:5000.

Step 3: Front-End Configuration and Access
Open the main front-end JavaScript file (script.js).

Verify or update the BACKEND_URL variable to ensure it points to the correct server location.

For Local Testing: Keep the URL as:

JavaScript

const BACKEND_URL = 'http://localhost:5000';
For Live Deployment: If the server is hosted remotely (e.g., on Heroku, Render), replace the URL with its public address:

JavaScript

const BACKEND_URL = 'https://your-live-api-name.com';
Open the index.html file in your web browser to access the website. The front-end will now successfully fetch product data and submit forms to the running back-end API.

🔌 API Endpoints
The front-end consumes data from the following required back-end endpoints:

Feature HTTP Method Endpoint Data Sent (Body)
Fetch Products GET /api/products None
Submit Quote POST /api/quotes Customer details, items array, totalAmount
Contact Form POST /api/messages contactName, contactEmail, contactSubject, contactMessage
