<?php
session_start();

$n = "";
$l = "";
$c = "";

  if(isset($_POST["btn_delete"])){

         require_once("../conn.php");
       
        $id = $_GET["id"];
        $conn = new connec();
        $table = "cinema";

        $conn->delete($table, $id);
        header("Location: viewcinema.php");
    }

if (empty($_SESSION["admin_username"])) {
    header("Location:index.php");
} else {
     include("admin_header.php");

    if(isset($_GET["id"])){
          $id = $_GET["id"];
    
        $conn = new connec();
        $tbl = "cinema";
        $result = $conn->select($tbl, $id);

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $n = $row["name"];
                $l = $row["location"];
                $c = $row["city"];
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
                    <form method="post">
                        <div class="container" style="color: #343a40;">
                        
                        <label for="text"><b>Cinema Name</b></label>
                        <input type="text" style="border-radius: 30px;" placeholder="Enter Cinema Name" name="cinema_name_txt" id="email" value="<?php echo $n; ?>">

                       <label for="text"><b>Cinema Location</b></label>
                        <input type="text" style="border-radius: 30px;" placeholder="Enter Cinema Location" name="cinema_location_txt" id="email" value="<?php echo $l; ?>">
                        <label for="text"><b>City</b></label>
                        <input type="text" style="border-radius: 30px;" placeholder="Enter City" name="city_name_txt" id="email" value="<?php echo $c; ?>">

                        <a href="viewcinema.php" class="btn" style="background-color:darkcyan; color:white">Cancel</a>
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
