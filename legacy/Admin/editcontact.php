<?php
session_start();

$n = "";
$e = "";
$num = "";
$msg = "";
$msg_date = "";

if (isset($_POST["btn_update"])) {

    include("../conn.php");
    $name = $_POST["contact_name_txt"];
    $email = $_POST["contact_email_txt"];
    $num = $_POST["contact_num_txt"];
    $msg = $_POST["contact_msg_txt"];
    $msg_date = $_POST["contact_msg_date_txt"];

    $id = $_GET["id"];
    $conn = new connec();
    $sql = "update contact set name='$name', email='$email', num='$num', msg='$msg', msg_date='$msg_date' where id=$id";
    $conn->update($sql, "Contact Updated Successfully");
    header("Location: viewcontact.php");
}

if (empty($_SESSION["admin_username"])) {
    header("Location:index.php");
} else {
    include("admin_header.php");

    if (isset($_GET["id"])) {
        $id = $_GET["id"];

        $conn = new connec();
        $tbl = "contact";
        $result = $conn->select($tbl, $id);

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $n = $row["name"];
                $e = $row["email"];
                $num = $row["num"];
                $msg = $row["msg"];
                $msg_date = $row["msg_date"];
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
                    <h5 class="text-center mt-2" style="color:maroon;">Edit Contact Details</h5>

                    <div class="table-responsive mt-4">
                        <form method="post">
                            <div class="container" style="color: #343a40;">

                                <label for="text"><b>Contact Name</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Contact Name" name="contact_name_txt" id="email" value="<?php echo $n; ?>">

                                <label for="text"><b>Contact Email</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Contact Email" name="contact_email_txt" id="email" value="<?php echo $e; ?>">
                                <label for="text"><b>Contact Number</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Contact Number" name="contact_num_txt" id="email" value="<?php echo $num; ?>">
                                <label for="text"><b>Contact Message</b></label>
                                <input type="text" style="border-radius: 30px;" placeholder="Enter Contact Message" name="contact_msg_txt" id="email" value="<?php echo $msg; ?>">
                                <label for="text"><b>Message Date</b></label>
                                <input type="date" style="border-radius: 30px;" placeholder="Enter Message Date" name="contact_msg_date_txt" id="email" value="<?php echo $msg_date; ?>">


                                <a href="viewcontact.php" class="btn" style="background-color:darkcyan; color:white">Cancel</a>
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