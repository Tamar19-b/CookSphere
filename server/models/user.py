def user_from_row(row):
    return {
        "id": row["id"],
        "name": row["name"],
        "email": row["email"],
    }
