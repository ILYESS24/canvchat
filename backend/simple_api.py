#!/usr/bin/env python3
"""
Simplified API for stable deployment on Render
"""

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import asyncio
import os

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Starting AI Worker API...")
    yield
    print("🛑 Shutting down AI Worker API...")

app = FastAPI(
    title="AI Worker API",
    description="Simple API for AI Worker interface",
    version="1.0.0",
    lifespan=lifespan
)

# API Routes
@app.get("/api")
async def api_root():
    """API root endpoint."""
    return {
        "message": "🚀 Kortix AI Worker Backend",
        "description": "This is the backend API for Kortix AI Workspace.",
        "version": "1.0.0",
        "status": "operational",
        "frontend": "Frontend is served from the root path (/)",
        "endpoints": {
            "health": "/v1/health",
            "agents": "/v1/agents",
            "test": "/test"
        }
    }

@app.get("/test")
async def test_endpoint():
    """Simple test endpoint."""
    return {
        "status": "ok",
        "message": "AI Worker API is working!",
        "timestamp": "2025-01-09"
    }

@app.get("/")
async def root():
    """Serve the frontend index page."""
    print("🏠 Root route called")
    index_path = os.path.join(static_dir, "index.html")
    print(f"📄 Index path: {index_path}")
    print(f"📄 Index exists: {os.path.exists(index_path)}")

    if os.path.exists(index_path):
        print("✅ Serving root index.html")
        from fastapi.responses import FileResponse
        return FileResponse(index_path, media_type="text/html")
    else:
        print("❌ Root index.html not found - returning diagnostic info")
        # Return a simple HTML page with diagnostic info
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Kortix - Diagnostic</title>
            <style>
                body {{ font-family: Arial, sans-serif; padding: 20px; }}
                .error {{ color: red; }}
                .info {{ color: blue; }}
            </style>
        </head>
        <body>
            <h1>🚀 Kortix AI Worker Backend</h1>
            <p>This is the backend API for Kortix AI Workspace.</p>

            <h2>🔍 Diagnostic Information</h2>
            <p><strong>Static directory:</strong> {static_dir}</p>
            <p><strong>Static dir exists:</strong> {os.path.exists(static_dir) if static_dir else False}</p>
            <p><strong>Index path:</strong> {index_path}</p>
            <p><strong>Index exists:</strong> {os.path.exists(index_path)}</p>

            <h3>API Status</h3>
            <div id="api-status">Checking...</div>

            <script>
                fetch('/v1/health')
                    .then(response => response.json())
                    .then(data => {{
                        document.getElementById('api-status').innerHTML =
                            '✅ ' + data.service + ' - ' + data.status;
                        document.getElementById('api-status').style.color = 'green';
                    }})
                    .catch(error => {{
                        document.getElementById('api-status').innerHTML = '❌ API not responding';
                        document.getElementById('api-status').style.color = 'red';
                    }});
            </script>
        </body>
        </html>
        """
        from fastapi.responses import HTMLResponse
        return HTMLResponse(content=html_content)

@app.get("/v1/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "AI Worker Backend",
        "version": "1.0.0"
    }

@app.get("/v1/agents")
async def get_agents():
    """Get available AI agents."""
    return {
        "agents": [
            {
                "id": "data-analyst",
                "name": "Data Analyst",
                "description": "Analyzes data and creates reports",
                "avatar": "🧠",
                "status": "active"
            },
            {
                "id": "code-assistant",
                "name": "Code Assistant",
                "description": "Helps with programming and development",
                "avatar": "💻",
                "status": "active"
            },
            {
                "id": "content-writer",
                "name": "Content Writer",
                "description": "Creates content and marketing materials",
                "avatar": "📝",
                "status": "active"
            }
        ],
        "total": 3,
        "status": "success"
    }

# Mount static files for the frontend from project root (static folder contains frontend)
# Try multiple possible paths since Render deployment structure might be different
possible_paths = [
    os.path.join(os.path.dirname(os.path.dirname(__file__)), "static"),  # Standard path
    os.path.join(os.getcwd(), "static"),  # Current working directory
    "/opt/render/project/src/static",  # Render specific path
    "static"  # Relative path as fallback
]

static_dir = None
for path in possible_paths:
    print(f"🔍 Checking static path: {path}")
    if os.path.exists(path) and os.path.isdir(path):
        static_dir = path
        print(f"✅ Found static directory: {static_dir}")
        break

if static_dir is None:
    print("❌ No static directory found in any of the expected locations!")
    static_dir = possible_paths[0]  # Use first path as fallback

if os.path.exists(static_dir):
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")
    print(f"✅ Static files mounted from: {static_dir}")
    # List files in static directory
    try:
        files = os.listdir(static_dir)
        print(f"📄 Files in static directory: {files}")
    except Exception as e:
        print(f"❌ Error listing static directory: {e}")
else:
    print(f"❌ Static directory not found: {static_dir}")
    print("❌ This is why you're not seeing the frontend!")

# SPA catch-all route for frontend routing
@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    """Serve the frontend for all non-API routes (SPA support)."""
    print(f"🌐 Frontend route called with path: '{full_path}'")

    # Don't interfere with API routes
    if full_path.startswith(("api", "docs", "redoc", "openapi.json", "test", "v1/")):
        print(f"🚫 API route detected: {full_path}")
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="API endpoint not found")

    # Serve index.html for all other routes (SPA routing)
    index_path = os.path.join(static_dir, "index.html")
    print(f"📄 Looking for index.html at: {index_path}")
    print(f"📄 Index file exists: {os.path.exists(index_path)}")

    if os.path.exists(index_path):
        print("✅ Serving index.html")
        from fastapi.responses import FileResponse
        return FileResponse(index_path, media_type="text/html")
    else:
        print("❌ Index.html not found")
        return {"error": "Frontend not available", "message": "Static files not found", "path": full_path}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
