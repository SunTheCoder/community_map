from flask import Blueprint, request, jsonify
from .models import db, Resource, User, Notification
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required, get_jwt_identity




resource_bp = Blueprint('resources', __name__)
user_bp = Blueprint('users', __name__)

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
        comments=data.get('comments')
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