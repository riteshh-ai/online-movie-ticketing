<?php
session_start();
// only allow superadmin to manage accounts
if (empty($_SESSION["admin_username"])) {
    header("Location:index.php");
    exit();
}
if (!isset($_SESSION['admin_cinema_id']) || $_SESSION['admin_cinema_id'] != 0) {
    // not global admin
    header("Location:dashboard.php");
    exit();
}

include("admin_header.php");
$conn = new connec();

$sql = "SELECT a.id, a.username, a.email, a.password, c.name AS cinema_name, a.cinema_id FROM admin_users a LEFT JOIN cinema c ON a.cinema_id = c.id";
$result = $conn->select_by_query($sql);
?>

<style>
    .table-responsive {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }
    table.table th,
    table.table td {
        font-size: 14px;
        white-space: nowrap;
    }
    table.table tr { height: 10px !important; }
    table.table th { font-weight: 600; font-size: 15px; }
    .btn { padding: 3px 8px; font-size: 12px; }
</style>

<section>
    <div class="container-fluid" style="overflow: hidden;">
        <div class="row">
            <div class="col-md-2" style="background-color:black;">
                <?php include('admin_sidenavbar.php'); ?>
            </div>
            <div class="col-md-10">
                <h5 class="text-center mt-2" style="color:maroon;">Cinema Admin Accounts</h5>
                <a href="addadmin.php" style="color:brown;">Add Admin</a>

                <div class="table-responsive mt-4">
                    <table class="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Password</th>
                                <th>Cinema</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            if ($result && $result->num_rows > 0) {
                                while ($row = $result->fetch_assoc()) {
                            ?>
                                <tr>
                                    <td><?php echo $row['id']; ?></td>
                                    <td><?php echo htmlspecialchars($row['username']); ?></td>
                                    <td><?php echo htmlspecialchars($row['email']); ?></td>
                                    <td><?php echo htmlspecialchars($row['password']); ?></td>
                                    <td><?php echo htmlspecialchars($row['cinema_name'] ?? '-'); ?></td>
                                    <td>
                                        <a href="editadmin.php?id=<?php echo $row['id']; ?>" class="btn btn-primary">Edit</a>
                                        <a href="deleteadmin.php?id=<?php echo $row['id']; ?>" class="btn btn-danger" onclick="return confirm('Are you sure?');">Delete</a>
                                    </td>
                                </tr>
                            <?php
                                }
                            } else {
                                echo '<tr><td colspan="5">No admins defined.</td></tr>';
                            }
                            ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</section>

<?php include("admin_footer.php");
