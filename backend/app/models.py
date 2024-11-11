from flask_sqlalchemy import SQLAlchemy
import bcrypt

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    zip_code = db.Column(db.String(10), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)  # New field for admin status

    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
    
    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "password_hash": self.password_hash,
            "zip_code": self.zip_code,
            "is_admin": self.is_admin 
        }


class Resource(db.Model):
    __tablename__ = 'resources'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    accessibility = db.Column(db.String(100))
    accuracy = db.Column(db.Boolean, default=False)
    community_verified = db.Column(db.Boolean, default=False)
    description = db.Column(db.Text)
    votes_accuracy = db.Column(db.Integer, default=0)
    votes_verified = db.Column(db.Integer, default=0)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    street_address = db.Column(db.String(200))
    city = db.Column(db.String(100))
    state = db.Column(db.String(100))
    zip_code = db.Column(db.String(10), nullable=False)
    phone_number = db.Column(db.String(20))

    # Define a bidirectional relationship with Comment using back_populates
    comments = db.relationship('Comment', back_populates='resource', lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "location": self.location,
            "type": self.type,
            "accessibility": self.accessibility,
            "accuracy": self.accuracy,
            "community_verified": self.community_verified,
            "description": self.description,
            "votes_accuracy": self.votes_accuracy,
            "votes_verified": self.votes_verified,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "street_address": self.street_address,
            "city": self.city,
            "state": self.state,
            "zip_code": self.zip_code,
            "phone_number": self.phone_number
        }


class Comment(db.Model):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    resource_id = db.Column(db.Integer, db.ForeignKey('resources.id'), nullable=False)
    comment_text = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(255))  # Optional URL to an image associated with the comment
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    # Define bidirectional relationships with Resource and User using back_populates
    resource = db.relationship('Resource', back_populates='comments')
    user = db.relationship('User', backref=db.backref('comments', lazy=True))

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "resource_id": self.resource_id,
            "comment_text": self.comment_text,
            "image_url": self.image_url,
            "created_at": self.created_at
        }

class Notification(db.Model):
    __tablename__ = 'notifications'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    category = db.Column(db.String(50))
    proximity = db.Column(db.Integer)


class Post(db.Model):
    __tablename__ = 'posts'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(255))  # Optional URL to an image associated with the post
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    # Relationship back to User
    user = db.relationship('User', backref=db.backref('posts', lazy=True))

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "content": self.content,
            "image_url": self.image_url,
            "created_at": self.created_at
        }
