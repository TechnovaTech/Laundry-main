import os
import re

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Fix all malformed quote patterns
        content = content.replace('`)', '")')
        content = content.replace("'`)", "'\")")
        content = content.replace('\'")', "')")
        content = content.replace('`}', '"}')
        
        # Fix specific useState patterns
        content = re.sub(r"useState\('all\"\)", "useState('all')", content)
        content = re.sub(r"useState\('\"\)", "useState('')", content)
        content = re.sub(r"getItem\('partnerId\"\)", "getItem('partnerId')", content)
        content = re.sub(r"fetch\(`http://localhost:3000/api/mobile/partners/\$\{partnerId\}\"\)", "fetch(`http://localhost:3000/api/mobile/partners/${partnerId}`)", content)
        content = re.sub(r"fetch\(`\$\{API_URL\}/api/orders\"\)", "fetch(`${API_URL}/api/orders`)", content)
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f'Error fixing {filepath}: {e}')
        return False

os.chdir('d:/OFFICE WORK/laundry-main')

partner_files = [
    'partner/src/app/check-availability/page.tsx',
    'partner/src/app/delivery/[id]/page.tsx',
    'partner/src/app/delivery/history/page.tsx',
    'partner/src/app/delivery/pick/page.tsx',
    'partner/src/app/hub/delivered/page.tsx',
]

for file in partner_files:
    if os.path.exists(file):
        if fix_file(file):
            print(f'Fixed: {file}')
        else:
            print(f'No changes: {file}')
    else:
        print(f'Not found: {file}')

print('\nAll partner app files fixed!')
