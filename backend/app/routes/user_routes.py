from flask import Blueprint, request, jsonify, current_app
import traceback
from app.models import db, Resource, User, Notification
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required, get_jwt_identity

user_bp = Blueprint('users', __name__)

@user_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    print("Received data:", data)  # Debugging line
    
    # Check if required data is provided
    if 'username' not in data or 'password' not in data:
        return jsonify({"error": "Username and password are required"}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"error": "Username already exists"}), 409  # Conflict status code

    new_user = User(username=data['username'])
    new_user.set_password(data['password'])  # Hash password

    # Try adding and committing to the database, catch any errors
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        db.session.rollback()
        print("Error:", e)  # Print error message
        return jsonify({"error": "Failed to register user"}), 500


@user_bp.route('/login', methods=['POST'])
def login():
    data = request.json

    if 'username' not in data or 'password' not in data:
        return jsonify({"error": "Username and password are required"}), 400
    
    user = User.query.filter_by(username=data['username']).first()
    
    if user and user.check_password(data['password']):
        # Generate a JWT token
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401
    

@user_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    return jsonify({"message": f"Access granted to user {current_user_id}"}), 200


@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    current_user_id = get_jwt_identity()

    # Assuming `User.is_admin` is a field indicating admin privileges
    current_user = User.query.get(current_user_id)
    if not current_user.is_admin and current_user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    try:
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted"}), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error deleting user {user_id}: {str(e)}")
        return jsonify({"error": "An error occurred while deleting the user"}), 500



@user_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():    
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user.is_admin:
        return jsonify({"error": "Unauthorized"}), 403

    users = User.query.all()
    return jsonify([user.serialize() for user in users])

@user_bp.route('/delete-all-users', methods=['DELETE'])
def delete_all_users():
    db.session.query(User).delete()
    db.session.commit()
    return jsonify({"message": "All users deleted"}), 200
