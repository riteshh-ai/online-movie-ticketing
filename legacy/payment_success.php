<?php

include("header.php");
require_once("conn.php");

$conn = new connec();

/* ===== GET VALUES ===== */
$status           = $_GET['status'] ?? '';
$transaction_uuid = $_GET['transaction_uuid'] ?? '';
$product_code     = $_GET['product_code'] ?? '';
$total_amount     = $_GET['total_amount'] ?? '';

$booking_id   = $_SESSION['booking_id']   ?? null;
$session_uuid = $_SESSION['esewa_uuid']   ?? null;
$session_amt  = $_SESSION['esewa_amount'] ?? null;

$payment_successful = false;

/* ===== BASIC VERIFICATION ===== */
if (
    $status === 'COMPLETE' &&
    $booking_id &&
    $transaction_uuid === $session_uuid &&
    (float)$total_amount == (float)$session_amt
) {
    $sql = "
        UPDATE booking 
        SET payment_status='completed', payment_method='esewa' 
        WHERE id=$booking_id
    ";
    $conn->update($sql, "Payment updated");

    $payment_successful = true;

    /* clear only payment related sessions */
    unset($_SESSION['esewa_uuid'], $_SESSION['esewa_amount']);
}
?>

<section class="mt-5">
    <div class="container d-flex justify-content-center align-items-center" style="min-height:500px;">
        <div class="card shadow p-5" style="max-width:500px;width:100%;border-radius:15px;text-align:center;">

            <?php if ($payment_successful): ?>
                <div style="color:#2ecc71">
                    <i class="fa fa-check-circle" style="font-size:80px;"></i>
                </div>
                <h2 style="color:#2ecc71;">Payment Successful!</h2>

                <div style="background:#f0f0f0;padding:20px;border-radius:8px;margin:20px 0;">
                    <p><b>Booking ID:</b> #<?php echo $booking_id; ?></p>
                    <p><b>Transaction:</b> <?php echo substr($transaction_uuid, 0, 18); ?>...</p>
                    <p><b>Amount:</b> Rs. <?php echo $total_amount; ?></p>
                </div>

                <a href="index.php" class="btn" style="background:darkcyan;color:#fff;padding:12px 30px;border-radius:25px;">
                    Home
                </a>
                <a href="booking.php" class="btn" style="background:#3498db;color:#fff;padding:12px 30px;border-radius:25px;">
                    Book Again
                </a>

            <?php else: ?>
                <div style="color:#e74c3c">
                    <i class="fa fa-times-circle" style="font-size:80px;"></i>
                </div>
                <h2 style="color:#e74c3c;">Payment Verification Failed</h2>
                <p>Your transaction could not be verified.</p>

                <a href="booking.php" class="btn" style="background:darkcyan;color:#fff;padding:12px 30px;border-radius:25px;">
                    Try Again
                </a>
            <?php endif; ?>

        </div>
    </div>
</section>

<?php include("footer.php"); ?>