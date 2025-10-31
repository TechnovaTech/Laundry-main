# Complete Redelivery Workflow

## Overview
This document describes the complete redelivery workflow for failed delivery orders in the Laundry Management System.

## Workflow Steps

### 1. Delivery Failure (Partner App)
**Location**: `http://localhost:3002/delivery/[id]`

- Partner attempts delivery but customer is unavailable/address incorrect/refuses order
- Partner clicks "Not Delivered" button
- Partner selects failure reason(s):
  - Customer Unavailable
  - Incorrect Address
  - Refusal to Accept
- System updates order:
  - `status: 'delivery_failed'`
  - `deliveryFailureReason: 'Selected reasons'`
  - `deliveryFailureFee: 150` (₹100-₹250)
  - `deliveryFailedAt: timestamp`
- Customer is charged delivery failure fee

### 2. Return to Hub Request (Partner App)
**Location**: `http://localhost:3002/hub/drop`

- Failed delivery orders appear in hub drop page
- Partner drops order at hub and requests return approval
- System updates order:
  - `returnToHubRequested: true`
  - `returnToHubRequestedAt: timestamp`

### 3. Admin Approval (Admin Panel)
**Location**: `http://localhost:3000/admin/undelivered-orders`

- Admin sees all `delivery_failed` orders
- Orders with return requests show APPROVE/DECLINE buttons
- Admin clicks APPROVE:
  - `returnToHubApproved: true`
  - `returnToHubApprovedAt: timestamp`
  - `status: 'delivered_to_hub'`
  - `deliveredToHubAt: timestamp`
- SETUP REDELIVERY button appears

### 4. Setup Redelivery (Admin Panel)
**Location**: `http://localhost:3000/admin/undelivered-orders`

- Admin clicks "SETUP REDELIVERY" button
- Modal opens showing failure reason
- **If failure reason includes "Address"**:
  - Admin can update delivery address
- **If failure reason includes "Unavailable"**:
  - Admin sets new redelivery date
  - Admin selects time slot (9AM-12PM, 12PM-3PM, 3PM-6PM, 6PM-9PM)
- Admin clicks "Schedule Redelivery":
  - `status: 'process_completed'`
  - `processCompletedAt: timestamp`
  - `redeliveryScheduled: true`
  - `deliveryAddress: updated` (if address changed)
  - `deliverySlot: {date, timeSlot}` (if time changed)
- Order moves to partner delivery queue

### 5. Partner Picks for Redelivery (Partner App)
**Location**: `http://localhost:3002/delivery/pick`

- Order appears with "REDELIVERY" tag
- Shows updated address/time if changed by admin
- Partner selects order and clicks "Confirm Selection"

### 6. Start Redelivery (Partner App)
**Location**: `http://localhost:3002/delivery/[id]`

- Button shows "Start Redelivery" instead of "Start Delivery"
- Partner clicks button:
  - `status: 'out_for_delivery'`
  - `outForRedeliveryAt: timestamp` (instead of outForDeliveryAt)
  - `partnerId: assigned`

### 7. Complete Redelivery (Partner App)
**Location**: `http://localhost:3002/delivery/[id]`

- Partner delivers order successfully
- Partner clicks "Order Delivered":
  - `status: 'delivered'`
  - `deliveredAt: timestamp`
- Toast shows "Order redelivered successfully!"

### 8. Customer View (Customer App)
**Location**: `http://localhost:3001/order-details`

**Timeline shows**:
1. Order Placed
2. Reached Location
3. Picked Up
4. Delivered to Hub
5. Processing
6. Ironing
7. Process Completed
8. **Out for Redelivery** (with `outForRedeliveryAt` timestamp)
9. **Redelivered Successfully** (with `deliveredAt` timestamp)

**Failed delivery card shows**:
- ⚠ Delivery Failed
- Reason: [failure reason]
- Delivery Fee Charged: ₹150

### 9. Admin View (Admin Panel)
**Location**: `http://localhost:3000/admin/orders/[id]`

**Order Status Timeline shows**:
- All standard statuses
- **Out for Redelivery** (instead of Out for Delivery) with timestamp
- **Redelivered Successfully** (instead of Delivered) with timestamp

## Database Fields

### Order Model Fields
```typescript
{
  deliveryFailureReason: String,
  deliveryFailureFee: Number,
  deliveryFailedAt: Date,
  returnToHubRequested: Boolean,
  returnToHubRequestedAt: Date,
  returnToHubApproved: Boolean,
  returnToHubApprovedAt: Date,
  redeliveryScheduled: Boolean,
  outForRedeliveryAt: Date,
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  deliverySlot: {
    date: Date,
    timeSlot: String
  }
}
```

## Status Flow

```
Normal Flow:
pending → reached_location → picked_up → delivered_to_hub → 
processing → ironing → process_completed → out_for_delivery → delivered

Failed Delivery Flow:
... → out_for_delivery → delivery_failed → 
[return request] → delivered_to_hub → 
[admin setup redelivery] → process_completed → 
out_for_delivery (with redeliveryScheduled=true) → delivered
```

## Key Features

1. **Conditional Fields**: Admin modal shows different fields based on failure reason
2. **Updated Address**: If admin changes address, partner sees new location
3. **Updated Time**: If admin sets new time slot, partner sees customer availability
4. **REDELIVERY Tag**: Visual indicator in partner app for redelivery orders
5. **Different Timestamps**: Uses `outForRedeliveryAt` instead of `outForDeliveryAt`
6. **Success Message**: Shows "Redelivered Successfully" instead of "Delivered"
7. **Timeline Differentiation**: All three apps show redelivery-specific timeline

## Testing Checklist

- [ ] Partner can mark delivery as failed with reasons
- [ ] Partner can request return to hub
- [ ] Admin sees return request in undelivered orders page
- [ ] Admin can approve/decline return request
- [ ] Admin can setup redelivery with address/time changes
- [ ] Order appears in partner delivery queue with REDELIVERY tag
- [ ] Partner sees updated address/time if changed
- [ ] Partner can start redelivery (sets outForRedeliveryAt)
- [ ] Partner can complete redelivery
- [ ] Customer sees "Out for Redelivery" and "Redelivered Successfully" in timeline
- [ ] Admin sees redelivery timeline in order details
- [ ] Failed delivery card shows in customer app with reason and fee

## Important Notes

1. **Restart Admin Panel**: After clearing `.next` cache, restart the admin panel server to load updated Order model
2. **Real-time Updates**: Customer order details page refreshes every 5 seconds to show latest status
3. **Delivery Fee**: Customer is charged ₹150 for failed delivery (configurable ₹100-₹250)
4. **Pincode Matching**: Partner only sees orders matching their service area pincode
