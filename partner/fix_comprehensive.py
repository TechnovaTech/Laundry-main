import os
import re

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Fix useState with malformed quotes
        content = re.sub(r"useState\(['\"]`\)", "useState('')", content)
        content = re.sub(r"useState\(['\"]\"", "useState('')", content)
        
        # Fix getItem with malformed quotes
        content = re.sub(r"getItem\('([^']+)`\)", r"getItem('\1')", content)
        
        # Fix replace with malformed quotes
        content = re.sub(r"replace\(([^,]+),\s*['\"]`\)", r"replace(\1, '')", content)
        content = re.sub(r"replace\(([^,]+),\s*['\"]\\s`\)", r"replace(\1, ' ')", content)
        
        # Fix router.push with malformed quotes
        content = re.sub(r"push\(['\"]([^'\"]+)`\)", r"push('/\1')", content)
        content = re.sub(r"push\(['\"]\/([^'\"]+)`\)", r"push('/\1')", content)
        
        # Fix alert with malformed quotes
        content = re.sub(r"alert\(['\"]([^'\"]+)`\)", r"alert('\1')", content)
        
        # Fix join with malformed quotes
        content = re.sub(r"join\(['\"],\s`\)", r"join(', ')", content)
        
        # Fix selectedReasons.push with malformed quotes
        content = re.sub(r"push\('([^']+)`\)", r"push('\1')", content)
        
        # Fix === comparisons with malformed quotes
        content = re.sub(r"===\s*['\"]([^'\"]+)`\)", r"=== '\1')", content)
        
        # Fix startsWith with malformed quotes
        content = re.sub(r"startsWith\(['\"]([^'\"]+)`\)", r"startsWith('/\1')", content)
        content = re.sub(r"startsWith\(['\"]\/([^'\"]+)`\)", r"startsWith('/\1')", content)
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Fixed: {filepath}')
            return True
        else:
            print(f'No changes: {filepath}')
            return False
    except Exception as e:
        print(f'Error fixing {filepath}: {e}')
        return False

os.chdir('d:/OFFICE WORK/laundry-main/partner')

files = [
    'src/app/check-availability/page.tsx',
    'src/app/delivery/[id]/page.tsx',
    'src/app/delivery/history/page.tsx',
    'src/app/delivery/pick/page.tsx',
    'src/app/hub/delivered/page.tsx',
    'src/app/hub/drop/page.tsx',
    'src/app/login/page.tsx',
    'src/app/pickups/confirm/[id]/page.tsx',
    'src/app/pickups/page.tsx',
    'src/components/BottomNav.tsx',
]

for file in files:
    if os.path.exists(file):
        fix_file(file)
    else:
        print(f'Not found: {file}')

print('\nAll files processed!')
