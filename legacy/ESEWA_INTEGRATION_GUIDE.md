# eSEWA Payment Integration Guide

## Overview
This document provides a complete guide for the eSewa payment integration implemented in the Online Movie Ticket Booking system.

## Test Credentials
```
eSewa ID: 9806800001 (or 2, 3, 4, 5)
Password: Nepal@123
MPIN: 1122
Merchant Code: EPAYTEST
Token: 123456
```

## Files Created/Modified

### 1. **booking.php** (Modified)
- Added payment method selection modal after booking confirmation
- Stores booking details in session for payment processing
- Shows two options: "Pay with eSewa" and "Pay at Counter"

### 2. **esewa_payment.php** (New)
- Handles eSewa payment request
- Generates secure signature for eSewa validation
- Creates auto-submitting form to redirect to eSewa gateway
- Stores transaction UUID for verification

### 3. **payment_success.php** (New)
- Displays when payment is successfully completed via eSewa
- Updates booking status to 'completed'
- Sets payment method to 'esewa'
- Shows booking confirmation details

### 4. **payment_failure.php** (New)
- Displays when payment fails or is cancelled
- Updates booking status to 'failed'
- Provides option to retry or go home

### 5. **payment_counter.php** (New)
- Handles "Pay at Counter" option
- Sets payment method to 'counter' and status to 'pending'
- Displays booking details and payment instructions
- Shows instructions for counter payment

### 6. **esewa_config.php** (New)
- Contains all eSewa configuration credentials
- Easy switching between test and production environment
- Stores test credentials and can be updated for live credentials

### 7. **DATABASE_UPDATES.sql** (New)
- SQL queries to update the booking table schema
- Adds payment_status and payment_method columns
- Optional columns for transaction tracking

## Database Schema Changes

Run these SQL queries in your database:

```sql
-- Add payment_status column
ALTER TABLE booking ADD COLUMN payment_status VARCHAR(50) DEFAULT 'pending' AFTER total_amnt;

-- Add payment_method column
ALTER TABLE booking ADD COLUMN payment_method VARCHAR(50) DEFAULT 'counter' AFTER payment_status;

-- Add transaction_id column (optional)
ALTER TABLE booking ADD COLUMN transaction_id VARCHAR(255) DEFAULT NULL AFTER payment_method;

-- Add payment_date column (optional)
ALTER TABLE booking ADD COLUMN payment_date DATETIME DEFAULT NULL AFTER transaction_id;
```

## Payment Flow

### eSewa Payment Flow
```
1. User completes booking selection (seats, show, date)
2. User clicks "Confirm Booking"
3. Booking is created in database (payment_status = 'pending')
4. Payment options modal appears
5. User selects "Pay with eSewa"
6. User redirected to eSewa payment gateway
7. User logs in with eSewa credentials
8. User completes payment
9. eSewa redirects back to payment_success.php
10. Booking status updated to 'completed'
11. Success page displays confirmation
```

### Counter Payment Flow
```
1. User completes booking selection
2. User clicks "Confirm Booking"
3. Booking is created in database
4. Payment options modal appears
5. User selects "Pay at Counter"
6. Booking method set to 'counter', status = 'pending'
7. Instructions page displays
8. User proceeds to cinema counter with Booking ID
9. Payment collected at counter
10. Admin can mark as paid in dashboard (optional)
```

## Testing

### Test Successful Payment
1. Navigate to booking page
2. Select seats, show, and date
3. Click "Confirm Booking"
4. Choose "Pay with eSewa"
5. Use credentials:
   - eSewa ID: 9806800001
   - Password: Nepal@123
   - MPIN: 1122
6. Amount should be ≥ 100

### Test Failed Payment
1. Follow same steps but use amount < 10
2. OR use invalid credentials
3. Payment should be marked as failed

## Security Considerations

1. **Secret Key Storage**: Never expose ESEWA_SECRET_KEY in frontend code
2. **Signature Verification**: Always verify signatures from eSewa responses
3. **HTTPS**: Use HTTPS in production environment
4. **Transaction Logging**: Keep record of all transactions for auditing
5. **Amount Validation**: Always verify amount on server side before processing

## Environment Setup

### Development (Test Mode)
```php
// Already configured in esewa_config.php
define('ESEWA_TEST_MODE', true);
```

### Production (Live Mode)
1. Get your production credentials from eSewa
2. Update esewa_config.php:
   ```php
   define('ESEWA_TEST_MODE', false);
   define('ESEWA_MERCHANT_CODE_PROD', 'YOUR_MERCHANT_CODE');
   define('ESEWA_SECRET_KEY_PROD', 'YOUR_SECRET_KEY');
   ```
3. Update URLs to use HTTPS

## Troubleshooting

### Payment Not Processing
- Check if ESEWA_TEST_MODE is set correctly
- Verify credentials are entered correctly in eSewa
- Check if test account has sufficient balance

### Signature Error
- Ensure secret key is correct
- Verify message format matches eSewa documentation
- Check if merchant code is correct

### Redirect Issues
- Ensure success_url and failure_url are accessible
- Check if URLs use correct domain
- Verify no special characters in URL

## Admin Dashboard Integration

To view payment status in admin panel:

```sql
-- View all bookings with payment details
SELECT id, customer_id, no_ticket, total_amnt, 
       payment_status, payment_method, payment_date 
FROM booking;

-- View pending counter payments
SELECT id, no_ticket, total_amnt, booking_date 
FROM booking 
WHERE payment_method = 'counter' AND payment_status = 'pending';

-- View completed eSewa payments
SELECT id, no_ticket, total_amnt, payment_date, transaction_id 
FROM booking 
WHERE payment_method = 'esewa' AND payment_status = 'completed';
```

## Important Notes

1. **Test Mode Active**: The system is currently in TEST mode. Test thoroughly before going live.

2. **Seat Reservation**: Seats are reserved immediately upon booking creation. Consider implementing a timeout for pending payments.

3. **Email Notifications**: Recommended to implement email notifications for booking confirmation and payment status.

4. **Payment Verification**: Consider implementing server-side verification with eSewa to ensure payment authenticity.

5. **Refunds**: Implement refund handling for cancelled bookings.

## Support

For eSewa documentation: https://developer.esewa.com.np/
For issues related to this integration, check the payment logs and verify:
- Database entries are being created
- Payment status is being updated
- URLs are correctly configured

## Next Steps

1. Run the SQL queries from DATABASE_UPDATES.sql
2. Test the payment flow with provided credentials
3. Once satisfied, update to production credentials
4. Implement email notifications (optional)
5. Add admin dashboard for payment management (optional)
