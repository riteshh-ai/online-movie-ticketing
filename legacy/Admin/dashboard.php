<?php
session_start();

if (empty($_SESSION["admin_username"])) {
    header("Location:index.php");
} else {

    include("admin_header.php");
    $conn = new connec();
?>


    <section>
        <div class="container-fluid" style="overflow: hidden;">
            <div class="row">
                <div class="col-md-2" style="background-color:black;">
                    <?php include('admin_sidenavbar.php'); ?>
                </div>
                <div class="col-md-10" style="padding: 20px;">
                    <h5 class="text-center mb-4" style="color:maroon; font-weight:bold;">Admin Dashboard</h5>

                    <!-- Dashboard Stats -->
                    <div class="row mb-4">
                        <?php
                        // Total Movies
                        $movies = $conn->select_all("movie");
                        $total_movies = $movies->num_rows;

                        // Total Bookings (restricted to cinema if logged in as cinema admin)
                        if (!empty($_SESSION['admin_cinema_id']) && $_SESSION['admin_cinema_id'] > 0) {
                            $cid = intval($_SESSION['admin_cinema_id']);
                            $resb = $conn->select_by_query("SELECT b.* FROM `booking` b JOIN `show` s ON b.show_id = s.id WHERE s.cinema_id=$cid");
                            $total_bookings = $resb ? $resb->num_rows : 0;
                        } else {
                            $bookings = $conn->select_all("booking");
                            $total_bookings = $bookings->num_rows;
                        }

                        // Total Customers
                        $customers = $conn->select_all("customer");
                        $total_customers = $customers->num_rows;

                        // Total Cinemas
                        $cinemas = $conn->select_all("cinema");
                        $total_cinemas = $cinemas->num_rows;
                        ?>

                        <!-- Movies Card -->
                        <div class="col-md-3 mb-3">
                            <div class="card" style="border-left: 5px solid #b51313ff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                <div class="card-body">
                                    <h6 class="card-title" style="color:#666;">Total Movies</h6>
                                    <h2 style="color:#FF6B6B; font-weight:bold;"><?php echo $total_movies; ?></h2>
                                    <a href="viewmovie.php" class="btn btn-sm" style="background-color:#b51313ff; color:white; width:100%;">View Movies</a>
                                </div>
                            </div>
                        </div>

                        <!-- Bookings Card -->
                        <div class="col-md-3 mb-3">
                            <div class="card" style="border-left: 5px solid #11967dff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                <div class="card-body">
                                    <h6 class="card-title" style="color:#666;">Total Bookings</h6>
                                    <h2 style="color:#4ECDC4; font-weight:bold;"><?php echo $total_bookings; ?></h2>
                                    <a href="viewbooking.php" class="btn btn-sm" style="background-color:#11967dff; color:white; width:100%;">View Bookings</a>
                                </div>
                            </div>
                        </div>

                        <!-- Customers Card -->
                        <div class="col-md-3 mb-3">
                            <div class="card" style="border-left: 5px solid #11967dff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                <div class="card-body">
                                    <h6 class="card-title" style="color:#666;">Total Customers</h6>
                                    <h2 style="color:#95E1D3; font-weight:bold;"><?php echo $total_customers; ?></h2>
                                    <a href="viewcustomer.php" class="btn btn-sm" style="background-color:#11967dff; color:white; width:100%;">View Customers</a>
                                </div>
                            </div>
                        </div>

                        <!-- Cinemas Card -->
                        <div class="col-md-3 mb-3">
                            <div class="card" style="border-left: 5px solid #b51313ff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                <div class="card-body">
                                    <h6 class="card-title" style="color:#666;">Total Cinemas</h6>
                                    <h2 style="color:#F38181; font-weight:bold;"><?php echo $total_cinemas; ?></h2>
                                    <a href="viewcinema.php" class="btn btn-sm" style="background-color:#b51313ff; color:white; width:100%;">View Cinemas</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="row">
                        <div class="col-md-12">
                            <h6 style="color:maroon; font-weight:bold; margin-bottom:15px;">Quick Actions</h6>
                            <div class="btn-group-vertical" style="width:100%;">
                                <a href="addmovie.php" class="btn btn-outline-danger mb-2" style="text-align:left;">
                                    <i class="fa fa-plus"></i> Add New Movie
                                </a>
                                <a href="addshow.php" class="btn btn-outline-info mb-2" style="text-align:left;">
                                    <i class="fa fa-plus"></i> Add New Show
                                </a>
                                <a href="addcinema.php" class="btn btn-outline-warning mb-2" style="text-align:left;">
                                    <i class="fa fa-plus"></i> Add New Cinema
                                </a>
                                <a href="addcustomer.php" class="btn btn-outline-success mb-2" style="text-align:left;">
                                    <i class="fa fa-plus"></i> Add New Customer
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

<?php
    include("admin_footer.php");
}
?>