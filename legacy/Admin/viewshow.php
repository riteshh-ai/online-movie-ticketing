<?php
session_start();

if (empty($_SESSION["admin_username"])) {
    header("Location:index.php");
} else {
    include("admin_header.php");

    $conn = new connec();
    // Adjust the table and column names to match your DB. The attachment screenshot shows columns: id, movie_id, show_date, show_time_id, no_seat, cinema_id, ticket_price
    // We'll join with `movie`, `show_time` (if exists), and `cinema` to get readable names.
        $sql = "SELECT s.id,
                   m.name AS movie_name,
                   s.show_date,
                   st.time AS show_time,
                   s.no_seat,
                   c.name AS cinema_name,
                   s.ticket_price
            FROM `movie_ticket_booking`.`show` s
            LEFT JOIN movie m ON s.movie_id = m.id
            LEFT JOIN show_time st ON s.show_time_id = st.id
            LEFT JOIN cinema c ON s.cinema_id = c.id";

    $result = $conn->select_by_query($sql);
?>

    <style>
        .table-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        table.table th, table.table td { font-size: 14px; white-space: nowrap; }
        table.table tr { height: 10px !important; }
        table.table th { font-weight: 600; font-size: 15px; }
        .btn { padding: 3px 8px; font-size: 12px; }
    </style>

    <section>
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-2" style="background-color:black;">
                    <?php include('admin_sidenavbar.php'); ?>
                </div>
                <div class="col-md-10">
                    <h5 class="text-center mt-2" style="color:maroon;">Shows</h5>
                      <a href="addshow.php" style="color:brown;">Add Show</a>

                    <div class="table-responsive mt-4">
                        <table class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Movie Name</th>
                                    <th>Show Date</th>
                                    <th>Show Time</th>
                                    <th>No. of Seats</th>
                                    <th>Cinema Name</th>
                                    <th>Ticket Price</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                if ($result && $result->num_rows > 0) {
                                    while ($row = $result->fetch_assoc()) {
                                ?>
                                        <tr>
                                            <td><?php echo $row['id']; ?></td>
                                            <td><?php echo htmlspecialchars($row['movie_name']); ?></td>
                                            <td><?php echo $row['show_date']; ?></td>
                                            <td><?php echo htmlspecialchars($row['show_time']); ?></td>
                                            <td><?php echo $row['no_seat']; ?></td>
                                            <td><?php echo htmlspecialchars($row['cinema_name']); ?></td>
                                            <td><?php echo $row['ticket_price']; ?></td>
                                            <td>
                                                <a href="editshow.php?id=<?php echo $row['id']; ?>" class="btn btn-primary">Edit</a>
                                                <a href="deleteshow.php?id=<?php echo $row['id']; ?>" class="btn btn-danger">Delete</a>
                                            </td>
                                        </tr>
                                <?php
                                    }
                                } else {
                                    echo '<tr><td colspan="8">No shows found.</td></tr>';
                                }
                                ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </section>

<?php
    include("admin_footer.php");
}
?>
