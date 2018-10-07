<?php

$id=$_POST['student_id'];
$name=$_POST['name'];
$course=$_POST['course'];
$grade=$_POST['grade'];
//check if you have all the data you need from the client-side call.  This should include the fields being changed and the ID of the student to be changed
//if not, add an appropriate error to errors
if(isset($id)&& isset($grade)&& isset($name)&& isset($course)){
	$sql="UPDATE `student_data` SET `name`='{$name}',`grade`='{$grade}',`course`='{$course}' WHERE `id`='{$id}' ";
	$result = mysqli_query($conn,$sql);
	if(empty($result)){
		$output['errors'][]='database errors';
	}else if(mysqli_affected_rows($conn)===1){
		$output['success']=true;
		
		
	}else{
		$output['errors'][]='update error';
	}
}else{
	$output['errors'][]="missing input";
}

//write a query that updates the data at the given student ID.  

//send the query to the database, store the result of the query into $result


//check if $result is empty.  
	//if it is, add 'database error' to errors
//else: 
	//check if the number of affected rows is 1.  Please note that if the data updated is EXCACTLY the same as the original data, it will show a result of 0
		//if it did, change output success to true
	//if not, add to the errors: 'update error'

?>