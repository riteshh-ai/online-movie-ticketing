<?php
session_start();

if (empty($_SESSION["admin_username"])) {
    header("Location:index.php");
} else {

    include("admin_header.php");
    $conn = new connec();
    $sql = "SELECT movie.id, movie.name, movie.movie_banner, movie.rel_date, industry.industry_name, genre.genre_name,language.lang_name, movie.duration, movie.director, movie.cast, movie.age_rating
    FROM movie, genre, industry, movie_ticket_booking.language
    WHERE movie.industry_id=industry.id AND
    movie.genre_id= genre.id AND
    movie.lang_id = language.id;";

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
                    <h5 class="text-center mt-2" style="color:maroon;">Movie Details </h5>
                    <a href="addmovie.php" style="color:brown;">Add Movie</a>

                    <div class="table-responsive mt-4">
                        <table class="table table-bordered table-striped" s>
                            <thead>
                                <tr>
                                    <th>Banner</th>
                                    <th>Name</th>
                                    <th>Release Date</th>
                                    <th>Industry</th>
                                    <th>Genre</th>
                                    <th>Language</th>
                                    <th>Movie Duration</th>
                                    <th>Director</th>
                                    <th>Cast</th>
                                    <th>Age Rating</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                if ($result->num_rows > 0) {
                                    while ($row = $result->fetch_assoc()) {
                                ?>
                                        <tr>
                                            <td><img src="../<?php echo $row["movie_banner"] ?>" style="height:100px;"></td>
                                            <td><?php echo $row["name"] ?></td>
                                            <td><?php echo $row["rel_date"] ?></td>
                                            <td><?php echo $row["industry_name"] ?></td>
                                            <td><?php echo $row["genre_name"] ?></td>
                                            <td><?php echo $row["lang_name"] ?></td>
                                            <td><?php echo $row["duration"] ?></td>
                                            <td><?php echo $row["director"] ?></td>
                                            <td><?php echo $row["cast"] ?></td>
                                            <td><?php echo $row["age_rating"] ?></td>

                                            <td><a href="editmovie.php?id=<?php echo $row["id"]; ?>" class="btn btn-primary">Edit</a>
                                                <a href="deletemovie.php?id= <?php echo $row["id"]; ?>" class="btn btn-danger">Delete</a>
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