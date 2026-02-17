# Dhara ML Chatbot Service

This directory contains the Python-based Machine Learning service for the Dhara Chatbot.

## Prerequisites
- Python 3.8+
- pip

## Setup

1. **Navigate to the directory:**
   ```bash
   cd dhara/ML-Model-main/ML-Model-main
   ```

2. **Create a virtual environment (optional but recommended):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

## Running the Server

Start the Flask API server:
```bash
python api_server.py
```
The service will run on `http://localhost:5001`.

## Integration
The Node.js backend (running on port 5000) automatically forwards chatbot requests to this service.
