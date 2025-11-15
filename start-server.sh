#!/bin/bash

# Patient Portal Demo - Local Development Server
# Starts a local HTTP server for testing the application

echo "🏥 Starting Patient Portal Demo..."
echo "📍 Server will be available at: http://localhost:8080"
echo "🔑 Demo credentials: demo@asembia.com / password"
echo ""
echo "Press Ctrl+C to stop the server"
echo "----------------------------------------"

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    python3 -m http.server 8080
elif command -v python &> /dev/null; then
    python -m http.server 8080
else
    echo "❌ Python not found. Please install Python to run local server."
    echo "💡 Alternative: Use any static file server of your choice"
    exit 1
fi