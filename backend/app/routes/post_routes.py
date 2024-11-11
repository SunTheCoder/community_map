# app/routes/post_routes.py
from flask import Blueprint, request, jsonify
from app.models import db, Post
from flask_jwt_extended import jwt_required, get_jwt_identity

post_bp = Blueprint('post_bp', __name__)

# Route to get all posts
@post_bp.route('/posts', methods=['GET'])
def get_posts():
    posts = Post.query.all()
    return jsonify([post.serialize() for post in posts]), 200

# Route to create a new post
@post_bp.route('/posts', methods=['POST'])
@jwt_required()
def create_post():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    new_post = Post(
        user_id=user_id,
        title=data.get('title'),
        content=data.get('content'),
        image_url=data.get('image_url')
    )
    
    db.session.add(new_post)
    db.session.commit()
    return jsonify(new_post.serialize()), 201

# Route to get a single post by ID
@post_bp.route('/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    post = Post.query.get_or_404(post_id)
    return jsonify(post.serialize()), 200

# Route to update a post
@post_bp.route('/posts/<int:post_id>', methods=['PUT'])
@jwt_required()
def update_post(post_id):
    post = Post.query.get_or_404(post_id)
    user_id = get_jwt_identity()

    # Ensure the user updating the post is the owner
    if post.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    post.title = data.get('title', post.title)
    post.content = data.get('content', post.content)
    post.image_url = data.get('image_url', post.image_url)

    db.session.commit()
    return jsonify(post.serialize()), 200

# Route to delete a post
@post_bp.route('/posts/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    post = Post.query.get_or_404(post_id)
    user_id = get_jwt_identity()

    # Ensure the user deleting the post is the owner
    if post.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(post)
    db.session.commit()
    return jsonify({"message": "Post deleted"}), 200
