<?php
include("header.php");

$conn = new connec();
$result = $conn->select_show_dt();

// Store all results in an array for reuse
$shows_array = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $shows_array[] = $row;
    }
}

if (isset($_POST["btn_booking"])) {
    $cust_id = (int)$_POST["cust_id"];
    $show_id = (int)$_POST["show_id"];
    $no_tikt = (int)$_POST["no_ticket"];
    $bkng_date = $_POST["booking_date"];
    $total_amnt = 250 * $no_tikt;
    $seat_number = $_POST["seat_dt"];
    $seat_arr = array_filter(array_map('trim', explode(",", $seat_number)));

    // Insert reserved seats (use explicit columns and escape seat values)
    foreach ($seat_arr as $item_raw) {
        $item = $conn->conn->real_escape_string($item_raw);
        $sql = "INSERT INTO `seat_reserved` (`show_id`,`cust_id`,`seat_number`,`reserved`) VALUES ($show_id, $cust_id, '$item', 0)";
        $abc = $conn->insert_lastid($sql);
    }

    // Insert seat detail and booking using explicit column lists (avoid schema mismatch)
    // seat_detail table stores seat_no (comma-separated seats) rather than no_ticket
    $seat_no_escaped = $conn->conn->real_escape_string($seat_number);
    $sql = "INSERT INTO `seat_detail` (`cust_id`,`show_id`,`seat_no`) VALUES ($cust_id, $show_id, '$seat_no_escaped')";
    $seat_dt_id = $conn->insert_lastid($sql);

    $sql = "INSERT INTO `booking` (`cust_id`,`show_id`,`no_ticket`,`seat_dt_id`,`booking_date`,`total_amount`) VALUES ($cust_id, $show_id, $no_tikt, $seat_dt_id, '$bkng_date', $total_amnt)";
    $booking_id = $conn->insert_lastid($sql);

    // Store booking info in session for payment processing
    $_SESSION["booking_id"] = $booking_id;
    $_SESSION["booking_total"] = $total_amnt;
    $_SESSION["booking_seats"] = $seat_number;

    // Show payment options modal
    $_SESSION["show_payment_modal"] = true;
}
?>

<script>
    // Store show info for dynamic display
    var showInfo = {};
    <?php
    foreach ($shows_array as $row) {
        echo "showInfo['{$row['id']}'] = {
            cinema: '" . addslashes($row['name']) . "',
            movie: '" . addslashes($row['movie_name']) . "',
            date: '" . addslashes($row['show_date']) . "',
            time: '" . addslashes($row['time']) . "',
            price: '{$row['ticket_price']}'
        };\n";
    }
    ?>

    $(document).ready(function() {
        // Generate seat chart
        for (i = 1; i <= 4; i++) {
            for (j = 1; j <= 10; j++) {
                $('#seat_chart').append('<div class="col-md-2 mt-2 mb-2 ml-2 mr-2 text-center" style="background-color:grey;color:white"><input type="checkbox" value="R' + (i + 'S' + j) + '" name="seat_chart[]" class="mr-2 col-md-2 mb-2" onclick="checkboxtotal();" >R' + (i + 'S' + j) + '</div>');
            }
        }

        // Show info when show is selected
        $('#show_id').on('change', function() {
            var showId = $(this).val();
            if (showInfo[showId]) {
                $('#cinema_name').text(showInfo[showId].cinema);
                $('#show_date_time').text(showInfo[showId].movie + " | " + showInfo[showId].date + " | " + showInfo[showId].time);
                $('#price').text("Rs. " + showInfo[showId].price);
            } else {
                $('#cinema_name').text('');
                $('#show_date_time').text('');
                $('#price').text('');
            }
            checkboxtotal();
        });
    });

    function checkboxtotal() {
        var seat = [];
        $('input[name="seat_chart[]"]:checked').each(function() {
            seat.push($(this).val());
        });
        var st = seat.length;
        $('#no_ticket').val(st);

        // Get price per ticket from selected show
        var showId = $('#show_id').val();
        var price = showInfo[showId] ? parseInt(showInfo[showId].price) : 250;
        var total = "Rs. " + (st * price);

        $('#price_details').text(total);
        $('#seat_details').text(seat.join(", "));
        $('#seat_dt').val(seat.join(", "));
    }
</script>

