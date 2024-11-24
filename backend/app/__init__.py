from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .models import db
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize extensions
migrate = Migrate()

def create_app():
    app = Flask(__name__)

    # Configure app settings
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 3600  # Token lasts for 1 hour


    # Initialize JWT
    jwt = JWTManager(app)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173", "methods": ["GET", "POST", "OPTIONS", "PUT", "DELETE"]}})


    # Register Blueprints
    from .routes import resource_bp, user_bp, auth_bp, post_bp, reply_bp  # Import the blueprints
    app.register_blueprint(resource_bp, url_prefix='/api')
    app.register_blueprint(user_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(post_bp, url_prefix='/api') 
    app.register_blueprint(reply_bp, url_prefix='/api')  # Register the reply routes


    return app
