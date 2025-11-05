import os
import glob

os.chdir('d:/OFFICE WORK/laundry-main/partner/src')

for root, dirs, files in os.walk('.'):
    for file in files:
        if file.endswith('.tsx'):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original = content
                content = content.replace('`)', "')")
                content = content.replace('"`)', '")')
                
                if content != original:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f'Fixed: {filepath}')
            except Exception as e:
                print(f'Error: {filepath} - {e}')

print('Done!')
