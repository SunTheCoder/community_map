from flask import Blueprint, request, jsonify, current_app
import traceback
from app.models import db, Resource, User, Notification
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required, get_jwt_identity

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/auth', methods=['POST'])
def auth():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    zip_code = data.get('zipCode')
    print(zip_code)

    # Check if the username and password are provided
    if not username or not password or not zip_code:
        return jsonify({"error": "Username, password, and ZIP code are required"}), 400

    # Check if the user already exists
    user = User.query.filter_by(username=username).first()

    if user:
        # Attempt login if user exists
        if user.check_password(password):
            access_token = create_access_token(identity=user.id)
            return jsonify({"message": "Login successful", "access_token": access_token, "username": username, "is_admin": user.is_admin}), 200
        else:
            return jsonify({"error": "Invalid password"}), 401
    else:
        # Register new user if they don't exist
        new_user = User(username=username, zip_code=zip_code)
        new_user.set_password(password)  # Hash the password

        try:
            db.session.add(new_user)
            db.session.commit()
            access_token = create_access_token(identity=new_user.id)
            return jsonify({"message": "Account created", "access_token": access_token}), 201
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Error creating account: {str(e)}")
            return jsonify({"error": "An error occurred while creating the account"}), 500
        
@auth_bp.route('/auth/user', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user.serialize())
