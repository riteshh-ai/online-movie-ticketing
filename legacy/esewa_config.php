<?php

/**
 * eSewa Payment Gateway Configuration
 * 
 * TEST CREDENTIALS PROVIDED:
 * eSewa ID: 9806800001/2/3/4/5
 * Password: Nepal@123
 * MPIN: 1122
 * Merchant ID/Service Code: EPAYTEST
 * Token: 123456
 */

// =====================================================
// eSEWA TEST ENVIRONMENT CREDENTIALS
// =====================================================

define('ESEWA_TEST_MODE', true); // Set to false for production

// Test Gateway URL
define('ESEWA_TEST_GATEWAY', 'https://uat.esewa.com.np/api/epay/main/v2/form');

// Production Gateway URL (when ready)
define('ESEWA_PRODUCTION_GATEWAY', 'https://epay.esewa.com.np/api/epay/main/v2/form');

// TEST CREDENTIALS - REPLACE WITH YOUR OWN AFTER GOING LIVE
define('ESEWA_MERCHANT_CODE_TEST', 'EPAYTEST');
define('ESEWA_SECRET_KEY_TEST', '8gBm/:&EnhH.1/q');

// Production Credentials (update when you go live)
define('ESEWA_MERCHANT_CODE_PROD', 'YOUR_MERCHANT_CODE_HERE');
define('ESEWA_SECRET_KEY_PROD', 'YOUR_SECRET_KEY_HERE');

// =====================================================
// DYNAMIC CONFIGURATION BASED ON ENVIRONMENT
// =====================================================

if (ESEWA_TEST_MODE) {
    define('ESEWA_GATEWAY_URL', ESEWA_TEST_GATEWAY);
    define('ESEWA_MERCHANT_CODE', ESEWA_MERCHANT_CODE_TEST);
    define('ESEWA_SECRET_KEY', ESEWA_SECRET_KEY_TEST);
} else {
    define('ESEWA_GATEWAY_URL', ESEWA_PRODUCTION_GATEWAY);
    define('ESEWA_MERCHANT_CODE', ESEWA_MERCHANT_CODE_PROD);
    define('ESEWA_SECRET_KEY', ESEWA_SECRET_KEY_PROD);
}

// =====================================================
// APPLICATION URLS FOR PAYMENT CALLBACKS
// =====================================================

// Update these if your application is hosted on a different domain
define('APP_DOMAIN', 'http://' . $_SERVER['HTTP_HOST'] . '/Online-Movie-Ticket-Booking');
define('ESEWA_SUCCESS_URL', APP_DOMAIN . '/payment_success.php');
define('ESEWA_FAILURE_URL', APP_DOMAIN . '/payment_failure.php');

// =====================================================
// ESEWA PAYMENT PRODUCT DETAILS
// =====================================================

define('PRODUCT_CODE', 'EPAYTEST'); // Same as merchant code for testing
define('PRODUCT_SERVICE_CHARGE', 0); // Service charge percentage
define('PRODUCT_DELIVERY_CHARGE', 0); // Delivery charge

// =====================================================
// TESTING GUIDE
// =====================================================
/*
 * TEST CREDENTIALS TO USE IN eSEWA:
 * 
 * eSewa ID: 9806800001 (or 2, 3, 4, 5)
 * Password: Nepal@123
 * MPIN: 1122
 * 
 * TO TEST SUCCESSFUL PAYMENT:
 * - Use amount: 100 or more
 * - Use valid eSewa test credentials above
 * 
 * TO TEST FAILED PAYMENT:
 * - Use amount: Less than 10
 * OR
 * - Use invalid credentials
 * 
 * FLOW:
 * 1. User selects "Pay with eSewa" on booking page
 * 2. User is redirected to eSewa payment page
 * 3. User logs in with test credentials (9806800001 / Nepal@123 / 1122)
 * 4. User completes payment
 * 5. eSewa redirects back to your success/failure page
 * 6. Payment status is updated in database
 */
