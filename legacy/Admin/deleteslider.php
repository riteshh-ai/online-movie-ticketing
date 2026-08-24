<?php
session_start();

$imgsrc = "";
$alt_txt = "";

if (isset($_POST["btn_delete"])) {

    include("../conn.php");

    $id = $_GET["id"];
    $conn = new connec();
    $table = "slider";

    $conn->delete($table, $id);
    header("Location: viewslider.php");
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
                    <h5 class="text-center mt-2" style="color:maroon;">Delete Cinema Details</h5>

                    <div class="table-responsive mt-4">
                        <form method="post" enctype="multipart/form-data" class="mt-5">
                            <div class="container" style="color: #343a40;">


                                <img src="../<?php echo $imgsrc; ?>" width="150px" height="100px;" />
                                <br><br>

                                <label for="text"><b>Alternate Text</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Alternate Text" name="slider_alt_text" value="<?php echo $alt_txt; ?>" required><br><br>

                                <a href="viewslider.php" class="btn" style="background-color:darkcyan; color:white">Cancel</a>
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