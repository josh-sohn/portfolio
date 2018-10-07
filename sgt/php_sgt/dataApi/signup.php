<?php
$username=$_POST['username'];
$email=$_POST['email'];
$password=hash("sha256",$_POST['email']);
$password=hash("sha256",$password);

if(isset($username) && isset($email) && isset($password)){
    $password=hash("sha256",$password);
    $sql="INSERT INTO `user`(`user_id`, `user_email`, `password`, `user_name`) VALUES (null,'{$email}','{$password}','{$username}')"; 
    $result=mysqli_query($conn,$sql);
   if(empty($result)){
       $output['error']=mysqli_error($conn);
       $output['error'][]='email already in use';
   }else if(mysqli_affected_rows($conn)===1){
       $output['success']=true;
       $output['data']=$email;
   }
}else{
    $output['error']='Missing inputs';
}
?>