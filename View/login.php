<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="../public/style.css">
</head>
<body>
    <header>
        <div class="logo">ZERO WASTE LIVING</div>
    </header>
    <main>
        <form action="../Controller/login.php" method="post">
            <h2>Login</h2>
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
            <button type="submit">Log in</button>
        </form>
    </main>
</body>
</html>