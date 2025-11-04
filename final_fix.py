import os
import re

def final_fix(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix all remaining broken strings with backtick
    content = re.sub(r"'([^']*)`\)", r"'\1')", content)
    content = re.sub(r'"([^"]*)`\)', r'"\1")', content)
    content = re.sub(r"`\)", r"`)", content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# Fix all customer app files
for root, dirs, files in os.walk('customer/src'):
    for file in files:
        if file.endswith(('.tsx', '.ts')):
            filepath = os.path.join(root, file)
            final_fix(filepath)

print('Final fix complete!')
