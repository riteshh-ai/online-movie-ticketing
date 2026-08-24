<?php
include("header.php");
require_once("conn.php");

$conn = new connec();
$result = $conn->select_by_query("SELECT * FROM movie WHERE rel_date > CURDATE() ORDER BY rel_date ASC");
?>

<style>
    /* Match the dark theme of Now Showing */
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

    .btn-view {
        background-color: darkcyan;
        color: white;
        width: 100%;
        border: none;
        transition: 0.3s;
    }

    .btn-view:hover {
        background-color: #0097a7;
        color: #fff;
    }
</style>

<section class="mt-5">
    <h3 class="text-center mb-4" style="color:darkcyan;">Coming Soon</h3>

    <div class="container">
        <div class="row">
            <?php
            if ($result && $result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {

                    // safe related lookups
                    $indrow = [];
                    $langrow = [];
                    $genrow = [];

                    if (!empty($row["industry_id"])) {
                        $ind = $conn->select("industry", $row["industry_id"]);
                        if ($ind) $indrow = $ind->fetch_assoc() ?: [];
                    }
                    if (!empty($row["lang_id"])) {
                        $lang = $conn->select("language", $row["lang_id"]);
                        if ($lang) $langrow = $lang->fetch_assoc() ?: [];
                    }
                    if (!empty($row["genre_id"])) {
                        $gen = $conn->select("genre", $row["genre_id"]);
                        if ($gen) $genrow = $gen->fetch_assoc() ?: [];
                    }

                    $movieId      = (int)($row['id'] ?? 0);
                    $movieName    = htmlspecialchars($row['name'] ?? 'Untitled');
                    $movieBanner  = !empty($row['movie_banner']) ? htmlspecialchars($row['movie_banner']) : 'Images/default_poster.jpg';
                    $rel_date     = htmlspecialchars($row['rel_date'] ?? '');
                    $industryName = htmlspecialchars($indrow['industry_name'] ?? '');
                    $langName     = htmlspecialchars($langrow['lang_name'] ?? '');
                    $genreName    = htmlspecialchars($genrow['genre_name'] ?? '');
            ?>
                    <div class="col-md-3 mb-4">
                        <div class="card h-100">
                            <img src="<?php echo $movieBanner; ?>" alt="<?php echo $movieName; ?>" />
                            <div class="card-body">
                                <h6 class="text-center" style="min-height:40px;"><?php echo $movieName; ?></h6>
                                <p><b>Release Date:</b> <?php echo $rel_date; ?></p>
                                <p><b>Language:</b> <?php echo $langName; ?></p>
                                <p><b>Genre:</b> <?php echo $genreName; ?></p>
                            </div>
                            <div class="card-footer bg-transparent border-0">
                                <a class="btn btn-view" href="movie_details.php?movie_id=<?php echo $movieId; ?>">
                                    View Details
                                </a>
                            </div>
                        </div>
                    </div>
            <?php
                }
            } else {
                echo '<div class="col-12 text-center text-light mt-4">No upcoming movies found.</div>';
            }
            ?>
        </div>
    </div>
</section>

<?php
include("footer.php");
?>