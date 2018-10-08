/* information about jsdocs: 
* param: http://usejsdoc.org/tags-param.html#examples
* returns: http://usejsdoc.org/tags-returns.html
* 
/**
 * Listen for the document to load and initialize the application
 */
document.addEventListener('DOMContentLoaded', initializeApp);

/**
 * Define all global variables here.  
 * 
 
 */
/***********************
 * student_array - global array to hold student objects
 * @type {Array}
 * example of student_array after input: 
 * student_array = [
 *  { name: 'Jake', course: 'Math', grade: 85 },
 *  { name: 'Jill', course: 'Comp Sci', grade: 85 }
 * ];
 */
let student_array=[];

/***************************************************************************************************
* initializeApp 
* @params {undefined} none
* @returns: {undefined} none
* initializes the application, including adding click handlers and pulling in any data from the server, in later versions
*/
function initializeApp(){
addClickHandlersToElements();
serverCall("serverCall");
login();
signUp();
}

/***************************************************************************************************
* addClickHandlerstoElements
* @params {undefined} 
* @returns  {undefined}
*     
*/
function addClickHandlersToElements(){

      document.getElementById("add").addEventListener("click",handleAddClicked);
      document.getElementById("cancel").addEventListener("click",handleCancelClick);
      

      
}

/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param {object} event  The event object from the click
 * @return: 
       none
 */
function handleAddClicked(event){
   
      let studentArray=getStudentFormValue(); 
      const createStudent=true;
      addStudent(studentArray.student.value,studentArray.course.value
                ,parseFloat(studentArray.grade.value),null,createStudent);

}
/***************************************************************************************************
 * handleCancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearAddStudentFormInputs
 */
function handleCancelClick(){
      let studentArray=getStudentFormValue();
      for(a in studentArray){
            studentArray[a].classList.remove("error");
      }
      clearAddStudentFormInputs();
}
/***************************************************************************************************
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 * @param {undefined} none
 * @return undefined
 * @calls clearAddStudentFormInputs, updateStudentList
 */
function getStudentFormValue(){
      let studentArray={
            student:document.getElementById("studentName"),
            course:document.getElementById("course"),
            grade:document.getElementById("studentGrade")
        }
        return studentArray;
}
function addStudent(studentName,courseType,studentGrade,idNumber,createStudent){
  let studentArray=getStudentFormValue(); 
  if(studentName.trim()!="" && courseType.trim()!="" && studentGrade!="" && !isNaN(studentGrade)){
        
      for(a in studentArray){
                  studentArray[a].classList.remove("error");
            }    
    const student ={ name: studentName, course: courseType, grade: studentGrade,id:idNumber };
    const crud={crudName:"createStudent",newstudent:student};
    student_array.push(student);
    
    if(createStudent){
      serverCall(crud);
    }
    updateStudentList(student);
    clearAddStudentFormInputs();
  }
  else{
      for(a in studentArray){
            studentArray[a].classList.remove("error");
      }
        for(a in studentArray){
            if(studentArray[a].value.trim()==""){
                 studentArray[a].classList.add("error");
           }
        };
  }
 }

/***************************************************************************************************
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentFormInputs(){
      let studentName= document.getElementById("studentName").value="";
      let course =document.getElementById("course").value="";
      let studentGrade=document.getElementById("studentGrade").value="";
}
/***************************************************************************************************
 * renderStudentOnDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param {object} studentObj a single student object with course, name, and grade inside
 */
