<?php

include("header.php");
require_once("conn.php");

$conn = new connec();

$status     = $_GET['status'] ?? 'FAILED';
$booking_id = $_SESSION['booking_id'] ?? null;

/* update only if booking exists */
if ($booking_id) {
    $sql = "
        UPDATE booking 
        SET payment_status='failed', payment_method='esewa' 
        WHERE id=$booking_id
    ";
    $conn->update($sql, "Payment failed");
}
?>

<section class="mt-5">
    <div class="container d-flex justify-content-center align-items-center" style="min-height:500px;">
        <div class="card shadow p-5" style="max-width:500px;width:100%;border-radius:15px;text-align:center;">

            <div style="color:#e74c3c">
                <i class="fa fa-times-circle" style="font-size:80px;"></i>
            </div>

            <h2 style="color:#e74c3c;">Payment Failed</h2>

            <div style="background:#fff3cd;padding:15px;border-radius:8px;margin:20px 0;">
                <b>Status:</b> <?php echo htmlspecialchars($status); ?>
            </div>

            <a href="booking.php" class="btn" style="background:darkcyan;color:#fff;padding:12px 25px;border-radius:25px;">
                Try Again
            </a>
            <a href="index.php" class="btn" style="background:#95a5a6;color:#fff;padding:12px 25px;border-radius:25px;">
                Home
            </a>

        </div>
    </div>
</section>

<?php include("footer.php"); ?>