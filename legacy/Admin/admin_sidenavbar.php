<style>
    /*:root {
        --NAV_HEIGHT: 100px;
    }

    .sidebar-nav {
        background-color: #111;
        padding: 20px 0;
        min-height: calc(100vh - var(--NAV_HEIGHT));
        /* fills to page bottom 
        overflow-y: auto;
        box-shadow: 2px 0 6px rgba(0, 0, 0, 0.3);
    }

    /* Keep sidebar visually full-height when inside a taller container 
    .sidebar-nav .nav-link {
        color: #fff !important;
        padding: 12px 20px;
        border-left: 4px solid transparent;
        transition: all 0.18s ease;
        display: block;
        font-weight: 500;
    }

    .sidebar-nav .nav-link:hover {
        background-color: rgba(128, 0, 0, 0.15);
        border-left-color: maroon;
        padding-left: 28px;
        color: #fff !important;
    }

    .sidebar-nav .nav-link.active {
        background-color: rgba(128, 0, 0, 0.25);
        border-left-color: maroon;
    }

    /* Make sure the parent col doesn't collapse if you have short content 
    .fix-sidebar-col 
        padding: 0;
    }*/
</style>

<ul class="navbar-nav mr-auto mt-2 mt-lg-0 ml-5">
    <li class="nav-item">
        <a class="nav-link" href="dashboard.php" style="color: white;">Dashboard</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="viewbooking.php" style="color: white;">Movie Booking</a>
    </li>

    <?php if (empty($_SESSION['admin_cinema_id']) || $_SESSION['admin_cinema_id'] == 0): ?>
    <li class="nav-item">
        <a class="nav-link" href="viewadmin.php" style="color: white;">Admins</a>
    </li>

    <li class="nav-item">
        <a class="nav-link" href="viewcinema.php" style="color: white;">Cinema</a>
    </li>

    <li class="nav-item">
        <a class="nav-link" href="viewcontact.php" style="color: white;">Contact</a>
    </li>

    <li class="nav-item">
        <a class="nav-link" href="viewcustomer.php" style="color: white;">Customer</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="viewfeedback.php" style="color: white;">Feedback</a>
    </li>
    <?php endif; ?>

    <li class="nav-item">
        <a class="nav-link" href="viewgenre.php" style="color: white;">Movie Genre</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="viewindustry.php" style="color: white;">Movie Industry</a>
    </li>

    <li class="nav-item">
        <a class="nav-link" href="viewlanguage.php" style="color: white;">Movie Language</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="viewmovie.php" style="color: white;">Movie</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="viewseat_details.php" style="color: white;">Seat Details</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="viewseat_reserved.php" style="color: white;">Seat Reserved</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="viewshow.php" style="color: white;">Movie Show</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="viewshowtime.php" style="color: white;">Movie Show Time</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="viewslider.php" style="color: white;">Slider</a>
    </li>

</ul>