function renderStudentOnDom(newStudent){

      const outer_tr =document.createElement("tr");
      const inner_td_name =document.createElement("td");
      let inner_td_text=document.createTextNode(newStudent.name);
      inner_td_name.appendChild(inner_td_text);

      const inner_td_course = document.createElement("td");
      let inner_td_course_text= document.createTextNode(newStudent.course);
      inner_td_course.appendChild(inner_td_course_text);

      const inner_td_grade = document.createElement("td");
      let inner_td_grade_text= document.createTextNode(newStudent.grade);
      inner_td_grade.appendChild(inner_td_grade_text);

      const inner_td_button =document.createElement("td");

      const buttonUpdate =document.createElement("button");
      buttonUpdate.className='btn btn-success update';
      const button_text_update=document.createTextNode('Update');
      buttonUpdate.appendChild(button_text_update);
      inner_td_button.appendChild(buttonUpdate);

      const buttonDelete =document.createElement("button");
      buttonDelete.className='btn btn-danger delete';
      const button_text=document.createTextNode('Delete');
      buttonDelete.appendChild(button_text);
      inner_td_button.appendChild(buttonDelete);
      

      outer_tr.appendChild(inner_td_name);
      outer_tr.appendChild(inner_td_course);
      outer_tr.appendChild(inner_td_grade);
      outer_tr.appendChild(inner_td_button);

      document.querySelector(".student-list tbody").appendChild(outer_tr);
      updateButton(buttonUpdate,newStudent);
      deleteButton(buttonDelete,newStudent);
     
}


/***************************************************************************************************
 * updateStudentList - centralized function to update the average and call student list update
 * @param students {array} the array of student objects
 * @returns {undefined} none
 * @calls renderStudentOnDom, calculateGradeAverage, renderGradeAverage
 */
function updateStudentList(student){
      renderStudentOnDom(student);
      renderGradeAverage(calculateGradeAverage(student_array));

  
}
/***************************************************************************************************
 * calculateGradeAverage - loop through the global student array and calculate average grade and return that value
 * @param: {array} students  the array of student objects
 * @returns {number}
 */
function calculateGradeAverage(array){

let studentGradeSum= null;
array.map(student=>{
     studentGradeSum+= parseFloat(student.grade);
})

 let studentGradeAverage = parseFloat(studentGradeSum/array.length);
 return studentGradeAverage;
}
/***************************************************************************************************
 * renderGradeAverage - updates the on-page grade average
 * @param: {number} average    the grade average
 * @returns {undefined} none
 */
function renderGradeAverage(number){
      let avgGrade= document.getElementsByClassName("avgGrade");
   
      for(let x=0;x<avgGrade.length;x++){
            avgGrade[x].innerText=number.toFixed(2);
      }
     
    
}
function deleteButton(button,student){
      button.addEventListener("click",function(){
            const element=this;
            const deleteModal=document.querySelector(".deleteModal");
            let name = document.querySelector(".DeleteName").value=student.name;
            let course = document.querySelector(".DeleteCourse").value=student.course;
            let grade = document.querySelector(".DeleteGrade").value=student.grade;
            deleteModal.classList.remove("hide");
            deleteModal.classList.add("show");
            confirmDeleteModal(element,student);

            
          
            

      });
}
function confirmDeleteModal(element,student){
      let deleteAjax= document.querySelector(".DeleteAjax");
      deleteAjax.addEventListener("click",()=>{
            const crud={deleteStudent:student,crudName:"deleteStudent"};
            removeStudent(student,element);
            serverCall(crud);
            deleteModalHide();
      });
      let deleteCancel_modal=document.querySelector(".cancelDelete");
      deleteCancel_modal.addEventListener("click",()=>{
            deleteModalHide()
      });
      
}
function deleteModalHide(){
      const deleteModal=document.querySelector(".deleteModal");
      deleteModal.classList.add("hide");     
      deleteModal.classList.remove("show");
      
}
function cancelModal(){
      let modal=document.getElementsByClassName("modal")[0];
            
            modal.classList.add("hide");
            modal.classList.remove("show");
}
function updateButton(button,student){
      
      button.addEventListener("click",()=>{
          
            let name = document.querySelector(".updateName").value=student.name;
            let course = document.querySelector(".updateCourse").value=student.course;
            let grade = document.querySelector(".updateGrade").value=student.grade;
            let modal=document.getElementsByClassName("modal")[0];
            
            modal.classList.remove("hide");
            modal.classList.add("show");
            let updateAjax= document.querySelector(".updateAjax");
           updateAjax.addEventListener("click",function ajax(){
                 updateStudent(student);
                 updateAjax.removeEventListener("click",ajax);
           });
           let cancel_modal=document.querySelector(".cancelModal");
           cancel_modal.addEventListener("click",()=>{
                 cancelModal()
           });

           
            

          
           
            

      });
     
}

