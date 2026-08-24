 <?php
    session_start();

    if (empty($_SESSION["admin_username"])) {
        header("Location:index.php");
    } else {

        include("admin_header.php");
        $conn = new connec();
        $tbl = "feedback";
        $result = $conn->select_all($tbl);

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
                     <h5 class="text-center mt-2" style="color:maroon;">Customer Feedback </h5>
                     <a href="addfeedback.php" style="color:brown;">Add Feedback</a>

                     <div class="table-responsive mt-4">
                         <table class="table table-bordered table-striped" s>
                             <thead>
                                 <tr>
                                     <th>ID</th>
                                     <th>Name</th>
                                     <th>Email</th>
                                     <th>Cell No.</th>
                                     <th>Message</th>
                                     <th>Rating</th>
                                     <th>Submitted Date</th>
                                     <th>Action</th>
                                 </tr>
                             </thead>
                             <tbody>
                                 <?php
                                    if ($result->num_rows > 0) {
                                        while ($row = $result->fetch_assoc()) {
                                    ?>
                                         <tr>
                                             <td><?php echo $row["id"] ?></td>
                                             <td><?php echo $row["name"] ?></td>
                                             <td><?php echo $row["email"] ?></td>
                                             <td><?php echo $row["phone"] ?></td>
                                             <td><?php echo $row["message"] ?></td>
                                             <td><?php echo $row["rating"] ?></td>
                                             <td><?php echo $row["submitted_date"] ?></td>

                                             <td><a href="editfeedback.php?id=<?php echo $row["id"]; ?>" class="btn btn-primary">Edit</a>
                                                 <a href="deletefeedback.php?id= <?php echo $row["id"]; ?>" class="btn btn-danger">Delete</a>
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