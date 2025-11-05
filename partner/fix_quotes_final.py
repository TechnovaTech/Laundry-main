import os

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        fixed_lines = []
        for line in lines:
            # Fix single quote start with double quote end
            line = line.replace("'profile\")", "'profile')")
            line = line.replace("'partnerId\")", "'partnerId')")
            line = line.replace("'react\"", "'react'")
            line = line.replace("'contain\"", "'contain'")
            line = line.replace("useState(''))", "useState('')")
            line = line.replace("useState(''))", "useState('')")
            
            # Fix template literals with wrong ending
            if '`http://localhost:3000' in line and line.strip().endswith('");'):
                line = line.replace('");', '`);')
            if '`http://localhost:3000' in line and line.strip().endswith('\");'):
                line = line.replace('\");', '`);')
            if '`${API_URL}' in line and line.strip().endswith('");'):
                line = line.replace('");', '`);')
            if '`${API_URL}' in line and line.strip().endswith('\");'):
                line = line.replace('\");', '`);')
                
            fixed_lines.append(line)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(fixed_lines)
        print(f'Fixed: {filepath}')
        return True
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
        fix_file(file)
    else:
        print(f'Not found: {file}')

print('\nAll files fixed!')
