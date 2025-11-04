import os
import re

def fix_fetch(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix fetch calls with mismatched quotes
    content = re.sub(r"fetch\(`\$\{API_URL\}([^`]*)'", r"fetch(`${API_URL}\1`", content)
    content = re.sub(r'fetch\(`\$\{API_URL\}([^`]*)"', r'fetch(`${API_URL}\1`', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# Fix all customer app files
for root, dirs, files in os.walk('customer/src'):
    for file in files:
        if file.endswith(('.tsx', '.ts')):
            filepath = os.path.join(root, file)
            fix_fetch(filepath)

print('Fetch fixes complete!')
