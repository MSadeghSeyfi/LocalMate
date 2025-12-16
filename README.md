# LocalMate - Local Management Application

A beautiful, bilingual (English/Persian) application with Neumorphism design, built with FastAPI backend and vanilla JavaScript frontend.

## Features

- ✨ Beautiful Neumorphism UI Design
- 🌐 Bilingual Support (English & Persian with RTL/LTR)
- 🔐 User Authentication (Login/Register)
- 📊 User Dashboard
- 💾 SQLite Database
- 🚀 FastAPI Backend

## Tech Stack

- **Backend**: FastAPI + Python 3.9+
- **Database**: SQLite (local file-based)
- **Frontend**: HTML5 + Vanilla JavaScript
- **Styling**: Tailwind CSS + Custom Neumorphism CSS
- **Icons**: Lucide Icons

## Project Structure

```
LocalMate/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── database.py          # Database models & connection
│   ├── auth.py              # Authentication utilities
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── css/
│   │   └── neumorphism.css  # Neumorphism styles
│   ├── js/
│   │   └── auth.js          # Authentication & utilities
│   ├── login.html           # Login page
│   ├── register.html        # Registration page
│   └── dashboard.html       # User dashboard
├── database/
│   └── localmate.db         # SQLite database (auto-created)
├── Architecture.md          # Architecture documentation
└── README.md                # This file
```

## Quick Start

### Prerequisites
- Python 3.9 or higher
- Git (for cloning the repository)

### Installation & Setup

#### Windows:

1. **Clone the repository**:
```bash
git clone <repository-url>
cd LocalMate
```

2. **Run setup** (first time only):
```bash
setup.bat
```

3. **Run the application**:
```bash
run.bat
```

#### Linux/Mac:

1. **Clone the repository**:
```bash
git clone <repository-url>
cd LocalMate
```

2. **Make scripts executable** (first time only):
```bash
chmod +x setup.sh run.sh
```

3. **Run setup** (first time only):
```bash
./setup.sh
```

4. **Run the application**:
```bash
./run.sh
```

### Access the Application

Once the server is running, open your browser and navigate to:
- **Login**: http://localhost:8000/static/login.html
- **Register**: http://localhost:8000/static/register.html
- **API Documentation**: http://localhost:8000/docs

## Usage

1. **Register a new account**:
   - Go to the registration page
   - Choose your preferred language (English/فارسی)
   - Fill in username, email, and password
   - Click "Create Account"

2. **Login**:
   - Go to the login page
   - Enter your username and password
   - Click "Login"

3. **Dashboard**:
   - After login, you'll be redirected to the dashboard
   - The dashboard is currently empty and will be populated with features later
   - You can change language from the dashboard
   - Use the logout button to sign out

## Language Support

The application supports two languages:
- **English** (LTR - Left to Right)
- **فارسی** (RTL - Right to Left)

You can switch languages using the language selector at any time. The language preference is saved in your browser's local storage.

## API Endpoints

- `POST /api/register` - Register a new user
- `POST /api/login` - Login user
- `GET /api/user/me` - Get current user info

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Token expiration: 30 minutes

## Development

The dashboard is currently empty and ready for future features. You can extend it by:
- Adding new pages in the `frontend/` directory
- Creating new API endpoints in `backend/main.py`
- Extending the database models in `backend/database.py`

## Important Notes

### Virtual Environment
- The project uses an isolated Python virtual environment (`venv/`)
- This environment is **NOT** tracked in git (excluded via `.gitignore`)
- Each user must run `setup.bat` or `./setup.sh` to create their own virtual environment
- This ensures clean dependency management and avoids conflicts with global Python packages

### Database
- The database file (`database/localmate.db`) is **NOT** tracked in git
- Each user will have their own local database created automatically on first run
- User data remains private and local to each installation
- The `database/` folder structure is preserved via `.gitkeep` file

### Security
- Never commit database files containing user data
- Never commit the `venv/` folder
- All user passwords are hashed with bcrypt
- JWT tokens expire after 30 minutes
- Tokens are stored in browser's localStorage

### UI/UX
- The UI follows Neumorphism design principles throughout
- Fully responsive design for mobile and desktop
- Smooth animations and transitions

## Future Enhancements

The dashboard will be expanded with additional features in future updates.

---

**Created with LocalMate** 🚀
