<?php
session_start();
if (empty($_SESSION["admin_username"]) || !isset($_SESSION['admin_cinema_id']) || $_SESSION['admin_cinema_id'] != 0) {
    header("Location:index.php");
    exit();
}
require_once("../conn.php");
$conn = new connec();
$error = '';

$id = intval($_GET['id'] ?? 0);
if ($id <= 0) {
    header("Location:viewadmin.php");
    exit();
}

// fetch existing
$result = $conn->select_by_query("SELECT * FROM admin_users WHERE id=$id");
if (!$result || $result->num_rows === 0) {
    header("Location:viewadmin.php");
    exit();
}
$admin = $result->fetch_assoc();

if (isset($_POST['btn_update'])) {
    $username = trim($_POST['username_txt']);
    $email = trim($_POST['email_txt']);
    $password = trim($_POST['password_txt']);
    $cinema_id = intval($_POST['cinema_id_txt']);
    if ($username === '' || $email === '' || $cinema_id <= 0) {
        $error = "Username, email and cinema are required.";
    } else {
        $updateSQL = "UPDATE admin_users SET username='" . $conn->conn->real_escape_string($username) . "', email='" . $conn->conn->real_escape_string($email) . "', " .
            ($password !== '' ? "password='" . $conn->conn->real_escape_string($password) . "', " : "") .
            "cinema_id=$cinema_id WHERE id=$id";
        $conn->update($updateSQL, "Admin updated.");
        header("Location:viewadmin.php");
        exit();
    }
}

$cinemas = $conn->select_all('cinema');
include("admin_header.php");
?>

<section>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-2" style="background-color:black;">
                <?php include('admin_sidenavbar.php'); ?>
            </div>
            <div class="col-md-10">
                <h5 class="text-center mt-2" style="color:maroon;">Edit Cinema Admin</h5>
                <form method="post" class="mt-4">
                    <div class="container" style="color:#343a40; max-width:500px;">
                        <label><b>Username</b></label>
                        <input type="text" name="username_txt" value="<?php echo htmlspecialchars($admin['username']); ?>" required>

                        <label><b>Email</b></label>
                        <input type="email" name="email_txt" value="<?php echo htmlspecialchars($admin['email']); ?>" required>

                        <label><b>Password</b></label>
                        <input type="text" name="password_txt" value="<?php echo htmlspecialchars($admin['password']); ?>" required>

                        <label><b>Cinema</b></label>
                        <select name="cinema_id_txt" required>
                            <option value="">-- Select Cinema --</option>
                            <?php while ($r = $cinemas->fetch_assoc()) {
                                $sel = $r['id'] == $admin['cinema_id'] ? 'selected' : '';
                                echo "<option value='" . $r['id'] . "' $sel>" . htmlspecialchars($r['name']) . "</option>";
                            } ?>
                        </select>
                        <?php if ($error) echo '<p style="color:red;">'.$error.'</p>'; ?>
                        <a href="viewadmin.php" class="btn" style="background-color:darkcyan;color:white">Cancel</a>
                        <button type="submit" name="btn_update" class="btn" style="background-color:darkcyan;color:white">Update</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</section>

<?php include("admin_footer.php");
