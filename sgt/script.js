/* information about jsdocs: 
* param: http://usejsdoc.org/tags-param.html#examples
* returns: http://usejsdoc.org/tags-returns.html
* 
/**
 * Listen for the document to load and initialize the application
 */
$(document).ready(initializeApp);

/**
 * Define all global variables here.  
 */
var student_array = [];
var edit_clicked = false;
var save_del_async_call = false;
/***********************
 * student_array - global array to hold student objects
 * @type {Array}
 * example of student_array after input: 
 * student_array = [
 *  { name: 'Jake', course: 'Math', grade: 85 },
 *  { name: 'Jill', course: 'Comp Sci', grade: 85 }
 * ];
 */

/***************************************************************************************************
 * initializeApp 
 * @params {undefined} none
 * @returns: {undefined} none
 * initializes the application, including adding click handlers and pulling in any data from the server, in later versions
 */
function initializeApp() {
    addClickHandlersToElements();
    getData();
}

/***************************************************************************************************
 * addClickHandlerstoElements
 * @params {undefined} 
 * @returns  {undefined}
 *     
 */
function addClickHandlersToElements() {
    //Delete button event listener is in renderStudentOnDom function
    $('.add_button').on('click', handleAddClicked);
    $('.cancel_button').on('click', handleCancelClick);
    $(document).keypress(function(e) {
        if (!edit_clicked) {
            if (e.which == 13) {
                handleAddClicked();
            }
        }
    });
    $('.form-control').on('input', highlightTextInput);
    $('.student-list-container').on('click', removeErrorMessages);
}

/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param {object} event  The event object from the click
 * @return: 
       none
 */
function handleAddClicked(event) {
    validateAddStudent();
}
/***************************************************************************************************
 * handleCancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearAddStudentFormInputs
 */
function handleCancelClick() {
    clearAddStudentFormInputs();
    removeErrorMessages();
}
/***************************************************************************************************
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 * @param {undefined} none
 * @return undefined
 * @calls clearAddStudentFormInputs, updateStudentList
 */
function addStudent() {
    var name = $('#studentName').val();
    var course = $('#course').val();
    var grade = parseFloat($('#studentGrade').val());

    if (name != '' && course != '' && grade != '') {
        clearAddStudentFormInputs();

        sendData(name, course, grade);
    }
}
/***************************************************************************************************
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentFormInputs() {
    $('#studentName').val('');
    $('#course').val('');
    $('#studentGrade').val('');

    $('#studentName').closest('div').removeClass('has-success');
    $('#course').closest('div').removeClass('has-success');
    $('#studentGrade').closest('div').removeClass('has-success');
}
/***************************************************************************************************
 * renderStudentOnDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param {object} studentObj a single student object with course, name, and grade inside
 */
