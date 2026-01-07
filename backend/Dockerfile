# Dockerfile for Kortix Backend (Render)
FROM python:3.11-slim

# Set environment variables
ENV ENV_MODE=production
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE $PORT

# Start command
CMD ["sh", "-c", "uvicorn api:app --host 0.0.0.0 --port $PORT"]