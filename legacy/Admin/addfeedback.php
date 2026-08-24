<?php
session_start();
if (isset($_POST["btn_insert"])) {

    require_once("../conn.php");
    $name = $_POST["feedback_name_txt"];
    $email = $_POST["feedback_email_txt"];
    $phone = $_POST["feedback_phone_txt"];
    $message = $_POST["feedback_message_txt"];
    $rating = $_POST["feedback_rating_txt"];
    $submitted_date = $_POST["feedback_submitted_date_txt"];

    $conn = new connec();
    $sql = "insert into feedback values(0,'$name','$email','$phone','$message','$rating','$submitted_date')";
    $conn->insert($sql, "Feedback Inserted Successfully");
    header("Location: viewfeedback.php");
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
                    <h5 class="text-center mt-2" style="color:maroon;">Add Feedback</h5>

                    <div class="table-responsive mt-4">
                        <form method="post">
                            <div class="container" style="color: #343a40;">

                                <label for="text"><b>Customer Name</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Customer Name" name="feedback_name_txt" id="email">

                                <label for="text"><b>Customer Email</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Customer Email" name="feedback_email_txt" id="email">
                                <label for="text"><b>Customer Phone</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Contact Number" name="feedback_phone_txt" id="email">
                                <label for="text"><b>Customer Message</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Customer Message" name="feedback_message_txt" id="email">
                                <label for="text"><b>Customer Rating</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Customer Rating" name="feedback_rating_txt" id="email">
                                <label for="text"><b>Submitted Date</b></label>
                                <input type="date" style="border-radius: 30px;" placeholder="Enter Submitted Date" name="feedback_submitted_date_txt" id="email">
                                <br><br>

                                <a href="viewfeedback.php" class="btn" style="background-color:darkcyan; color:white">Cancel</a>
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