function renderStudentOnDom(studentObj) {
    const id = studentObj.id;
    let name = studentObj.name;
    let course = studentObj.course;
    let grade = studentObj.grade;

    var outer_tr = $('<tr>');
    var inner_td_name = $('<td>', {
        text: name,
        class: 'col-xs-3',
    });
    var inner_td_course = $('<td>', {
        text: course,
        class: 'col-xs-3',
    });
    var inner_td_grade = $('<td>', {
        text: grade,
        class: 'col-xs-2',
    });
    var inner_td_button = $('<td>', {
        class: 'col-xs-4',
    });
    var del_button = $('<button>', {
        type: 'button',
        text: 'Delete',
        'data-id': id,
        class: 'btn btn-danger delete_row table_button',
        on: {
            click: addErrorConfirmationBar,
        }
    })
    var edit_button_initial = $('<button>', {
        type: 'button',
        text: 'Edit',
        class: 'btn btn-info table_button',
        on: {
            click: editMode
        }
    })
    var save_button = $('<button>', {
        type: 'button',
        text: 'Save',
        class: 'btn btn-success table_button',
    })
    var nameInput = $('<input />', {
        'class': 'tableInput',
        'type': 'text',
        'value': name,
        size: 12,
    });

    var courseInput = $('<input />', {
        'class': 'tableInput',
        'type': 'text',
        'value': course,
        size: 12,
    });

    var gradeInput = $('<input />', {
        'class': 'tableInput',
        'type': 'number',
        'value': grade,
        'style': "width: 3em",
        'min': 0,
        'max': 100,
    });

    var confirmation_outer_tr = $('<tr>');

    var inner_td_message = $('<td>', {
        text: 'Are you sure?',
        class: "text-right",
        'colspan': 2,
    });

    var empty_td1 = $('<td>');

    var confirmation_td_buttons = $('<td>');

    var no_button = $('<button>', {
        type: 'button',
        text: 'No',
        class: 'btn btn-info table_button',
    })

    var yes_button = $('<button>', {
        type: 'button',
        text: 'Yes',
        class: 'btn btn-warning table_button',
    })

    addIconsForMobile();
    $(window).resize(addIconsForMobile);

    $(inner_td_button).append(del_button, edit_button_initial);
    $(outer_tr).append(inner_td_name, inner_td_course, inner_td_grade, inner_td_button);
    $('.student-list tbody').append(outer_tr);

    function editMode() {
        if (edit_clicked || save_del_async_call) {
            return
        }
        if ($(window).width() < 475) {
            save_button.html('<i class="far fa-save"></i>');
        } else {
            save_button.html('Save');
        }

        edit_clicked = true;
        $(inner_td_name).text('');
        $(inner_td_course).text('');
        $(inner_td_grade).text('');

        $(nameInput).val(name);
        $(courseInput).val(course);
        $(gradeInput).val(grade);

        $(inner_td_name).append(nameInput);
        $(inner_td_course).append(courseInput);
        $(inner_td_grade).append(gradeInput);

        $(edit_button_initial).replaceWith(save_button);

        $(save_button).on('click', sendUpdate);

        $(outer_tr).addClass('bg-warning');

        $(document).on('click', function(e) {
            if (!$(e.target).is($(edit_button_initial)) &&
                !$(e.target).is($(save_button)) &&
                !$(e.target).is($(nameInput)) &&
                !$(e.target).is($(courseInput)) &&
                !$(e.target).is($(gradeInput)) &&
                !$(e.target).is('i.fas.fa-edit')
            ) {
                exitEditMode.call(this)
            }
        }.bind(this));

        $(document).keypress(function(e) {
            if (e.which == 13) {
                sendUpdate();
            }
        });

    }

    function sendUpdate() {
        var ajaxOptions = {
            url: 'backend/data.php',
            method: 'GET',
            data: {
                'action': 'update',
                'student_id': id,
                'name': $(nameInput).val(),
                'course': $(courseInput).val(),
                'grade': $(gradeInput).val(),
            },
            success: function(response) {
                if (response.success) {
                    name = $(nameInput).val();
                    course = $(courseInput).val();
                    grade = parseInt($(gradeInput).val());
                    save_del_async_call = false;
                    exitEditMode();
                }
            },
            dataType: 'json',
        };
        save_del_async_call = true;
        $.ajax(ajaxOptions)
    }

    function exitEditMode() {
        if (!edit_clicked) {
            return
        }

        $(document).off('click');

        $(edit_button_initial).on('click', editMode);

        $(inner_td_name).text(name);
        $(inner_td_course).text(course);
        $(inner_td_grade).text(grade);

        //$(save_button).replaceWith(edit_button_initial);
        $(save_button).remove();
        $(inner_td_button).append(edit_button_initial);
        $(outer_tr).removeClass('bg-warning');

        for (let i = 0; i < student_array.length; i++) {
            if (student_array[i].id === id) {
                student_array[i].name = name;
                student_array[i].course = course;
                student_array[i].grade = grade;
            }
        }
        var average = calculateGradeAverage(student_array);
        renderGradeAverage(average);

        edit_clicked = false;
    }

    function addErrorConfirmationBar() {
        if (edit_clicked || save_del_async_call) {
            return
        }
        //Adds event handlers to yes and no buttons
        edit_clicked = true;
        no_button.click(exitDeleteMode);
        yes_button.click(function() {
            deleteData(id, outer_tr);
            exitDeleteMode();
        });

        //Color the student row
        outer_tr.addClass('bg-danger');

        //Adds an event handler so user can click outside dom area to exit delete mode
        $(document).on('click', function(e) {
            if (!$(e.target).is($(no_button)) &&
                !$(e.target).is($(yes_button)) &&
                !$(e.target).is($(del_button)) &&
                !$(e.target).is('i.fas.fa-trash-alt')
            ) {
                exitDeleteMode.call(this)
            }
        }.bind(this));

        //Turn off delete button
        del_button.off();

        //Assemble elements and append to DOM
        $(confirmation_td_buttons).append(no_button, yes_button);
        $(confirmation_outer_tr).append(empty_td1, inner_td_message, confirmation_td_buttons);
        $(outer_tr).after(confirmation_outer_tr);
    }

    function exitDeleteMode() {
        if (!edit_clicked) {
            return
        }
        $(document).off('click');
        //Remove confirmation elements and color highlight
        confirmation_outer_tr.empty();
        confirmation_outer_tr.remove();
        outer_tr.removeClass('bg-danger');

        //Reassigns click handler to delete button
        del_button.click(addErrorConfirmationBar);

        edit_clicked = false;
    }

    function addIconsForMobile() {
        if ($(window).width() < 475) {
            nameInput.attr('size', 8);
            courseInput.attr('size', 8);
            del_button.html('<i class="fas fa-trash-alt"></i>');
            edit_button_initial.html('<i class="fas fa-edit"></i>');
            yes_button.html('<i class="fas fa-check"></i>');
            no_button.html('<i class="fa fa-ban" aria-hidden="true"></i>');
        } else {
            nameInput.attr('size', 12);
            courseInput.attr('size', 12);
            del_button.html('Delete');
            edit_button_initial.html('Edit');
            yes_button.html('Yes');
            no_button.html('No');
        }

        if ($(window).width() < 355) {
            $('.student-list-container').addClass('table-responsive');
        } else {
            $('.student-list-container').removeClass('table-responsive');
        }
    }
}
/***************************************************************************************************
 * updateStudentList - centralized function to update the average and call student list update
 * @param students {array} the array of student objects
 * @returns {undefined} none
 * @calls renderStudentOnDom, calculateGradeAverage, renderGradeAverage
 */
