import os
import re

def fix_syntax(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix more broken patterns
    content = content.replace('digit === "`)', 'digit === "")')
    content = content.replace("digit === '`)", "digit === '')")
    content = content.replace('=== "`', '=== ""')
    content = content.replace("=== '`", "=== ''")
    content = content.replace('!== "`', '!== ""')
    content = content.replace("!== '`", "!== ''")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# Fix all customer app files
for root, dirs, files in os.walk('customer/src'):
    for file in files:
        if file.endswith(('.tsx', '.ts')):
            filepath = os.path.join(root, file)
            fix_syntax(filepath)

print('All syntax errors fixed!')
