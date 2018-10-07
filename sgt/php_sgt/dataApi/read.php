<?php

//write a query that selects all the students from the database, all the data from each row
$sql="SELECT * FROM `student_data`";

$result=mysqli_query($conn,$sql);
//send the query to the database, store the result of the query into $result


//check if $result is empty. 
if(empty($result)){
	//if it is, add 'database error' to errors
	$output['errors'][]='database error';
	
} else{
//else: 
	
	//check if any data came back
	if(mysqli_num_rows($result)>0){
			$output['success']=true;
			$output['data']=[];
		while($row=mysqli_fetch_assoc($result)){
			
		$output['data'][]=$row;
		}

			//if it did, change output success to true
				//do a while loop to collect all the data 
					//add each row of data to the $output['data'] array
			//if not, add to the errors: 'no data'
			}else{
				$output['errors'][]='no Data';
		}
	}
	
	


?>