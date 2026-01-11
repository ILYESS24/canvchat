# Central MCP mocks for deployment compatibility
import asyncio
from typing import Dict, List, Any, Optional, Tuple, AsyncGenerator
from dataclasses import dataclass

class MockClientSession:
    def __init__(self, *args, **kwargs):
        pass

    async def initialize(self):
        pass

    async def list_tools(self):
        return {"tools": []}

    async def call_tool(self, name: str, arguments: Dict[str, Any]):
        return {"content": [{"type": "text", "text": f"Mock MCP tool '{name}' executed with args: {arguments}"}]}

    async def list_resources(self):
        return {"resources": []}

    async def read_resource(self, uri: str):
        return {"contents": [{"uri": uri, "mimeType": "text/plain", "text": f"Mock content for {uri}"}]}

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        pass

class MockStdioServerParameters:
    def __init__(self, command: str, args=None, env=None):
        self.command = command
        self.args = args or []
        self.env = env or {}

class MockSSEClient:
    def __init__(self, *args, **kwargs):
        pass

    async def __aenter__(self):
        return (MockClientSession(), None)

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        pass

class MockStdioClient:
    def __init__(self, *args, **kwargs):
        pass

    async def __aenter__(self):
        return (MockClientSession(), None)

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        pass

class MockStreamableHTTPClient:
    def __init__(self, *args, **kwargs):
        pass

    async def __aenter__(self):
        return (MockClientSession(), None)

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        pass

# Mock modules
class MockMCPClient:
    sse = MockSSEClient
    stdio = MockStdioClient
    streamable_http = MockStreamableHTTPClient

class MockMCPModule:
    ClientSession = MockClientSession
    StdioServerParameters = MockStdioServerParameters
    client = MockMCPClient()

# Export mocks
ClientSession = MockClientSession
StdioServerParameters = MockStdioServerParameters
sse_client = MockSSEClient()
stdio_client = MockStdioClient()
streamablehttp_client = MockStreamableHTTPClient()
