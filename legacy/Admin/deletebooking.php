<?php
session_start();

$customer_name = "";
$movie_name = "";
$cinema_name = "";
$show_date = "";
$show_time = "";
$no_ticket = "";
$total_amount = "";
$booking_date = "";
$seat_dt_id = "";

if (isset($_POST["btn_delete"])) {
    require_once("../conn.php");

    $id = intval($_GET["id"]);
    $conn = new connec();

    // Get seat_detail_id and show_id to validate
    $result = $conn->select('booking', $id);
    $seat_dt_id = "";
    $show_id = "";
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $seat_dt_id = $row['seat_dt_id'];
        $show_id = $row['show_id'];
        // enforce cinema restriction
        if (!empty($_SESSION['admin_cinema_id']) && $_SESSION['admin_cinema_id'] > 0) {
            $chk = $conn->select('show', $show_id);
            if ($chk && $chk->num_rows > 0) {
                $r2 = $chk->fetch_assoc();
                if ($r2['cinema_id'] != $_SESSION['admin_cinema_id']) {
                    header("Location:viewbooking.php");
                    exit();
                }
            }
        }
    }

    // Delete booking first (it has FK to seat_detail)
    $conn->delete('booking', $id);

    // Then delete seat_reserved records related to this show
    if ($show_id) {
        $sql = "DELETE FROM `seat_reserved` WHERE show_id = $show_id";
        $conn->select_by_query($sql);
    }

    // Finally delete seat_detail
    if ($seat_dt_id) {
        $sql = "DELETE FROM `seat_detail` WHERE id = $seat_dt_id";
        $conn->select_by_query($sql);
    }
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
            $row = $result->fetch_assoc();
            // verify cinema restriction
            if (!empty($_SESSION['admin_cinema_id']) && $_SESSION['admin_cinema_id'] > 0) {
                $chk = $conn->select('show', $row['show_id']);
                if ($chk && $chk->num_rows > 0) {
                    $r2 = $chk->fetch_assoc();
                    if ($r2['cinema_id'] != $_SESSION['admin_cinema_id']) {
                        header("Location:viewbooking.php");
                        exit();
                    }
                }
            }

            $no_ticket = $row["no_ticket"];
            $total_amount = $row["total_amount"];
            $booking_date = $row["booking_date"];
            $seat_dt_id = $row["seat_dt_id"];

            // Get customer name
            $result_cust = $conn->select('customer', $row['cust_id']);
            if ($result_cust->num_rows > 0) {
                $row_cust = $result_cust->fetch_assoc();
                $customer_name = $row_cust["fullname"];
            }

            // Get show details
            $result_show = $conn->select('show', $row['show_id']);
            if ($result_show->num_rows > 0) {
                $row_show = $result_show->fetch_assoc();
                $show_date = $row_show["show_date"];

                // Get movie name
                $result_movie = $conn->select('movie', $row_show['movie_id']);
                if ($result_movie->num_rows > 0) {
                    $row_movie = $result_movie->fetch_assoc();
                    $movie_name = $row_movie["name"];
                }

                // Get show time
                $result_time = $conn->select('show_time', $row_show['show_time_id']);
                if ($result_time->num_rows > 0) {
                    $row_time = $result_time->fetch_assoc();
                    $show_time = isset($row_time['time']) ? $row_time['time'] : '';
                }

                // Get cinema name
                $result_cinema = $conn->select('cinema', $row_show['cinema_id']);
                if ($result_cinema->num_rows > 0) {
                    $row_cinema = $result_cinema->fetch_assoc();
                    $cinema_name = isset($row_cinema['name']) ? $row_cinema['name'] : (isset($row_cinema['cinema_name']) ? $row_cinema['cinema_name'] : '');
                }
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
                    <h5 class="text-center mt-2" style="color:maroon;">Delete Booking</h5>

                    <div class="table-responsive mt-4">
                        <form method="post">
                            <div class="container" style="color: #343a40;">

                                <label for="text"><b>Customer Name</b></label>
                                <input type="text" style="border-radius: 30px;" name="customer_txt" value="<?php echo htmlspecialchars($customer_name); ?>" disabled>

                                <label for="text"><b>Movie</b></label>
                                <input type="text" style="border-radius: 30px;" name="movie_txt" value="<?php echo htmlspecialchars($movie_name); ?>" disabled>

                                <label for="text"><b>Cinema</b></label>
                                <input type="text" style="border-radius: 30px;" name="cinema_txt" value="<?php echo htmlspecialchars($cinema_name); ?>" disabled>

                                <label for="text"><b>Show Date</b></label>
                                <input type="text" style="border-radius: 30px;" name="show_date_txt" value="<?php echo $show_date; ?>" disabled>

                                <label for="text"><b>Show Time</b></label>
                                <input type="text" style="border-radius: 30px;" name="show_time_txt" value="<?php echo htmlspecialchars($show_time); ?>" disabled>

                                <label for="text"><b>No. of Tickets</b></label>
                                <input type="text" style="border-radius: 30px;" name="no_ticket_txt" value="<?php echo $no_ticket; ?>" disabled>

                                <label for="text"><b>Total Amount</b></label>
                                <input type="text" style="border-radius: 30px;" name="total_amount_txt" value="<?php echo $total_amount; ?>" disabled>

                                <label for="text"><b>Booking Date</b></label>
                                <input type="text" style="border-radius: 30px;" name="booking_date_txt" value="<?php echo $booking_date; ?>" disabled>

                                <a href="viewbooking.php" class="btn" style="background-color:darkcyan; color:white">Cancel</a>
                                <button type="submit" name="btn_delete" class="btn" style="background-color:darkcyan; color:white">Delete</button>

                            </div>
                        </form>

                    </div>
                </div>
            </div>
    </section>

<?php
    include("admin_footer.php");
}
?>
