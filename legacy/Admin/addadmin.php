<?php
session_start();
if (empty($_SESSION["admin_username"]) || !isset($_SESSION['admin_cinema_id']) || $_SESSION['admin_cinema_id'] != 0) {
    header("Location:index.php");
    exit();
}

require_once("../conn.php");
$conn = new connec();
$error = '';
if (isset($_POST['btn_insert'])) {
    $username = trim($_POST['username_txt']);
    $email = trim($_POST['email_txt']);
    $password = trim($_POST['password_txt']);
    $cinema_id = intval($_POST['cinema_id_txt']);

    if ($username === '' || $email === '' || $password === '' || $cinema_id <= 0) {
        $error = "All fields are required.";
    } else {
        // insert new admin
        $sql = "INSERT INTO admin_users (username,email,password,cinema_id) VALUES ('" . $conn->conn->real_escape_string($username) . "', '" . $conn->conn->real_escape_string($email) . "', '" . $conn->conn->real_escape_string($password) . "', $cinema_id)";
        $conn->insert($sql, "Admin account created.");
        header("Location: viewadmin.php");
        exit();
    }
}

// fetch cinemas for dropdown
$cinemas = $conn->select_all('cinema');

include("admin_header.php");
?>

<style>
/* reuse styles from other forms */
textarea, input[type=text], input[type=password], input[type=email] { width:100%; padding:15px; margin:5px 0 22px 0; display:inline-block; border:none; background:#f1f1f1; border-radius:30px; transition:box-shadow 0.2s; }
textarea:focus, input[type=text]:focus, input[type=password]:focus, input[type=email]:focus { background-color:#ddd; outline:none; box-shadow:0 0 0 2px #17a2b8; }
.registerbtn { background-color:maroon; color:white; padding:16px 20px; margin:8px 0; border:none; cursor:pointer; width:50%; opacity:0.9; }
.registerbtn:hover { opacity:1; }
</style>

<section>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-2" style="background-color:black;">
                <?php include('admin_sidenavbar.php'); ?>
            </div>
            <div class="col-md-10">
                <h5 class="text-center mt-2" style="color:maroon;">Add Cinema Admin</h5>

                <form method="post" class="mt-4">
                    <div class="container" style="color:#343a40; max-width:500px;">
                        <label><b>Username</b></label>
                        <input type="text" name="username_txt" required>

                        <label><b>Email</b></label>
                        <input type="email" name="email_txt" required>

                        <label><b>Password</b></label>
                        <input type="password" name="password_txt" required>

                        <label><b>Cinema</b></label>
                        <select name="cinema_id_txt" required>
                            <option value="">-- Select Cinema --</option>
                            <?php while ($r = $cinemas->fetch_assoc()) {
                                echo "<option value='" . $r['id'] . "'>" . htmlspecialchars($r['name']) . "</option>";
                            } ?>
                        </select>

                        <?php if ($error) echo '<p style="color:red;">'.$error.'</p>'; ?>

                        <a href="viewadmin.php" class="btn" style="background-color:darkcyan;color:white">Cancel</a>
                        <button type="submit" name="btn_insert" class="btn" style="background-color:darkcyan;color:white">Create</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</section>

<?php include("admin_footer.php");
