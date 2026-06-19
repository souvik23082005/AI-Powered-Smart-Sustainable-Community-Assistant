import sys
import os
from dotenv import load_dotenv

load_dotenv()
sys.path.append(os.path.join(os.path.dirname(__file__), '.'))
from config.db import get_connection

def create_tables():
    conn = get_connection()
    cursor = conn.cursor()
    
    # 1. Users Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            full_name VARCHAR(100),
            email VARCHAR(100) UNIQUE,
            password VARCHAR(255),
            is_admin BOOLEAN DEFAULT FALSE,
            sustainability_score INT DEFAULT 0,
            level INT DEFAULT 1,
            badges TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    print("Checked/Created 'users' table.")
    
    # 2. Complaints Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS complaints (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            category VARCHAR(100),
            priority VARCHAR(50) DEFAULT 'Low',
            description TEXT,
            location VARCHAR(255),
            image VARCHAR(255),
            status VARCHAR(50) DEFAULT 'Submitted',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    """)
    print("Checked/Created 'complaints' table.")
    
    # 3. Chat History Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS chat_history (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            question TEXT,
            answer TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    """)
    print("Checked/Created 'chat_history' table.")
    
    # 4. Carbon Records Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS carbon_records (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            electricity_usage FLOAT,
            travel_distance FLOAT,
            fuel_usage FLOAT,
            emission_kg FLOAT,
            eco_score INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    """)
    print("Checked/Created 'carbon_records' table.")
    
    conn.commit()
    cursor.close()
    conn.close()
    print("All database tables are set up successfully on your Aiven Database!")

if __name__ == "__main__":
    create_tables()
