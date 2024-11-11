from .resource_routes import resource_bp
from .user_routes import user_bp
from .auth_routes import auth_bp

def init_routes(app):
    app.register_blueprint(resource_bp, url_prefix='/api')
    app.register_blueprint(user_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api')
