<?php
session_start();
if (isset($_POST["btn_insert"])) {

    require_once("../conn.php");
    $name = $_POST["movie_name_txt"];
    $movie_desc = $_POST["movie_desc_txt"];
    $rel_date = $_POST["rel_date_txt"];
    $industry_id = $_POST["industry_id_txt"];
    $genre_id = $_POST["genre_id_txt"];
    $lang_id = $_POST["lang_id_txt"];
    $duration = $_POST["duration_txt"];
    $director = $_POST["director_txt"];
    $cast = $_POST["cast_txt"];
    $age_rating = $_POST["age_rating_txt"];

    // Handle movie banner upload
    $movie_banner = "";
    if (isset($_FILES["movie_banner_txt"]) && $_FILES["movie_banner_txt"]["error"] == 0) {
        $target_dir_store = "Images/";
        $target_dir_actual = "../Images/";
        $file_name = time() . "_" . basename($_FILES["movie_banner_txt"]["name"]);
        $target_file = $target_dir_actual . $file_name;

        if (move_uploaded_file($_FILES["movie_banner_txt"]["tmp_name"], $target_file)) {
            $movie_banner = $target_dir_store . $file_name;
        }
    }

    // Handle landscape image upload
    $landscape_img = "";
    if (isset($_FILES["landscape_img_txt"]) && $_FILES["landscape_img_txt"]["error"] == 0) {
        $target_dir_store = "Images/landscape/";
        $target_dir_actual = "../Images/landscape/";
        $file_name = time() . "_" . basename($_FILES["landscape_img_txt"]["name"]);
        $target_file = $target_dir_actual . $file_name;

        if (move_uploaded_file($_FILES["landscape_img_txt"]["tmp_name"], $target_file)) {
            $landscape_img = $target_dir_store . $file_name;
        }
    }

    $conn = new connec();
    $sql = "insert into movie values(0,'$name','$movie_banner','$movie_desc','$rel_date','$industry_id','$genre_id','$lang_id','$duration','$director','$cast','$age_rating','$landscape_img')";
    $conn->insert($sql, "Movie Inserted Successfully");
    header("Location: viewmovie.php");
}

if (empty($_SESSION["admin_username"])) {
    header("Location:index.php");
} else {

    include("admin_header.php");

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
                    <h5 class="text-center mt-2" style="color:maroon;">Add Movie</h5>

                    <div class="table-responsive mt-4">
                        <form method="post" enctype="multipart/form-data">
                            <div class="container" style="color: #343a40;">

                                <label for="text"><b>Movie Name</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Movie Name" name="movie_name_txt" id="email">

                                <label for="text"><b>Movie Banner</b></label>
                                <input type="file" style="border-radius: 30px;" placeholder="Enter Movie Banner" name="movie_banner_txt" id="email"><br>
                                <label for="text"><b>Movie Description</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Movie Description" name="movie_desc_txt" id="email">
                                <label for="text"><b>Release Date</b></label>
                                <input type="date" style="border-radius: 30px;" placeholder="Enter Release Date" name="rel_date_txt" id="email">
                                <label for="text"><b>Industry</b></label>
                                <select style="border-radius: 30px;" name="industry_id_txt" id="email" required>
                                    <option value="">-- Select Industry --</option>
                                    <?php
                                    $conn_select = new connec();
                                    $result = $conn_select->select_all('industry');
                                    while ($row = $result->fetch_assoc()) {
                                        echo "<option value='" . $row['id'] . "'>" . $row['industry_name'] . "</option>";
                                    }
                                    ?>
                                </select>
                                <label for="text"><b>Genre</b></label>
                                <select style="border-radius: 30px;" name="genre_id_txt" id="email" required>
                                    <option value="">-- Select Genre --</option>
                                    <?php
                                    $conn_select = new connec();
                                    $result = $conn_select->select_all('genre');
                                    while ($row = $result->fetch_assoc()) {
                                        echo "<option value='" . $row['id'] . "'>" . $row['genre_name'] . "</option>";
                                    }
                                    ?>
                                </select>
                                <label for="text"><b>Language</b></label>
                                <select style="border-radius: 30px;" name="lang_id_txt" id="email" required>
                                    <option value="">-- Select Language --</option>
                                    <?php
                                    $conn_select = new connec();
                                    $result = $conn_select->select_all('language');
                                    while ($row = $result->fetch_assoc()) {
                                        echo "<option value='" . $row['id'] . "'>" . $row['lang_name'] . "</option>";
                                    }
                                    ?>
                                </select><br>
                                <label for="text"><b>Duration</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Duration (e.g., 2h 15m)" name="duration_txt" id="email">
                                <label for="text"><b>Director</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Director Name" name="director_txt" id="email">
                                <label for="text"><b>Cast</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Cast Members (comma-separated)" name="cast_txt" id="email">
                                <label for="text"><b>Age Rating</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Age Rating (e.g., PG, R)" name="age_rating_txt" id="email">
                                <label for="text"><b>Landscape Image URL</b></label>
                                <input type="file" style="border-radius: 30px;" placeholder="Enter Landscape Image URL (optional)" name="landscape_img_txt" id="email">
                                <br><br>

                                <a href="viewmovie.php" class="btn" style="background-color:darkcyan; color:white">Cancel</a>
                                <button type="submit" name="btn_insert" class="btn" style="background-color:darkcyan; color:white">Insert</button>
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