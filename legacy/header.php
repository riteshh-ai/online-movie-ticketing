<?php
session_start();
require_once("conn.php");
$conn = new connec();

// Handle logout
if (isset($_GET["action"]) && $_GET["action"] == "logout") {
    session_destroy();

    header("Location: index.php");
    exit();
}

// Handle login (replace with your own authentication logic)
if (isset($_POST["btn_login"])) {

    $email_id = $_POST["log_email"];
    $paswrd_log = $_POST["log_psw"];

    $result = $conn->select_login("customer", $email_id);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();

        if ($row["email"] == $email_id && $row["password"] == $paswrd_log) {
            $_SESSION["username"] = $row["fullname"];
            $_SESSION["cust_id"] = $row["id"];
            $_SERVER["ul"] = '<li class="nav-item"><a class="nav-link">Hello' . $_SESSION["username"] . '</a></li> <li class="nav-item"><a class="nav-link" href="index.php?action=logout">LogOut</a></li>';
        } else {
            echo '<script> alert("Invalid Password");</script>';
        }
    } else {
        echo '<script> alert("Invalid Email Id");</script>';
    }
}


if (isset($_POST["btn_reg"])) {

    $name = $_POST["reg_full_name"];
    $email = $_POST["reg_email"];
    $cellno = $_POST["reg_number_txt"];
    $gender = $_POST["reg_gender_txt"];
    $paswrd = $_POST["reg_psw"];
    $cnfrm_paswrd = $_POST["psw_repeat"];

    if ($paswrd == $cnfrm_paswrd) {

        $sql = "insert into customer values(0,'$name','$email','$cellno','$gender','$cnfrm_paswrd')";


        $conn->insert($sql, "Customer Registered! Now You can Login");
    } else {
?>
        <script>
            alert("Confirm Password not match");
        </script>
<?php

    }
}
?>
<!doctype html>
<html lang="en">

<head>
    <title>Online Movie Ticket Booking</title>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <link rel="icon" href="Images/Clapperboard.jpeg">
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
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

        section {
            background-image: url('Images/theatre pic.jpeg');
            /* your background image */
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            position: relative;
            padding: 60px 0;
            color: #000;
            /* text color */
        }

        /* Make background slightly lighter but still visible */
        section::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.3);
            /* 0.3 = lighter overlay */
            z-index: 1;
        }

        /* Keep content above overlay */
        section>* {
            position: relative;
            z-index: 2;
        }

        /* Remove default body margin */
        body {
            margin: 0;
            padding: 0;
        }

        .navbar {
            background-color: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            top: 0;
            left: 0;
            width: 100%;
            z-index: 1000;

        }

        .navbar-brand {
            color: #fff !important;
            font-weight: 600;
            letter-spacing: 1px;
        }

        .navbar-nav .nav-link {
            color: #fff !important;
            margin-right: 15px;
            transition: color 0.3s;
        }

        .navbar-nav .nav-link:hover {
            color: #ffc107 !important;
        }

        /* Ensure carousel starts right after navbar */
        #carouselId {
            margin-top: 0 !important;
            padding-top: 0 !important;
        }

        /* Optional: remove extra top padding from section */
        section:first-of-type {
            margin-top: 0 !important;
            padding-top: 0 !important;
        }

        /* 🎬 Dropdown menu styling only */
        .dropdown-menu {
            background-color: rgba(0, 0, 0, 0.8);
            border: 1px solid darkcyan;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 255, 255, 0.2);
            min-width: 180px;
            padding: 0.5rem 0;
            animation: fadeInDown 0.25s ease-in-out;
        }

        /* Menu items */
        .dropdown-item {
            color: azure !important;
            font-weight: 500;
            padding: 10px 20px;
            transition: all 0.3s ease;
        }

        .dropdown-item:hover {
            background-color: darkcyan !important;
            color: white !important;
            border-radius: 6px;
            transform: translateX(4px);
        }

        /* Dropdown arrow color fix */
        .nav-link.dropdown-toggle::after {
            color: cyan !important;
        }

        /* Soft dropdown animation */
        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-8px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Profile dropdown styling */
        .dropdown-menu-right {
            right: 0 !important;
            left: auto !important;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 255, 255, 0.3);
            border: 1px solid rgba(0, 255, 255, 0.4);
        }

        .dropdown-item i {
            margin-right: 8px;
            width: 16px;
            text-align: center;
        }

        .dropdown-divider {
            border-color: rgba(0, 255, 255, 0.3);
        }

        /* Profile icon styling */
        .nav-link .fa-user-circle {
            font-size: 18px;
            margin-right: 5px;
        }

        /* Floating Feedback Button */
        .feedback-floating-btn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #00bcd4 0%, #0097a7 100%);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 20px rgba(0, 188, 212, 0.4);
            z-index: 999;
            transition: all 0.3s ease;
            color: white;
            font-size: 24px;
        }

        .feedback-floating-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 30px rgba(0, 188, 212, 0.6);
        }

        .feedback-floating-btn:active {
            transform: scale(0.95);
        }

        @media (max-width: 768px) {
            .feedback-floating-btn {
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                font-size: 20px;
            }
        }
    </style>

