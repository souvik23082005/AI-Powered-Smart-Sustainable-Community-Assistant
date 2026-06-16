from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from config.db import get_connection
import os
import json

complaint_bp = Blueprint("complaints", __name__)

# ==========================
# Create Complaint
# ==========================
@complaint_bp.route("/api/complaints", methods=["POST"])
@jwt_required()
def create_complaint():
    user_id = get_jwt_identity()
    category = request.form.get("category", "Other")
    priority = request.form.get("priority", "Low")
    description = request.form.get("description", "")
    location = request.form.get("location", "")
    image = request.files.get("image")
    filename = None

    if image:
        filename = image.filename
        image.save(os.path.join(current_app.config["UPLOAD_FOLDER"], filename))

    conn = get_connection()
    cursor = conn.cursor()

    # Save Complaint
    cursor.execute(
        """
        INSERT INTO complaints (user_id, category, priority, description, location, image, status)
        VALUES (%s, %s, %s, %s, %s, %s, 'Submitted')
        """,
        (user_id, category, priority, description, location, filename)
    )

    # Gamification: Sustainability Score +20 for reporting
    cursor.execute(
        """
        UPDATE users
        SET sustainability_score = sustainability_score + 20
        WHERE id = %s
        """,
        (user_id,)
    )

    # Check for level ups (every 100 points = 1 level)
    cursor.execute("SELECT sustainability_score, level FROM users WHERE id=%s", (user_id,))
    user = cursor.fetchone()
    if user:
        new_level = max(1, user["sustainability_score"] // 100 + 1)
        if new_level > user["level"]:
            cursor.execute("UPDATE users SET level=%s WHERE id=%s", (new_level, user_id))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Complaint Submitted Successfully"})



# ==========================
# Admin - View All Complaints
# ==========================
@complaint_bp.route("/api/admin/complaints", methods=["GET"])
@jwt_required()
def admin_complaints():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT c.*, u.full_name
        FROM complaints c
        JOIN users u ON c.user_id = u.id
        ORDER BY c.id DESC
        """
    )
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data)


# ==========================
# Admin - Update Status
# ==========================
@complaint_bp.route("/api/admin/update-status/<int:id>", methods=["PUT"])
@jwt_required()
def update_status(id):
    data = request.get_json()
    status = data["status"] # Expected: Submitted, Reviewed, In Progress, Resolved

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("UPDATE complaints SET status = %s WHERE id = %s", (status, id))

    # Gamification: If resolved, give user +30 score
    if status == "Resolved":
        cursor.execute("SELECT user_id FROM complaints WHERE id = %s", (id,))
        complaint = cursor.fetchone()
        if complaint:
            uid = complaint["user_id"]
            cursor.execute("UPDATE users SET sustainability_score = sustainability_score + 30 WHERE id = %s", (uid,))
            
            # Check level up
            cursor.execute("SELECT sustainability_score, level, badges FROM users WHERE id=%s", (uid,))
            u = cursor.fetchone()
            if u:
                new_lvl = max(1, u["sustainability_score"] // 100 + 1)
                
                # Check badges logic (Issue Resolver Badge)
                try:
                    badges = json.loads(u["badges"]) if u["badges"] else []
                except:
                    badges = []
                    
                if "Issue Resolver" not in badges:
                    badges.append("Issue Resolver")
                    
                cursor.execute(
                    "UPDATE users SET level=%s, badges=%s WHERE id=%s", 
                    (new_lvl, json.dumps(badges), uid)
                )

    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": f"Complaint marked as {status}"})


# ==========================
# Admin - Analytics Stats
# ==========================
@complaint_bp.route("/api/admin/analytics", methods=["GET"])
@jwt_required()
def admin_analytics():
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT COUNT(*) as total_users, AVG(sustainability_score) as avg_score FROM users")
        user_stats = cursor.fetchone()

        cursor.execute("SELECT COUNT(*) as total_complaints FROM complaints")
        total_complaints = cursor.fetchone()["total_complaints"]

        cursor.execute("SELECT status, COUNT(*) as count FROM complaints GROUP BY status")
        status_counts = cursor.fetchall()

        cursor.execute("SELECT category, COUNT(*) as count FROM complaints GROUP BY category")
        type_counts = cursor.fetchall()
        
        cursor.execute("SELECT priority, COUNT(*) as count FROM complaints GROUP BY priority")
        priority_counts = cursor.fetchall()

        cursor.execute("SELECT COUNT(*) as total_records, AVG(emission_kg) as avg_emission FROM carbon_records")
        carbon_stats = cursor.fetchone()

        return jsonify({
            "total_users": user_stats["total_users"],
            "avg_score": round(user_stats["avg_score"] or 0, 2),
            "total_complaints": total_complaints,
            "status_counts": status_counts,
            "type_counts": type_counts,
            "priority_counts": priority_counts,
            "carbon_stats": {
                "total_records": carbon_stats["total_records"] if carbon_stats else 0,
                "avg_emission": round(carbon_stats["avg_emission"] or 0, 2) if carbon_stats else 0
            }
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


# ==========================
# Gamification: Leaderboard
# ==========================
@complaint_bp.route("/api/leaderboard", methods=["GET"])
@jwt_required()
def leaderboard():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT id, full_name, sustainability_score, level, badges 
        FROM users 
        ORDER BY sustainability_score DESC 
        LIMIT 10
        """
    )
    leaders = cursor.fetchall()
    cursor.close()
    conn.close()
    
    # parse badges json for safety
    for l in leaders:
        try:
            l["badges"] = json.loads(l["badges"]) if l["badges"] else []
        except:
            l["badges"] = []
            
    return jsonify(leaders)