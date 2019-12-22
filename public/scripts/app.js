document.addEventListener("DOMContentLoaded", function() {

    // UPDATE PROGRESS DETAILS
    const updateProgressDetails = () => {
        // SELECT TASKS AND ELEMENT TO UPDATE 
        let allTask = document.querySelectorAll('.check');
        let percentText = document.querySelector('.progress_percent_number');
        let bar = document.querySelector('.progress_bar');

        if (allTask.length) {
            
            // SELECT ALL COMPLETED TASK
            let completedTasks = document.querySelectorAll('.task_complete');
            // FIND PERCENTAGE COMPLETED
            let percent = Math.round((completedTasks.length / allTask.length) * 100);

            // CURRENT PERCENT VALUE
            percentText.innerHTML = `${percent.toString()}%`
            bar.style.width = `${percent.toString()}%`;

            return percent;
        }

    }

    // UPDATE PROGRESS ON TASK COMPLETE
    const onTaskComplete = () => {

            let percent = updateProgressDetails();

            if(percent === 100) {
                swal({
                    title: 'PROJECT COMPLETE',
                    text: 'You may delete this project if you want.',
                    buttons: false
                });

                setTimeout(() => {
                    swal.close()
                }, 1500)
            }
    }

    updateProgressDetails();


    // CLOSE ERROR MESSAGES 
    let errorMsg = document.querySelectorAll('.error_msg');
    errorMsg.forEach((error, index) => {
        let delay = (5 + index) * 1000;
        console.log(delay);
        setTimeout(function() {
            console.log(error);
            error.setAttribute('class', 'close')
        }, delay);
    });

    // DELETE PROJECT CONFIRMATION
    let deleteBtn = document.querySelector('#delete');
    if(deleteBtn) {
        deleteBtn.addEventListener('click', function(e) {

            e.preventDefault();

            const url = `${location.origin}/dashboard/project/${e.target.dataset.projectId}/delete`;

            swal({
                title: "WAIT!!!",
                text: "Are you sure you want to delete this project? ",
                dangerMode: true,
                buttons: ['NO, cancel', 'YES, do it!']
            }).then((value) => {
                if(value) {
                    axios.delete(url)
                        .then((res) => {
                            swal({
                                title: 'YAHOOOO!!!',
                                text: 'Project deleted successful!',
                                buttons: false
                            });

                            setTimeout(() => {
                                window.location.href = `${location.origin}/dashboard`;
                            }, 1000);
                        })
                        .catch((e) => {
                            swal({
                                title: 'OOOOOPSS!!!',
                                text: 'Something went wrong!',
                                buttons: false
                            });

                            setTimeout(() => {
                                swal.close()
                            }, 1000)
                        }) 
                    
                }
            });

        });
    }
    
    // TASK COMPLETE REQUEST
    const tasks = document.querySelectorAll('.check_task');

    if(tasks.length) {
        tasks.forEach( (task) => {
            // SELECT CHECK ICON
            const check = task.children[0];
            check.addEventListener('click', () => {
            
                const { taskId, projectId } = check.dataset;
                
                axios.patch(`${location.origin}/dashboard/project/${projectId}/task/${taskId}/complete`)
                    .then( (res) => { 
                        check.classList.toggle('task_complete');
                        onTaskComplete();
                    })
                    .catch( () => {
                        swal({
                            title: 'OOOOOPSS!!!',
                            text: 'Something went wrong!',
                            buttons: false
                        });

                        setTimeout(() => {
                            swal.close()
                        }, 1000)
                    });
            
            });
        })
    }


    // DELETE TASK FROM PROJECT
    const deleteTasksBtns = document.querySelectorAll('.delete_task');
    if(deleteTasksBtns.length) {
        let taskLength = deleteTasksBtns.length;
        deleteTasksBtns.forEach( deleteBtn => {
            deleteBtn.addEventListener('click', (event) => {
                event.preventDefault();

                //DISPLAY WARNING WINDOW
                swal({
                    title: "WAIT!!!",
                    text: "Are you sure you want to delete this task? ",
                    dangerMode: true,
                    buttons: ['NO, cancel', 'YES, do it!']
                })
                .then(value => {
                    if(value) {
                        const elem = deleteBtn.parentElement.parentElement;
                        const { taskId, projectId } = deleteBtn.dataset;
                        const url = `${location.origin}/dashboard/project/${projectId}/task/${taskId}/delete`;
                        axios.delete(url)
                            .then((res) => { 
                                if(taskLength === 1) {

                                    const parentElem = document.querySelector('.content_box')
                                    const tasksList = document.querySelector('.task_list');
                                    const progress = document.querySelector('.progress');

                                    const pElem = document.createElement("p");
                                    pElem.innerHTML = 'no task yet';

                                    const divElem = document.createElement("div");
                                    divElem.classList.add('tasks_msg');
                                    divElem.appendChild(pElem);

                                    parentElem.removeChild(tasksList);
                                    parentElem.removeChild(progress);

                                    parentElem.appendChild(divElem);

                                }
                                elem.parentElement.removeChild(elem);
                                updateProgressDetails();
                                taskLength = taskLength - 1;
                            })
                            .catch(e => console.log(e));
                    }
                })
                
            })
        })
    }

    // CLOSE USER REGISTRATION AND LOGIN ERRORS
    const userError = document.querySelectorAll('.user_error_close');
    if (userError.length) {
        userError.forEach((error) => {
            error.addEventListener('click', (e) => {
                const element = e.target.parentElement;
                element.parentElement.removeChild(element);
            });
        });
    }
    

});