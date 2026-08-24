<?php
include("header.php");
require_once("conn.php");

$conn = new connec();
$tbl = "movie";
$result = $conn->select_by_query("SELECT * FROM movie 
    WHERE rel_date <= CURDATE() 
      AND DATE_ADD(rel_date, INTERVAL 1 MONTH) > CURDATE()
    ORDER BY rel_date DESC ");
?>

<style>
    /* Match the dark theme of Coming Soon */
    body {
        background-color: #0d0d0d;
        color: azure;
    }

    .card {
        background-color: rgba(255, 255, 255, 0.05);
        border: none;
        transition: 0.3s;
        border-radius: 10px;
    }

    .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
    }

    .card img {
        height: 350px;
        object-fit: cover;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }

    .card h6,
    .card p {
        color: azure;
    }

    .btn-book {
        background-color: darkcyan;
        color: white;
        width: 100%;
        border: none;
        transition: 0.3s;
    }

    .btn-book:hover {
        background-color: #0097a7;
        color: #fff;
    }
</style>

<section class="mt-5">
    <h3 class="text-center mb-4" style="color:darkcyan;">Now Showing</h3>

    <div class="container">
        <div class="row">
            <?php
            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {

                    // Get related info
                    $ind = $conn->select("industry", $row["industry_id"]);
                    $indrow = $ind->fetch_assoc();

                    $lang = $conn->select("language", $row["lang_id"]);
                    $langrow = $lang->fetch_assoc();

                    $gen = $conn->select("genre", $row["genre_id"]);
                    $genrow = $gen->fetch_assoc();

                    $movieName = htmlspecialchars($row["name"] ?? "Untitled");
                    $banner = htmlspecialchars($row["movie_banner"] ?? "Images/default_poster.jpg");
            ?>
                    <div class="col-md-3 mb-4">
                        <div class="card h-100">
                            <img src="<?php echo $banner; ?>" alt="<?php echo $movieName; ?>">
                            <div class="card-body">
                                <h6 class="text-center" style="min-height:40px;"><?php echo $movieName; ?></h6>
                                <p><b>Release Date:</b> <?php echo $row["rel_date"]; ?></p>
                                <p><b>Industry:</b> <?php echo $indrow["industry_name"]; ?></p>
                                <p><b>Language:</b> <?php echo $langrow["lang_name"]; ?></p>
                                <p><b>Genre:</b> <?php echo $genrow["genre_name"]; ?></p>
                            </div>
                            <div class="card-footer bg-transparent border-0">
                                <a class="btn btn-book" href="booking.php">Book Ticket</a>
                            </div>
                        </div>
                    </div>
            <?php
                }
            } else {
                echo '<div class="col-12 text-center text-light mt-4">No movies currently showing.</div>';
            }
            ?>
        </div>
    </div>
</section>

<?php
include("footer.php");
?>