import sys
import os

# Add backend dir to path to import config
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
from config.db import get_connection

def migrate():
    conn = get_connection()
    cursor = conn.cursor()
    
    # 1. Update Complaints table
    try:
        # Check if priority column exists, if not add it
        cursor.execute("SHOW COLUMNS FROM complaints LIKE 'priority'")
        if not cursor.fetchone():
            cursor.execute("ALTER TABLE complaints ADD COLUMN priority VARCHAR(50) DEFAULT 'Low'")
            print("Added 'priority' to complaints")
            
        # Check if category column exists, if not rename issue_type
        cursor.execute("SHOW COLUMNS FROM complaints LIKE 'category'")
        if not cursor.fetchone():
            cursor.execute("ALTER TABLE complaints CHANGE issue_type category VARCHAR(100)")
            print("Renamed 'issue_type' to 'category' in complaints")
            
        # Migrate existing status 'Pending' -> 'Submitted', etc.
        cursor.execute("UPDATE complaints SET status='Submitted' WHERE status='Pending'")
        print("Updated existing pending complaints to 'Submitted'")

    except Exception as e:
        print("Error updating complaints:", e)

    # 2. Update Users table
    try:
        cursor.execute("SHOW COLUMNS FROM users LIKE 'level'")
        if not cursor.fetchone():
            cursor.execute("ALTER TABLE users ADD COLUMN level INT DEFAULT 1")
            print("Added 'level' to users")
            
        cursor.execute("SHOW COLUMNS FROM users LIKE 'badges'")
        if not cursor.fetchone():
            cursor.execute("ALTER TABLE users ADD COLUMN badges TEXT")
            # Using TEXT instead of JSON to be safe with all MySQL versions
            # We will serialize/deserialize JSON manually in python
            cursor.execute("UPDATE users SET badges='[]'")
            print("Added 'badges' to users")

    except Exception as e:
        print("Error updating users:", e)

    conn.commit()
    cursor.close()
    conn.close()
    print("Migration complete!")

if __name__ == "__main__":
    migrate()
