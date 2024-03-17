# Poast

Poast is a minimalist web application inspired by Twitter, designed for users to share text content with support for markdown formatting. It allows for posting, viewing, starring, commenting on posts, and reposting, alongside profile customization without the need for signup.

## Overview

The application is built using the Node.js platform with Express framework, leveraging MongoDB for data storage via Mongoose ORM. The frontend utilizes EJS for dynamic HTML rendering and Bootstrap for styling, ensuring a responsive and intuitive user interface. Session persistence is managed through express-session with connect-mongo.

## Features

- **Posting**: Users can create posts with markdown-formatted text, including inline code and code blocks.
- **Interaction**: Viewing, starring, commenting on, and reposting functionality enriches user engagement.
- **Profile Customization**: Users can set a username and upload a profile picture to personalize their accounts.
- **Recommendation Algorithm**: A basic algorithm recommends posts to users based on interactions.

## Getting started

### Requirements

- Node.js
- MongoDB
- npm (Node package manager)

### Quickstart

1. Clone the repository to your local machine.
2. Install dependencies with `npm install`.
3. Copy `.env.example` to `.env` and configure the environment variables.
4. Run the application with `npm start`. The server will start on the specified port, defaulting to 3000.

### License

MIT
