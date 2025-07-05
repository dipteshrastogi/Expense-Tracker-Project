import jwt
from functools import wraps
from flask import jsonify, request, current_app, g

def protectRoute(f):
    @wraps(f)
    async def wrapper(*args, **kwargs):
        token = None

        auth = request.headers.get('Authorization', None)
        if auth:
            parts = auth.split()
            if len(parts)==2 and parts[0].lower() == 'bearer':
                token = parts[1]
        
        if not token:
            token = request.cookies.get(
                current_app.config.get('JWT_ACCESS_COOKIE_NAME')
            )
        
        if not token:
            return jsonify(msg="Unauthorized user kyu aa raha"), 401

        try:
            payload = jwt.decode(
                token,
                current_app.config['JWT_SECRET_KEY'],
                algorithms=[ current_app.config.get('JWT_ALGORITHM', 'HS256') ]
            )
        
        except jwt.ExpiredSignatureError:
            return jsonify(msg="Token has expired"), 401
        except jwt.InvalidTokenError:
            return jsonify(msg="Invalid token"), 401
        
        g.current_user = payload.get('sub')

        return await f(*args, **kwargs)
        # without await, and using async in function, a coroutine object is returned and not the result.
    return wrapper

# Coroutine Object :- 

"""When one mark a function as async def,one is telling Python two things:
It returns a coroutine object when called, instead of running immediately.
Inside that function, any time you use await …, you’re telling it:
“Pause here, let other work run and move to event loop, and come back from the event loop when that 
awaited thing is done."""


"""
current_app is not the Python file where your Flask app is initialized. 
It is a special proxy object provided by Flask that gives you access to the active Flask app instance
from anywhere in your code, even if you’re not inside the app.py or wherever 
you created your Flask(__name__).
"""

"""
g is a special global object provided by Flask, short for "global" — but not in the Python global sense.
It is used to store data during the handling of a single request.
It is unique per request, meaning it's reset between requests.
You can use it to store data that multiple functions (routes, decorators, helpers) might need 
within the same request context.
"""




# def protectRoute(fn):
#     if inspect.iscoroutinefunction(fn):
#         @functools.wraps(fn)
#         async def async_wrapper(*args, **kwargs):
#             print("Hola Amigos")                    # ① your “pre‑processing”
#             return await fn(*args, **kwargs)        # ② call and await the async view
#         return async_wrapper                        # ③ return this wrapped async function

#     else:
#         @functools.wraps(fn)
#         def sync_wrapper(*args, **kwargs):
#             print("Hola Amigos")                    # ① same pre‑processing for sync views
#             return fn(*args, **kwargs)              # ② call the original sync view
#         return sync_wrapper                         # ③ return this wrapped sync function
