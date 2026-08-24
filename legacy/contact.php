<?php
include("header.php");

if (isset($_POST['btn_submit'])) {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $no = $_POST['number'];
    $messg = $_POST['message'];


    $sql = "insert into contact values(0,'$name','$email','$no','$messg',now())";
    $conn = new connec();

    $conn->insert($sql, "We will contact you soon on your email address.");
}
?>





<section style="min-height: 450px;">
    <div class="container">
        <div class=" col-md-12" style="margin-top: 20px; text-align: center; color:beige;">
            <center>
                <h1>Contact Us</h1>
                <h5>GET IN TOUCH</h5>
                <p>We'd love to talk about how we can work together. Send us a message below and we'll respond as soon as possible</p>
            </center>
        </div>
        <div class="row" style="color: white;">
            <div class="col-md-6 mt-5 mb-5 pl-5" style="border-radius: 30px; background-color:#343a40;">
                <h2 class="mt-5">Contact Information</h2>
                <p class="mt-1">Our Team will get back to you within 24 hours</p>

                <p class="mt-5"><i class="fa fa-phone fa-2x mt-3"> </i>&nbsp;01-4316254</p>
                <p class="mt-3"><i class="fa fa-envelope fa-2x mt-3"> </i>&nbsp; movieticket@live.com</p>
                <p class="mt-3"><i class="fa fa-map-marker fa-2x mt-3"> </i>&nbsp; movieticket@live.com</p>

                <h2 class="mt-5">Join Us</h2>
                <div class="md-5">
                    <a href="#" class="mt-5 " style="color: white;"><i class="fa fa-facebook-square fa-2x mt-3"></i></a>
                    <a href="#" class="mt-5 ml-3 " style="color: white;"><i class="fa fa-twitter-square fa-2x mt-3"></i></a>
                    <a href="#" class="mt-5 ml-3 " style="color: white;"><i class="fa fa-instagram fa-2x mt-3"></i></a>
                    <a href="#" class="mt-5 ml-3 " style="color: white;"><i class="fa fa-linkedin-square fa-2x mt-3"></i></a>
                </div>
            </div>
            <div class="col-md-6">
                <form method="post">
                    <div class="container" style="color:azure;">



                        <label for="username"><b>Your Name</b></label>
                        <input type="text" style="border: radius 30px;" placeholder="Enter Name" name="name" id="username" required>

                        <label for="email"><b>Email</b></label>
                        <input type="email" style="border: radius 30px;" placeholder="Enter Email" name="email" id="email" required>


                        <label for="number"><b>Number</b></label>
                        <input type="tel" style="border: radius 30px;" placeholder="Enter Number" name="number" id="number" required>

                        <label for="message"><b>Message</b></label>
                        <textarea name="message" id="message" rows="6" style="resize:none"></textarea>
                        <button type="submit" name="btn_submit" class="btn " style="background-color:darkcyan; color:white">Send Message</button>

                        <hr>
                    </div>



                </form>
            </div>

        </div>
    </div>
</section>


<?php
include("footer.php");
?>