<section class="mt-5 ">
    <?php if (empty($_SESSION["username"])): ?>
        <div class="container d-flex justify-content-center align-items-center" style="min-height: 400px;">
            <div class="card shadow p-4" style="max-width: 400px; width: 100%; border-radius: 20px;">
                <div class="text-center mb-3">
                    <i class="fa fa-lock fa-3x" style="color: darkcyan;"></i>
                </div>
                <h4 class="text-center mb-3" style="color:darkcyan;">Please log in to book your ticket</h4>
                <div class="text-center">
                    <button class="btn btn-info" data-toggle="modal" data-target="#modelId1">
                        <i class="fa fa-sign-in"></i> Login
                    </button>
                </div>
            </div>
        </div>
    <?php else: ?>
        <h3 class="text-center" style="color:darkcyan;">Book Your Ticket Now</h3>
        <div class="container">
            <div class="row">
                <div class="col-md-7" style="color:azure;">
                    <div id="seat-map" id="seatCharts">
                        <h3 class="text-center mt-5" style="color: darkcyan">Select Seats</h3>
                        <hr>
                        <label class="text-center" style="width:100%; background-color:darkcyan; color:white; padding:2%">
                            SCREEN
                        </label>
                        <div class="row" id="seat_chart"></div>
                        <div class="mt-3" style="color:darkcyan;">
                            <b>Selected Seats:</b> <span id="seat_details"></span>
                        </div>
                    </div>

                    <h6 class="mt-5" style="color: darkcyan">Cinema Name</h6>
                    <p class="mt-1" id="cinema_name"></p>

                    <h6 class="mt-3" style="color: darkcyan">Movie Show (Date and Timing)</h6>
                    <p class="mt-1" id="show_date_time"></p>

                    <h6 class="mt-3" style="color: darkcyan">Ticket Price</h6>
                    <p class="mt-1" id="price"></p>

                    <h6 class="mt-3" style="color: darkcyan">Total Ticket Price</h6>
                    <p class="mt-1" id="price_details"></p>

                </div>
                <div class="col-md-5">
                    <form action="" method="post" class="mt-5">
                        <div class="container" style="color:darkcyan;">
                            <center>
                                <p style="color: black;">Please fill this form to book your ticket</p>
                            </center>
                            <hr>
                            <label for="cust_id"><b>Customer ID</b></label>
                            <input type="number" style="border-radius: 30px;" name="cust_id" required value="<?php echo isset($_SESSION["cust_id"]) ? $_SESSION["cust_id"] : ''; ?>"><br>

                            <label for="show_id"><b>Show</b></label>
                            <div class="form-group">
                                <select class="form-control" name="show_id" id="show_id" style="border-radius: 30px;">
                                    <option value="">Select Show</option>
                                    <?php
                                    foreach ($shows_array as $row) {
                                        echo '<option value="' . $row["id"] . '">' . $row["movie_name"] . ' | ' . $row["show_date"] . ' | ' . $row["time"] . ' | ' . $row["name"] . '</option>';
                                    }
                                    ?>
                                </select>
                            </div>

                            <label for="no_ticket"><b>Number of Tickets</b></label>
                            <input type="number" style="border-radius: 30px;" id="no_ticket" name="no_ticket" required readonly><br>

                            <label for="seat_dt"><b>Seat Details</b></label>
                            <input type="text" style="border-radius: 30px;" name="seat_dt" id="seat_dt" readonly required><br>

                            <label for="booking_date"><b>Booking Date</b></label>
                            <input type="date" style="border-radius: 30px;" name="booking_date" required>

                            <button type="submit" name="btn_booking" class="btn" style="background-color:darkcyan; color: white;">Confirm Booking</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    <?php endif; ?>
</section>

<!-- Payment Options Modal -->
<div class="modal fade" id="paymentModal" tabindex="-1" role="dialog" aria-labelledby="paymentModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header" style="background-color: darkcyan; color: white;">
                <h5 class="modal-title" id="paymentModalLabel">Select Payment Method</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="color: white;">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" style="text-align: center; padding: 30px;">
                <p style="margin-bottom: 30px; color: #333;">Choose how you want to pay for your booking:</p>

                <div style="display: flex; gap: 20px; justify-content: center;">
                    <!-- eSewa Payment Option -->
                    <form method="POST" action="esewa_payment.php" style="flex: 1;">
                        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 15px; background-color: #2ecc71; border: none; border-radius: 8px; color: white; font-weight: bold; font-size: 16px;">
                            <i class="fa fa-mobile"></i> Pay with eSewa
                        </button>
                    </form>

                    <!-- Pay at Counter Option -->
                    <form method="POST" action="payment_counter.php" style="flex: 1;">
                        <button type="submit" class="btn btn-secondary" style="width: 100%; padding: 15px; background-color: #3498db; border: none; border-radius: 8px; color: white; font-weight: bold; font-size: 16px;">
                            <i class="fa fa-money"></i> Pay at Counter
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    $(document).ready(function() {
        <?php if (!empty($_SESSION["show_payment_modal"])): ?>
            $("#paymentModal").modal('show');
            <?php unset($_SESSION["show_payment_modal"]); ?>
        <?php endif; ?>
    });
</script>

<?php
include("footer.php");
?>