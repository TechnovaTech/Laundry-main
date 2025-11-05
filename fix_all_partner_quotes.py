import os
import glob

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Fix all quote mismatches
        content = content.replace('`}', '`')
        content = content.replace('"}', '`}')
        content = content.replace('\'")', "')")
        content = content.replace('`")', '`)')
        content = content.replace("'`)", "')")
        content = content.replace('(")', "('')")
        content = content.replace("('partnerId`)", "('partnerId')")
        content = content.replace('alert(")', "alert('')")
        content = content.replace('"delivered")', "'delivered')")
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f'Error: {e}')
        return False

os.chdir('d:/OFFICE WORK/laundry-main/partner/src/app')

for root, dirs, files in os.walk('.'):
    for file in files:
        if file.endswith('.tsx'):
            filepath = os.path.join(root, file)
            if fix_file(filepath):
                print(f'Fixed: {filepath}')

print('\nDone!')
