from flask import Blueprint, request, jsonify
from app.models import db, Reply, Post, Comment
from flask_jwt_extended import jwt_required, get_jwt_identity

reply_bp = Blueprint('reply_bp', __name__)

# Route to handle CORS preflight request and allow GET requests
@reply_bp.route('/posts/<int:post_id>/replies', methods=['OPTIONS', 'GET'])
def replies_for_post(post_id):
    if request.method == 'OPTIONS':
        response = jsonify()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Authorization, Content-Type")
        return response

    # Handle GET request to retrieve replies for a specific post
    replies = Reply.query.filter_by(record_type='post', record_id=post_id).all()
    return jsonify([reply.serialize() for reply in replies]), 200

# Route to get replies for a specific comment (supports CORS preflight)
@reply_bp.route('/comments/<int:comment_id>/replies', methods=['OPTIONS', 'GET'])
def replies_for_comment(comment_id):
    if request.method == 'OPTIONS':
        response = jsonify()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Authorization, Content-Type")
        return response

    # Handle GET request to retrieve replies for a specific comment
    replies = Reply.query.filter_by(record_type='comment', record_id=comment_id).all()
    return jsonify([reply.serialize() for reply in replies]), 200

# Route to create a reply for a post or comment
@reply_bp.route('/replies', methods=['POST'])
@jwt_required()
def create_reply():
    user_id = get_jwt_identity()
    data = request.get_json()

    # Validate record_type
    if data.get('record_type') not in ['post', 'comment']:
        return jsonify({"error": "Invalid record type"}), 400

    # Ensure the referenced record exists
    if data['record_type'] == 'post':
        record = Post.query.get(data['record_id'])
    else:
        record = Comment.query.get(data['record_id'])
    
    if not record:
        return jsonify({"error": "Referenced record not found"}), 404

    # Create new reply
    new_reply = Reply(
        user_id=user_id,
        record_id=data['record_id'],
        record_type=data['record_type'],
        content=data['content']
    )

    db.session.add(new_reply)
    db.session.commit()
    return jsonify(new_reply.serialize()), 201

# Route to update a reply
@reply_bp.route('/replies/<int:reply_id>', methods=['PUT'])
@jwt_required()
def update_reply(reply_id):
    reply = Reply.query.get_or_404(reply_id)
    user_id = get_jwt_identity()

    # Ensure the user updating the reply is the owner
    if reply.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    reply.content = data.get('content', reply.content)
    db.session.commit()
    return jsonify(reply.serialize()), 200

# Route to delete a reply
@reply_bp.route('/replies/<int:reply_id>', methods=['DELETE'])
@jwt_required()
def delete_reply(reply_id):
    reply = Reply.query.get_or_404(reply_id)
    user_id = get_jwt_identity()

    # Ensure the user deleting the reply is the owner
    if reply.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(reply)
    db.session.commit()
    return jsonify({"message": "Reply deleted"}), 200
