<?php
include("header.php");

// Handle feedback submission
if (isset($_POST["submit_feedback"])) {
    $name = $_POST["feedback_name"];
    $email = $_POST["feedback_email"];
    $phone = $_POST["feedback_phone"];
    $message = $_POST["feedback_message"];
    $rating = $_POST["feedback_rating"];
    
    $sql = "INSERT INTO feedback (name, email, phone, message, rating, submitted_date) VALUES ('$name', '$email', '$phone', '$message', '$rating', NOW())";
    
    if ($conn->conn->query($sql) === TRUE) {
        echo '<script>alert("Thank you! Your feedback has been submitted successfully."); window.location.href="index.php";</script>';
    } else {
        echo '<script>alert("Error submitting feedback. Please try again.");</script>';
    }
}
?>

<style>
    body {
        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
        min-height: 100vh;
        color: #fff;
        margin: 0;
        padding: 0;
    }

    .feedback-container {
        max-width: 700px;
        margin: 40px auto 30px;
        background: rgba(0, 0, 0, 0.7);
        border: 2px solid darkcyan;
        border-radius: 15px;
        padding: 40px;
        box-shadow: 0 8px 32px rgba(0, 255, 255, 0.2);
    }

    .feedback-header {
        text-align: center;
        margin-bottom: 30px;
        border-bottom: 2px solid darkcyan;
        padding-bottom: 20px;
    }

    .feedback-header h1 {
        color: #00bcd4;
        font-size: 2.5rem;
        margin: 0;
        text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
    }

    .feedback-header p {
        color: #aaa;
        margin: 10px 0 0 0;
        font-size: 1rem;
    }

    .form-group {
        margin-bottom: 25px;
    }

    label {
        display: block;
        margin-bottom: 8px;
        color: #00bcd4;
        font-weight: 600;
        font-size: 0.95rem;
    }

    input[type="text"],
    input[type="email"],
    input[type="tel"],
    textarea,
    select {
        width: 100%;
        padding: 12px 15px;
        border: 1px solid darkcyan;
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
        border-radius: 8px;
        font-size: 0.95rem;
        font-family: inherit;
        transition: all 0.3s ease;
    }

    input[type="text"]:focus,
    input[type="email"]:focus,
    input[type="tel"]:focus,
    textarea:focus,
    select:focus {
        background: rgba(255, 255, 255, 0.15);
        border-color: #00bcd4;
        box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
        outline: none;
    }

    textarea {
        resize: vertical;
        min-height: 150px;
    }

    select {
        cursor: pointer;
    }

    .rating-group {
        display: flex;
        gap: 10px;
        margin-top: 10px;
    }

    .rating-option {
        flex: 1;
    }

    .rating-option input[type="radio"] {
        display: none;
    }

    .rating-option label {
        display: block;
        padding: 12px;
        text-align: center;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid darkcyan;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-bottom: 0;
        font-weight: 600;
    }

    .rating-option input[type="radio"]:checked + label {
        background: darkcyan;
        color: #000;
        transform: scale(1.05);
    }

    .button-group {
        display: flex;
        gap: 10px;
        margin-top: 30px;
    }

    .btn-submit,
    .btn-cancel {
        flex: 1;
        padding: 12px 20px;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
        text-align: center;
    }

    .btn-submit {
        background: linear-gradient(135deg, #00bcd4 0%, #0097a7 100%);
        color: white;
    }

    .btn-submit:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 188, 212, 0.4);
    }

    .btn-cancel {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
        border: 1px solid darkcyan;
    }

    .btn-cancel:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    .info-box {
        background: rgba(0, 188, 212, 0.1);
        border-left: 3px solid darkcyan;
        padding: 15px;
        margin-bottom: 25px;
        border-radius: 5px;
        color: #aaa;
        font-size: 0.9rem;
    }

    @media (max-width: 768px) {
        .feedback-container {
            margin: 20px 15px;
            padding: 25px;
        }

        .feedback-header h1 {
            font-size: 1.8rem;
        }

        .rating-group {
            flex-wrap: wrap;
        }

        .rating-option {
            flex: 1 1 calc(25% - 8px);
        }
    }
</style>

<div class="feedback-container">
    <div class="feedback-header">
        <h1>Feedback Form</h1>
        <p>We'd love to hear from you! Share your experience with us.</p>
    </div>

    <div class="info-box">
        <i class="fa fa-info-circle"></i> Your feedback helps us improve our services and provide you with a better movie booking experience.
    </div>

    <form method="POST" action="">
        <div class="form-group">
            <label for="name">Full Name *</label>
            <input type="text" id="name" name="feedback_name" placeholder="Enter your full name" required>
        </div>

        <div class="form-group">
            <label for="email">Email Address *</label>
            <input type="email" id="email" name="feedback_email" placeholder="Enter your email" required>
        </div>

        <div class="form-group">
            <label for="phone">Phone Number</label>
            <input type="tel" id="phone" name="feedback_phone" placeholder="Enter your phone number (optional)">
        </div>

        <div class="form-group">
            <label>How would you rate your experience? *</label>
            <div class="rating-group">
                <div class="rating-option">
                    <input type="radio" id="rating1" name="feedback_rating" value="5" required>
                    <label for="rating1">⭐ Excellent</label>
                </div>
                <div class="rating-option">
                    <input type="radio" id="rating2" name="feedback_rating" value="4" required>
                    <label for="rating2">😊 Good</label>
                </div>
                <div class="rating-option">
                    <input type="radio" id="rating3" name="feedback_rating" value="3" required>
                    <label for="rating3">😐 Average</label>
                </div>
                <div class="rating-option">
                    <input type="radio" id="rating4" name="feedback_rating" value="1" required>
                    <label for="rating4">😞 Poor</label>
                </div>
            </div>
        </div>

        <div class="form-group">
            <label for="message">Your Feedback *</label>
            <textarea id="message" name="feedback_message" placeholder="Please share your thoughts, suggestions, or complaints..." required></textarea>
        </div>

        <div class="button-group">
            <button type="submit" name="submit_feedback" class="btn-submit">
                <i class="fa fa-paper-plane"></i> Submit Feedback
            </button>
            <a href="index.php" class="btn-cancel">
                <i class="fa fa-times"></i> Cancel
            </a>
        </div>
    </form>
</div>

<div style="height: 50px;"></div>

<?php include("footer.php"); ?>
