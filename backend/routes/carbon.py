from flask import Blueprint, request, jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from config.db import get_connection

carbon_bp = Blueprint(
    "carbon",
    __name__
)

@carbon_bp.route(
    "/api/carbon/calculate",
    methods=["POST"]
)
@jwt_required()
def calculate_carbon():

    user_id = get_jwt_identity()

    data = request.json

    electricity = float(
        data["electricity_usage"]
    )

    travel = float(
        data["travel_distance"]
    )

    fuel = float(
        data["fuel_usage"]
    )

    emission = (
        electricity * 0.85
        +
        travel * 0.21
        +
        fuel * 2.3
    )

    eco_score = max(
        0,
        100 - int(emission / 10)
    )

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO carbon_records
        (
            user_id,
            electricity_usage,
            travel_distance,
            fuel_usage,
            emission_kg,
            eco_score
        )
        VALUES
        (%s,%s,%s,%s,%s,%s)
        """,
        (
            user_id,
            electricity,
            travel,
            fuel,
            emission,
            eco_score
        )
    )

    conn.commit()

    cursor.close()
    conn.close()

    suggestions = []

    if electricity > 100:
        suggestions.append(
            "Use LED bulbs to save electricity."
        )

    if travel > 100:
        suggestions.append(
            "Use public transport whenever possible."
        )

    if fuel > 50:
        suggestions.append(
            "Reduce fuel consumption and consider carpooling."
        )

    return jsonify({
        "emission_kg": round(
            emission,
            2
        ),
        "eco_score": eco_score,
        "suggestions": suggestions
    })

@carbon_bp.route(
    "/api/carbon/history"
)
@jwt_required()
def carbon_history():

    user_id = get_jwt_identity()

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT *
        FROM carbon_records
        WHERE user_id=%s
        ORDER BY created_at
        """,
        (user_id,)
    )

    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(data)