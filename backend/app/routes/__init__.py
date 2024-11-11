from .resource_routes import resource_bp
from .user_routes import user_bp
from .auth_routes import auth_bp
from .post_routes import post_bp
from .reply_routes import reply_bp  # Import the reply blueprint


def init_routes(app):
    app.register_blueprint(resource_bp, url_prefix='/api')
    app.register_blueprint(user_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(post_bp, url_prefix='/api') 
    app.register_blueprint(reply_bp, url_prefix='/api')  # Register the reply routes

