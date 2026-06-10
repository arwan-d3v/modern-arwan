import re

with open('src/app/page.tsx', 'r') as f:
    content = f.read()

# Make it a client component since we use framer motion on the page
if '"use client";' not in content:
    content = '"use client";\n' + content

with open('src/app/page.tsx', 'w') as f:
    f.write(content)
