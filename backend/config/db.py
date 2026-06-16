import pymysql
import os
import ssl

def get_connection():
    # Aiven requires SSL, but without the CA downloaded we can bypass strict verification
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    return pymysql.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", "www.tr.com"),
        database=os.getenv("DB_NAME", "smart_community_ai"),
        port=int(os.getenv("DB_PORT", 3306)),
        ssl=ctx,
        cursorclass=pymysql.cursors.DictCursor
    )