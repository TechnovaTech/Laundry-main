import os
import re

def fix_syntax(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix broken strings
    content = content.replace("useState('`)", "useState('')")
    content = content.replace('useState("`)', 'useState("")')
    content = content.replace("setSelectedVoucherCode('`)", "setSelectedVoucherCode('')")
    content = content.replace("setIssueText('`)", "setIssueText('')")
    content = content.replace("otp.join('`)", "otp.join('')")
    content = content.replace("navigate('/congrats`)", "navigate('/congrats')")
    content = content.replace("navigate('/not-available`)", "navigate('/not-available')")
    content = content.replace("navigate('/profile`)", "navigate('/profile')")
    content = content.replace("replace(/\\D/g, '`)", "replace(/\\D/g, '')")
    content = content.replace("localStorage.getItem('customerId`)", "localStorage.getItem('customerId')")
    content = content.replace("split(', `)", "split(', ')")
    content = content.replace('split(" - `)', 'split(" - ")')
    content = content.replace("', ' + address.addressLine2 : '`)", "', ' + address.addressLine2 : '')")
    content = content.replace("console.log('Service check failed, continuing with save`)", "console.log('Service check failed, continuing with save')")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return True

# Fix all customer app files
for root, dirs, files in os.walk('customer/src'):
    for file in files:
        if file.endswith(('.tsx', '.ts')):
            filepath = os.path.join(root, file)
            fix_syntax(filepath)
            print(f'Fixed: {filepath}')

print('\nAll syntax errors fixed!')
