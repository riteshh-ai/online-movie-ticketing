<?php
session_start();

$seat_no = "";
$cust_id = "";
$show_id = "";
if (isset($_POST["btn_update"])) {

    include("../conn.php");
    $seat_no = $_POST["seat_no_txt"];
    $cust_id = $_POST["customer_id_txt"];
    $show_id = $_POST["show_id_txt"];

    $id = $_GET["id"];
    $conn = new connec();
    $sql = "update seat_detail set seat_no='$seat_no', cust_id='$cust_id', show_id='$show_id' where id=$id";
    $conn->update($sql, "Seat Details Updated Successfully");
    header("Location: viewseat_details.php");
}

if (empty($_SESSION["admin_username"])) {
    header("Location:index.php");
} else {
    include("admin_header.php");

    if (isset($_GET["id"])) {
        $id = $_GET["id"];

        $conn = new connec();
        $tbl = "seat_detail";
        $result = $conn->select($tbl, $id);

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $seat_no = $row["seat_no"];
                $cust_id = $row["cust_id"];
                $show_id = $row["show_id"];
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
                    <h5 class="text-center mt-2" style="color:maroon;">Edit Seat Details</h5>

                    <div class="table-responsive mt-4">
                        <form method="post">
                            <div class="container" style="color: #343a40;">

                                <label for="text"><b>Seat No.</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Seat Number" name="seat_no_txt" id="email" value="<?php echo $seat_no; ?>">

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
                                </select><br>

                                <a href="viewseat_details.php" class="btn" style="background-color:darkcyan; color:white">Cancel</a>
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