# Online-Movie-Ticket-Booking
My first project using php mysql

## New Features (Feb 2026)
To support cinema‑specific administrators the database now includes an `admin_users` table. Run the following SQL after creating your schema:

```sql
CREATE TABLE `admin_users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `cinema_id` INT NOT NULL,
    FOREIGN KEY (`cinema_id`) REFERENCES `cinema`(`id`) ON DELETE CASCADE
);

-- sample entries for the cinemas mentioned in the ticket:
INSERT INTO admin_users (username,email,password,cinema_id) VALUES
('cinebliss','cinebliss@example.com','pass123', 1),
('cinema_grand','grand@example.com','grandpwd',2),
('dreamscape','dream@example.com','dreampwd',3),
('cineplus','plus@example.com','pluspwd',4),
('nueplex','nueplex@example.com','nuepwd',5),
('cinelucky','lucky@example.com','luckypwd',7);
```

Adjust user names/passwords as desired. The default super‑admin remains `admin@gmail.com` / `admin1234` and has access to all cinemas.

Admin panel pages now restrict bookings and show selections to the cinema associated with the logged‑in admin. Super‑admins can manage the list of cinema admins via the new **Admins** section in the sidebar.

