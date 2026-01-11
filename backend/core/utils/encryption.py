"""
Simple encryption utilities for credential profiles.
"""

import os
import base64
from cryptography.fernet import Fernet
from core.utils.logger import logger


def get_encryption_key() -> bytes:
    """Get or create encryption key for credentials."""
    key_env = os.getenv("MCP_CREDENTIAL_ENCRYPTION_KEY")

    env_mode = os.getenv("ENV_MODE", "LOCAL").upper()

    logger.debug(f"MCP encryption key check - ENV_MODE: {env_mode}, MCP_CREDENTIAL_ENCRYPTION_KEY: {'set' if key_env else 'not set'}")

    if key_env:
        try:
            # Fernet expects the key as a base64-encoded byte string
            if isinstance(key_env, str):
                key_bytes = key_env.encode('utf-8')
            else:
                key_bytes = key_env

            # Validate the key by trying to create a Fernet instance
            Fernet(key_bytes)
            return key_bytes
        except Exception as e:
            logger.error(f"❌ Invalid Fernet encryption key: {e}")
            logger.error(f"❌ Key value (first 20 chars): {key_env[:20] if key_env else 'None'}...")
            logger.error(f"❌ Key length: {len(key_env) if key_env else 0} characters")
            logger.error("The MCP_CREDENTIAL_ENCRYPTION_KEY must be a valid 32-byte base64-encoded Fernet key")
            logger.error("Generate a new key with: python3 -c \"from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())\"")
            logger.error(f"Current ENV_MODE: {env_mode}")
            logger.error("Check your Render environment variables - MCP_CREDENTIAL_ENCRYPTION_KEY is set to an invalid value")
            raise ValueError(f"Invalid Fernet encryption key: {e}")

    # Handle missing key based on environment
    if env_mode == "LOCAL":
        # Generate a new key as fallback for local development
        logger.warning("No MCP_CREDENTIAL_ENCRYPTION_KEY found in LOCAL environment, generating new key")
        key = Fernet.generate_key()
        logger.info(f"Generated new encryption key. Set MCP_CREDENTIAL_ENCRYPTION_KEY={key.decode()} in your environment")
        return key
    else:
        # In PRODUCTION/STAGING, require encryption key to be set
        logger.error("❌ MCP_CREDENTIAL_ENCRYPTION_KEY environment variable is required in production/staging")
        logger.error("Set MCP_CREDENTIAL_ENCRYPTION_KEY to a valid Fernet key in your deployment environment")
        logger.error("Generate a key with: python3 -c \"from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())\"")
        raise ValueError("MCP_CREDENTIAL_ENCRYPTION_KEY environment variable must be set in production/staging environments")


def encrypt_data(data: str) -> str:
    """
    Encrypt a string and return base64 encoded encrypted data.
    
    Args:
        data: String data to encrypt
        
    Returns:
        Base64 encoded encrypted string
    """
    encryption_key = get_encryption_key()
    cipher = Fernet(encryption_key)
    
    # Convert string to bytes
    data_bytes = data.encode('utf-8')
    
    # Encrypt the data
    encrypted_bytes = cipher.encrypt(data_bytes)
    
    # Return base64 encoded string
    return base64.b64encode(encrypted_bytes).decode('utf-8')


def decrypt_data(encrypted_data: str) -> str:
    """
    Decrypt base64 encoded encrypted data and return the original string.
    
    Args:
        encrypted_data: Base64 encoded encrypted string
        
    Returns:
        Decrypted string
    """
    encryption_key = get_encryption_key()
    cipher = Fernet(encryption_key)
    
    # Decode base64 to get encrypted bytes
    encrypted_bytes = base64.b64decode(encrypted_data.encode('utf-8'))
    
    # Decrypt the data
    decrypted_bytes = cipher.decrypt(encrypted_bytes)
    
    # Return as string
    return decrypted_bytes.decode('utf-8') 