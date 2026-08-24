<?php
session_start();

$n = "";
$movie_banner = "";
$movie_desc = "";
$rel_date = "";
$industry_id = "";
$genre_id = "";
$lang_id = "";
$duration = "";
$director = "";
$cast = "";
$age_rating = "";
$landscape_img = "";
if (isset($_POST["btn_update"])) {

    include("../conn.php");
    $name = $_POST["movie_name_txt"];
    $movie_banner = $_POST["movie_banner_txt"];
    $movie_desc = $_POST["movie_desc_txt"];
    $rel_date = $_POST["rel_date_txt"];
    $industry_id = $_POST["industry_id_txt"];
    $genre_id = $_POST["genre_id_txt"];
    $lang_id = $_POST["lang_id_txt"];
    $duration = $_POST["duration_txt"];
    $director = $_POST["director_txt"];
    $cast = $_POST["cast_txt"];
    $age_rating = $_POST["age_rating_txt"];
    $landscape_img = $_POST["landscape_img_url"];

    $id = $_GET["id"];
    $conn = new connec();
    $sql = "update movie set name='$name', movie_banner='$movie_banner', movie_desc='$movie_desc', rel_date='$rel_date', industry_id='$industry_id', genre_id='$genre_id', lang_id='$lang_id', duration='$duration', director='$director', cast='$cast', age_rating='$age_rating', landscape_img='$landscape_img' where id=$id";
    $conn->update($sql, "Movie Updated Successfully");
    header("Location: viewmovie.php");
}

if (empty($_SESSION["admin_username"])) {
    header("Location:index.php");
} else {
    include("admin_header.php");

    if (isset($_GET["id"])) {
        $id = $_GET["id"];

        $conn = new connec();
        $tbl = "movie";
        $result = $conn->select($tbl, $id);

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $n = $row["name"];
                $movie_banner = $row["movie_banner"];
                $movie_desc = $row["movie_desc"];
                $rel_date = $row["rel_date"];
                $industry_id = $row["industry_id"];
                $genre_id = $row["genre_id"];
                $lang_id = $row["lang_id"];
                $duration = $row["duration"];
                $director = $row["director"];
                $cast = $row["cast"];
                $age_rating = $row["age_rating"];
                $landscape_img = $row["landscape_img"];
            }
        }
    }

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
                    <h5 class="text-center mt-2" style="color:maroon;">Edit Movie Details</h5>

                    <div class="table-responsive mt-4">
                        <form method="post">
                            <div class="container" style="color: #343a40;">

                                <label for="text"><b>Movie Name</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Movie Name" name="movie_name_txt" id="email" value="<?php echo $n; ?>">

                                <label for="text"><b>Movie Banner</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Movie Banner" name="movie_banner_txt" id="email" value="<?php echo $movie_banner; ?>">
                                <label for="text"><b>Movie Description</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Movie Description" name="movie_desc_txt" id="email" value="<?php echo $movie_desc; ?>">
                                <label for="text"><b>Release Date</b></label>
                                <input type="date" style="border-radius: 30px;" placeholder="Enter Release Date" name="rel_date_txt" id="email" value="<?php echo $rel_date; ?>">
                                <label for="text"><b>Industry</b></label>
                                <select style="border-radius: 30px;" name="industry_id_txt" id="email">
                                    <option value="">-- Select Industry --</option>
                                    <?php
                                    $conn_select = new connec();
                                    $result = $conn_select->select_all('industry');
                                    while ($row = $result->fetch_assoc()) {
                                        $selected = ($row['id'] == $industry_id) ? 'selected' : '';
                                        echo "<option value='" . $row['id'] . "' " . $selected . ">" . $row['industry_name'] . "</option>";
                                    }
                                    ?>
                                </select>
                                <label for="text"><b>Genre</b></label>
                                <select style="border-radius: 30px;" name="genre_id_txt" id="email">
                                    <option value="">-- Select Genre --</option>
                                    <?php
                                    $conn_select = new connec();
                                    $result = $conn_select->select_all('genre');
                                    while ($row = $result->fetch_assoc()) {
                                        $selected = ($row['id'] == $genre_id) ? 'selected' : '';
                                        echo "<option value='" . $row['id'] . "' " . $selected . ">" . $row['genre_name'] . "</option>";
                                    }
                                    ?>
                                </select>
                                <label for="text"><b>Language</b></label>
                                <select style="border-radius: 30px;" name="lang_id_txt" id="email">
                                    <option value="">-- Select Language --</option>
                                    <?php
                                    $conn_select = new connec();
                                    $result = $conn_select->select_all('language');
                                    while ($row = $result->fetch_assoc()) {
                                        $selected = ($row['id'] == $lang_id) ? 'selected' : '';
                                        echo "<option value='" . $row['id'] . "' " . $selected . ">" . $row['lang_name'] . "</option>";
                                    }
                                    ?>
                                </select><br>
                                <label for="text"><b>Duration</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Duration (e.g., 2h 15m)" name="duration_txt" id="email" value="<?php echo $duration; ?>">
                                <label for="text"><b>Director</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Director Name" name="director_txt" id="email" value="<?php echo $director; ?>">
                                <label for="text"><b>Cast</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Cast Names (comma separated)" name="cast_txt" id="email" value="<?php echo $cast; ?>">
                                <label for="text"><b>Age Rating</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Age Rating (e.g., PG, R)" name="age_rating_txt" id="email" value="<?php echo $age_rating; ?>">
                                <label for="text"><b>Landscape Image URL</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Landscape Image URL" name="landscape_img_url" id="email" value="<?php echo $landscape_img; ?>">

                                <a href="viewmovie.php" class="btn" style="background-color:darkcyan; color:white">Cancel</a>
                                <button type="submit" name="btn_update" class="btn" style="background-color:darkcyan; color:white">Update</button>
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