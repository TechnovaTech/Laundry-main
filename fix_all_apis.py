import os
import re

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'localhost:3000' not in content:
        return False
    
    # Add import if not present
    if "from '@/config/api'" not in content and "from \"@/config/api\"" not in content:
        # Find last import line
        lines = content.split('\n')
        last_import = 0
        for i, line in enumerate(lines):
            if line.strip().startswith('import '):
                last_import = i
        
        # Insert import after last import
        lines.insert(last_import + 1, "import { API_URL } from '@/config/api';")
        content = '\n'.join(lines)
    
    # Replace all localhost:3000 patterns
    content = re.sub(r'`http://localhost:3000/', r'`${API_URL}/', content)
    content = re.sub(r"'http://localhost:3000/", r"`${API_URL}/", content)
    content = re.sub(r'"http://localhost:3000/', r'`${API_URL}/', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return True

# Fix all customer app files
customer_files = [
    'customer/src/pages/Booking.tsx',
    'customer/src/pages/BookingConfirmation.tsx',
    'customer/src/pages/BookingHistory.tsx',
    'customer/src/pages/CheckAvailability.tsx',
    'customer/src/pages/ContinueBooking.tsx',
    'customer/src/pages/CreateProfile.tsx',
    'customer/src/pages/Home.tsx',
    'customer/src/pages/OrderDetails.tsx',
    'customer/src/pages/Prices.tsx',
    'customer/src/pages/Profile.tsx',
    'customer/src/pages/RateOrder.tsx',
    'customer/src/pages/ReferEarn.tsx',
    'customer/src/pages/VerifyMobile.tsx',
    'customer/src/pages/Wallet.tsx',
    'customer/src/utils/generateInvoice.ts'
]

for file in customer_files:
    if os.path.exists(file):
        if fix_file(file):
            print(f'Fixed: {file}')
    else:
        print(f'Not found: {file}')

print('\nAll customer app files updated!')
