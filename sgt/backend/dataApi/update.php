<?php
if ( empty($_GET['student_id']) || empty($_GET['name']) || empty($_GET['course']) || empty($_GET['grade']) ){
		$output['errors'][] = 'Need to have id, name, course, and grade in data.';
	}

$query = "UPDATE `student_data` SET `name`='{$_GET['name']}',`grade`={$_GET['grade']},`course`='{$_GET['course']}' WHERE `id`={$_GET['student_id']}";
$result = mysqli_query($conn, $query);

if ( empty($result) ){
	$output['errors'][] = 'Database error.';
}
else {
	if ($result) {
		$output['success'] = true;
	} 
	else {
		$output['errors'][] = 'Error with delete.';
	}
}