</head>

<body>
    <nav class="navbar navbar-expand-md navbar-dark" style="background-color: #000;">
        <a class="navbar-brand" href="index.php">
            <img src="Images/Clapperboard.jpeg" alt="Logo" style="height: 40px;">
        </a>
        <button class="navbar-toggler d-lg-none" type="button" data-toggle="collapse" data-target="#collapsibleNavId" aria-controls="collapsibleNavId"
            aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="collapsibleNavId">
            <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
                <li class="nav-item"><a class="nav-link" href="index.php">Home</a></li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="dropdownId" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Movies</a>
                    <div class="dropdown-menu" aria-labelledby="dropdownId">
                        <a class="dropdown-item" href="commingsoon.php">Coming Soon</a>
                        <a class="dropdown-item" href="nowshowing.php">Now showing</a>
                    </div>
                </li>

                <li class="nav-item"><a class="nav-link" href="booking.php">Book Ticket</a></li>
                <li class="nav-item"><a class="nav-link" href="about.php">About</a></li>
                <li class="nav-item"><a class="nav-link" href="contact.php">Contact</a></li>
            </ul>
            <ul class="navbar-nav">
                <li class="nav-item" style="margin-right: 10px;">
                    <form class="form-inline" method="GET" action="index.php">
                        <div class="input-group" style="width: 300px;">
                            <input class="form-control" type="search" placeholder="Search movies..." name="search" style="border-radius: 20px 0 0 20px; border: 1px solid #ccc;">
                            <div class="input-group-append">
                                <button class="btn btn-outline-secondary" type="submit" style="border-radius: 0 20px 20px 0; background-color: darkcyan; color: white; border: 1px solid darkcyan;">
                                    <i class="fa fa-search"></i>
                                </button>
                            </div>
                        </div>
                    </form>
                </li>
                <?php if (empty($_SESSION["username"])): ?>
                    <li class="nav-item">
                        <a class="nav-link" data-toggle="modal" data-target="#modelId">Register</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-toggle="modal" data-target="#modelId1">Login</a>
                    </li>
                <?php else: ?>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="profileDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fa fa-user-circle"></i> <?php echo htmlspecialchars(substr($_SESSION["username"], 0, 12)); ?>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="profileDropdown" style="right: 0; left: auto;">
                            <a class="dropdown-item" href="profile.php">
                                <i class="fa fa-user"></i> My Profile
                            </a>
                        
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="index.php?action=logout" style="color: #ff6b6b;">
                                <i class="fa fa-sign-out"></i> Logout
                            </a>
                        </div>
                    </li>
                <?php endif; ?>
            </ul>
        </div>
    </nav>

    <!-- Register Modal -->
    <!-- Register Modal -->
    <div class="modal fade" id="modelId" tabindex="-1" role="dialog" aria-labelledby="modelTitleId" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable" role="document"> <!-- 👈 scrollable added -->
            <div class="modal-content">
                <div class="modal-header" style="background-color:darkcyan; color:black">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form method="post">
                        <div class="container" style="color:#343a40">
                            <center>
                                <h1>Customer Register</h1>
                                <p>Please fill in this form to create an account</p>
                            </center>
                            <hr>
                            <label for="username"><b>Full Name</b></label>
                            <input type="text" style="border-radius: 30px;" placeholder="Enter Your Name" name="reg_full_name" id="username" required>

                            <label for="email"><b>Email</b></label>
                            <input type="email" style="border-radius: 30px;" placeholder="Enter Email" name="reg_email" id="email" required>

                            <label for="number"><b>Cell Number</b></label>
                            <input type="tel" style="border-radius: 30px;" placeholder="Enter Number" name="reg_number_txt" id="number" required>

                            <label><b>Select Gender</b></label><br>
                            <input type="radio" value="male" name="reg_gender_txt" required> Male
                            <input type="radio" value="female" name="reg_gender_txt" style="margin-left:5%;" required> Female
                            <input type="radio" value="others" name="reg_gender_txt" style="margin-left:5%;" required> Others

                            <br><br>

                            <label for="psw"><b>Password</b></label>
                            <input type="password" style="border-radius: 30px;" placeholder="Enter Password" name="reg_psw" id="psw" required>

                            <label for="psw-repeat"><b>Repeat Password</b></label>
                            <input type="password" style="border-radius: 30px;" placeholder="Repeat Password" name="psw_repeat" id="psw-repeat" required>

                            <button type="submit" class="btn" name="btn_reg" style="background-color:darkcyan; color:white">Register</button>
                            <hr>
                        </div>
                        <div class="container">
                            <p>Already have an account?
                                <a data-toggle="modal" data-target="#modelId1" style="color:gray; cursor:pointer;">Log In</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Login Modal -->
    <!-- Login Modal -->
    <div class="modal fade" id="modelId1" tabindex="-1" role="dialog" aria-labelledby="modelTitleId" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable" role="document"> <!-- 👈 scrollable added -->
            <div class="modal-content">
                <div class="modal-header" style="background-color:darkcyan; color:black">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form action="" method="post">
                        <div class="container" style="color: #343a40;">
                            <center>
                                <h1>LogIn</h1>
                            </center>
                            <hr>
                            <label for="email"><b>Email</b></label>
                            <input type="email" style="border-radius: 30px;" placeholder="Enter Email" name="log_email" id="email" required>
                            <label for="psw"><b>Password</b></label>
                            <input type="password" style="border-radius: 30px;" placeholder="Enter Password" name="log_psw" id="psw" required>
                            <button type="submit" name="btn_login" class="btn" style="background-color:darkcyan; color:white">Login</button>
                        </div>
                        <div class="container signin">
                            <p>Don't have an account?
                                <a data-toggle="modal" data-target="#modelId" style="color: gray; cursor:pointer;">Register</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script>
        $(document).ready(function() {
            // Switch from Login to Register
            $('[data-target="#modelId"]').on('click', function(e) {
                $('#modelId1').modal('hide');
                setTimeout(function() {
                    $('#modelId').modal('show');
                }, 400);
            });

            // Switch from Register to Login
            $('[data-target="#modelId1"]').on('click', function(e) {
                $('#modelId').modal('hide');
                setTimeout(function() {
                    $('#modelId1').modal('show');
                }, 400);
            });

            // Auto focus first input when modal is opened
            $('#modelId, #modelId1').on('shown.bs.modal', function() {
                $(this).find('input:first').trigger('focus');
            });
        });
    </script>

    <!-- Floating Feedback Button -->
    <a href="feedback.php" class="feedback-floating-btn" title="Send Feedback">
        <i class="fa fa-comment"></i>
    </a>

</body>

</html>