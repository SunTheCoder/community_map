from flask import Flask
# from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import click
from .models import db, Resource, User
from dotenv import load_dotenv
import os


load_dotenv() 


migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')  # Change to a strong secret key
    # app.config['SQLALCHEMY_POOL_SIZE'] = 5
    # app.config['SQLALCHEMY_MAX_OVERFLOW'] = 10
    jwt = JWTManager(app)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)

    # Import and register blueprints
    from .routes import resource_bp, user_bp
    app.register_blueprint(resource_bp, url_prefix='/api')
   
    app.register_blueprint(user_bp, url_prefix='/api')

    @app.cli.command("seed")
    @click.option("--resources", is_flag=True, help="Seed resource data")
    @click.option("--users", is_flag=True, help="Seed user data")
    def seed(resources, users):
        """Seed the database with initial data."""
        
        if resources:
            seed_resources()
        if users:
            seed_users()
        if not (resources or users):  # If no specific option is provided, seed everything
            seed_resources()
            seed_users()

        print("Database seeded successfully!")

    def seed_resources():
        resource1 = Resource(
            name="Community Food Bank",
            location="123 Main St, Townsville",
            type="food bank",
            accessibility="Wheelchair accessible",
            comments="Open daily from 9 am to 5 pm",
            accuracy=True,
            community_verified=True
        )
        resource2 = Resource(
            name="Community Fridge",
            location="456 Elm St, Townsville",
            type="community fridge",
            accessibility="24/7 accessible",
            comments="Fresh produce on weekends",
            accuracy=True,
            community_verified=False
        )
        db.session.add_all([resource1, resource2])
        db.session.commit()

    def seed_users():
        user1 = User(username="testuser", password="password123")
        db.session.add(user1)
        db.session.commit()

    return app
