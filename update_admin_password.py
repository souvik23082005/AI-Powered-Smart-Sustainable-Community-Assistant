import sys
import os
import bcrypt

# Add backend dir to path to import config
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
from config.db import get_connection

def hash_admin_passwords():
    conn = get_connection()
    cursor = conn.cursor()
    
    # Get all admins
    cursor.execute("SELECT id, password FROM admins")
    admins = cursor.fetchall()
    
    for admin in admins:
        # If it's already a bcrypt hash, skip it
        # Bcrypt hashes typically start with $2a$, $2b$, or $2y$ and are 60 chars long
        if admin["password"].startswith("$2") and len(admin["password"]) == 60:
            print(f"Admin ID {admin['id']} already hashed.")
            continue
            
        # Hash plaintext password
        hashed = bcrypt.hashpw(admin["password"].encode("utf-8"), bcrypt.gensalt())
        
        # Update db
        cursor.execute("UPDATE admins SET password=%s WHERE id=%s", (hashed.decode("utf-8"), admin["id"]))
        print(f"Hashed password for admin ID {admin['id']}")
        
    conn.commit()
    cursor.close()
    conn.close()
    print("Done hashing admin passwords.")

if __name__ == "__main__":
    hash_admin_passwords()
