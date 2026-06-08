import re

with open('src/components/MediaModal.tsx', 'r') as f:
    content = f.read()

# Replace unoptimized with responsive sizing
new_content = re.sub(
    r'<Image src=\{project\.image_url\} alt=\{project\.title\} className="w-full h-full object-cover" width=\{800\} height=\{600\} unoptimized />',
    r'<Image src={project.image_url} alt={project.title} className="w-full h-full object-cover" fill sizes="100vw" priority />',
    content
)

with open('src/components/MediaModal.tsx', 'w') as f:
    f.write(new_content)
