# routes/auth_routes.py
from flask import Blueprint, request, jsonify
from controllers.auth_controller import register_user, login_user
from middlewares.auth_middleware import protectRoute
# if __init__.py not used to import any file, then make sure that project root is on sys.path

auth_bp = Blueprint('auth', __name__) # Blueprint is a class and auth_bp is an object/ instance of it.

@auth_bp.route('/register', methods=['POST'])
async def register():
    data = request.get_json() or {}
    return await register_user(data) # without using await, some coroutine error came as register_user is an async function


@auth_bp.route('/login', methods=['POST'])
@protectRoute
async def login():
    data = request.get_json() or {}
    return await login_user(data)
