<?php
session_start();

$name = "";
$email = "";
$phone = "";
$message = "";
$rating = "";
$submitted_date = "";

if (isset($_POST["btn_delete"])) {

    require_once("../conn.php");

    $id = $_GET["id"];
    $conn = new connec();
    $table = "feedback";

    $conn->delete($table, $id);
    header("Location: viewfeedback.php");
}

if (empty($_SESSION["admin_username"])) {
    header("Location:index.php");
} else {
    include("admin_header.php");

    if (isset($_GET["id"])) {
        $id = $_GET["id"];

        $conn = new connec();
        $tbl = "feedback";
        $result = $conn->select($tbl, $id);

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $name = $row["name"];
                $email = $row["email"];
                $phone = $row["phone"];
                $message = $row["message"];
                $rating = $row["rating"];
                $submitted_date = $row["submitted_date"];
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
                    <h5 class="text-center mt-2" style="color:maroon;">Delete Feedback</h5>

                    <div class="table-responsive mt-4">
                        <form method="post">
                            <div class="container" style="color: #343a40;">

                                <label for="text"><b>Customer Name</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Customer Name" name="customer_name_txt" id="email" value="<?php echo $name; ?>">

                                <label for="text"><b>Customer Email</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Customer Email" name="customer_email_txt" id="email" value="<?php echo $email; ?>">
                                <label for="text"><b>Customer Cell</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Contact Number" name="customer_cell_txt" id="email" value="<?php echo $cell; ?>">
                                <label for="text"><b>Customer Message</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Customer Message" name="customer_message_txt" id="email" value="<?php echo $message; ?>">
                                <label for="text"><b>Customer Rating</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Customer Rating" name="customer_rating_txt" id="email" value="<?php echo $rating; ?>">
                                <label for="text"><b>Submitted Date</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Submitted Date" name="customer_submitted_date_txt" id="email" value="<?php echo $submitted_date; ?>">

                                <a href="viewfeedback.php" class="btn" style="background-color:darkcyan; color:white">Cancel</a>
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