<?php
session_start();
  if(isset($_POST["btn_insert"])){

         require_once("../conn.php");
        $name = $_POST["cinema_name_txt"];
        $location = $_POST["cinema_location_txt"];
        $city = $_POST["city_name_txt"];


        $conn = new connec();
        $sql = "insert into cinema values(0,'$name','$location','$city')";

        $conn->insert($sql, "Cinema Inserted Successfully");
        header("Location: viewcinema.php");
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
                    <h5 class="text-center mt-2" style="color:maroon;">Add Cinema</h5>

                    <div class="table-responsive mt-4">
                    <form method="post">
                        <div class="container" style="color: #343a40;">
                        
                        <label for="text"><b>Cinema Name</b></label>
                        <input type="text" style="border-radius: 30px;" placeholder="Enter Cinema Name" name="cinema_name_txt" id="email">

                       <label for="text"><b>Cinema Location</b></label>
                        <input type="text" style="border-radius: 30px;" placeholder="Enter Cinema Location" name="cinema_location_txt" id="email">
                        <label for="text"><b>City</b></label>
                        <input type="text" style="border-radius: 30px;" placeholder="Enter City" name="city_name_txt" id="email">

                        <a href="viewcinema.php" class="btn" style="background-color:darkcyan; color:white">Cancel</a>
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