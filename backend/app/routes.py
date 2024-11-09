from flask import Blueprint, request, jsonify, current_app
import traceback
from .models import db, Resource, User, Notification
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required, get_jwt_identity




resource_bp = Blueprint('resources', __name__)
user_bp = Blueprint('users', __name__)
auth_bp = Blueprint('auth', __name__)

@resource_bp.route('/resources', methods=['POST'])
def create_resource():
    print("POST /resources hit")  # Debugging message
    data = request.json
    print("Received data:", data)  # Print received data

    new_resource = Resource(
        name=data['name'],
        location=data['location'],
        type=data['type'],
        accessibility=data.get('accessibility'),
        zip_code=data['zip_code'],
        latitude=data['latitude'],
        longitude=data['longitude']
    )
    db.session.add(new_resource)
    db.session.commit()
    return jsonify({"message": "Resource created"}), 201


@resource_bp.route('/resources', methods=['GET'])
def get_resources():
    resources = Resource.query.all()
    return jsonify([resource.serialize() for resource in resources])

@resource_bp.route('/resources/<int:resource_id>', methods=['PUT'])
def update_resource(resource_id):
    # Retrieve the resource from the database
    resource = Resource.query.get(resource_id)
    
    # Check if the resource exists
    if not resource:
        return jsonify({"error": "Resource not found"}), 404
    
    # Get data from the request
    data = request.json
    
    # Update resource fields with provided data, or keep existing values
    resource.name = data.get('name', resource.name)
    resource.location = data.get('location', resource.location)
    resource.type = data.get('type', resource.type)
    resource.accessibility = data.get('accessibility', resource.accessibility)
    resource.comments = data.get('comments', resource.comments)
    
    # Commit changes to the database
    db.session.commit()
    
    return jsonify({"message": "Resource updated"}), 200

@resource_bp.route('/resources/<int:resource_id>', methods=['DELETE'])
def delete_resource(resource_id):

    resource = Resource.query.get(resource_id)
    
    if not resource:
        return jsonify({"error": "Resource not found"}), 404
    
    db.session.delete(resource)
    db.session.commit()

    return jsonify({"message": "Resource deleted"}), 204


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