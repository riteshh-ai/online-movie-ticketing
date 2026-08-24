<?php
session_start();
include("conn.php");

if (file_exists(__DIR__ . '/esewa_config.php')) {
    include_once(__DIR__ . '/esewa_config.php');
}

$conn = new connec();

/* ===== SAFE FALLBACK TEST CONFIG ===== */
if (!defined('ESEWA_GATEWAY_URL'))
    define('ESEWA_GATEWAY_URL', 'https://uat.esewa.com.np/api/epay/main/v2/form');

if (!defined('ESEWA_MERCHANT_CODE'))
    define('ESEWA_MERCHANT_CODE', 'EPAYTEST');

if (!defined('ESEWA_MERCHANT_SECRET'))
    define('ESEWA_MERCHANT_SECRET', '8gBm/:&EnhH.1/q');

/* ===== SESSION CHECK ===== */
if (!isset($_SESSION["booking_id"], $_SESSION["booking_total"], $_SESSION["cust_id"])) {
    header("Location: booking.php");
    exit();
}

$booking_id   = (int)$_SESSION["booking_id"];
$total_amount = (float)$_SESSION["booking_total"];
$customer_id  = (int)$_SESSION["cust_id"];

/* ===== TRANSACTION ===== */
$transaction_uuid = md5(time() . $booking_id . $customer_id);

/* ===== SIGNATURE ===== */
$message = "total_amount=$total_amount,transaction_uuid=$transaction_uuid,product_code=" . ESEWA_MERCHANT_CODE;
$signature = base64_encode(
    hash_hmac('sha256', $message, ESEWA_MERCHANT_SECRET, true)
);

$_SESSION["esewa_uuid"]   = $transaction_uuid;
$_SESSION["esewa_amount"] = $total_amount;
?>

<!DOCTYPE html>
<html>

<head>
    <title>Processing eSewa Payment</title>
    <style>
        body {
            font-family: Arial;
            background: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        .box {
            background: #fff;
            padding: 40px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, .15);
            width: 380px;
        }

        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #ddd;
            border-top: 4px solid darkcyan;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }

        @keyframes spin {
            100% {
                transform: rotate(360deg)
            }
        }

        .btn {
            display: inline-block;
            margin: 8px;
            padding: 10px 14px;
            border-radius: 6px;
            color: #fff;
            text-decoration: none;
            font-size: 14px;
        }
    </style>
</head>

<body>

    <div class="box">
        <h3>Processing Payment</h3>
        <div class="spinner"></div>
        <p>Redirecting to eSewa…</p>
        <p style="color:#666">Amount: Rs. <?php echo $total_amount; ?></p>

        <hr>

        <p style="font-size:13px;color:#777">
            If eSewa test server doesn’t open, use simulation 👇
        </p>

        <a class="btn" style="background:#2ecc71"
            href="payment_success.php?transaction_uuid=<?php echo $transaction_uuid; ?>&status=COMPLETE&product_code=<?php echo ESEWA_MERCHANT_CODE; ?>&total_amount=<?php echo $total_amount; ?>">
            ✅ Simulate Success
        </a>

        <a class="btn" style="background:#e74c3c"
            href="payment_failure.php?status=FAILED">
            ❌ Simulate Failure
        </a>
    </div>

    <!-- FORM EXISTS BUT IS NOT AUTO SUBMITTED -->
    <form id="esewa_form" action="<?php echo ESEWA_GATEWAY_URL; ?>" method="POST" target="_blank">
        <input type="hidden" name="amount" value="<?php echo $total_amount; ?>">
        <input type="hidden" name="tax_amount" value="0">
        <input type="hidden" name="total_amount" value="<?php echo $total_amount; ?>">
        <input type="hidden" name="transaction_uuid" value="<?php echo $transaction_uuid; ?>">
        <input type="hidden" name="product_code" value="<?php echo ESEWA_MERCHANT_CODE; ?>">
        <input type="hidden" name="signed_field_names" value="total_amount,transaction_uuid,product_code">
        <input type="hidden" name="signature" value="<?php echo $signature; ?>">
    </form>

</body>

</html>