function updateStudentList(student_array) {
    var last_student_index = student_array.length - 1;
    // for ( let i = 0; i < student_array.length; i++ ) {
    //       renderStudentOnDom( student_array[i] );
    // }
    renderStudentOnDom(student_array[last_student_index]);
    var average = calculateGradeAverage(student_array);
    renderGradeAverage(average);
}
/***************************************************************************************************
 * calculateGradeAverage - loop through the global student array and calculate average grade and return that value
 * @param: {array} students  the array of student objects
 * @returns {number}
 */
function calculateGradeAverage(student_array) {
    var sum = 0;
    var average = 0;

    for (var i = 0; i < student_array.length; i++) {
        sum += student_array[i].grade;
    }
    average = sum / student_array.length;
    average = parseInt(average);

    if (average === NaN) {
        average = 0;
    }

    return average
}
/***************************************************************************************************
 * renderGradeAverage - updates the on-page grade average
 * @param: {number} average    the grade average
 * @returns {undefined} none
 */
function renderGradeAverage(average) {
    $('.avgGrade').text(average);
}
/***************************************************************************************************
 * getData - pulls data from database using AJAX call
 * @param: 
 * @returns 
 */
function getData() {
    var ajaxOptions = {
        url: 'backend/data.php',
        method: 'GET',
        data: {
            'api_key': 'k9mLtN7WCf',
            'action': 'readAll',
        },
        success: doWhenDataReceived,
        dataType: 'json',
    };
    $.ajax(ajaxOptions)
}
/***************************************************************************************************
 * sendData - send data to server
 * @param: 
 * @returns 
 */
function sendData(name, course, grade) {
    var ajaxOptions = {
        url: 'backend/data.php',
        method: 'GET',
        data: {
            'api_key': 'k9mLtN7WCf',
            'action': 'insert',
            'name': name,
            'course': course,
            'grade': grade
        },
        success: function adsf(response) {
            var new_student_object = {
                name: name,
                course: course,
                grade: grade,
                id: response.insertID,
            }
            student_array.push(new_student_object);
            updateStudentList(student_array);
        },
        // success: doWhenDataSentAndReturned,
        dataType: 'json',
    };
    $.ajax(ajaxOptions)
        //debugger
        //return 11
}
/***************************************************************************************************
 * deleteData - send data to server
 * @param: 
 * @returns 
 */
