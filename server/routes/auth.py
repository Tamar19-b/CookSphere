from flask import Blueprint, request, session

from services.db_service import create_user, find_user_by_email, verify_user_credentials

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not name or not email or not password:
        return {"error": "Name, email, and password are required."}, 400

    if find_user_by_email(email):
        return {"error": "An account with this email already exists."}, 409

    user = create_user(name=name, email=email, password=password)
    session["user_id"] = user["id"]
    session["user_name"] = user["name"]

    return {"message": "Registration successful.", "user": user}, 201


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return {"error": "Email and password are required."}, 400

    user = verify_user_credentials(email=email, password=password)
    if not user:
        return {"error": "Invalid email or password."}, 401

    session["user_id"] = user["id"]
    session["user_name"] = user["name"]

    return {"message": "Login successful.", "user": user}


@auth_bp.post("/logout")
def logout():
    session.clear()
    return {"message": "Logged out successfully."}


@auth_bp.get("/me")
def me():
    user_id = session.get("user_id")
    if not user_id:
        return {"user": None}, 401

    return {
        "user": {
            "id": user_id,
            "name": session.get("user_name"),
        }
    }
