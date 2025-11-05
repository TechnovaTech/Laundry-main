import os
import re

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Fix mixed quote patterns - single quote start with double quote end
        content = re.sub(r"'([^'\"]+)\"", r"'\1'", content)
        
        # Fix template literal patterns
        content = re.sub(r'`\$\{([^}]+)\}([^`]*)"', r'`${\1}\2`', content)
        
        # Fix useState patterns
        content = re.sub(r"useState\('\"", "useState('')", content)
        content = re.sub(r'useState\("', "useState('')", content)
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f'Error fixing {filepath}: {e}')
        return False

os.chdir('d:/OFFICE WORK/laundry-main/partner')

files = [
    'src/components/BottomNav.tsx',
    'src/app/hub/drop/page.tsx',
    'src/app/login/page.tsx',
    'src/app/pickups/confirm/[id]/page.tsx',
    'src/app/pickups/page.tsx',
]

for file in files:
    if os.path.exists(file):
        if fix_file(file):
            print(f'Fixed: {file}')
        else:
            print(f'No changes: {file}')
    else:
        print(f'Not found: {file}')

print('\nAll files fixed!')
