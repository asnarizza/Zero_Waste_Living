<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create an Account</title>
    <link rel="stylesheet" href="../public/style.css">
</head>
<body>
    <header>
        <div class="logo">ZERO WASTE LIVING</div>
    </header>
    <main>
        <form action="../Controller/register.php" method="post" enctype="multipart/form-data">
            <h2>Create an Account</h2>
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required>

            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>

            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>

            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>

            <label for="gender">Gender:</label>
            <input type="text" id="gender" name="gender" required>

            <label for="birthDate">Birth Date:</label>
            <input type="date" id="birthDate" name="birthDate" required>

            <label for="image">Profile Image:</label>
            <input type="file" id="image" name="image" required>

            <button type="submit">Create Account</button>
        </form>
    </main>
</body>
</html>