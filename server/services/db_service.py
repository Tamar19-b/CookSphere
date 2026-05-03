import os
import sqlite3
from contextlib import closing

from werkzeug.security import check_password_hash, generate_password_hash

from models.recipe import recipe_from_row
from models.user import user_from_row

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DB_PATH = os.path.join(BASE_DIR, "cooksphere.db")


def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db():
    with closing(get_connection()) as connection:
        cursor = connection.cursor()
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )
            """
        )
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS recipes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                ingredients TEXT NOT NULL,
                steps TEXT NOT NULL,
                image_url TEXT,
                is_public INTEGER NOT NULL DEFAULT 0,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
            """
        )
        connection.commit()


def find_user_by_email(email):
    with closing(get_connection()) as connection:
        row = connection.execute(
            "SELECT id, name, email FROM users WHERE email = ?",
            (email,),
        ).fetchone()
        return user_from_row(row) if row else None


def create_user(name, email, password):
    password_hash = generate_password_hash(password)

    with closing(get_connection()) as connection:
        cursor = connection.execute(
            """
            INSERT INTO users (name, email, password)
            VALUES (?, ?, ?)
            """,
            (name, email, password_hash),
        )
        connection.commit()
        row = connection.execute(
            "SELECT id, name, email FROM users WHERE id = ?",
            (cursor.lastrowid,),
        ).fetchone()
        return user_from_row(row)


def verify_user_credentials(email, password):
    with closing(get_connection()) as connection:
        row = connection.execute(
            "SELECT * FROM users WHERE email = ?",
            (email,),
        ).fetchone()
        if not row or not check_password_hash(row["password"], password):
            return None
        return user_from_row(row)


def create_recipe(user_id, title, ingredients, steps, image_url=None):
    with closing(get_connection()) as connection:
        cursor = connection.execute(
            """
            INSERT INTO recipes (user_id, title, ingredients, steps, image_url)
            VALUES (?, ?, ?, ?, ?)
            """,
            (user_id, title, ingredients, steps, image_url),
        )
        connection.commit()
        return get_recipe_by_id(cursor.lastrowid, requester_id=user_id)


def get_public_recipes():
    with closing(get_connection()) as connection:
        rows = connection.execute(
            """
            SELECT recipes.*, users.name AS author_name
            FROM recipes
            JOIN users ON users.id = recipes.user_id
            WHERE recipes.is_public = 1
            ORDER BY recipes.id DESC
            """
        ).fetchall()
        return [recipe_from_row(row) for row in rows]


def get_user_recipes(user_id):
    with closing(get_connection()) as connection:
        rows = connection.execute(
            """
            SELECT recipes.*, users.name AS author_name
            FROM recipes
            JOIN users ON users.id = recipes.user_id
            WHERE recipes.user_id = ?
            ORDER BY recipes.id DESC
            """,
            (user_id,),
        ).fetchall()
        return [recipe_from_row(row) for row in rows]


def get_recipe_by_id(recipe_id, requester_id=None):
    with closing(get_connection()) as connection:
        row = connection.execute(
            """
            SELECT recipes.*, users.name AS author_name
            FROM recipes
            JOIN users ON users.id = recipes.user_id
            WHERE recipes.id = ?
            """,
            (recipe_id,),
        ).fetchone()
        if not row:
            return None

        recipe = recipe_from_row(row)
        if recipe["is_public"] or requester_id == recipe["user_id"]:
            return recipe
        return None


def update_recipe(recipe_id, user_id, title, ingredients, steps, image_url=None):
    with closing(get_connection()) as connection:
        cursor = connection.execute(
            """
            UPDATE recipes
            SET title = ?, ingredients = ?, steps = ?, image_url = ?
            WHERE id = ? AND user_id = ?
            """,
            (title, ingredients, steps, image_url, recipe_id, user_id),
        )
        connection.commit()
        if cursor.rowcount == 0:
            return None
        return get_recipe_by_id(recipe_id, requester_id=user_id)


def delete_recipe(recipe_id, user_id):
    with closing(get_connection()) as connection:
        cursor = connection.execute(
            "DELETE FROM recipes WHERE id = ? AND user_id = ?",
            (recipe_id, user_id),
        )
        connection.commit()
        return cursor.rowcount > 0


def toggle_recipe_public_status(recipe_id, user_id):
    with closing(get_connection()) as connection:
        row = connection.execute(
            "SELECT is_public FROM recipes WHERE id = ? AND user_id = ?",
            (recipe_id, user_id),
        ).fetchone()
        if not row:
            return None

        next_value = 0 if row["is_public"] else 1
        connection.execute(
            "UPDATE recipes SET is_public = ? WHERE id = ? AND user_id = ?",
            (next_value, recipe_id, user_id),
        )
        connection.commit()
        return get_recipe_by_id(recipe_id, requester_id=user_id)
