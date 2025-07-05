from flask import Flask
from flask import jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from asgiref.wsgi import WsgiToAsgi
from utils.config import ProductionConfig, DevelopmentConfig
from flask_cors import CORS

import os
app = Flask(__name__)
app.config.from_object(
    ProductionConfig if os.getenv('FLASK_ENV') == 'production' else DevelopmentConfig
)

# Flask‑JWT‑Extended picks up that JWT_SECRET_KEY from app.config.

allowed_origins = [
    "http://localhost:5000"
]

db = SQLAlchemy(app)
jwt = JWTManager(app)

# Without calling JWTManager(app) (or equivalently jwt.init_app(app)), your app would know the secret key,
# but none of the machinery that actually creates, verifies, or enforces JWTs would be registered.

import models

with app.app_context():
    db.create_all() 

from routes.auth_route import auth_bp
from routes.expense_route import expense_bp

CORS(app, origins = allowed_origins)

print(app.config["SQLALCHEMY_DATABASE_URI"])

@app.route('/hola')
def index():
    return jsonify(msg="Hola amigos"), 200

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(expense_bp, url_prefix='/api/expense')

asgi_app = WsgiToAsgi(app)

# pipenv run uvicorn app:asgi_app --reload
