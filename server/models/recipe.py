def recipe_from_row(row):
    return {
        "id": row["id"],
        "user_id": row["user_id"],
        "title": row["title"],
        "ingredients": row["ingredients"],
        "steps": row["steps"],
        "image_url": row["image_url"],
        "is_public": bool(row["is_public"]),
        "author_name": row["author_name"] if "author_name" in row.keys() else None,
    }
