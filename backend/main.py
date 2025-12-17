from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field, model_validator
from typing import Optional, List
from datetime import timedelta, datetime
import os

from database import get_db, init_db, User, Task, TimeEntry
from auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    verify_token,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

app = FastAPI(title="LocalMate API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
init_db()

# Mount static files
frontend_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
app.mount("/static", StaticFiles(directory=frontend_path), name="static")

# Pydantic models
class UserRegister(BaseModel):
    username: str
    password: str = Field(..., min_length=6, max_length=1000)
    confirm_password: str = Field(..., min_length=6, max_length=1000)
    language: Optional[str] = "en"

    @model_validator(mode='after')
    def check_passwords_match(self):
        if self.password != self.confirm_password:
            raise ValueError('Passwords do not match')
        return self

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    username: str
    language: str

class UserResponse(BaseModel):
    id: int
    username: str
    language: str

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: datetime

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None

class TaskResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str]
    due_date: datetime
    is_completed: bool
    created_at: datetime
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True

class TimeEntryCreate(BaseModel):
    task_id: int
    duration_minutes: int = Field(..., gt=0, le=600)  # Max 600 minutes (10 hours)

class TimeEntryResponse(BaseModel):
    id: int
    user_id: int
    task_id: int
    duration_minutes: int
    start_time: datetime
    end_time: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True

# Helper function to get current user
def get_current_user_from_token(token: str, db: Session):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    username = payload.get("sub")
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

@app.post("/api/register", response_model=Token)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    # Check if username exists
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        username=user_data.username,
        hashed_password=hashed_password,
        language=user_data.language
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user.username}, expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": new_user.username,
        "language": new_user.language
    }

@app.post("/api/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == user_data.username).first()
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": user.username,
        "language": user.language
    }

@app.get("/api/user/me", response_model=UserResponse)
def get_current_user(token: str, db: Session = Depends(get_db)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    username = payload.get("sub")
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user.id,
        "username": user.username,
        "language": user.language
    }

# Task endpoints
@app.post("/api/tasks", response_model=TaskResponse)
def create_task(task_data: TaskCreate, token: str, db: Session = Depends(get_db)):
    user = get_current_user_from_token(token, db)

    new_task = Task(
        user_id=user.id,
        title=task_data.title,
        description=task_data.description,
        due_date=task_data.due_date
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task

@app.get("/api/tasks", response_model=List[TaskResponse])
def get_tasks(token: str, db: Session = Depends(get_db)):
    user = get_current_user_from_token(token, db)
    tasks = db.query(Task).filter(Task.user_id == user.id).order_by(Task.due_date).all()
    return tasks

@app.put("/api/tasks/{task_id}/complete", response_model=TaskResponse)
def complete_task(task_id: int, token: str, db: Session = Depends(get_db)):
    user = get_current_user_from_token(token, db)

    task = db.query(Task).filter(Task.id == task_id, Task.user_id == user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.is_completed = not task.is_completed
    task.completed_at = datetime.utcnow() if task.is_completed else None
    db.commit()
    db.refresh(task)

    return task

@app.put("/api/tasks/{task_id}/move-to-today", response_model=TaskResponse)
def move_task_to_today(task_id: int, token: str, db: Session = Depends(get_db)):
    user = get_current_user_from_token(token, db)

    task = db.query(Task).filter(Task.id == task_id, Task.user_id == user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Set due_date to today
    today = datetime.now().replace(hour=23, minute=59, second=59, microsecond=0)
    task.due_date = today
    db.commit()
    db.refresh(task)

    return task

@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: int, token: str, db: Session = Depends(get_db)):
    user = get_current_user_from_token(token, db)

    task = db.query(Task).filter(Task.id == task_id, Task.user_id == user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()

    return {"message": "Task deleted successfully"}

# Time Entry endpoints
@app.post("/api/time-entries", response_model=TimeEntryResponse)
def create_time_entry(entry_data: TimeEntryCreate, token: str, db: Session = Depends(get_db)):
    user = get_current_user_from_token(token, db)

    # Verify task belongs to user
    task = db.query(Task).filter(Task.id == entry_data.task_id, Task.user_id == user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Create time entry
    start_time = datetime.utcnow()
    end_time = start_time + timedelta(minutes=entry_data.duration_minutes)

    new_entry = TimeEntry(
        user_id=user.id,
        task_id=entry_data.task_id,
        duration_minutes=entry_data.duration_minutes,
        start_time=start_time,
        end_time=end_time
    )
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)

    return new_entry

@app.get("/api/time-entries", response_model=List[TimeEntryResponse])
def get_time_entries(token: str, task_id: Optional[int] = None, db: Session = Depends(get_db)):
    user = get_current_user_from_token(token, db)

    query = db.query(TimeEntry).filter(TimeEntry.user_id == user.id)

    if task_id:
        query = query.filter(TimeEntry.task_id == task_id)

    entries = query.order_by(TimeEntry.created_at.desc()).all()
    return entries

@app.get("/api/tasks/{task_id}/total-time")
def get_task_total_time(task_id: int, token: str, db: Session = Depends(get_db)):
    user = get_current_user_from_token(token, db)

    # Verify task belongs to user
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Calculate total time
    total_minutes = db.query(TimeEntry).filter(
        TimeEntry.task_id == task_id,
        TimeEntry.user_id == user.id
    ).with_entities(TimeEntry.duration_minutes).all()

    total = sum([entry[0] for entry in total_minutes])

    return {
        "task_id": task_id,
        "total_minutes": total,
        "total_hours": round(total / 60, 2)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
