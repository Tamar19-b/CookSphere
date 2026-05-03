def generate_scene_description(ingredients, steps):
    normalized_ingredients = [
        item.strip()
        for item in ingredients.replace("\n", ",").split(",")
        if item.strip()
    ]
    step_lines = [line.strip() for line in steps.splitlines() if line.strip()]
    if not step_lines:
        step_lines = [chunk.strip() for chunk in steps.split(".") if chunk.strip()]

    highlight = ", ".join(normalized_ingredients[:4]) or "fresh ingredients"
    descriptions = []

    for index, step in enumerate(step_lines[:8], start=1):
        if index == 1:
            scene = (
                f"Step {index}: A bright kitchen counter is arranged with {highlight}, "
                f"while the cook begins: {step.lower()}."
            )
        elif index == len(step_lines[:8]):
            scene = (
                f"Step {index}: The final touches come together as the dish is plated "
                f"beautifully, capturing the moment to {step.lower()}."
            )
        else:
            scene = (
                f"Step {index}: A close-up cooking moment shows texture, steam, and motion "
                f"as the cook works through: {step.lower()}."
            )
        descriptions.append(scene)

    if not descriptions:
        descriptions = [
            "Step 1: A clean prep station displays the ingredients, ready for cooking.",
            "Step 2: The cooking process becomes lively with color, texture, and movement.",
            "Step 3: The finished dish is plated in a warm, inviting serving scene.",
        ]

    return descriptions
