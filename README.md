# SWEEP

link to demo: https://youtu.be/Y8mRRYlyUTs

## Introduction

Welcome to Sweep. Here, you can view and report local crime incidents in your area and see their details on an interactive map.

## Features

- **User Authentication**: Securely log in and create an account to access the app's features.
- **Edit/Delete Account**: Easily manage your account settings.
- **Create Crime Reports**: Contribute to your community by submitting detailed crime reports.
- **Interactive Map**: See the locations and descriptions of crime incidents .

## Instructions

Follow these steps to get started with Sweep:

1. **Fork and Clone**: Fork this repository and clone it to your local machine.

2. **Install Dependencies**:

   - In your terminal, run the following command to set up the Python environment:

     ```bash
     pipenv install && pipenv shell
     ```

   - Navigate to the server directory:

     ```bash
     cd server
     ```

   - Run the backend server:

     ```bash
     python app.py
     ```

   - In a separate terminal, install dependencies for the client:

     ```bash
     npm install --prefix client
     ```

   - Start the frontend client:
     ```bash
     npm start --prefix client
     ```

3. **Account Creation**: Once the app is loaded, create your account to begin exploring and reporting crime incidents.

Make sure the backend server is running on port 5555.

We hope you find Sweep helpful for your community's safety and awareness!
