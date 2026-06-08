import re

with open('src/app/page.tsx', 'r') as f:
    content = f.read()

# Add framer-motion import
if 'import { motion }' not in content:
    content = content.replace('import FadeIn from "@/components/FadeIn";', 'import FadeIn from "@/components/FadeIn";\nimport { motion } from "framer-motion";')

# Define new StatCard
new_stat_card = '''const StatCard = ({ label, value, icon, delay = 0 }: StatCardProps) => (
  <FadeIn delay={delay} className="glass-hover p-6 rounded-none flex flex-col gap-4 border border-surface relative overflow-hidden group">
    <div className="absolute inset-0 bg-gradient-to-br from-surface to-transparent opacity-50 z-0 pointer-events-none" />
    <div className="text-accent-cyan z-10">{icon}</div>
    <div className="z-10">
      <div className="text-3xl font-mono font-bold text-text-primary tracking-tighter drop-shadow-sm">{value}</div>
      <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-secondary font-bold mt-1 group-hover:text-accent-cyan transition-colors">{label}</div>
    </div>
  </FadeIn>
);'''

# Replace old StatCard
content = re.sub(
    r'const StatCard = \(\{ label, value, icon, delay = 0 \}: StatCardProps\) => \([\s\S]*?\n\);',
    new_stat_card,
    content
)

# Insert CTAs after the intro paragraph
cta_html = '''
        <FadeIn delay={0.5}>
          <div className="flex flex-col sm:flex-row gap-6 mt-8 mb-16">
            <motion.a
              href="/dashboard"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-accent-cyan text-black px-8 py-4 rounded-none font-bold font-mono text-sm tracking-widest uppercase flex items-center justify-center shadow-cyan-glow hover:bg-accent-cyan/90 transition-colors"
            >
              Access Dashboard
            </motion.a>
            <motion.a
              href="#showcase"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border border-text-secondary text-text-primary px-8 py-4 rounded-none font-bold font-mono text-sm tracking-widest uppercase flex items-center justify-center hover:border-accent-cyan hover:text-accent-cyan transition-colors"
            >
              View Architecture
            </motion.a>
          </div>
        </FadeIn>
'''

# We need to insert this right after the paragraph
content = re.sub(
    r'(<p className="text-lg md:text-xl text-text-secondary max-w-2xl leading-relaxed mt-8 mb-12 font-medium">\s*Building resilient algorithmic trading systems, automated data pipelines,\s*and scalable network infrastructures\. Focused on performance, security, and high-frequency execution\.\s*</p>\s*</FadeIn>)',
    r'\1\n' + cta_html,
    content
)


with open('src/app/page.tsx', 'w') as f:
    f.write(content)
