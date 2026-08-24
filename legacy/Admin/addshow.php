<?php
session_start();
if (isset($_POST["btn_insert"])) {

    require_once("../conn.php");
    $movie_id = $_POST["movie_id_txt"];
    $show_date = $_POST["show_date_txt"];
    $show_time_id = $_POST["show_time_id_txt"];
    $no_seat = $_POST["no_seat_txt"];
    $cinema_id = $_POST["cinema_id_txt"];
    $ticket_price = $_POST["ticket_price_txt"];

    $conn = new connec();
    $sql = "INSERT INTO `show` VALUES(0,'$movie_id','$show_date','$show_time_id','$no_seat','$cinema_id','$ticket_price')";
    $conn->insert($sql, "Show Inserted Successfully");
    header("Location: viewshow.php");
}

if (empty($_SESSION["admin_username"])) {
    header("Location:index.php");
} else {

    include("admin_header.php");

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
                    <h5 class="text-center mt-2" style="color:maroon;">Add Show</h5>

                    <div class="table-responsive mt-4">
                        <form method="post">
                            <div class="container" style="color: #343a40;">

                                <label for="text"><b>Movie</b></label>
                                <select style="border-radius: 30px;" name="movie_id_txt" id="email" required>
                                    <option value="">-- Select Movie --</option>
                                    <?php
                                    $conn_select = new connec();
                                    $result = $conn_select->select_all('movie');
                                    while ($row = $result->fetch_assoc()) {
                                        echo "<option value='" . $row['id'] . "'>" . $row['name'] . "</option>";
                                    }
                                    ?>
                                </select><br>

                                <label for="text"><b>Show Date</b></label>
                                <input type="date" style="border-radius: 30px;" name="show_date_txt" id="email" required><br>

                                <label for="text"><b>Show Time</b></label>
                                <select style="border-radius: 30px;" name="show_time_id_txt" id="email" required>
                                    <option value="">-- Select Show Time --</option>
                                    <?php
                                    $conn_select = new connec();
                                    $result = $conn_select->select_all('show_time');
                                    while ($row = $result->fetch_assoc()) {
                                        echo "<option value='" . $row['id'] . "'>" . $row['time'] . "</option>";
                                    }
                                    ?>
                                </select><br>

                                <label for="text"><b>No. of Seats</b></label>
                                <input type="number" min="0" style="border-radius: 30px;" placeholder="Enter Number of Seats" name="no_seat_txt" id="email" required>

                                <label for="text"><b>Cinema</b></label>
                                <select style="border-radius: 30px;" name="cinema_id_txt" id="email" required>
                                    <option value="">-- Select Cinema --</option>
                                    <?php
                                    $conn_select = new connec();
                                    $result = $conn_select->select_all('cinema');
                                    while ($row = $result->fetch_assoc()) {
                                        // some installations use 'name' column for cinema as seen earlier
                                        $cinema_display = isset($row['cinema_name']) ? $row['cinema_name'] : (isset($row['name']) ? $row['name'] : '');
                                        echo "<option value='" . $row['id'] . "'>" . $cinema_display . "</option>";
                                    }
                                    ?>
                                </select><br>

                                <label for="text"><b>Ticket Price</b></label>
                                <input type="number" min="0" style="border-radius: 30px;" placeholder="Enter Ticket Price" name="ticket_price_txt" id="email" required>

                                <br><br>
                                <a href="viewshow.php" class="btn" style="background-color:darkcyan; color:white">Cancel</a>
                                <button type="submit" name="btn_insert" class="btn" style="background-color:darkcyan; color:white">Insert</button>
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
