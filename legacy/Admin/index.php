<?php
session_start();
$error = "";

// If already logged in
if (!empty($_SESSION["admin_username"])) {
    header("Location: dashboard.php");
    exit();
}

if (isset($_POST["btn_login"])) {
    require_once("../conn.php");
    $email_id = $_POST["log_email"];
    $paswrd_log = $_POST["log_psw"];

    $conn = new connec();

    // super‑user hardcoded account (global access)
    if ($email_id === "admin@gmail.com" && $paswrd_log === "admin1234") {
        $_SESSION["admin_username"] = $email_id;
        $_SESSION["admin_cinema_id"] = 0; // 0 means no restriction
        header("Location: dashboard.php");
        exit();
    }

    // look up cinema‑specific admins by email
    $query = "SELECT * FROM admin_users WHERE email='" . $conn->conn->real_escape_string($email_id) . "' AND password='" . $conn->conn->real_escape_string($paswrd_log) . "'";
    $result = $conn->select_by_query($query);
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $_SESSION["admin_username"] = $row['username'];
        $_SESSION["admin_email"] = $row['email'];
        $_SESSION["admin_cinema_id"] = $row['cinema_id'];
        header("Location: dashboard.php");
        exit();
    } else {
        $error = "Invalid Email or Password";
    }
}
?>



<!doctype html>
<html lang="en">

<head>
    <title>Admin Panel</title>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

    <style>
        * {
            box-sizing: border-box
        }

        .container {
            padding: 16px;
        }

        textarea,
        input[type=text],
        input[type=password],
        input[type=tel],
        input[type=email],
        input[type=date],
        input[type=number] {
            width: 100%;
            padding: 15px;
            margin: 5px 0 22px 0;
            display: inline-block;
            border: none;
            background: #f1f1f1;
            border-radius: 30px;
            transition: box-shadow 0.2s;
        }

        textarea:focus,
        input[type=text]:focus,
        input[type=password]:focus,
        input[type=tel]:focus,
        input[type=email]:focus {
            background-color: #ddd;
            outline: none;
            box-shadow: 0 0 0 2px #17a2b8;
        }

        hr {
            border: 1px solid #f1f1f1;
            margin-bottom: 25px;
        }

        .registerbtn {
            background-color: maroon;
            color: white;
            padding: 16px 20px;
            margin: 8px 0;
            border: none;
            cursor: pointer;
            width: 50%;
            opacity: 0.9;
        }

        .registerbtn:hover {
            opacity: 1;
        }

        a {
            color: dodgerblue;
        }

        .signin {
            background-color: #f1f1f1;
            text-align: center;
        }

        .modal-body {

            overflow-y: auto;
            /* scroll inside modal */
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="row">
            <div class="col-md-6" style="margin:auto;">
                <form action="" method="post">
                    <div class="container" style="color: #343a40;">
                        <center>
                            <h1>Admin LogIn</h1>
                        </center>
                        <hr>
                        <label for="email"><b>Email</b></label>
                        <input type="email" style="border-radius: 30px;" placeholder="Enter Email" name="log_email" id="email" required>
                        <label for="psw"><b>Password</b></label>
                        <input type="password" style="border-radius: 30px;" placeholder="Enter Password" name="log_psw" id="psw" required>
                        <button type="submit" name="btn_login" class="btn" style="background-color:darkcyan; color:white">Login</button>
                    </div>

                </form>
                <p style="color:maroon; margin-left:1%; font-weight:bold"><?php echo $error; ?></p>
            </div>

        </div>
    </div>







    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
</body>

</html>