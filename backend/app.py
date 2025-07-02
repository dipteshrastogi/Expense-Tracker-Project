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

with app.app_context():
    db.create_all() 

CORS(app, origins = allowed_origins)

print("Flask-JWT-Extended is working!")

@app.route('/')
def index():
    return jsonify(msg="Hola amigos"), 200

asgi_app = WsgiToAsgi(app)

# pipenv run uvicorn app:asgi_app --reload

