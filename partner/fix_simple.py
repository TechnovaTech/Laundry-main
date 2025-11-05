import os

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Simple string replacements for common patterns
        content = content.replace("'partnerId`)", "'partnerId')")
        content = content.replace("'all`)", "'all')")
        content.replace("replace('_', ' `)", "replace('_', ' ')")
        
        # Fix the specific line in delivery/[id]/page.tsx
        content = content.replace(".replace('_', ' `)", ".replace('_', ' ')")
        
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
