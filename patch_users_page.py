import re

with open('src/app/dashboard/users/page.tsx', 'r') as f:
    content = f.read()

# Fix img lint warning
content = re.sub(
    r'<img src=\{user\.photoURL\} alt=\{user\.displayName \|\| \'User\'\} className="w-full h-full object-cover" />',
    r'<Image src={user.photoURL} alt={user.displayName || \'User\'} fill className="object-cover" sizes="32px" />',
    content
)

if 'import Image from "next/image";' not in content:
    content = content.replace('import { useState, useEffect } from "react";', 'import { useState, useEffect } from "react";\nimport Image from "next/image";')

with open('src/app/dashboard/users/page.tsx', 'w') as f:
    f.write(content)
