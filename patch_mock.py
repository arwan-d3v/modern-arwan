import re

with open('src/lib/firebaseAdmin.ts', 'r') as f:
    content = f.read()

content = content.replace("db = getDatabase();", """
if (admin.apps.length > 0) {
  db = getDatabase();
} else {
  throw new Error("No apps");
}
""")

with open('src/lib/firebaseAdmin.ts', 'w') as f:
    f.write(content)
