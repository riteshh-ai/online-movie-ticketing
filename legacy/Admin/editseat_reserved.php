<?php
session_start();

$seat_number = "";
$cust_id = "";
$show_id = "";
$reserved = "";

if (isset($_POST["btn_update"])) {

    include("../conn.php");
    $seat_number = $_POST["seat_number_txt"];
    $cust_id = $_POST["customer_id_txt"];
    $show_id = $_POST["show_id_txt"];
    $reserved = $_POST["reserved_txt"];

    $id = $_GET["id"];
    $conn = new connec();
    $sql = "update seat_reserved set seat_number='$seat_number', cust_id='$cust_id', show_id='$show_id', reserved='$reserved' where id=$id";
    $conn->update($sql, "Seat Reserved Updated Successfully");
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
                    <h5 class="text-center mt-2" style="color:maroon;">Edit Seat Reserved</h5>

                    <div class="table-responsive mt-4">
                        <form method="post">
                            <div class="container" style="color: #343a40;">

                                <label for="text"><b>Seat Number</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Seat Number" name="seat_number_txt" id="email" value="<?php echo $seat_number; ?>">

                                <label for="text"><b>Customer</b></label>
                                <select style="border-radius: 30px;" name="customer_id_txt" id="email">
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
                                <select style="border-radius: 30px;" name="show_id_txt" id="email">
                                    <option value="">-- Select Show --</option>
                                    <?php
                                    $conn_select = new connec();
                                    $sql = "SELECT s.id, m.name FROM movie_ticket_booking.show s JOIN movie m ON s.movie_id = m.id";
                                    $result = $conn_select->select_by_query($sql);
                                    if($result->num_rows > 0) {
                                        while ($row = $result->fetch_assoc()) {
                                            $selected = ($row['id'] == $show_id) ? 'selected' : '';
                                            echo "<option value='" . $row['id'] . "' " . $selected . ">" . $row['name'] . "</option>";
                                        }
                                    }
                                    ?>
                                </select>

                                <label for="text"><b>Status</b></label>
                                <select style="border-radius: 30px;" name="reserved_txt" id="email">
                                    <option value="">-- Select Status --</option>
                                    <option value="1" <?php echo ($reserved == 1) ? 'selected' : ''; ?>>Available</option>
                                    <option value="0" <?php echo ($reserved == 0) ? 'selected' : ''; ?>>Already Booked</option>
                                </select><br>

                                <a href="viewseat_reserved.php" class="btn" style="background-color:darkcyan; color:white">Cancel</a>
                                <button type="submit" name="btn_update" class="btn" style="background-color:darkcyan; color:white">Update</button>
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
