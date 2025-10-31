# Cancellation Charge Percentage Fix

## Problem
The cancellation charge percentage set by admin (e.g., 50%) was not being saved or used correctly. It always remained at the default 20%, and users were not shown the correct charge amount when canceling orders.

## Solution Implemented

### 1. Backend Fix (Admin Panel)
**File**: `admin panel/app/api/orders/[id]/route.ts`

**Changes**:
- Added import for `OrderCharges` model
- Modified cancellation fee calculation to fetch the percentage from the database instead of using hardcoded 20%
- The system now dynamically retrieves `cancellationPercentage` from the OrderCharges collection

**Code Changes**:
```typescript
// Before (Hardcoded):
cancellationFee = Math.round(currentOrder.totalAmount * 0.20)

// After (Dynamic from DB):
const orderCharges = await OrderCharges.findOne()
const cancellationPercentage = orderCharges?.cancellationPercentage || 20
cancellationFee = Math.round(currentOrder.totalAmount * (cancellationPercentage / 100))
```

### 2. Frontend Fix (Customer App)
**File**: `customer/src/pages/BookingConfirmation.tsx`

**Changes**:
- Added state to store `cancellationPercentage` fetched from API
- Added `useEffect` to fetch cancellation charges on component mount
- Updated cancellation policy modal to show dynamic percentage
- Added example calculation showing exact charge amount for current order
- Improved cancellation logic to check for `partnerId` instead of status
- Enhanced success message to show detailed charge breakdown

**Key Features**:
1. **Dynamic Policy Display**: Shows admin-set percentage in cancellation policy
2. **Real-time Calculation**: Displays exact charge amount based on order total
3. **Clear Messaging**: Shows detailed breakdown when order is cancelled
4. **Accurate Fee Calculation**: Uses partner assignment to determine if fee applies

## How It Works

### Admin Side:
1. Admin goes to **Add-On Management** → **Order Charges** tab
2. Sets the **Cancellation Percentage** (e.g., 50%)
3. Clicks **Save Charge Settings**
4. The percentage is saved in MongoDB `OrderCharges` collection

### Customer Side:
1. Customer places an order
2. On **Booking Confirmation** page, they can view cancellation policy
3. Policy shows: "Once a pickup executive has been assigned, a **{X}% cancellation fee** will be charged"
4. Example calculation shown: "For an order of ₹500, the cancellation charge would be ₹{calculated amount}"
5. When customer clicks **Cancel Order**:
   - System checks if partner is assigned
   - If YES: Calculates fee = (Order Total × Percentage) / 100
   - If NO: No fee charged
6. Success message shows: "Order cancelled. Cancellation charge of ₹{amount} ({X}% of ₹{total}) has been deducted from your wallet."

## Cancellation Fee Logic

### No Fee Charged:
- Order cancelled BEFORE partner assignment
- `partnerId` is null/undefined

### Fee Charged:
- Order cancelled AFTER partner assignment
- `partnerId` exists
- Fee = (Total Amount × Admin Set Percentage) / 100
- Fee is deducted from customer's wallet balance
- If wallet insufficient, remaining amount added to `dueAmount`

## Example Scenarios

### Scenario 1: Admin sets 50%
- Order Total: ₹1000
- Partner Assigned: Yes
- Cancellation Fee: ₹500 (50% of ₹1000)

### Scenario 2: Admin sets 30%
- Order Total: ₹800
- Partner Assigned: Yes
- Cancellation Fee: ₹240 (30% of ₹800)

### Scenario 3: Any percentage
- Order Total: ₹600
- Partner Assigned: No
- Cancellation Fee: ₹0 (No fee before partner assignment)

## Database Schema

### OrderCharges Model
```typescript
{
  cancellationPercentage: Number (default: 20),
  customerUnavailable: Number (default: 150),
  incorrectAddress: Number (default: 150),
  refusalToAccept: Number (default: 150),
  updatedAt: Date
}
```

## API Endpoints Used

1. **GET** `/api/order-charges` - Fetch current charge settings
2. **POST** `/api/order-charges` - Update charge settings (Admin)
3. **PATCH** `/api/orders/[id]` - Cancel order with dynamic fee calculation

## Testing Steps

1. **Set Custom Percentage**:
   - Login to Admin Panel (http://localhost:3000)
   - Go to Add-On → Order Charges
   - Set Cancellation Percentage to 50%
   - Save settings

2. **Place Order**:
   - Login to Customer App (http://localhost:3001)
   - Place a new order for ₹500

3. **View Policy**:
   - On confirmation page, click "View Cancellation Policy"
   - Verify it shows "50% cancellation fee"
   - Verify example shows "₹250" for ₹500 order

4. **Cancel Before Assignment**:
   - Cancel order immediately
   - Verify: "No cancellation charge applied"

5. **Cancel After Assignment**:
   - Place another order
   - Wait for partner assignment (or assign manually in admin)
   - Cancel order
   - Verify: "Cancellation charge of ₹250 (50% of ₹500) has been deducted"

## Files Modified

1. `admin panel/app/api/orders/[id]/route.ts` - Backend cancellation logic
2. `customer/src/pages/BookingConfirmation.tsx` - Frontend cancellation UI

## Notes

- The percentage is stored as a whole number (e.g., 20 for 20%, 50 for 50%)
- Calculation uses: `Math.round((amount * percentage) / 100)` to avoid decimals
- Fee is automatically deducted from wallet or added to due amount
- Transaction history is created for wallet deductions
- All console logs added for debugging purposes
