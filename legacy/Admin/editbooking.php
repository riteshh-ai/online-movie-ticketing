<?php
session_start();

$cust_id = "";
$show_id = "";
$no_ticket = "";
$booking_date = "";
$total_amount = "";

if (isset($_POST["btn_update"])) {
    include("../conn.php");

    $cust_id = $_POST["cust_id_txt"];
    $show_id = $_POST["show_id_txt"];
    $no_ticket = $_POST["no_ticket_txt"];
    $booking_date = $_POST["booking_date_txt"];
    $total_amount = $_POST["total_amount_txt"];

    $id = $_GET["id"];
    $conn = new connec();
    
    // Get seat_detail_id first
    $result = $conn->select('booking', $id);
    $seat_dt_id = "";
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $seat_dt_id = $row['seat_dt_id'];
    }

    // Update seat_detail
    if ($seat_dt_id) {
        $sql = "UPDATE `seat_detail` SET cust_id='$cust_id', show_id='$show_id' WHERE id=$seat_dt_id";
        $conn->update($sql, "");
    }

    // Update booking
    $sql = "UPDATE `booking` SET cust_id='$cust_id', show_id='$show_id', no_ticket='$no_ticket', booking_date='$booking_date', total_amount='$total_amount' WHERE id=$id";
    $conn->update($sql, "Booking Updated Successfully");
    header("Location: viewbooking.php");
}

if (empty($_SESSION["admin_username"])) {
    header("Location:index.php");
} else {
    include("admin_header.php");

    if (isset($_GET["id"])) {
        $id = $_GET["id"];

        $conn = new connec();
        $tbl = "booking";
        $result = $conn->select($tbl, $id);

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                // if this admin is tied to a cinema, make sure the booking belongs to it
                if (!empty($_SESSION['admin_cinema_id']) && $_SESSION['admin_cinema_id'] > 0) {
                    $check = $conn->select_by_query("SELECT cinema_id FROM `show` WHERE id=" . intval($row['show_id']));
                    if ($check && $check->num_rows > 0) {
                        $c = $check->fetch_assoc();
                        if ($c['cinema_id'] != $_SESSION['admin_cinema_id']) {
                            header("Location:viewbooking.php");
                            exit();
                        }
                    }
                }

                $cust_id = $row["cust_id"];
                $show_id = $row["show_id"];
                $no_ticket = $row["no_ticket"];
                $booking_date = $row["booking_date"];
                $total_amount = $row["total_amount"];
            }
        }
    }

?>

    <style>
        .table-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        table.table th, table.table td { font-size: 14px; white-space: nowrap; }
        table.table tr { height: 10px !important; }
        table.table th { font-weight: 600; font-size: 15px; }
        .btn { padding: 3px 8px; font-size: 12px; }
    </style>

    <section>
        <div class="container-fluid" style="overflow: hidden;"> <!-- Prevent scrolling -->
            <div class="row">
                <div class="col-md-2" style="background-color:black;">
                    <?php include('admin_sidenavbar.php'); ?>
                </div>
                <div class="col-md-10">
                    <h5 class="text-center mt-2" style="color:maroon;">Edit Booking</h5>

                    <div class="table-responsive mt-4">
                        <form method="post">
                            <div class="container" style="color: #343a40;">

                                <label for="text"><b>Customer</b></label>
                                <select style="border-radius: 30px;" name="cust_id_txt" id="email" required>
                                    <option value="">-- Select Customer --</option>
                                    <?php
                                    $conn_select = new connec();
                                    $result = $conn_select->select_all('customer');
                                    while ($row = $result->fetch_assoc()) {
                                        $selected = ($row['id'] == $cust_id) ? 'selected' : '';
                                        echo "<option value='" . $row['id'] . "' " . $selected . ">" . $row['fullname'] . "</option>";
                                    }
                                    ?>
                                </select>

                                <label for="text"><b>Show</b></label>
                                <select style="border-radius: 30px;" name="show_id_txt" id="show_id" required>
                                    <option value="">-- Select Show --</option>
                                    <?php
                                    $conn_select = new connec();
                                    $filter = '';
                                    if (!empty($_SESSION['admin_cinema_id']) && $_SESSION['admin_cinema_id'] > 0) {
                                        $id = intval($_SESSION['admin_cinema_id']);
                                        $filter = "WHERE s.cinema_id = $id";
                                    }
                                    $sql = "SELECT s.id, m.name, s.show_date, st.time, s.ticket_price FROM `show` s LEFT JOIN movie m ON s.movie_id = m.id LEFT JOIN show_time st ON s.show_time_id = st.id $filter";
                                    $result = $conn_select->select_by_query($sql);
                                    if($result && $result->num_rows > 0) {
                                        while ($row = $result->fetch_assoc()) {
                                            $selected = ($row['id'] == $show_id) ? 'selected' : '';
                                            echo "<option value='" . $row['id'] . "' " . $selected . " data-price='" . $row['ticket_price'] . "'>" . $row['name'] . " - " . $row['show_date'] . " " . $row['time'] . "</option>";
                                        }
                                    }
                                    ?>
                                </select><br>

                                <label for="text"><b>Number of Tickets</b></label>
                                <input type="number" min="1" style="border-radius: 30px;" placeholder="Enter Number of Tickets" name="no_ticket_txt" id="no_ticket" value="<?php echo $no_ticket; ?>" required onchange="calculateTotal()">

                                <label for="text"><b>Total Amount</b></label>
                                <input type="number" min="0" style="border-radius: 30px;" placeholder="Total Amount" name="total_amount_txt" id="total_amount" value="<?php echo $total_amount; ?>" readonly>

                                <label for="text"><b>Booking Date</b></label>
                                <input type="date" style="border-radius: 30px;" name="booking_date_txt" id="email" value="<?php echo $booking_date; ?>" required>

                                <br><br>
                                <a href="viewbooking.php" class="btn" style="background-color:darkcyan; color:white">Cancel</a>
                                <button type="submit" name="btn_update" class="btn" style="background-color:darkcyan; color:white">Update</button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
    </section>

    <script>
        function calculateTotal() {
            var showSelect = document.getElementById('show_id');
            var ticketsInput = document.getElementById('no_ticket');
            var totalInput = document.getElementById('total_amount');
            
            var selectedOption = showSelect.options[showSelect.selectedIndex];
            var price = selectedOption.getAttribute('data-price') || 0;
            var tickets = ticketsInput.value || 0;
            
            totalInput.value = parseInt(price) * parseInt(tickets);
        }

        // Calculate on page load
        window.addEventListener('load', calculateTotal);
        // Calculate on show selection change
        document.getElementById('show_id').addEventListener('change', calculateTotal);
    </script>

<?php
    include("admin_footer.php");
}
?>