function deleteData(current_index, outer_tr) {
    var ajaxOptions = {
        url: 'backend/data.php',
        method: 'get',
        data: {
            'api_key': 'k9mLtN7WCf',
            'action': 'delete',
            'student_id': current_index
        },
        success: function(response) {
            save_del_async_call = false;
            for (let i = 0; i < student_array.length; i++) {
                if (student_array[i].id === current_index) {
                    student_array.splice(i, 1);
                }
            }
            // outer_tr.remove();

            var average = calculateGradeAverage(student_array);
            renderGradeAverage(average);
            outer_tr.remove();
        },
        error: function() {},
        // success: doWhenDataSentAndReturned,
        dataType: 'json',
    };
    save_del_async_call = true;
    $.ajax(ajaxOptions)
}

/***************************************************************************************************
 * doWhenDataReceived - runs after the data is got
 * @param: 
 * @returns 
 */
function doWhenDataReceived(response) {
    // student_array = response.data;      
    for (let i = 0; i < response.data.length; i++) {
        var currentStudent = response.data[i];
        student_array.push(currentStudent)
        updateStudentList(student_array);
    }
}

/***************************************************************************************************
 * highlightText
 *Input -
 * @param: 
 * @returns 
 */
function highlightTextInput() {
    let input_text = $(this).val();
    if (input_text === '' || input_text.length > 40) {
        $(this).closest('div').addClass('has-error');
        $(this).closest('div').removeClass('has-success');
    } else if ($(this).is('#studentGrade') && (input_text < 0 || input_text > 100)) {
        $(this).closest('div').addClass('has-error');
        $(this).closest('div').removeClass('has-success');
    } else if (input_text !== '') {
        $(this).closest('div').addClass('has-success');
        $(this).closest('div').removeClass('has-error');
        let warning_text = $(this).closest('div').next();
        if (warning_text.hasClass('text-danger')) {
            warning_text.remove();
        }
    }
}
/***************************************************************************************************
 * validateAddStudent - 
 *Input -
 * @param: 
 * @returns 
 */
function validateAddStudent() {
    let validate = 0;

    //Trim white spaces
    $('#studentName').val($('#studentName').val().trim());
    $('#course').val($('#course').val().trim());
    highlightTextInput.call($('#studentName')[0]);
    highlightTextInput.call($('#course')[0]);
    highlightTextInput.call($('#studentGrade')[0]);

    $('.errorMessage').remove();

    if ($('#studentName').val() === '') {
        $('<p class="text-danger errorMessage">&#9702 Student name required.</p>').insertAfter('#nameInputGroup');
    } else if ($('#studentName').val().length > 40) {
        $('<p class="text-danger errorMessage">&#9702 Must not exceed 40 characters.</p>').insertAfter('#nameInputGroup');
    } else { validate += 1 }

    if ($('#course').val() === '') {
        $('<p class="text-danger errorMessage">&#9702 Course name required.</p>').insertAfter('#courseInputGroup');
    } else if ($('#course').val().length > 40) {
        $('<p class="text-danger errorMessage">&#9702 Must not exceed 40 characters.</p>').insertAfter('#courseInputGroup');
    } else { validate += 1 }

    if ($('#studentGrade').val() === '') {
        $('<p class="text-danger errorMessage">&#9702 Student grade required.</p>').insertAfter('#gradeInputGroup');
    } else if ($('#studentGrade').val() > 100) {
        $('<p class="text-danger errorMessage">&#9702 Student grade must not exceed 100.</p>').insertAfter('#gradeInputGroup');
    } else if ($('#studentGrade').val() < 0) {
        $('<p class="text-danger errorMessage">&#9702 Student grade cannot be negative.</p>').insertAfter('#gradeInputGroup');
    } else { validate += 1 }

    if (validate === 3) {
        addStudent();
    }
}


/***************************************************************************************************
 * removeErrorMessages - 
 *Input -
 * @param: 
 * @returns 
 */
function removeErrorMessages() {
    if ($('#studentName').val() === '' &&
        $('#course').val() === '' &&
        $('#studentGrade').val() === '') {
        $('.errorMessage').remove();
        $('#studentName').closest('div').removeClass('has-error');
        $('#course').closest('div').removeClass('has-error');
        $('#studentGrade').closest('div').removeClass('has-error');
    }
}

/***************************************************************************************************
 * removeErrorMessages - 
 *Input -
 * @param: 
 * @returns 
 */
function setTwoNumberDecimal(inputBar) {
    inputBar.value = parseFloat(inputBar.value).toFixed(2);
};