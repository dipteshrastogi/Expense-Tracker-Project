from flask import Flask
from flask import jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from asgiref.wsgi import WsgiToAsgi
from config import ProductionConfig, DevelopmentConfig
from flask_cors import CORS

import os
app = Flask(__name__)
app.config.from_object(
    ProductionConfig if os.getenv('FLASK_ENV') == 'production' else DevelopmentConfig
)

allowed_origins = [
    "http://localhost:5000"
]

db = SQLAlchemy(app)
jwt = JWTManager(app)

import models

with app.app_context():
    db.create_all() 

from routes.auth_route import auth_bp

CORS(app, origins = allowed_origins)

print(app.config["SQLALCHEMY_DATABASE_URI"])

@app.route('/hola')
def index():
    return jsonify(msg="Hola amigos"), 200

app.register_blueprint(auth_bp, url_prefix='/auth')

asgi_app = WsgiToAsgi(app)

# pipenv run uvicorn app:asgi_app --reload

