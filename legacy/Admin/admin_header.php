<?php
require_once("../conn.php");
// determine cinema name for this admin (if any)
$adminCinemaName = '';
if (!empty($_SESSION["admin_cinema_id"]) && $_SESSION["admin_cinema_id"] > 0) {
    $connTemp = new connec();
    $res = $connTemp->select('cinema', $_SESSION['admin_cinema_id']);
    if ($res && $row = $res->fetch_assoc()) {
        $adminCinemaName = $row['name'];
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
    </style>

</head>

<body>
    <nav class="navbar navbar-expand-md navbar-dark" style="background-color:#000;">
        <a class="navbar-brand d-flex align-items-center" href="dashboard.php">
            <img src="../Images/Clapperboard.jpeg" alt="Logo" style="height: 40px; margin-right:10px;">
            <span style="font-size:20px; font-weight:600;">Admin Panel<?php if(
    !empty($adminCinemaName)
): ?> - <?php echo htmlspecialchars($adminCinemaName); ?><?php endif; ?></span>
        </a>

        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navMenu">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse justify-content-end" id="navMenu">
            <ul class="navbar-nav">
                <?php if (!empty($_SESSION["admin_username"])): ?>
                    <li class="nav-item">
                        <a class="nav-link" href="logout.php">Logout</a>
                    </li>
                <?php endif; ?>
            </ul>
        </div>
    </nav>