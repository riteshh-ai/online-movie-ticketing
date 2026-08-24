<?php
session_start();

$seat_number = "";
$cust_id = "";
$show_id = "";
$reserved = "";
$customer_name = "";
$movie_name = "";

if (isset($_POST["btn_delete"])) {

    include("../conn.php");

    $id = $_GET["id"];
    $conn = new connec();
    $table = "seat_reserved";

    $conn->delete($table, $id);
    header("Location: viewseat_reserved.php");
}

if (empty($_SESSION["admin_username"])) {
    header("Location:index.php");
} else {
    include("admin_header.php");

    if (isset($_GET["id"])) {
        $id = $_GET["id"];

        $conn = new connec();
        $tbl = "seat_reserved";
        $result = $conn->select($tbl, $id);

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $seat_number = $row["seat_number"];
                $cust_id = $row["cust_id"];
                $show_id = $row["show_id"];
                $reserved = $row["reserved"];
            }
        }

        // Get customer name
        $result_cust = $conn->select('customer', $cust_id);
        if ($result_cust->num_rows > 0) {
            $row_cust = $result_cust->fetch_assoc();
            $customer_name = $row_cust["fullname"];
        }

        // Get movie name from show
        $sql = "SELECT m.name FROM movie_ticket_booking.show s JOIN movie m ON s.movie_id = m.id WHERE s.id = $show_id";
        $result_movie = $conn->select_by_query($sql);
        if ($result_movie->num_rows > 0) {
            $row_movie = $result_movie->fetch_assoc();
            $movie_name = $row_movie["name"];
        }
    }

?>

    <style>
        /* Make table scrollable horizontally */
        .table-responsive {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
        }

        /* Reduce font size */
        table.table th,
        table.table td {
            font-size: 14px;
            /* Adjust font size */
            white-space: nowrap;
            /* Prevent text from breaking */
        }

        /* Reduce row height & spacing */
        table.table tr {
            height: 10px !important;
        }

        /* Make header bold & small */
        table.table th {
            font-weight: 600;
            font-size: 15px;
        }

        /* Make action buttons smaller */
        .btn {
            padding: 3px 8px;
            font-size: 12px;
        }
    </style>

    <section>
        <div class="container-fluid" style="overflow: hidden;"> <!-- Prevent scrolling -->
            <div class="row">
                <div class="col-md-2" style="background-color:black;">
                    <?php include('admin_sidenavbar.php'); ?>
                </div>
                <div class="col-md-10">
                    <h5 class="text-center mt-2" style="color:maroon;">Delete Seat Reserved</h5>

                    <div class="table-responsive mt-4">
                        <form method="post">
                            <div class="container" style="color: #343a40;">

                                <label for="text"><b>Seat Number</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Seat Number" name="seat_number_txt" id="email" value="<?php echo $seat_number; ?>" disabled>

                                <label for="text"><b>Customer Name</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Customer Name" name="customer_name_txt" id="email" value="<?php echo $customer_name; ?>" disabled>

                                <label for="text"><b>Movie Name</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Movie Name" name="movie_name_txt" id="email" value="<?php echo $movie_name; ?>" disabled>

                                <label for="text"><b>Status</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Status" name="reserved_txt" id="email" value="<?php echo ($reserved == 1) ? 'Available' : 'Already Booked'; ?>" disabled>

                                <a href="viewseat_reserved.php" class="btn" style="background-color:darkcyan; color:white">Cancel</a>
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
