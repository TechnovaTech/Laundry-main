import os
import re

def replace_in_file(filepath, app_type):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'http://localhost:3000' not in content:
        return False
    
    # Add import if not exists
    if 'API_URL' not in content:
        if app_type == 'customer':
            import_line = "import { API_URL } from '@/config/api';\n"
        else:
            import_line = "import { API_URL } from '@/config/api';\n"
        
        # Add after last import
        lines = content.split('\n')
        last_import_idx = 0
        for i, line in enumerate(lines):
            if line.startswith('import '):
                last_import_idx = i
        lines.insert(last_import_idx + 1, import_line.rstrip())
        content = '\n'.join(lines)
    
    # Replace all localhost URLs
    content = content.replace("'http://localhost:3000", "`${API_URL}")
    content = content.replace('"http://localhost:3000', '`${API_URL}')
    content = content.replace("')", "`)")
    content = content.replace('")', '`)')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return True

# Process customer app
customer_dir = 'customer/src'
for root, dirs, files in os.walk(customer_dir):
    for file in files:
        if file.endswith(('.tsx', '.ts')) and not file.endswith('.d.ts'):
            filepath = os.path.join(root, file)
            if replace_in_file(filepath, 'customer'):
                print(f'Updated: {filepath}')

# Process partner app
partner_dir = 'partner/src'
for root, dirs, files in os.walk(partner_dir):
    for file in files:
        if file.endswith(('.tsx', '.ts')) and not file.endswith('.d.ts'):
            filepath = os.path.join(root, file)
            if replace_in_file(filepath, 'partner'):
                print(f'Updated: {filepath}')

print('\nDone! All localhost URLs replaced with API_URL')
