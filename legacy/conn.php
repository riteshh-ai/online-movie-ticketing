<?php
class connec
{
    public $username = "root";
    public $password = "";
    public $server_name = "localhost";
    public $db_name = "movie_ticket_booking";

    public $conn;


    function __construct()
    {
        $this->conn = new mysqli($this->server_name, $this->username, $this->password, $this->db_name);
        if ($this->conn->connect_error) {
            die("Connection Failed");
        }
    }

    function select_all($table_name)
    {
        $sql = "SELECT * FROM `$table_name`";
        $result = $this->conn->query($sql);


        return $result;
    }




    function select_show_dt()
    {
        $sql = "SELECT
    movie_ticket_booking.show.id,
    movie_ticket_booking.show.show_date,
    movie_ticket_booking.show.ticket_price,
    movie_ticket_booking.show.no_seat,
    movie_ticket_booking.show.movie_id,
    movie.name AS 'movie_name',
    show_time.time,
    cinema.name
FROM
    movie_ticket_booking.show,
    movie,
    show_time,
    cinema
WHERE
    movie_ticket_booking.show.movie_id = movie.id
    AND movie_ticket_booking.show.show_time_id = show_time.id
    AND movie_ticket_booking.show.cinema_id = cinema.id";


        $result = $this->conn->query($sql);
        return $result;
    }


    function select_movie($table_name, $date)
    {
        if ($date == "comingsoon") {
            $sql = "SELECT * FROM $table_name where rel_date > row";
            $result = $this->conn->query($sql);
            return $result;
        } else {
            $sql = "SELECT * FROM $table_name where rel_date <= CURDATE() AND DATE_ADD(rel_date, INTERVAL 1 MONTH) > CURDATE() ORDER BY rel_date DESC";
            $result = $this->conn->query($sql);
        }


        return $result;
    }



    function select_by_query($query)
    {
        $result = $this->conn->query($query);
        return $result;
    }


    function select($table_name, $id)
    {
        $sql = "SELECT * FROM `$table_name` where id=$id";
        $result = $this->conn->query($sql);
        return  $result;
    }

    function select_login($table_name, $email)
    {
        $sql = "SELECT * FROM `$table_name` where email='$email'";
        $result = $this->conn->query($sql);
        return  $result;
    }

    function insert($query, $msg)
    {
        if ($this->conn->query($query) === TRUE) {
            echo '<script> alert("' . $msg . '");</script>';
        } else {
            echo '<script> alert("' . $this->conn->error . '");</script>';
        }
    }

    function update($query, $msg)
    {
        if ($this->conn->query($query) === TRUE) {
            echo '<script> alert("' . $msg . '");</script>';
        } else {
            echo '<script> alert("' . $this->conn->error . '");</script>';
        }
    }

    function delete($table_name, $id)
    {
        $query = "Delete from `$table_name` WHERE id =$id";
        if ($this->conn->query($query) === TRUE) {
            echo '<script> alert("Record Deleted");</script>';
        } else {
            echo '<script> alert("' . $this->conn->error . '");</script>';
        }
    }


    function insert_lastid($query)
    {
        $last_id = 0;
        if ($this->conn->query($query) === TRUE) {
            $last_id = $this->conn->insert_id;
        } else {
            echo '<script> alert("' . $this->conn->error . '");</script>';
        }
        return $last_id;
    }
}