function updateStudent(student){
      
      let name = document.querySelector(".updateName").value;
      let course = document.querySelector(".updateCourse").value;
      let grade = document.querySelector(".updateGrade").value;
      const crud={name,course,grade,id:student.id,crudName:"updateStudent"};
      let modal=document.getElementsByClassName("modal")[0];
      modal.classList.remove("show");
      modal.classList.add("hide");
      serverCall(crud);

}
function removeStudent(studentDeleted,element){
  let location=student_array.indexOf(studentDeleted);
  student_array.splice(location,1);
  element.parentNode.parentNode.remove();
  
}

function serverCall(crud){
      let dataPull;
      switch(crud.crudName){

      case "deleteStudent":
            dataPull={
            
                  url:"php_sgt/data.php?action=delete",
                  method:'POST',
                  dataType:'json',
                  data:`api_key=ToxPuUbzst&student_id=${crud.deleteStudent.id}`,
                      
                  success:deleteStudent
            }
            ajaxCall(dataPull)
            break;

      case "createStudent":
             dataPull={
                  url:"php_sgt/data.php?action=insert",
                  method:'POST',
                  dataType:'json',
                  data:`api_key=ToxPuUbzst&name=${crud.newstudent.name}&course=${crud.newstudent.course}&grade=${crud.newstudent.grade}`,
                        
                        
                  success:createStudent
            }
            ajaxCall(dataPull)
            break;
      case "updateStudent":
      
            dataPull={
            url:"php_sgt/data.php?action=update",
            method:'POST',
            dataType:'json',
            data:`api_key=ToxPuUbzst&name=${crud.name}&course=${crud.course}&grade=${crud.grade}&student_id=${crud.id}`,
                  
                  
            success:createStudent
      }
      ajaxCall(dataPull)
      break;

      default :
    
             dataPull={
                  url:"php_sgt/data.php?action=readAll",
                  method:'POST',
                  dataType:'json',
                  data:"api_key=ToxPuUbzst",
                  success:dataCapture
            }
            ajaxCall(dataPull)
      }
    
     
      
}

function ajaxCall(dataPull){
        
      const xhr = new XMLHttpRequest();
   
      xhr.onload =function() {
        if (this.readyState == 4 && this.status == 200) {
        return dataPull.success(JSON.parse(this.response));
        }
      };
      xhr.open("POST", dataPull.url);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(dataPull.data);


    }
      


function dataCapture(response){
     
      document.querySelector(".student-list>tbody").innerHTML="";
      student_array=[];
      const createStudent=false;
      
      response.data.map(student=>{
      
           addStudent(student.name,student.course,student.grade,student.id,createStudent)
      });
     
     
}

function createStudent(response){

const crud={crudName:"undefined"};

serverCall(crud);
}

function deleteStudent(response){

const crud={crudName:"undefined"};
serverCall(crud);
}

/* Login and Signup Javascript*/
function login(){
$(".login").on("click",function(){
      loginPopUp();
});
}

function signUp(){
$(".signUp").on("click",function(){
 signupPopUp();
});
}
function signupPopUp(){


$(".signup-form").removeClass("hide");
$(".signupPopUp").addClass("animated bounceIn");
setTimeout(()=>{$(".signupPopUp").removeClass("animated bounceIn")},1000);
$(".cancelSignUp").on("click",function(event){
      
                  
      $(".signupPopUp").addClass("animated bounceOut");
      setTimeout(()=>{
            $(".signup-form").addClass("hide");
            $(".signupPopUp").removeClass("animated bounceOut");
            clearForms();
      },1000);
      $(".cancelSignUp").off();
      $(".signUpBtn").off();
});
$(".loginRedirect").on("click",function(event){
      
      loginRedirect();
      
});
$(".signUpBtn").on("click",()=>{
      var signUpData=signUpForm();
      if(signUpData.validation){
     signupAjax(signUpData);
      }
   
});
}


