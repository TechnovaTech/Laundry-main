import os
import re

def fix_navigate(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix navigate calls
    content = content.replace("navigate('/login`)", "navigate('/login')")
    content = content.replace('navigate("/login`)', 'navigate("/login")')
    content = content.replace("navigate('/login`);", "navigate('/login');")
    content = content.replace('navigate("/login`);', 'navigate("/login");')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# Fix all customer app files
for root, dirs, files in os.walk('customer/src'):
    for file in files:
        if file.endswith(('.tsx', '.ts')):
            filepath = os.path.join(root, file)
            fix_navigate(filepath)

print('Navigate fixes complete!')
