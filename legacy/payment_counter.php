<?php
ob_start(); // Buffer output to allow header() calls
include("header.php");

// Get booking ID from session (set during booking confirmation)
$booking_id = isset($_SESSION['booking_id']) ? $_SESSION['booking_id'] : '';
$total_amount = isset($_SESSION['booking_total']) ? $_SESSION['booking_total'] : '';

// Redirect if no valid booking session
if (empty($booking_id)) {
    ob_end_clean(); // Clear buffer
    header('Location: booking.php');
    exit;
}

// Update booking with counter payment method
if ($booking_id) {
    $sql = "UPDATE booking SET payment_status = 'pending', payment_method = 'counter' WHERE id = $booking_id";
    $conn->update($sql, "Marked as counter payment");

    // Get booking details
    $booking_result = $conn->select_by_query("SELECT * FROM booking WHERE id = $booking_id");
    $booking = $booking_result ? $booking_result->fetch_assoc() : [];

    // Clear session variables
    unset($_SESSION['booking_id']);
    unset($_SESSION['booking_total']);
    unset($_SESSION['booking_seats']);
} else {
    $booking = [];
}
?>

<section class="mt-5">
    <div class="container d-flex justify-content-center align-items-center" style="min-height: 500px;">
        <div class="card shadow p-5" style="max-width: 600px; width: 100%; border-radius: 15px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <i class="fa fa-check-circle" style="font-size: 80px; color: #3498db;"></i>
            </div>

            <h2 style="color: darkcyan; text-align: center; margin-bottom: 25px;">Payment Method: Counter</h2>

            <div style="background-color: #e8f4f8; padding: 20px; border-radius: 8px; border-left: 4px solid #3498db; margin-bottom: 25px;">
                <p style="color: #2c3e50; margin: 0; font-size: 15px;">
                    <strong>Your booking is confirmed!</strong> Please complete your payment at the cinema counter.
                </p>
            </div>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                <h5 style="color: #2c3e50; margin-top: 0;">Booking Details:</h5>

                <?php if (!empty($booking) && is_array($booking)): ?>
                    <div style="display: flex; justify-content: space-between; margin: 10px 0; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
                        <span style="color: #666;">Booking ID:</span>
                        <strong style="color: #2c3e50;">#<?php echo htmlspecialchars($booking_id ?: ($booking['id'] ?? '')); ?></strong>
                    </div>

                    <div style="display: flex; justify-content: space-between; margin: 10px 0; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
                        <span style="color: #666;">Number of Tickets:</span>
                        <strong style="color: #2c3e50;"><?php echo htmlspecialchars($booking['no_ticket'] ?? ($booking['no_tikt'] ?? 'N/A')); ?></strong>
                    </div>

                    <div style="display: flex; justify-content: space-between; margin: 10px 0; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
                        <span style="color: #666;">Booking Date:</span>
                        <strong style="color: #2c3e50;"><?php echo htmlspecialchars($booking['booking_date'] ?? 'N/A'); ?></strong>
                    </div>

                    <div style="display: flex; justify-content: space-between; margin: 10px 0; padding-top: 10px; padding-bottom: 10px; background-color: #fff; border-radius: 5px; padding: 15px 10px; border: 2px solid #3498db;">
                        <span style="color: #2c3e50; font-size: 16px;"><strong>Total Amount to Pay:</strong></span>
                        <strong style="color: #3498db; font-size: 18px;">Rs. <?php echo htmlspecialchars($booking['total_amount'] ?? $booking['total_amnt'] ?? ($booking['total'] ?? 'N/A')); ?></strong>
                    </div>

                <?php else: ?>
                    <div style="padding:20px; background:#fff; border-radius:6px;">
                        <p style="color:#666; margin:0;">Booking information not available (session expired or invalid booking). Please return to the booking page.</p>
                    </div>
                <?php endif; ?>
            </div>

            <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #f39c12;">
                <h6 style="color: #856404; margin-top: 0;">⚠️ Important Instructions:</h6>
                <ul style="color: #856404; margin: 10px 0; padding-left: 20px;">
                    <li>Please arrive at the cinema 15 minutes before your show time</li>
                    <li>Pay the full amount at the counter with your booking ID</li>
                    <li>Keep your receipt for entry</li>
                    <li>Seats will be reserved for 15 minutes</li>
                </ul>
            </div>

            <div style="text-align: center; display: flex; gap: 10px; justify-content: center;">
                <a href="index.php" class="btn" style="background-color: darkcyan; color: white; padding: 12px 30px; border-radius: 25px; text-decoration: none; flex: 0 0 auto;">
                    <i class="fa fa-home"></i> Back to Home
                </a>
                <a href="booking.php" class="btn" style="background-color: #3498db; color: white; padding: 12px 30px; border-radius: 25px; text-decoration: none; flex: 0 0 auto;">
                    <i class="fa fa-plus"></i> Book More
                </a>
            </div>
        </div>
    </div>
</section>

<?php
include("footer.php");
ob_end_flush(); // Send buffered output
?>