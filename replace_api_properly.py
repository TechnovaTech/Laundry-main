import os
import re

def replace_api_url(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'localhost:3000' not in content:
        return False
    
    # Add import if not present
    if "from '@/config/api'" not in content and "from \"@/config/api\"" not in content:
        # Find last import line
        lines = content.split('\n')
        last_import = 0
        for i, line in enumerate(lines):
            if line.strip().startswith('import '):
                last_import = i
        
        # Insert import after last import
        lines.insert(last_import + 1, "import { API_URL } from '@/config/api';")
        content = '\n'.join(lines)
    
    # Replace localhost:3000 with ${API_URL}
    content = content.replace('http://localhost:3000', '${API_URL}')
    
    # Fix quotes: change 'url' to `url` when it contains ${API_URL}
    content = re.sub(r"'(\$\{API_URL\}[^']*)'", r'`\1`', content)
    content = re.sub(r'"(\$\{API_URL\}[^"]*)"', r'`\1`', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return True

# Fix customer app
customer_files = []
for root, dirs, files in os.walk('customer/src'):
    for file in files:
        if file.endswith(('.tsx', '.ts')) and not file.endswith('.d.ts'):
            filepath = os.path.join(root, file)
            if replace_api_url(filepath):
                customer_files.append(filepath)
                print(f'Fixed: {filepath}')

print(f'\nTotal files updated: {len(customer_files)}')
