from flask import Blueprint, request, jsonify, current_app
import traceback
from app.models import db, Resource, User, Notification
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required, get_jwt_identity

resource_bp = Blueprint('resources', __name__)

@resource_bp.route('/resources', methods=['POST'])
@jwt_required()
def create_resource():
    current_user_id = get_jwt_identity()
    data = request.json
    print("Received data:", data)  # Print received data

    new_resource = Resource(
        name=data.get('name'),
        location=data.get('location'),
        type=data.get('type'),
        accessibility=data.get('accessibility'),
        description=data.get('description'),
        votes_accuracy=data.get('votes_accuracy'),
        votes_verified=data.get('votes_verified'),
        latitude=data.get('latitude'),
        longitude=data.get('longitude'),
        street_address=data.get('street_address'),
        city=data.get('city'),
        state=data.get('state'),
        zip_code=data.get('zip_code'),
        phone_number=data.get('phone_number'),
        user_id=current_user_id
    )
    db.session.add(new_resource)
    db.session.commit()
    return jsonify({"message": "Resource created"}), 201


@resource_bp.route('/resources/<int:resource_id>/comments', methods=['GET'])
def get_comments(resource_id):
    resource = Resource.query.get_or_404(resource_id)
    comments = resource.comments  # Use the relationship to fetch comments
    return jsonify([comment.serialize() for comment in comments]), 200

@resource_bp.route('/users/<int:user_id>/resources', methods=['GET'])
@jwt_required()
def get_user_resources(user_id):
    current_user_id = get_jwt_identity()

    # Only allow fetching if the current user is the owner or an admin
    current_user = User.query.get(current_user_id)
    if current_user_id != user_id and not current_user.is_admin:
        return jsonify({"error": "Unauthorized"}), 403

    resources = Resource.query.filter_by(user_id=user_id).all()
    return jsonify([resource.serialize() for resource in resources])

@resource_bp.route('/resources/<int:resource_id>/comments', methods=['POST'])
@jwt_required()
def add_comment(resource_id):
    user_id = get_jwt_identity()
    data = request.json

    # Ensure the resource exists
    resource = Resource.query.get_or_404(resource_id)

    # Create a new comment
    new_comment = Comment(
        user_id=user_id,
        resource_id=resource.id,
        content=data.get('content')
    )
    db.session.add(new_comment)
    db.session.commit()
    return jsonify(new_comment.serialize()), 201


@resource_bp.route('/resources', methods=['GET'])
def get_resources():
    resources = Resource.query.all()
    return jsonify([resource.serialize() for resource in resources])

@resource_bp.route('/resources/<int:resource_id>', methods=['PUT'])
@jwt_required()
def update_resource(resource_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    resource = Resource.query.get(resource_id)

    if not resource:
        return jsonify({"error": "Resource not found"}), 404

    # Check if the user is the owner or an admin
    if resource.user_id != current_user_id and not current_user.is_admin:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.json
    resource.name = data.get('name', resource.name)
    resource.type = data.get('type', resource.type)
    resource.accessibility = data.get('accessibility', resource.accessibility)
    resource.description = data.get('description', resource.description)

    db.session.commit()
    return jsonify({"message": "Resource updated"}), 200


@resource_bp.route('/resources/<int:resource_id>', methods=['DELETE'])
@jwt_required()
def delete_resource(resource_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    resource = Resource.query.get(resource_id)

    if not resource:
        return jsonify({"error": "Resource not found"}), 404

    # Check if the user is the owner or an admin
    if resource.user_id != current_user_id and not current_user.is_admin:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(resource)
    db.session.commit()
    return jsonify({"message": "Resource deleted"}), 200



@resource_bp.route('/resources', methods=['DELETE'])
def delete_all_resource():

    db.session.query(Resource).delete()
    db.session.commit()
    return jsonify({"message": "All resourcess deleted"}), 200