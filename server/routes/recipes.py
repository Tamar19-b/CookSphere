from flask import Blueprint, request, session

from services.db_service import (
    create_recipe,
    delete_recipe,
    get_public_recipes,
    get_recipe_by_id,
    get_user_recipes,
    toggle_recipe_public_status,
    update_recipe,
)

recipes_bp = Blueprint("recipes", __name__)


def _require_auth():
    user_id = session.get("user_id")
    if not user_id:
        return None, ({"error": "Authentication required."}, 401)
    return user_id, None


@recipes_bp.get("")
def list_public_recipes():
    return {"recipes": get_public_recipes()}


@recipes_bp.get("/my")
def list_my_recipes():
    user_id, error = _require_auth()
    if error:
        return error

    return {"recipes": get_user_recipes(user_id)}


@recipes_bp.get("/<int:recipe_id>")
def get_recipe(recipe_id):
    user_id = session.get("user_id")
    recipe = get_recipe_by_id(recipe_id=recipe_id, requester_id=user_id)
    if not recipe:
        return {"error": "Recipe not found or unavailable."}, 404

    return {"recipe": recipe}


@recipes_bp.post("")
def add_recipe():
    user_id, error = _require_auth()
    if error:
        return error

    data = request.get_json(silent=True) or {}
    title = (data.get("title") or "").strip()
    ingredients = (data.get("ingredients") or "").strip()
    steps = (data.get("steps") or "").strip()
    image_url = (data.get("image_url") or "").strip() or None

    if not title or not ingredients or not steps:
        return {"error": "Title, ingredients, and steps are required."}, 400

    recipe = create_recipe(
        user_id=user_id,
        title=title,
        ingredients=ingredients,
        steps=steps,
        image_url=image_url,
    )
    return {"message": "Recipe created successfully.", "recipe": recipe}, 201


@recipes_bp.put("/<int:recipe_id>")
def edit_recipe(recipe_id):
    user_id, error = _require_auth()
    if error:
        return error

    data = request.get_json(silent=True) or {}
    title = (data.get("title") or "").strip()
    ingredients = (data.get("ingredients") or "").strip()
    steps = (data.get("steps") or "").strip()
    image_url = (data.get("image_url") or "").strip() or None

    if not title or not ingredients or not steps:
        return {"error": "Title, ingredients, and steps are required."}, 400

    recipe = update_recipe(
        recipe_id=recipe_id,
        user_id=user_id,
        title=title,
        ingredients=ingredients,
        steps=steps,
        image_url=image_url,
    )
    if not recipe:
        return {"error": "Recipe not found or access denied."}, 404

    return {"message": "Recipe updated successfully.", "recipe": recipe}


@recipes_bp.delete("/<int:recipe_id>")
def remove_recipe(recipe_id):
    user_id, error = _require_auth()
    if error:
        return error

    deleted = delete_recipe(recipe_id=recipe_id, user_id=user_id)
    if not deleted:
        return {"error": "Recipe not found or access denied."}, 404

    return {"message": "Recipe deleted successfully."}


@recipes_bp.post("/<int:recipe_id>/toggle-public")
def toggle_public(recipe_id):
    user_id, error = _require_auth()
    if error:
        return error

    recipe = toggle_recipe_public_status(recipe_id=recipe_id, user_id=user_id)
    if not recipe:
        return {"error": "Recipe not found or access denied."}, 404

    return {"message": "Recipe visibility updated.", "recipe": recipe}
