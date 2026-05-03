from flask import Flask
from flask_cors import CORS

from routes.ai import ai_bp
from routes.auth import auth_bp
from routes.recipes import recipes_bp
from services.db_service import init_db


def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = "cooksphere-dev-secret"
    app.config["JSON_AS_ASCII"] = False

    CORS(
        app,
        supports_credentials=True,
        resources={
            r"/*": {
                "origins": [
                    "http://localhost:3000",
                    "http://localhost:3001",
                    "http://127.0.0.1:3000",
                    "http://127.0.0.1:3001",
                ]
            }
        },
    )

    init_db()

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(recipes_bp, url_prefix="/recipes")
    app.register_blueprint(ai_bp, url_prefix="/ai")

    @app.get("/health")
    def health_check():
        return {"status": "ok", "service": "CookSphere API"}

    return app


app = create_app()


if __name__ == "__main__":
    app.run(debug=True, port=5000)
