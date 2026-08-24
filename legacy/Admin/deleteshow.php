<?php
session_start();

$movie_name = "";
$show_date = "";
$show_time = "";
$no_seat = "";
$cinema_name = "";
$ticket_price = "";

if (isset($_POST["btn_delete"])) {
    include("../conn.php");
    $id = $_GET["id"];
    $conn = new connec();

    // delete dependent records first to avoid FK constraint errors
    $sql = "DELETE FROM `booking` WHERE show_id = $id";
    $conn->select_by_query($sql);

    $sql = "DELETE FROM `seat_detail` WHERE show_id = $id";
    $conn->select_by_query($sql);

    $sql = "DELETE FROM `seat_reserved` WHERE show_id = $id";
    $conn->select_by_query($sql);

    // finally delete the show record
    $conn->delete('show', $id);
    header("Location: viewshow.php");
}

if (empty($_SESSION["admin_username"])) {
    header("Location:index.php");
} else {
    include("admin_header.php");

    if (isset($_GET["id"])) {
        $id = $_GET["id"];
        $conn = new connec();
        $tbl = "show";
        $result = $conn->select($tbl, $id);

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $show_date = $row["show_date"];
            $no_seat = $row["no_seat"];
            $ticket_price = $row["ticket_price"];
            // fetch movie name
            $m = $conn->select('movie', $row['movie_id']);
            if ($m && $m->num_rows > 0) {
                $mr = $m->fetch_assoc();
                $movie_name = $mr['name'];
            }
            // fetch show time
            $st = $conn->select('show_time', $row['show_time_id']);
            if ($st && $st->num_rows > 0) {
                $str = $st->fetch_assoc();
                $show_time = isset($str['time']) ? $str['time'] : $row['show_time_id'];
            }
            // fetch cinema name
            $c = $conn->select('cinema', $row['cinema_id']);
            if ($c && $c->num_rows > 0) {
                $cr = $c->fetch_assoc();
                $cinema_name = isset($cr['name']) ? $cr['name'] : (isset($cr['cinema_name']) ? $cr['cinema_name'] : '');
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
                    <h5 class="text-center mt-2" style="color:maroon;">Delete Show</h5>

                    <div class="table-responsive mt-4">
                        <form method="post">
                            <div class="container" style="color: #343a40;">

                                <label for="text"><b>Movie</b></label>
                                <input type="text" style="border-radius: 30px;" name="movie_txt" value="<?php echo htmlspecialchars($movie_name); ?>" disabled>

                                <label for="text"><b>Show Date</b></label>
                                <input type="text" style="border-radius: 30px;" name="show_date_txt" value="<?php echo $show_date; ?>" disabled>

                                <label for="text"><b>Show Time</b></label>
                                <input type="text" style="border-radius: 30px;" name="show_time_txt" value="<?php echo htmlspecialchars($show_time); ?>" disabled>

                                <label for="text"><b>No. of Seats</b></label>
                                <input type="text" style="border-radius: 30px;" name="no_seat_txt" value="<?php echo $no_seat; ?>" disabled>

                                <label for="text"><b>Cinema</b></label>
                                <input type="text" style="border-radius: 30px;" name="cinema_txt" value="<?php echo htmlspecialchars($cinema_name); ?>" disabled>

                                <label for="text"><b>Ticket Price</b></label>
                                <input type="text" style="border-radius: 30px;" name="ticket_price_txt" value="<?php echo $ticket_price; ?>" disabled>

                                <a href="viewshow.php" class="btn" style="background-color:darkcyan; color:white">Cancel</a>
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
