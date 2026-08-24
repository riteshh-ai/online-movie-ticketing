<?php
session_start();

$imgsrc = "";
$alt_txt = "";

if (isset($_POST["btn_update"])) {

    $alt = $_POST["slider_alt_text"];


    $target_dir =  "images/";
    $target_file = $target_dir . $_FILES["fileToUpload"]["name"];

    $target_dir_01 =  "../images/";
    $target_file_01 = $target_dir_01 . $_FILES["fileToUpload"]["name"];


    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

    if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file_01)) {
        $id = $_GET["id"];
        $conn = new connec();
        $sql = "update slider set img_path='$target_file', alt='$alt' where id=$id";

        $conn->update($sql, "Cinema Updated Successfully");
        header("Location:viewslider.php");
    } else {
        echo "Error in uploading";
    }
}

if (empty($_SESSION["admin_username"])) {
    header("Location:index.php");
} else {
    include("admin_header.php");

    if (isset($_GET["id"])) {
        $id = $_GET["id"];

        $conn = new connec();
        $tbl = "slider";
        $result = $conn->select($tbl, $id);

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $imgsrc = $row["img_path"];
                $alt_txt = $row["alt"];
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
                    <h5 class="text-center mt-2" style="color:maroon;">Update Slider</h5>

                    <div class="table-responsive mt-4">

                        <form method="post" enctype="multipart/form-data" class="mt-5">
                            <div class="container" style="color: #343a40;">

                                <label for="text"><b>Select Image</b></label>
                                <input type="file" style="border-radius: 30px;" name="fileToUpload" id="fileToUpload" value="<?php echo $imgsrc; ?>" required><br><br>


                                <img src="../<?php echo $imgsrc; ?>" width="150px" height="100px;" />
                                <br><br>

                                <label for="text"><b>Alternate Text</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Alternate Text" name="slider_alt_text" value="<?php echo $alt_txt; ?>" required><br><br>


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