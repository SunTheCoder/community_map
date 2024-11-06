from flask import Blueprint, request, jsonify
from .models import db, Resource, User, Notification


resource_bp = Blueprint('resources', __name__)

@resource_bp.route('/resources', methods=['POST'])
def create_resource():
    data = request.json
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
