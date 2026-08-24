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
if (isset($_POST["btn_delete"])) {

    include("../conn.php");

    $id = $_GET["id"];
    $conn = new connec();
    $table = "movie";

    $conn->delete($table, $id);
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
                    <h5 class="text-center mt-2" style="color:maroon;">Delete Movie Details</h5>

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
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Cast Names" name="cast_txt" id="email" value="<?php echo $cast; ?>">
                                <label for="text"><b>Age Rating</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Age Rating" name="age_rating_txt" id="email" value="<?php echo $age_rating; ?>">
                                <label for="text"><b>Landscape Image URL</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter landscape image URL" name="landscape_img" id="email" value="<?php echo $landscape_img; ?>">
                                <br><br>

                                <a href="viewmovie.php" class="btn" style="background-color:darkcyan; color:white">Cancel</a>
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