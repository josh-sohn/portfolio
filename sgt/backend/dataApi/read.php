<?php

//write a query that selects all the students from the database, all the data from each row
$query = "SELECT * FROM `student_data`";
$result = null;
//send the query to the database, store the result of the query into $result
$result = mysqli_query( $conn, $query );

//check if $result is empty.  
if ( empty($result) ) {
	//if it is, add 'database error' to errors
	$output['errors'][] = 'Database error.';
} 
//else:
else { 
	//check if any data came back
	if ( mysqli_num_rows($result) > 0 ) {
		$output['data']=[];
		//if it did, change output success to true
		$output['success'] = true;
		//do a while loop to collect all the data
		while ( $row = mysqli_fetch_assoc($result) ) {
			//Casts id and grade as integers
			$row['id'] = (int) $row['id'];
			$row['grade'] = (int) $row['grade'];
			//add each row of data to the $output['data'] array
			$output['data'][] = $row;
		}
	}
	//if not, add to the errors: 'no data'
	else {
		$output['errors'][] = 'No data.';
	}
}
?>