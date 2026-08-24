<?php
include("header.php");
require_once("conn.php");

if (!isset($_GET['movie_id']) || !is_numeric($_GET['movie_id'])) {
    header("Location: commingsoon.php");
    exit();
}
$movie_id = (int)$_GET['movie_id'];

$conn = new connec();
$sql = "SELECT m.*,
               ind.industry_name,
               g.genre_name,
               lg.lang_name
        FROM movie m
        LEFT JOIN industry ind ON m.industry_id = ind.id
        LEFT JOIN genre g ON m.genre_id = g.id
        LEFT JOIN `language` lg ON m.lang_id = lg.id
        WHERE m.id = $movie_id
        LIMIT 1";
$res = $conn->select_by_query($sql);

if (!$res || $res->num_rows == 0) {
    echo '<div class="container mt-5"><div class="alert alert-warning">Movie not found.</div></div>';
    include("footer.php");
    exit();
}

$row = $res->fetch_assoc();

// safe values / fallbacks
$name        = htmlspecialchars($row['name'] ?? 'Untitled');
$banner      = !empty($row['landscape_img']) ? $row['landscape_img'] : (!empty($row['movie_banner']) ? $row['movie_banner'] : 'Images/default_landscape.jpg');
$description = nl2br(htmlspecialchars($row['movie_desc'] ?? $row['description'] ?? 'No description available.'));
$director    = htmlspecialchars($row['director'] ?? '—');
$cast        = htmlspecialchars($row['cast'] ?? '—');
$duration    = htmlspecialchars($row['duration'] ?? '—');
$genre       = htmlspecialchars($row['genre_name'] ?? ($row['genre'] ?? '—'));
$rel_date    = htmlspecialchars($row['rel_date'] ?? '—');
$age_rating  = htmlspecialchars($row['age_rating'] ?? '—');
$language    = htmlspecialchars($row['lang_name'] ?? ($row['language'] ?? '—'));
$industry    = htmlspecialchars($row['industry_name'] ?? '—');
?>

<style>
    .movie-details {
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url('<?php echo $banner; ?>');
        background-size: cover;
        background-position: center;
        color: #f1f1f1;
        padding: 80px 0;
    }

    .movie-card {
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(8px);
        border-radius: 15px;
        padding: 30px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    }

    .movie-title {
        font-size: 2.3rem;
        font-weight: bold;
        color: #00bcd4;
        margin-bottom: 15px;
    }

    .movie-info li {
        padding: 8px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .movie-info li strong {
        color: #00bcd4;
    }

    .description {
        margin-top: 15px;
        line-height: 1.6;
    }

    .btn-back {
        display: inline-block;
        margin-top: 25px;
        background-color: #00bcd4;
        color: white;
        padding: 10px 18px;
        border-radius: 6px;
        text-decoration: none;
        transition: 0.3s;
    }

    .btn-back:hover {
        background-color: #0097a7;
        color: #fff;
    }
</style>

<section class="movie-details">
    <div class="container">
        <div class="movie-card">
            <div class="row">
                <div class="col-md-5">
                    <img src="<?php echo htmlspecialchars($banner); ?>"
                        alt="<?php echo $name; ?>"
                        style="width:100%; border-radius:12px; box-shadow:0 6px 20px rgba(0,0,0,0.4);">
                </div>
                <div class="col-md-7">
                    <h2 class="movie-title"><?php echo $name; ?></h2>
                    <ul class="list-unstyled movie-info">
                        <li><strong>Director:</strong> <?php echo $director; ?></li>
                        <li><strong>Cast:</strong> <?php echo $cast; ?></li>
                        <li><strong>Duration:</strong> <?php echo $duration; ?></li>
                        <li><strong>Genre:</strong> <?php echo $genre; ?></li>
                        <li><strong>Release Date:</strong> <?php echo $rel_date; ?></li>
                        <li><strong>Age Rating:</strong> <?php echo $age_rating; ?></li>
                        <li><strong>Language:</strong> <?php echo $language; ?></li>
                        <li><strong>Industry:</strong> <?php echo $industry; ?></li>
                    </ul>
                    <div class="description">
                        <strong>Description:</strong><br>
                        <?php echo $description; ?>
                    </div>

                    <a href="commingsoon.php" class="btn-back">← Back to Coming Soon</a>
                </div>
            </div>
        </div>
    </div>
</section>

<?php include("footer.php"); ?>