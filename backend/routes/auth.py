from flask import (
    Blueprint,
    request,
    jsonify
)

from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)

from config.db import get_connection

import bcrypt
import pymysql

auth_bp = Blueprint(
    "auth",
    __name__
)


# -----------------------------------
# Register
# -----------------------------------

@auth_bp.route(
    "/api/register",
    methods=["POST"]
)
def register():

    data = request.json

    full_name = data["full_name"]
    email = data["email"]
    password = data["password"]

    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    )

    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            INSERT INTO users
            (
                full_name,
                email,
                password
            )
            VALUES
            (
                %s,
                %s,
                %s
            )
        """,
        (
            full_name,
            email,
            hashed_password.decode("utf-8")
        ))
        conn.commit()
    except pymysql.err.IntegrityError:
        cursor.close()
        conn.close()
        return jsonify({
            "message": "Email already registered"
        }), 409

    cursor.close()
    conn.close()

    return jsonify({
        "message":"User Registered Successfully"
    })


# -----------------------------------
# User Login
# -----------------------------------

@auth_bp.route(
    "/api/login",
    methods=["POST"]
)
def login():

    data = request.json

    email = data["email"]
    password = data["password"]

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE email=%s",
        (email,)
    )

    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if not user:

        return jsonify({
            "message":"User Not Found"
        }),404

    if bcrypt.checkpw(
        password.encode("utf-8"),
        user["password"].encode("utf-8")
    ):

        token = create_access_token(
            identity=str(user["id"])
        )

        return jsonify({
            "token":token,
            "user":user
        })

    return jsonify({
        "message":"Invalid Credentials"
    }),401


# -----------------------------------
# Admin Login
# -----------------------------------

@auth_bp.route(
    "/api/admin/login",
    methods=["POST"]
)
def admin_login():

    data = request.json

    username = data["username"]
    password = data["password"]

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM admins WHERE username=%s",
        (username,)
    )

    admin = cursor.fetchone()

    cursor.close()
    conn.close()

    if not admin:

        return jsonify({
            "message":"Admin Not Found"
        }),404

    if bcrypt.checkpw(
        password.encode("utf-8"),
        admin["password"].encode("utf-8")
    ):

        token = create_access_token(
            identity=f"admin_{admin['id']}"
        )

        return jsonify({
            "token":token
        })

    return jsonify({
        "message":"Invalid Credentials"
    }),401


# -----------------------------------
# Protected Dashboard Test
# -----------------------------------

@auth_bp.route(
    "/api/dashboard",
    methods=["GET"]
)
@jwt_required()
def dashboard():

    current_user = get_jwt_identity()

    return jsonify({
        "message":"Welcome User",
        "user_id":current_user
    })


# -----------------------------------
# User Profile
# -----------------------------------

@auth_bp.route(
    "/api/profile",
    methods=["GET"]
)
@jwt_required()
def profile():

    user_id = get_jwt_identity()

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            id,
            full_name,
            email,
            sustainability_score,
            level,
            badges
        FROM users
        WHERE id = %s
    """,
    (
        user_id,
    ))

    user = cursor.fetchone()

    cursor.close()
    conn.close()
    
    if user:
        import json
        try:
            user["badges"] = json.loads(user["badges"]) if user["badges"] else []
        except:
            user["badges"] = []

    return jsonify(user)