"""Utility functions for sandbox file operations."""

from datetime import datetime
from pathlib import Path
from typing import Optional
from core.utils.logger import logger

# Mock daytona_sdk for deployment compatibility
class MockAsyncSandbox:
    def __init__(self, *args, **kwargs):
        self.id = "mock_sandbox_id"

    async def run_command(self, *args, **kwargs):
        return MockCommandResult()

    async def upload_file(self, *args, **kwargs):
        return MockUploadResult()

    async def download_file(self, *args, **kwargs):
        return MockDownloadResult()

    async def stop(self):
        pass

class MockCommandResult:
    def __init__(self):
        self.exit_code = 0
        self.output = "Mock command executed successfully"

class MockUploadResult:
    def __init__(self):
        self.success = True

class MockDownloadResult:
    def __init__(self):
        self.success = True

# Replace daytona_sdk import with mock
AsyncSandbox = MockAsyncSandbox


async def generate_unique_filename(sandbox: AsyncSandbox, base_path: str, original_filename: str) -> str:
    """
    Generate a unique filename by appending a timestamp if the file already exists.
    
    Args:
        sandbox: The sandbox instance
        base_path: The base directory path (e.g., /workspace/uploads)
        original_filename: The original filename
        
    Returns:
        A unique filename that doesn't conflict with existing files
    """
    # Parse filename and extension
    file_path = Path(original_filename)
    name_without_ext = file_path.stem
    extension = file_path.suffix
    
    # Try original filename first
    full_path = f"{base_path}/{original_filename}"
    
    try:
        # Check if file exists by trying to list it
        files = await sandbox.fs.list_files(base_path)
        existing_files = {f.name for f in files}
        
        if original_filename not in existing_files:
            return original_filename
        
        # File exists, generate unique filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        counter = 1
        
        while True:
            unique_filename = f"{name_without_ext}_{timestamp}_{counter}{extension}"
            if unique_filename not in existing_files:
                logger.info(f"Generated unique filename: {unique_filename} (original: {original_filename})")
                return unique_filename
            counter += 1
            
    except Exception as e:
        # If the directory doesn't exist yet or there's an error, use original filename
        logger.debug(f"Could not check for existing files in {base_path}: {str(e)}")
        return original_filename


def get_uploads_directory() -> str:
    """
    Get the standard uploads directory path for sandbox file uploads.
    
    Returns:
        The path to the uploads directory
    """
    return "/workspace/uploads"

