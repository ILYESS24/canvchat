#!/usr/bin/env python3
import os
import sys
sys.path.insert(0, os.path.dirname(__file__))
from api import app
import uvicorn
port = int(os.environ.get("PORT", "8000"))
print(f"Starting on port {port}")
uvicorn.run(app, host="0.0.0.0", port=port)
