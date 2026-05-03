from flask import Blueprint, request

from services.ai_service import generate_scene_description

ai_bp = Blueprint("ai", __name__)


@ai_bp.post("/visualize")
def visualize_recipe():
    data = request.get_json(silent=True) or {}
    ingredients = (data.get("ingredients") or "").strip()
    steps = (data.get("steps") or "").strip()

    if not ingredients or not steps:
        return {"error": "Ingredients and steps are required."}, 400

    scene_description = generate_scene_description(
        ingredients=ingredients,
        steps=steps,
    )
    return {"scene_description": scene_description}