function clearForms(){
var username=$(".username").val("")
var email=$(".email").val("")
var password=$(".password").val("")
var confirm_password=$(".confirm_password").val("");
}
function loginRedirect(){

$(".signupPopUp").addClass("animated bounceOut");
setTimeout(()=>{
      $(".signupPopUp").removeClass("animated bounceOut");
      $(".signup-form").addClass("hide");
      $(".cancelSignUp").off();
      $(".signUpBtn").off();
      clearForms();
},700);
setTimeout(()=>{loginPopUp()},1150);
}
function signupAjax(data){
data.password="tHodAoaSpp"+data.password+"627846";
$.ajax({
 
      url : 'php_sgt/data.php?action=signUp',
      type : 'POST',
      data : {
            'username' : data.username,
            'email':data.email,
            'password':data.password
      },
      dataType:'json',
      success : function(data) {
            console.log(data);              
            loginRedirect();
      },
      error : function(request,error)
      {
            loginRedirect();
            console.log(request);
            console.log(error);
      }
});
}
function signUpForm(){


var userCredentials=emailAndPasswordVerification("signUp");
var validation=userCredentials.validate;
var username=$(".username").val().trim();
var confirm_password=$(".confirm_password").val().trim();


if(username ==""){
      
   $(".usernameError")
   .text("- Username required")
   .addClass("Error animated flash");
   validation=false;
}
if(userCredentials.password =="" && confirm_password !=""){
      $(".passwordError")
      .text("- password required")
      .addClass("Error animated flash");
      validation=false;
}
if(confirm_password=="" && userCredentials.password !=""){
      $(".confirm_passwordError")
      .text("- confirmation password required")
      .addClass("Error animated flash");
      validation=false;
}else if(userCredentials.password !== confirm_password && userCredentials.password!=""){
      
      $(".confirm_passwordError")
      .text("- password doesn't match!")
      .addClass("Error animated flash");
      validation=false;
}


setTimeout(()=>{
      $(".Error").removeClass("animated flash")
},1200);

var signObject={username:username,email:userCredentials.email,password:userCredentials.password,validation:validation};
return signObject;
}
function emailAndPasswordVerification(loginOrSignup){
      var credentialsValidation=true;
      var re =/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      $(".Error").text("");

      switch(loginOrSignup){
      case 'signup':      
            var email=$(".email").val().trim();
            var password=$(".password").val().trim();
            
            if(email=="" || !(re.test(email.trim())) ){
                  $(".emailError")
                  .text("- Invalid Email")
                  .addClass("Error animated flash");
                  credentialsValidation=false;
            }
            if(password==""){
                  $(".passwordError")
                  .text("- password required")
                  .addClass("Error animated flash");
                  credentialsValidation=false;
            }
            return userCredentials={validate:credentialsValidation,email:email,password:password};
      
      case 'login':      
            var email=$(".inputEmail").val().trim();
            var password=$(".inputPassword").val().trim();
            
            if(email=="" || !(re.test(email.trim())) ){
                  $(".inputEmailError")
                  .text("- Invalid Email")
                  .addClass("Error animated flash");
                  credentialsValidation=false;
            }
            if(password==""){
                  $(".inputPassError")
                  .text("- password required")
                  .addClass("Error animated flash");
                  credentialsValidation=false;
            }
            return userCredentials={validate:credentialsValidation,email:email,password:password};
   }
}
function loginPopUp (){
    
$(".loginModal").removeClass("hide");
$(".loginPopUP").addClass("animated bounceIn");
setTimeout(()=>{$(".loginPopUP").removeClass("animated bounceIn")},1000);

$(".cancel").on("click",function(){
      
      $(".loginPopUP").addClass("animated bounceOut");
      setTimeout(()=>{
            $(".loginPopUP").removeClass("animated bounceOut");
            $(".loginModal").addClass("hide");
            
      },1000);
      $(".cancel").off();
});

$(".loginEnter").on("click",function(){
      loginForm();
});
}
function loginForm(){
      var loginData=emailAndPasswordVerification("login");
      if(loginData.validate){
     loginAjax(loginData);
      }
      
}
function loginAjax(data){
      data.password="tHodAoaSpp"+data.password+"627846";
      $.ajax({
      
            url : 'php_sgt/data.php?action=login',
            type : 'POST',
            data : {
                  'email':data.email,
                  'password':data.password
            },
            dataType:'json',
            success : function(data) {
                  console.log(data);              
                  
            },
            error : function(request,error)
            {
                  loginRedirect();
                  console.log(request);
                  console.log(error);
            }
      });
}






