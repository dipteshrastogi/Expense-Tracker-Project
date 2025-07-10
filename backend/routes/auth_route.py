# routes/auth_routes.py
from flask import Blueprint, request
from controllers.auth_controller import register_user, login_user, check_auth, logout_user, updateProfile
from middlewares.auth_middleware import protectRoute
# if __init__.py not used to import any file, then make sure that project root is on sys.path

auth_bp = Blueprint('auth', __name__) # Blueprint is a class and auth_bp is an object/ instance of it.

@auth_bp.route('/register', methods=['POST'])
async def register():
    data = request.get_json() or {}
    return await register_user(data) # without using await, some coroutine error came as register_user is an async function


@auth_bp.route('/login', methods=['POST'])
async def login():
    data = request.get_json() or {}
    return await login_user(data)

@auth_bp.route('/checkAuth', methods=['GET'])
@protectRoute
async def auth_check():
    return await check_auth() 

@auth_bp.route('/logout', methods=['GET'])
async def log_out():
    return await logout_user() 


@auth_bp.route('/updateProfile', methods=['POST'])
@protectRoute
async def update_profile():
    data = request.get_json() or {}
    return await updateProfile(data)

