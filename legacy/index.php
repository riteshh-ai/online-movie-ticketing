<?php

include("header.php");


$conn = new connec();
$tbl = "slider";
$result = $conn->select_all($tbl);
$result1 = $conn->select_all($tbl);

// Handle search functionality
$search_query = isset($_GET["search"]) ? trim($_GET["search"]) : "";

if (!empty($_SESSION['show_login'])) {
?>
    <script>
        $(document).ready(function() {
            $("#modelId1").modal('show');
        });
    </script>
<?php
    unset($_SESSION['show_login']);
} elseif (empty($_SESSION["username"])) {
?>
    <script>
        $(document).ready(function() {
            $("#modelId1").modal('show');
        });
    </script>
<?php
}

?>

<?php if (empty($search_query)): ?>
    <section style="min-height: 450px;">
        <div id="carouselId" class="carousel slide" data-ride="carousel">
            <?php
            if ($result->num_rows > 0) {

                $i = 0;
                echo '<ol class="carousel-indicators">';

                while ($row = $result->fetch_assoc()) {
                    if ($i == 0) {
                        echo '<li data-target="#carouselId" data-slide-to="' . $i . '" class="active"></li>';
                    } else {
                        echo '<li data-target="#carouselId" data-slide-to="' . $i . '"></li>';
                    }
                    $i++;
                }
                echo '</ol>';
            }
            ?>
            <!-- <ol class="carousel-indicators">
        <li data-target="#carouselId" data-slide-to="0" class="active"></li>
        <li data-target="#carouselId" data-slide-to="1"></li>
        <li data-target="#carouselId" data-slide-to="2"></li>
                <li data-target="#carouselId" data-slide-to="3"></li>

    </ol> -->
            <div class="carousel-inner" role="listbox">
                <?php
                if ($result1->num_rows > 0) {

                    $j = 0;
                    while ($row1 = $result1->fetch_assoc()) {

                        if ($j == 0) {
                ?>
                            <div class="carousel-item active">
                                <img src="<?php echo $row1["img_path"]; ?>" alt="<?php echo $row1["alt"]; ?>" style="width: 100%; height: 500px;">
                            </div>
                        <?php
                        } else {
                        ?>
                            <div class="carousel-item">
                                <img src="<?php echo $row1["img_path"]; ?>" alt="<?php echo $row1["alt"]; ?>" style="width: 100%; height: 500px;">
                            </div>
                <?php
                        }
                        $j++;
                    }
                }
                ?>
                <!-- 
             <div class="carousel-item active">
            <img src="Images/banner1.jpeg" alt="First slide" style="width: 100%; height: 500px;">
        </div>
        <div class="carousel-item">
            <img src="Images/banner2.jpeg" alt="Second slide" style="width: 100%; height: 500px;">
        </div>
        <div class="carousel-item">
            <img src="Images/banner3.jpeg" alt="Third slide" style="width: 100%; height: 500px;">
        </div>
           <div class="carousel-item">
            <img src="Images/banner4.jpeg" alt="Fourth slide" style="width: 100%; height: 500px;">
        </div>
         -->
            </div>
            <a class="carousel-control-prev" href="#carouselId" role="button" data-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="sr-only">Previous</span>
            </a>
            <a class="carousel-control-next" href="#carouselId" role="button" data-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="sr-only">Next</span>
            </a>
        </div>
    </section>
<?php endif; ?>

<!-- Now Showing Section -->
<section class="py-5" id="nowshowing">
    <div class="container">
        <?php if (!empty($search_query)): ?>
            <h2 class="text-center mb-4" style="color:darkcyan;">Search Results for "<?php echo htmlspecialchars($search_query); ?>"</h2>
        <?php else: ?>
            <h2 class="text-center mb-4" style="color:darkcyan;">Now Showing</h2>
        <?php endif; ?>
        <div class="row">
            <?php
            if (!empty($search_query)) {
                // Search in movies
                $searchResult = $conn->select_by_query("SELECT * FROM movie WHERE name LIKE '%" . addslashes($search_query) . "%' ORDER BY rel_date DESC");
            } else {
                // Original now showing query
                $searchResult = $conn->select_by_query("SELECT * FROM movie WHERE rel_date <= CURDATE() AND DATE_ADD(rel_date, INTERVAL 1 MONTH) > CURDATE() ORDER BY rel_date DESC");
            }

            if ($searchResult && $searchResult->num_rows > 0) {
                while ($row = $searchResult->fetch_assoc()) {
            ?>
                    <div class="col-md-3 mb-4">
                        <div class="card h-100 shadow-sm">
                            <img src="<?php echo $row["movie_banner"]; ?>" class="card-img-top" style="height: 300px; " />
                            <div class="card-body">
                                <h6 class="card-title text-center"><?php echo $row["name"]; ?></h6>
                                <p class="card-text"><b>Release Date:</b> <?php echo $row["rel_date"]; ?></p>
                            </div>
                            <div class="card-footer bg-white border-0">
                                <?php if (!empty($_SESSION["username"])): ?>
                                    <a href="booking.php" class="btn btn-block" style="background-color:darkcyan; color:white;">Book Ticket</a>
                                <?php else: ?>
                                    <button class="btn btn-block" style="background-color:darkcyan; color:white;" disabled>Login to Book</button>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
            <?php
                }
            } else {
                echo '<div class="col-12"><p class="text-center">No movies found matching your search.</p></div>';
            }
            ?>
        </div>
    </div>
</section>

<!-- Coming Soon Section -->
<section class="py-5" id="comingsoon">
    <div class="container">
        <?php if (empty($search_query)): ?>
            <h2 class="text-center mb-4" style="color:darkcyan;">Coming Soon</h2>
        <?php endif; ?>
        <div class="row">
            <?php
            if (empty($search_query)) {
                $comingsoon = $conn->select_by_query("SELECT * FROM movie WHERE rel_date > CURDATE() ORDER BY rel_date ASC");
                if ($comingsoon && $comingsoon->num_rows > 0) {
                    while ($row = $comingsoon->fetch_assoc()) {
                        $id       = (int)($row['id'] ?? 0);
                        $name     = htmlspecialchars($row['name'] ?? 'Untitled');
                        $banner   = htmlspecialchars($row['movie_banner'] ?? 'Images/default_poster.jpg');
                        $rel_date = htmlspecialchars($row['rel_date'] ?? '');
            ?>
                        <div class="col-md-3 mb-4">
                            <div class="card h-100 shadow-sm">
                                <img src="<?php echo $banner; ?>" class="card-img-top" style="height: 300px; object-fit:cover;" alt="<?php echo $name; ?>" />
                                <div class="card-body">
                                    <h6 class="card-title text-center"><?php echo $name; ?></h6>
                                    <p class="card-text"><b>Release Date:</b> <?php echo $rel_date; ?></p>
                                </div>
                                <div class="card-footer bg-white border-0">
                                    <!-- open separate details page (no modal) -->
                                    <a class="btn btn-block" style="background-color:darkcyan; color:white;"
                                        href="movie_details.php?movie_id=<?php echo $id; ?>">
                                        View Details
                                    </a>
                                </div>
                            </div>
                        </div>
            <?php
                    }
                } else {
                    echo '<div class="col-12"><p class="text-center">No upcoming movies found.</p></div>';
                }
            }
            ?>
        </div>
    </div>
</section>

</section>



<?php
include("footer.php");
?>