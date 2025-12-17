import bcrypt
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
import hashlib

# Security config
SECRET_KEY = "your-secret-key-change-this-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def _normalize_password(password: str) -> str:
    """Normalize password to handle bcrypt's 72-byte limit"""
    # If password is longer than 72 bytes, hash it first with SHA256
    if len(password.encode('utf-8')) > 72:
        return hashlib.sha256(password.encode('utf-8')).hexdigest()
    return password

def verify_password(plain_password: str, hashed_password: str) -> bool:
    normalized = _normalize_password(plain_password)
    return bcrypt.checkpw(normalized.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password: str) -> str:
    normalized = _normalize_password(password)
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(normalized.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
