<?php
session_start();

if (empty($_SESSION["admin_username"])) {
    header("Location:index.php");
} else {
    include("admin_header.php");

    $conn = new connec();

    // determine filter for cinema-specific admins
    $cinemaFilter = '';
    if (!empty($_SESSION['admin_cinema_id']) && $_SESSION['admin_cinema_id'] > 0) {
        $id = intval($_SESSION['admin_cinema_id']);
        $cinemaFilter = "WHERE s.cinema_id = $id";
    }

    $sql = "SELECT 
    b.id,
    cu.fullname AS customer_name,
    m.name AS movie_name,
    ci.name AS cinema_name,
    s.show_date,
    st.time AS show_time,
    b.no_ticket,
    b.total_amount,
    b.payment_status,
    b.payment_method,
    b.booking_date
    FROM `booking` b
    JOIN customer cu ON b.cust_id = cu.id
    JOIN `show` s ON b.show_id = s.id
    LEFT JOIN movie m ON s.movie_id = m.id
    LEFT JOIN show_time st ON s.show_time_id = st.id
    LEFT JOIN cinema ci ON s.cinema_id = ci.id
    $cinemaFilter
    ORDER BY b.booking_date DESC";

    $result = $conn->select_by_query($sql);
?>

    <style>
        .table-responsive {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
        }

        table.table th,
        table.table td {
            font-size: 14px;
            white-space: nowrap;
        }

        table.table tr {
            height: 10px !important;
        }

        table.table th {
            font-weight: 600;
            font-size: 15px;
        }

        .btn {
            padding: 3px 8px;
            font-size: 12px;
        }
    </style>

    <section>
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-2" style="background-color:black;">
                    <?php include('admin_sidenavbar.php'); ?>
                </div>
                <div class="col-md-10">
                    <h5 class="text-center mt-2" style="color:maroon;">Bookings</h5>
                    <a href="addbooking.php" style="color:brown;">Add Booking</a>

                    <div class="table-responsive mt-4">
                        <table class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Customer</th>
                                    <th>Movie</th>
                                    <th>Cinema</th>
                                    <th>Show Date</th>
                                    <th>Show Time</th>
                                    <th>No. Tickets</th>
                                    <th>Total Amount</th>
                                    <th>Payment Status</th>
                                    <th>Payment Method</th>
                                    <th>Booking Date</th>
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
                                            <td><?php echo htmlspecialchars($row['customer_name']); ?></td>
                                            <td><?php echo htmlspecialchars($row['movie_name']); ?></td>
                                            <td><?php echo htmlspecialchars($row['cinema_name']); ?></td>
                                            <td><?php echo $row['show_date']; ?></td>
                                            <td><?php echo htmlspecialchars($row['show_time']); ?></td>
                                            <td><?php echo $row['no_ticket']; ?></td>
                                            <td><?php echo $row['total_amount']; ?></td>

                                            <td>
                                                <?php
                                                if ($row['payment_status'] == 'completed') {
                                                    echo '<span style="color:green;font-weight:bold;">Completed</span>';
                                                } elseif ($row['payment_status'] == 'failed') {
                                                    echo '<span style="color:red;font-weight:bold;">Failed</span>';
                                                } else {
                                                    echo '<span style="color:orange;font-weight:bold;">Pending</span>';
                                                }
                                                ?>
                                            </td>

                                            <td>
                                                <?php echo ucfirst($row['payment_method'] ?? 'N/A'); ?>
                                            </td>

                                            <td><?php echo $row['booking_date']; ?></td>
                                            <td>
                                                <a href="editbooking.php?id=<?php echo $row['id']; ?>" class="btn btn-primary">Edit</a>
                                                <a href="deletebooking.php?id=<?php echo $row['id']; ?>" class="btn btn-danger">Delete</a>
                                            </td>
                                        </tr>
                                <?php
                                    }
                                } else {
                                    echo '<tr><td colspan="10">No bookings found.</td></tr>';
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