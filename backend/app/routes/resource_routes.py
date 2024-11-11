from flask import Blueprint, request, jsonify, current_app
import traceback
from app.models import db, Resource, User, Notification
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required, get_jwt_identity

resource_bp = Blueprint('resources', __name__)

@resource_bp.route('/resources', methods=['POST'])
def create_resource():
    print("POST /resources hit")  # Debugging message
    data = request.json
    print("Received data:", data)  # Print received data

    new_resource = Resource(
        name=data.get('name'),
        location=data.get('location'),
        type=data.get('type'),
        accessibility=data.get('accessibility'),
        comments=data.get('comments'),
        description=data.get('description'),
        votes_accuracy=data.get('votes_accuracy'),
        votes_verified=data.get('votes_verified'),
        latitude=data.get('latitude'),
        longitude=data.get('longitude'),
        street_address=data.get('street_address'),
        city=data.get('city'),
        state=data.get('state'),
        zip_code=data.get('zip_code'),
        phone_number=data.get('phone_number')
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


@resource_bp.route('/resources', methods=['DELETE'])
def delete_all_resource():

    db.session.query(Resource).delete()
    db.session.commit()
    return jsonify({"message": "All resourcess deleted"}), 200