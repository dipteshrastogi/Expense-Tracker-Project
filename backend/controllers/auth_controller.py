from flask import jsonify,g
from models import User
from flask_jwt_extended import create_access_token, set_access_cookies, unset_jwt_cookies
from sqlalchemy.exc import IntegrityError
from utils.extensions import async_session  # an AsyncSession factory
from sqlalchemy import select
from sqlalchemy.orm import selectinload

async def check_auth():
    userId = g.current_user
    async with async_session() as session:
        stmt = select(User).where(User.id == userId)
        result = await session.execute(stmt)
        rows = result.scalars().all()

    user_data = [
        {
            "id": e.id,
            "username": e.username,
            "email": e.email,
            "description": e.description,
            "target": e.income
            # "expenses": [ex.to_dict() for ex in e.expenses]
        }
        for e in rows
    ]

    return jsonify(userData=user_data), 200

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
                User.__table__.select().where(User.username == username) # doing core-query and not ORM 
                # compliant ----- :(
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
    res.status_code = 201
    set_access_cookies(res, access_token)

    return res


async def login_user(data):
    username = data.get("username")
    password = data.get("password")
    email    = data.get("email")
    if not username or not password or not email:
        return jsonify(msg="Missing fields"), 400

    try:
        async with async_session() as session:
            result = await session.execute(
                select(User)
                .options(selectinload(User.expenses))
                .where(User.username == username)
            )
            user = result.scalars().one_or_none()
            if not user or not user.check_password(password):
                return jsonify(msg="Invalid credentials"), 401

            # Now this reflects the real number of expenses:
            # print(f"user {user.username} has {(user.expenses[0].category)} expenses")

            access_token = create_access_token(identity=str(user.id))

    except Exception as e:
        print(e)
        return jsonify(msg="Internal server error"), 500
    print("Token of login", access_token)
    res = jsonify(msg="Logged in", access_token=access_token)
    set_access_cookies(res, access_token)
    return res, 200

async def logout_user():
    print("Hola")
    res = jsonify(success=True, msg="User logged out successfully")
    unset_jwt_cookies(res)
    return res, 200

async def updateProfile(data):
    user_id = g.current_user
    new_username = data.get("username")
    new_email    = data.get("email")
    new_description = data.get("description")
    new_target = data.get("target")
    print("Hola")
    
    if not new_username and not new_email and new_description and new_target:
        return jsonify(msg="Fields are required to update"), 400

    try:
        async with async_session() as session:
            result = await session.execute(select(User).where(User.id == user_id))
            user = result.scalar_one_or_none()

            if not user:
                return jsonify(msg="User not found"), 404

            # Update fields
            if new_username:
                user.username = new_username
            if new_email:
                user.email = new_email
            if new_description:
                user.description = new_description
            if new_target:
                user.income = new_target

            await session.commit()

            return jsonify(msg="Profile updated successfully"), 200

    except Exception as e:
        print("Error in updateProfile:", str(e))
        return jsonify(msg="Failed to update profile"), 500

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
            print(len(user.expenses))
    except Exception as e:
        return jsonify(msg="Internal server error"), 500

    res =  jsonify(msg="User Logged in successfully", access_token=access_token)
    res.status_code = 200
    set_access_cookies(res, access_token)

    return res

# make_response() is a utility to turn almost anything(string, dict, tuple) into a Response object. 
    
