<?php
session_start();

if (empty($_SESSION["admin_username"])) {
    header("Location:index.php");
} else {

    include("admin_header.php");
    $conn = new connec();
    $cinemaFilter = '';
    if (!empty($_SESSION['admin_cinema_id']) && $_SESSION['admin_cinema_id'] > 0) {
        $cid = intval($_SESSION['admin_cinema_id']);
        $cinemaFilter = " AND s.cinema_id = $cid";
    }
    $sql = "SELECT sr.id, sr.show_id, cu.fullname, sr.seat_number, sr.reserved
            FROM seat_reserved sr
            JOIN customer cu ON sr.cust_id = cu.id
            JOIN `show` s ON sr.show_id = s.id
            WHERE 1=1" . $cinemaFilter;

    $result = $conn->select_by_query($sql);
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
                    <h5 class="text-center mt-2" style="color:maroon;">Seat Reserved Details </h5>

                    <div class="table-responsive mt-4">
                        <table class="table table-bordered table-striped" s>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Customer Name</th>
                                    <th>Seat No.</th>
                                    <th>Status</th>
                               
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                if ($result->num_rows > 0) {
                                    while ($row = $result->fetch_assoc()) {
                                ?>
                                        <tr>
                                            <td><?php echo $row["id"] ?></td>
                                            <td><?php echo $row["fullname"] ?></td>
                                            <td><?php echo $row["seat_number"] ?></td>
                                            <td>
                                                <?php 
                                                if($row["reserved"]==0){
                                                    echo "<p style='color:blue;'> Already Booked </p>";
                                                } else {
                                                    echo "<p style='color:green;'> Available </p>";
                                                }
                                                ?>
                                        
                                            </td>
                                    
                                            <td><a href="editseat_reserved.php?id=<?php echo $row["id"]; ?>" class="btn btn-primary">Edit</a>
                                                <a href="deleteseat_reserved.php?id= <?php echo $row["id"]; ?>" class="btn btn-danger">Delete</a>
                                            </td>
                                        </tr>
                                <?php
                                    }
                                }
                                ?>

                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
    </section>

<?php
    include("admin_footer.php");
}
?>