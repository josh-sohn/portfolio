<?php
 header("Access-Control-Allow-Origin: *");
define('fromData',true);

if(empty($_GET['action'] /* check if the get superglobal variable 'action' is empty*/)){
	exit('no action specified');
}
require 'mysql_connect.php';
//require the mysql_connect.php file.  Make sure your properly configured it!


$output = [
	'success'=> false, //we assume we will fail
	'errors'=>[]
];

switch($_GET['action'] /*do a comparison switch on the get superglobal action*/){

	case 'readAll':
	 
		//include the php file 'read.php'
		include 'dataApi/read.php';
		break;
	case 'insert':
		//include the php file insert.php
		include 'dataApi/insert.php';
		break;
	case 'delete':
		//include the php file delete.php
		include 'dataApi/delete.php';
		break;
	case 'update':
		//include the update.php file
		include 'dataApi/update.php';
		break;
	case 'signUp':
	   include 'dataApi/signup.php';
	   break;
	case 'login':
	   include 'dataApi/login.php';
	   break;
}

//convert the $output variable to json, store the result in $outputJSON
  $outputJSON=json_encode($output);
//print $outputJSON
print_r($outputJSON);

//end

?>