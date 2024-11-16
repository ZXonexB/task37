<?php
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'task35';
$username = 'root';
$password = '';

$itemsPerPage = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$offset = ($page - 1) * $itemsPerPage;

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get total number of records
    $countSql = "SELECT COUNT(*) FROM contacts";
    $countStmt = $pdo->query($countSql);
    $totalRecords = $countStmt->fetchColumn();

    // Get paginated data
    $sql = "SELECT * FROM contacts ORDER BY id ASC LIMIT :limit OFFSET :offset";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':limit', $itemsPerPage, PDO::PARAM_INT);
    $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'totalRecords' => $totalRecords,
        'itemsPerPage' => $itemsPerPage,
        'currentPage' => $page,
        'data' => $data
    ]);

} catch(PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

$pdo = null;
?>