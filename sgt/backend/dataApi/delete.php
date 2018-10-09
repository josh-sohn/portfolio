<?php

//check if you have all the data you need from the client-side call.  
//if not, add an appropriate error to errors
if ( empty($_GET['student_id']) ){
	$output['errors'][] = "Must include student_id.";
} else {
	$student_id = $_GET['student_id'];
//write a query that deletes the student by the given student ID  
	$query = "DELETE FROM `student_data` WHERE `id`=$student_id";
	$result = null;
//send the query to the database, store the result of the query into $result
	$result = mysqli_query($conn,$query);
//check if $result is empty.  	
	if ( empty($result) ){
	//if it is, add 'database error' to errors
		$output['errors'][] = "Database errors.";
	}
//else:
	else { 
	//check if the number of affected rows is 1
		if ($result) {
		//if it did, change output success to true
			$output['success'] = true;
		} 
	//if not, add to the errors: 'delete error'
		else {
			$output['errors'][] = 'Error with delete.';
		}
	}
}
?>
