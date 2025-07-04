from flask import jsonify
from models import User
from flask_jwt_extended import create_access_token, set_access_cookies
from sqlalchemy.exc import IntegrityError
from utils.extensions import async_session  # an AsyncSession factory

async def register_user(data):
    """Create a new user from JSON data {username, password}."""
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    if not username or not email:
        return jsonify(msg="Username and email required"), 400

    try:
        async with async_session() as session:
            result = await session.execute(
                User.__table__.select().where(User.username == username)
            )
            if result.first():
                return jsonify(msg="Username already exists"), 400

            new_user = User(username=username, email=email)
            new_user.set_password(password)
            session.add(new_user)
            await session.commit()
            access_token = create_access_token(identity=str(new_user.id))

    except IntegrityError:
        return jsonify(msg="Username already exists (race)"), 400
    
    except Exception as e:
        print(e)
        return jsonify(msg="Internal server error"), 500

    res =  jsonify(msg="User Registered Successfully", access_token=access_token)
    res.status_code = 200
    set_access_cookies(res, access_token)

    return res


async def login_user(data):
    """
    Async version of user login.
    Expects data with 'username' and 'password', returns JWT on success.
    """
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    if not username or not password or not email:
        return jsonify(msg="Missing username or password or email"), 400

    try:
        async with async_session() as session:
            result = await session.execute(
                User.__table__.select().where(User.username == username)
            )
            row = result.first()
            if not row:
                return jsonify(msg="Invalid credentials"), 401

            user = User(**row._asdict())  # hydrate into a User instance
            if not user.check_password(password):
                return jsonify(msg="Invalid credentials"), 401

            # Create JWT token
            access_token = create_access_token(identity=str(user.id))
    except Exception as e:
        return jsonify(msg="Internal server error"), 500

    res =  jsonify(msg="User Logged in successfully", access_token=access_token)
    res.status_code = 200
    set_access_cookies(res, access_token)

    return res

# make_response() is a utility to turn almost anything(string, dict, tuple) into a Response object. 
    
