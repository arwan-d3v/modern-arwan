import re

with open('src/components/ShowcaseSection.tsx', 'r') as f:
    content = f.read()

# Replace unoptimized with responsive sizing
new_content = re.sub(
    r'<Image src=\{project\.image_url\} alt=\{project\.title\} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" width=\{600\} height=\{400\} unoptimized />',
    r'<Image src={project.image_url} alt={project.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" fill sizes="(max-width: 768px) 100vw, 50vw" priority={index < 2} />',
    content
)

with open('src/components/ShowcaseSection.tsx', 'w') as f:
    f.write(new_content)
