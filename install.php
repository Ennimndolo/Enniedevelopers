<?php
/**
 * EnnieDevelopers Website - Database Installation Script
 * 
 * This script helps with setting up the database for the EnnieDevelopers website.
 * It creates the database and tables if they don't exist.
 */

// Basic settings
$pageTitle = 'EnnieDevelopers Website - Database Installation';
$sqlFile = 'sql/setup.sql';

// Function to output messages
function output_message($message, $type = 'info') {
    $colors = [
        'success' => ['bg' => '#d4edda', 'text' => '#155724'],
        'error' => ['bg' => '#f8d7da', 'text' => '#721c24'],
        'warning' => ['bg' => '#fff3cd', 'text' => '#856404'],
        'info' => ['bg' => '#d1ecf1', 'text' => '#0c5460'],
    ];
    
    $style = isset($colors[$type]) ? $colors[$type] : $colors['info'];
    
    echo "<div style='background-color: {$style['bg']}; color: {$style['text']}; padding: 15px; margin: 15px 0; border-radius: 5px;'>{$message}</div>";
}

// Check if form was submitted
$error = null;
$success = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data
    $host = isset($_POST['host']) ? trim($_POST['host']) : 'localhost';
    $username = isset($_POST['username']) ? trim($_POST['username']) : 'root';
    $password = isset($_POST['password']) ? $_POST['password'] : '';
    $database = isset($_POST['database']) ? trim($_POST['database']) : 'enniedevelopers_db';
    
    // Validate input
    if (empty($host) || empty($username) || empty($database)) {
        $error = 'Host, username, and database name are required.';
    } else {
        try {
            // Connect to MySQL server
            $pdo = new PDO("mysql:host={$host}", $username, $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            ]);
            
            // Check if database exists
            $stmt = $pdo->query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '{$database}'");
            $databaseExists = $stmt->rowCount() > 0;
            
            if (!$databaseExists) {
                // Create database
                $pdo->exec("CREATE DATABASE {$database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
                $success = "Database '{$database}' created successfully.";
            } else {
                $success = "Database '{$database}' already exists.";
            }
            
            // Select database
            $pdo->exec("USE {$database}");
            
            // Check if the SQL file exists
            if (!file_exists($sqlFile)) {
                $error = "SQL file '{$sqlFile}' not found.";
            } else {
                // Read and execute SQL file
                $sql = file_get_contents($sqlFile);
                
                // Split SQL file into individual queries
                $queries = explode(';', $sql);
                
                // Execute each query
                foreach ($queries as $query) {
                    $query = trim($query);
                    
                    if (!empty($query)) {
                        $pdo->exec($query);
                    }
                }
                
                // Update config file
                $configFile = 'php/config.php';
                
                if (file_exists($configFile)) {
                    $config = file_get_contents($configFile);
                    
                    // Replace database configuration
                    $config = preg_replace(
                        '/\$db_config\s*=\s*\[\s*\'host\'\s*=>\s*\'[^\']*\'\s*,\s*\'dbname\'\s*=>\s*\'[^\']*\'\s*,\s*\'user\'\s*=>\s*\'[^\']*\'\s*,\s*\'password\'\s*=>\s*\'[^\']*\'\s*,\s*\'charset\'\s*=>\s*\'[^\']*\'\s*,?\s*\];/',
                        "\$db_config = [\n    'host' => '{$host}',\n    'dbname' => '{$database}',\n    'user' => '{$username}',\n    'password' => '" . addslashes($password) . "',\n    'charset' => 'utf8mb4',\n];",
                        $config
                    );
                    
                    // Write updated config file
                    file_put_contents($configFile, $config);
                    
                    $success .= "<br>Configuration file updated successfully.";
                }
                
                $success .= "<br>Database tables created successfully.";
            }
        } catch (PDOException $e) {
            $error = "Database error: " . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $pageTitle; ?></title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* Basic styles */
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        
        h1 {
            color: #4A6CF7;
            border-bottom: 2px solid #E2E8F0;
            padding-bottom: 10px;
            margin-bottom: 30px;
        }
        
        h2 {
            color: #2D3748;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        
        .container {
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            padding: 30px;
            margin-bottom: 30px;
        }
        
        .step {
            background-color: #F8FAFC;
            border-left: 4px solid #4A6CF7;
            padding: 15px;
            margin-bottom: 20px;
        }
        
        .step-number {
            display: inline-block;
            width: 30px;
            height: 30px;
            background-color: #4A6CF7;
            color: white;
            border-radius: 50%;
            text-align: center;
            line-height: 30px;
            margin-right: 10px;
            font-weight: bold;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
        }
        
        input[type="text"],
        input[type="password"] {
            width: 100%;
            padding: 10px;
            border: 1px solid #E2E8F0;
            border-radius: 5px;
            font-size: 16px;
        }
        
        input[type="text"]:focus,
        input[type="password"]:focus {
            border-color: #4A6CF7;
            outline: none;
            box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
        }
        
        button {
            background-color: #4A6CF7;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        button:hover {
            background-color: #3B55C9;
        }
        
        .note {
            background-color: #FFF3CD;
            border-left: 4px solid #FDCB6E;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
        }
        
        .note strong {
            display: block;
            margin-bottom: 5px;
        }
        
        .success {
            background-color: #D4EDDA;
            border-left: 4px solid #00B894;
            padding: 15px;
            margin: 20px 0;
            color: #155724;
        }
        
        .error {
            background-color: #F8D7DA;
            border-left: 4px solid #FF6B6B;
            padding: 15px;
            margin: 20px 0;
            color: #721C24;
        }
        
        code {
            background-color: #F1F5F9;
            padding: 2px 5px;
            border-radius: 3px;
            font-family: monospace;
        }
        
        .login-info {
            background-color: #D1ECF1;
            border-left: 4px solid #0C5460;
            padding: 15px;
            margin: 20px 0;
            color: #0C5460;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1><i class="fas fa-database"></i> <?php echo $pageTitle; ?></h1>
        
        <?php if ($error): ?>
            <div class="error"><?php echo $error; ?></div>
        <?php endif; ?>
        
        <?php if ($success): ?>
            <div class="success">
                <?php echo $success; ?>
                
                <div class="login-info">
                    <strong>Default Admin Login:</strong><br>
                    Username: <code>admin</code><br>
                    Password: <code>admin123</code><br>
                    <em>Important: Change this password immediately after logging in!</em>
                </div>
                
                <p>
                    <a href="index.html" style="display: inline-block; margin-top: 15px; background-color: #4A6CF7; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">
                        <i class="fas fa-home"></i> Go to Homepage
                    </a>
                    <a href="admin/dashboard.php" style="display: inline-block; margin-top: 15px; margin-left: 10px; background-color: #00B894; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">
                        <i class="fas fa-tachometer-alt"></i> Go to Admin Dashboard
                    </a>
                </p>
            </div>
        <?php else: ?>
            <div class="step">
                <span class="step-number">1</span>
                <strong>Make sure XAMPP is running:</strong> Start Apache and MySQL in XAMPP Control Panel.
            </div>
            
            <div class="step">
                <span class="step-number">2</span>
                <strong>Enter your database connection details:</strong> These are typically the default XAMPP settings.
            </div>
            
            <form method="post">
                <div class="form-group">
                    <label for="host">Database Host:</label>
                    <input type="text" id="host" name="host" value="localhost" required>
                </div>
                
                <div class="form-group">
                    <label for="username">Database Username:</label>
                    <input type="text" id="username" name="username" value="root" required>
                </div>
                
                <div class="form-group">
                    <label for="password">Database Password:</label>
                    <input type="password" id="password" name="password" placeholder="Usually empty for XAMPP">
                </div>
                
                <div class="form-group">
                    <label for="database">Database Name:</label>
                    <input type="text" id="database" name="database" value="enniedevelopers_db" required>
                </div>
                
                <button type="submit">
                    <i class="fas fa-cog"></i> Install Database
                </button>
            </form>
            
            <div class="note">
                <strong>Note:</strong> This script will:
                <ol>
                    <li>Create the database if it doesn't exist</li>
                    <li>Create all required tables</li>
                    <li>Insert sample data</li>
                    <li>Update the configuration file</li>
                </ol>
                <p>If you already have a database with the same name, consider backing it up first.</p>
            </div>
        <?php endif; ?>
    </div>
    
    <div class="container">
        <h2>Manual Installation</h2>
        <p>If the automatic installation doesn't work, you can manually set up the database:</p>
        
        <ol>
            <li>Open phpMyAdmin (http://localhost/phpmyadmin)</li>
            <li>Create a new database called <code>enniedevelopers_db</code></li>
            <li>Select the database and click on the "Import" tab</li>
            <li>Click "Browse" and select the file <code>sql/setup.sql</code></li>
            <li>Click "Go" to import the SQL file</li>
            <li>Edit the file <code>php/config.php</code> to match your database settings</li>
        </ol>
    </div>
</body>
</html>