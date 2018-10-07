<?php

$studentId=$_POST['student_id'];

if(isset($studentId)){
$sql="DELETE FROM `student_data` WHERE `id`='{$studentId}'";
$result = mysqli_query($conn,$sql);
if(empty($result)){
	$output['errors'][]='database errors';
}else if(mysqli_affected_rows($conn)===1){
	$output['success']=true;
	
	
}else{
	$output['errors'][]='delete error';
}

}else{
	$output['errors']="Student id is not present";
}

//check if you have all the data you need from the client-side call.  
//if not, add an appropriate error to errors

//write a query that deletes the student by the given student ID  

//send the query to the database, store the result of the query into $result


//check if $result is empty.  
	//if it is, add 'database error' to errors
//else: 
	//check if the number of affected rows is 1
		//if it did, change output success to true
		
	//if not, add to the errors: 'delete error'

?>