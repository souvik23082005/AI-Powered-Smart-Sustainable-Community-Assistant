from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

from routes.auth import auth_bp
from routes.complaints import complaint_bp
from routes.chatbot import chatbot_bp
from routes.carbon import carbon_bp

app = Flask(__name__)

# Upload folder configuration
UPLOAD_FOLDER = "uploads"

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Automatically create uploads folder if it doesn't exist
os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)

CORS(app)

from datetime import timedelta

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super_secret_key_32_bytes_minimum_length_fallback_key")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)

jwt = JWTManager(app)

from flask import send_from_directory

# Register routes
app.register_blueprint(auth_bp)
app.register_blueprint(complaint_bp)
app.register_blueprint(chatbot_bp)
app.register_blueprint(carbon_bp)

@app.route("/")
def home():
    return {
        "message":"AI Smart Community Backend Running"
    }

@app.route("/uploads/<path:filename>")
def get_upload(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

if __name__ == "__main__":
    debug_mode = os.getenv("FLASK_DEBUG", "True").lower() in ("true", "1", "t")
    app.run(debug=debug_mode)