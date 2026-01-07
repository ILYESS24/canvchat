#!/usr/bin/env python3
"""
Render startup script for Suna backend
"""
import os
import sys

# Add the backend directory to Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Detect Render environment and skip Docker setup
if os.environ.get("RENDER") or os.environ.get("PORT"):
    print("🚀 Starting Suna API in Render environment...")

    # Import and run the FastAPI app directly
    from api import app
    import uvicorn

    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        reload=False,
        log_level="info"
    )
else:
    print("⚠️  Setup method not detected. Run './setup.py' first or using Docker Compose as default.")
    print("Docker Setup Detected")
    print("Managing all Suna services with Docker Compose...")
    print("")
    print("❌ Docker is not running or not installed.")
    print("Please start Docker and try again.")
