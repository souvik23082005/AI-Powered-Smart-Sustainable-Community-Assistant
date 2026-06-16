import pymysql
import os

def get_connection():
    return pymysql.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", "www.tr.com"),
        database=os.getenv("DB_NAME", "smart_community_ai"),
        cursorclass=pymysql.cursors.DictCursor
    )