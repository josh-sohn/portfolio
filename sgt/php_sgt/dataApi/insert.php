<?php

$name=$_POST['name'];
$course=$_POST['course'];
$grade=$_POST['grade'];

//check if you have all the data you need from the client-side call.  
if(isset($name) && isset($course) && isset($grade)){
   $sql="INSERT INTO `student_data`(`name`,`grade`,`course`) VALUES ('{$name}','{$grade}','{$course}')";
   $result = mysqli_query($conn,$sql);
   if(empty($result)){
	   $output['errors'][]='database errors';
   }else if(mysqli_affected_rows($conn)===1){
	   $output['success']=true;
	    $output['insertID']=mysqli_insert_id($conn);
   }else{
	   $output['errors'][]='insert error';
   }

}else{

	$output['errors'][]="blaahhhh";
}

//if not, add an appropriate error to errors

//write a query that inserts the data into the database.  remember that ID doesn't need to be set as it is auto incrementing

//send the query to the database, store the result of the query into $result


//check if $result is empty.  
	//if it is, add 'database error' to errors
//else: 
	//check if the number of affected rows is 1
		//if it did, change output success to true
		//get the insert ID of the row that was added
		//add 'insertID' to $outut and set the value to the row's insert ID
	//if not, add to the errors: 'insert error'

?>