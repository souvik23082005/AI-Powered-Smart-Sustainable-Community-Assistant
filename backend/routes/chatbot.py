from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from config.db import get_connection
import os
from google import genai

chatbot_bp = Blueprint("chatbot", __name__)

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# ==========================================
# AI Sustainability Chat (Personalized)
# ==========================================
@chatbot_bp.route("/api/chat", methods=["POST"])
@jwt_required()
def chat():
    conn = None
    cursor = None
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        if not data or not data.get("message"):
            return jsonify({"error": "Message is required"}), 400

        user_message = data["message"].strip()

        conn = get_connection()
        cursor = conn.cursor()

        # Fetch personalized data
        cursor.execute("SELECT full_name, sustainability_score, level FROM users WHERE id=%s", (user_id,))
        user = cursor.fetchone()

        cursor.execute("SELECT category, priority, status FROM complaints WHERE user_id=%s ORDER BY id DESC LIMIT 5", (user_id,))
        recent_complaints = cursor.fetchall()

        cursor.execute("SELECT electricity_usage, travel_distance, fuel_usage, emission_kg FROM carbon_records WHERE user_id=%s ORDER BY id DESC LIMIT 5", (user_id,))
        recent_carbon = cursor.fetchall()

        # Construct Persona Context
        prompt = f"""
You are EcoAI, the official AI assistant of the Smart Sustainable Community Platform.
Mission: Help citizens contribute to the UN Sustainable Development Goals (SDGs 3, 4, 11, 13).

You are talking to {user['full_name']} (Level {user['level']} with {user['sustainability_score']} points).
Their recent complaints: {recent_complaints}
Their recent carbon records: {recent_carbon}

Rules:
- Be encouraging and acknowledge their recent activities if relevant to the question.
- Suggest personalized actions based on their history.
- Maintain a friendly, professional sustainability expert persona.
- Provide practical solutions and bullet points.

User Question: {user_message}
"""

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        ai_reply = response.text

        # Save Chat History
        cursor.execute("""
            INSERT INTO chat_history (user_id, question, answer)
            VALUES (%s, %s, %s)
        """, (user_id, user_message, ai_reply))

        # Reward Interaction
        cursor.execute("UPDATE users SET sustainability_score = sustainability_score + 5 WHERE id = %s", (user_id,))
        conn.commit()

        return jsonify({"success": True, "reply": ai_reply})

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()


# ==========================================
# AI Monthly Report Generator
# ==========================================
@chatbot_bp.route("/api/ai/report", methods=["GET"])
@jwt_required()
def generate_report():
    conn = None
    cursor = None
    try:
        user_id = get_jwt_identity()
        conn = get_connection()
        cursor = conn.cursor()

        # Fetch Data
        cursor.execute("SELECT full_name, sustainability_score FROM users WHERE id=%s", (user_id,))
        user = cursor.fetchone()

        cursor.execute("SELECT COUNT(*) as cnt FROM complaints WHERE user_id=%s AND status='Resolved'", (user_id,))
        resolved = cursor.fetchone()["cnt"]

        cursor.execute("SELECT SUM(emission_kg) as total_emission FROM carbon_records WHERE user_id=%s", (user_id,))
        carbon = cursor.fetchone()["total_emission"] or 0

        prompt = f"""
You are EcoAI. Generate a highly motivating, short "Monthly Sustainability Impact Report" for {user['full_name']}.
Data:
- Points: {user['sustainability_score']}
- Community Issues Resolved: {resolved}
- Total Carbon Emissions: {carbon} kg

Format as Markdown. Praise their efforts, explain how their actions align with UN SDGs, and give 3 quick tips to improve next month.
"""

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        report = response.text

        # Reward
        cursor.execute("UPDATE users SET sustainability_score = sustainability_score + 10 WHERE id = %s", (user_id,))
        conn.commit()

        return jsonify({"success": True, "report": report})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()


# ==========================================
# Get User Chat History
# ==========================================
@chatbot_bp.route("/api/chat-history", methods=["GET"])
@jwt_required()
def chat_history():
    conn = None
    cursor = None
    try:
        user_id = get_jwt_identity()
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT id, question, answer, created_at
            FROM chat_history
            WHERE user_id = %s
            ORDER BY created_at DESC
        """, (user_id,))
        chats = cursor.fetchall()

        return jsonify({"success": True, "total_chats": len(chats), "data": chats})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()