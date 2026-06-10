import re

with open('src/lib/firebaseAdmin.ts', 'r') as f:
    content = f.read()

# Replace db init to only getDatabase if app exists
new_db_init = """let db: admin.database.Database;
try {
  db = getDatabase();
} catch (e) {
  console.warn("Failed to get Firebase Admin database:", e);
  db = {} as any; // mock
}"""

content = content.replace("const db = getDatabase();", new_db_init)

with open('src/lib/firebaseAdmin.ts', 'w') as f:
    f.write(content)
