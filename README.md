# CookSphere

CookSphere is a full-stack social recipe platform that blends community sharing with a lightweight AI experience. Users can register, log in, manage private recipes, publish dishes to a public feed, and generate a visual storyboard that describes the cooking journey step by step.

The project is structured like a small startup product rather than a classroom demo: a separated Flask backend, a React frontend, clean REST endpoints, session-based authentication, recipe privacy controls, and polished UI states for loading, empty views, and errors.

## What the product does

- User registration and login
- Personal dashboard for recipe management
- Create, edit, delete, and publish recipes
- Public social feed for shared recipes
- AI-style visualization endpoint that turns ingredients and steps into storyboard text scenes
- Protection for private recipes so only the owner can access them

## Tech stack

### Backend

- Python
- Flask
- REST API
- SQLite
- Session authentication with Flask cookies

### Frontend

- React with Hooks
- React Router
- Fetch API
- Clean custom CSS

## Project structure

```text
CookSphere/
├── server/
│   ├── app.py
│   ├── cooksphere.db
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── requirements.txt
├── client/
│   ├── package.json
│   ├── public/
│   └── src/
└── README.md
```

## Backend folder layout

```text
server/
  app.py
  routes/
    auth.py
    recipes.py
    ai.py
  services/
    ai_service.py
    db_service.py
  models/
    user.py
    recipe.py
```

## API overview

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

### Recipes

- `GET /recipes` - list all public recipes
- `GET /recipes/my` - list recipes for the logged-in user
- `GET /recipes/<id>` - get a recipe if it is public or owned by the current user
- `POST /recipes` - create a recipe
- `PUT /recipes/<id>` - update a recipe
- `DELETE /recipes/<id>` - delete a recipe
- `POST /recipes/<id>/toggle-public` - switch between private and public

### AI

- `POST /ai/visualize`

Request body:

```json
{
  "ingredients": "Tomatoes, garlic, olive oil, basil",
  "steps": "Chop the tomatoes.\nSaute the garlic.\nSimmer everything together."
}
```

Response body:

```json
{
  "scene_description": [
    "Step 1: A bright kitchen counter is arranged with tomatoes, garlic, olive oil, basil, while the cook begins: chop the tomatoes.",
    "Step 2: A close-up cooking moment shows texture, steam, and motion as the cook works through: saute the garlic.",
    "Step 3: The final touches come together as the dish is plated beautifully, capturing the moment to simmer everything together."
  ]
}
```

## Local setup

### 1. Run the backend

From the project root:

```bash
cd server
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The Flask API runs on `http://localhost:5000`.

### 2. Run the frontend

Open a second terminal:

```bash
cd client
npm install
npm start
```

The React app runs on `http://localhost:3000`.

## Example API calls

### Register

```bash
curl -X POST http://localhost:5000/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Tamar\",\"email\":\"tamar@example.com\",\"password\":\"secret123\"}"
```

### Login

```bash
curl -X POST http://localhost:5000/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"tamar@example.com\",\"password\":\"secret123\"}"
```

### Create recipe

```bash
curl -X POST http://localhost:5000/recipes ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"Shakshuka\",\"ingredients\":\"Eggs, tomatoes, garlic\",\"steps\":\"Saute garlic.\nAdd tomatoes.\nCrack eggs and cook.\"}"
```

### Visualize recipe

```bash
curl -X POST http://localhost:5000/ai/visualize ^
  -H "Content-Type: application/json" ^
  -d "{\"ingredients\":\"Eggs, tomatoes, garlic\",\"steps\":\"Saute garlic.\nAdd tomatoes.\nCrack eggs and cook.\"}"
```

## Why this project is interesting

CookSphere combines three product ideas that work well together:

- A practical CRUD application with real user value
- A social discovery layer through public recipe publishing
- An AI-inspired experience that makes recipes feel richer and more interactive

That combination makes it a strong portfolio project because it demonstrates backend design, frontend UX, API integration, access control, and product thinking in one coherent system.

## Notes

- The AI visualization currently uses a local mock service, so no external API key is required.
- SQLite is created automatically on first backend run.
- Authentication is cookie-based, so the frontend sends requests with `credentials: "include"`.
