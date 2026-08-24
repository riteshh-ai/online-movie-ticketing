<?php
session_start();

$name = "";
$email = "";
$cell = "";
$gender = "";
$password = "";

if (isset($_POST["btn_delete"])) {

    require_once("../conn.php");

    $id = $_GET["id"];
    $conn = new connec();
    $table = "customer";

    $conn->delete($table, $id);
    header("Location: viewcustomer.php");
}

if (empty($_SESSION["admin_username"])) {
    header("Location:index.php");
} else {
    include("admin_header.php");

    if (isset($_GET["id"])) {
        $id = $_GET["id"];

        $conn = new connec();
        $tbl = "customer";
        $result = $conn->select($tbl, $id);

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $name = $row["fullname"];
                $email = $row["email"];
                $cell = $row["cellno"];
                $gender = $row["gender"];
                $password = $row["password"];
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
                    <h5 class="text-center mt-2" style="color:maroon;">Delete Customer Details</h5>

                    <div class="table-responsive mt-4">
                        <form method="post">
                            <div class="container" style="color: #343a40;">

                                <label for="text"><b>Customer Name</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Customer Name" name="customer_name_txt" id="email" value="<?php echo $name; ?>">

                                <label for="text"><b>Customer Email</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Customer Email" name="customer_email_txt" id="email" value="<?php echo $email; ?>">
                                <label for="text"><b>Customer Cell</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Contact Number" name="customer_cell_txt" id="email" value="<?php echo $cell; ?>">
                                <label for="text"><b>Customer Gender</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Customer Gender" name="customer_gender_txt" id="email" value="<?php echo $gender; ?>">
                                <label for="text"><b>Customer Password</b></label>
                                <input type="password" style="border-radius: 30px;" placeholder="Enter Customer Password" name="customer_password_txt" id="email" value="<?php echo $password; ?>">

                                <a href="viewcustomer.php" class="btn" style="background-color:darkcyan; color:white">Cancel</a>
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