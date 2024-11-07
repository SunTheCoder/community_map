from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

class Resource(db.Model):
    __tablename__ = 'resources'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    accessibility = db.Column(db.String(100))
    comments = db.Column(db.Text)
    accuracy = db.Column(db.Boolean, default=False)
    community_verified = db.Column(db.Boolean, default=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "location": self.location,
            "type": self.type,
            "accessibility": self.accessibility,
            "comments": self.comments,
            "accuracy": self.accuracy,
            "community_verified": self.community_verified,
        }

class Notification(db.Model):
    __tablename__ = 'notifications'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    category = db.Column(db.String(50))
    proximity = db.Column(db.Integer)
