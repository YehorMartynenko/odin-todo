import { formatDate } from "./utils.js"

export function TodayPageController(manager) {
    const contentDiv = document.getElementById("right-panel-content");
    contentDiv.innerHTML = "";

    const rootDiv = document.createElement("div");
    rootDiv.setAttribute("id", "root-container");

    const myHeader1 = document.createElement("h1");
    myHeader1.textContent = "Today";
    myHeader1.setAttribute("class", "today");
    rootDiv.appendChild(myHeader1);

    // Build Overdue section
    const overdueSection = createOverdueSection(manager);
    rootDiv.appendChild(overdueSection);

    // Build Today section
    const todayTaskListSection = createTodaySection(manager);
    rootDiv.appendChild(todayTaskListSection);

    rootDiv.addEventListener("click", (event) => {
        const checkbox = event.target.closest(".task-checkbox");
        const addTask = event.target.closest(".add-task-second-btn");
        const cancelBtn = event.target.closest(".add-task-form .cancel-btn");
        const cancelDialogBtn = event.target.closest("#edit-task-dialog .cancel-btn");
        const cancelTodayBtn = event.target.closest(".cancel-today-btn");
        const selectedTask = event.target.closest(".task-text");

        if (checkbox) {
            const taskId = event.target.closest("[data-id]");
            const affectedTask = manager.getTodoById(taskId.dataset.id);
            manager.toggleStatus(affectedTask.id);
            TodayPageController(manager);
        }

        if(addTask) {
            const myForm = createAddTaskForm(manager);
            todayTaskListSection.removeChild(addTask);
            todayTaskListSection.appendChild(myForm);
        }

        if(cancelBtn) {
            const myBtn = createAddTaskBtn();
            const myForm = document.querySelector(".add-task-form")
            todayTaskListSection.removeChild(myForm);
            todayTaskListSection.appendChild(myBtn);
        }
        
        if(cancelTodayBtn) {
            const todayDateTimeDiv = document.querySelector(".today-div");
            todayDateTimeDiv.style.display = "none";
            const taskDateInput = document.getElementById("task-date");
            taskDateInput.style.display = "block";
        }

        if (selectedTask){
            const taskId = event.target.closest("[data-id]");
            const task = manager.getTodoById(taskId.dataset.id);
            const projects = manager.getAllProjects()
            const editTaskDialog = createEditTaskDialog(task, projects);

            editTaskDialog.addEventListener("close", () => {
                editTaskDialog.remove();
            }, { once: true });

            rootDiv.appendChild(editTaskDialog);
            editTaskDialog.showModal();
        }

        if (cancelDialogBtn){
            const dialog = document.getElementById("edit-task-dialog");
            dialog.close();
        }
    });

    rootDiv.addEventListener("submit", (event) => {
        event.preventDefault();
        const form = event.target;
        if (form.getAttribute("id") === "edit-task-form"){
            manager.updateTodo({
                id: form.dataset.task_id,
                title: form.elements.edit_task_title.value,
                notes: form.elements.edit_task_desc.value,
                dueDate: form.elements.edit_task_date.value,
                priority: form.elements.edit_task_priority.value,
                projectId: form.elements.edit_task_project.value,
            });
        } else {
            manager.createTodo({
                title: form.elements.task_title.value,
                notes: form.elements.task_desc.value,
                dueDate: form.elements.task_date.value,
                priority: form.elements.task_priority.value,
                projectId: form.elements.task_project.value,
            });
        }
        TodayPageController(manager);
    })

    contentDiv.appendChild(rootDiv);
}

function createOverdueSection(manager){
    const overdueSection = document.createElement("section");
    overdueSection.setAttribute("class", "overdue");
    const overdueHeader = document.createElement("h2");

    overdueHeader.textContent = "Overdue";
    overdueSection.appendChild(overdueHeader);

    const overdueTodos = manager.getOverdueTodos();
    if(overdueTodos.length === 0){
        const para = document.createElement("p");
        para.textContent = "Wow! You don't have any overdues so far!";
        para.setAttribute("class", "no-overdues-text");
        overdueSection.appendChild(para);
        return overdueSection;
    }
    overdueTodos.forEach(todoEl => {
        const overdueTaskDiv = document.createElement("div");
        overdueTaskDiv.setAttribute("class", "section-task-item");
        overdueTaskDiv.dataset.id = todoEl.id;

        const myCheckBox = createCheckbox();
        const taskTextSpan = createTaskTitle(todoEl);

        const taskWrapperDiv = document.createElement("div");
        taskWrapperDiv.setAttribute("class", "task-content-wrapper");

        const overdueDeadlineSpan = document.createElement("span");
        overdueDeadlineSpan.setAttribute("class", "overdue-deadline");
        overdueDeadlineSpan.textContent = formatDate(todoEl.dueDate);

        taskWrapperDiv.appendChild(taskTextSpan);
        taskWrapperDiv.appendChild(overdueDeadlineSpan);
        overdueTaskDiv.appendChild(myCheckBox);
        overdueTaskDiv.appendChild(taskWrapperDiv);
        overdueSection.appendChild(overdueTaskDiv);
    });

    return overdueSection;
}

function createTodaySection(manager) {
    const todayTaskListSection = document.createElement("div");
    todayTaskListSection.setAttribute("class", "today-task-list");
    const todayHeader = document.createElement("h2");

    todayHeader.textContent = formatDate(Date.now());;
    todayTaskListSection.appendChild(todayHeader);

    const todayTodos = manager.getTodayTodos();
    todayTodos.forEach(todoEl => {
        const todayTaskItemDiv = document.createElement("div");
        todayTaskItemDiv.setAttribute("class", "section-task-item");
        todayTaskItemDiv.dataset.id = todoEl.id;

        const myCheckBox = createCheckbox();
        const taskTextSpan = createTaskTitle(todoEl);

        todayTaskItemDiv.appendChild(myCheckBox);
        todayTaskItemDiv.appendChild(taskTextSpan);
        todayTaskListSection.appendChild(todayTaskItemDiv);
    });

    const addTaskBtn = createAddTaskBtn();

    todayTaskListSection.appendChild(addTaskBtn);

    return todayTaskListSection;
}

function createAddTaskBtn() {
    const addTaskBtn = document.createElement("button");
    addTaskBtn.textContent = "Add Task";
    addTaskBtn.setAttribute("class", "today-task-item add-task-second-btn");

    return addTaskBtn;
}

function createCheckbox(){
    const myCheckBox = document.createElement("input");
    myCheckBox.setAttribute("type", "checkbox");
    myCheckBox.setAttribute("class", "task-checkbox");
    return myCheckBox;
}

function createTaskTitle(todoEl){
    const taskTextSpan = document.createElement("span");
    taskTextSpan.setAttribute("class", "task-text");
    taskTextSpan.textContent = todoEl.title;
    return taskTextSpan;
}

function createAddTaskForm(manager){
    const myForm = document.createElement("form");
    myForm.setAttribute("class", "add-task-form");

    const taskTitleInput = document.createElement("input");
    taskTitleInput.setAttribute("id", "task-title");
    taskTitleInput.setAttribute("name", "task_title");
    taskTitleInput.setAttribute("type", "text");
    taskTitleInput.required = true;
    taskTitleInput.setAttribute("placeholder", "Enter your task title here...");

    const taskDescInput = document.createElement("textarea");
    taskDescInput.setAttribute("id", "task-desc");
    taskDescInput.setAttribute("name", "task_desc");
    taskDescInput.setAttribute("placeholder", "Description");

    const wrapper = document.createElement("div");
    wrapper.setAttribute("class", "wrapper");

    const taskDateInput = document.createElement("input");
    taskDateInput.setAttribute("id", "task-date");
    taskDateInput.setAttribute("name", "task_date");
    taskDateInput.setAttribute("type", "datetime-local");
    taskDateInput.style.display = "none";

    const todayDiv = document.createElement("div");
    todayDiv.setAttribute("class", "today-div");

    const todayP = document.createElement("p");
    todayP.textContent = "Today";

    const cancelTodayBtn = document.createElement("button");
    cancelTodayBtn.setAttribute("class", "cancel-today-btn");
    cancelTodayBtn.textContent = "x";
    cancelTodayBtn.setAttribute("type", "button");

    todayDiv.appendChild(todayP);
    todayDiv.appendChild(cancelTodayBtn);

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    taskDateInput.value = `${year}-${month}-${day}T23:59`;


    const taskPrioritySelect = document.createElement("select");
    taskPrioritySelect.setAttribute("id", "task-priority-select");
    taskPrioritySelect.setAttribute("name", "task_priority");
    const priorities = 
    [{
        title: "highest priority",
        value: 1
    },
    {   title: "medium priority",
        value: 2
    },
    {   title: "lowest priority",
        value: 3
    }];

    priorities.forEach(priority => {
        const taskPriorityOption = document.createElement("option");
        taskPriorityOption.setAttribute("value", priority.value);
        taskPriorityOption.textContent = `${priority.title}`;
        taskPrioritySelect.appendChild(taskPriorityOption)
    });
    const projectSelect = document.createElement("select");
    projectSelect.setAttribute("id", "project-select");
    projectSelect.setAttribute("name", "task_project");
    const defaultOption = document.createElement("option");
    defaultOption.setAttribute("value", "");
    defaultOption.textContent = "Select project";
    defaultOption.selected = true;
    projectSelect.appendChild(defaultOption);

    const projects = manager.getAllProjects();
    projects.forEach(project => {
        const projectSelectOption = document.createElement("option");
        projectSelectOption.setAttribute("value", project.id);
        projectSelectOption.textContent = project.title;
        projectSelect.appendChild(projectSelectOption);
    });

    wrapper.appendChild(taskDateInput);
    wrapper.appendChild(todayDiv);
    wrapper.appendChild(taskPrioritySelect);
    wrapper.appendChild(projectSelect);

    const btnWrapper = document.createElement("div");
    btnWrapper.setAttribute("class", "btn-wrapper");

    const cancelBtn = document.createElement("button");
    cancelBtn.setAttribute("class", "cancel-btn");
    cancelBtn.setAttribute("type", "button");
    cancelBtn.textContent = "Cancel";

    const submitBtn = document.createElement("button");
    submitBtn.setAttribute("type", "submit");
    submitBtn.setAttribute("class", "submit-btn");
    submitBtn.textContent = "Submit";

    btnWrapper.appendChild(cancelBtn);
    btnWrapper.appendChild(submitBtn);

    myForm.appendChild(taskTitleInput);
    myForm.appendChild(taskDescInput);
    myForm.appendChild(wrapper);
    myForm.appendChild(btnWrapper);

    return myForm;
}

function createEditTaskDialog(task, projects = []) {
    const dialog = document.createElement("dialog");
    dialog.id = "edit-task-dialog";

    const dialogContent = document.createElement("div");
    dialogContent.className = "dialog-content";

    const form = document.createElement("form");
    form.id = "edit-task-form";
    form.dataset.task_id = task.id;

    const mainFormGroup = document.createElement("div");
    mainFormGroup.className = "form-group";

    const taskDescWrapper = document.createElement("div");
    taskDescWrapper.className = "form-task-desc-wrapper";

    const titleInput = document.createElement("input");
    titleInput.id = "edit-task-title";
    titleInput.name = "edit_task_title";
    titleInput.type = "text";
    titleInput.value = task.title;

    const descTextarea = document.createElement("textarea");
    descTextarea.id = "edit-task-desc";
    descTextarea.name = "edit_task_desc";
    descTextarea.placeholder = "Add description";
    descTextarea.value = task.notes;

    taskDescWrapper.appendChild(titleInput);
    taskDescWrapper.appendChild(descTextarea);

    const buttonsWrapper = document.createElement("div");
    buttonsWrapper.className = "form-buttons-wrapper";

    const cancelButton = document.createElement("button");
    cancelButton.className = "cancel-btn";
    cancelButton.type = "button";
    cancelButton.textContent = "Cancel";

    const submitButton = document.createElement("button");
    submitButton.className = "submit-btn";
    submitButton.type = "submit";
    submitButton.textContent = "Submit";

    buttonsWrapper.appendChild(cancelButton);
    buttonsWrapper.appendChild(submitButton);

    mainFormGroup.appendChild(taskDescWrapper);
    mainFormGroup.appendChild(buttonsWrapper);

    const metadataWrapper = document.createElement("div");
    metadataWrapper.className = "form-metadata-wrapper";

    const projectGroup = document.createElement("div");
    projectGroup.className = "form-group";

    const projectLabel = document.createElement("label");
    projectLabel.htmlFor = "edit-task-project";
    projectLabel.textContent = "Project";

    const projectSelect = document.createElement("select");
    projectSelect.name = "edit_task_project";
    projectSelect.id = "edit-task-project";

    const defaultOption = document.createElement("option");
    defaultOption.setAttribute("value", "");
    defaultOption.textContent = "No project";
    if (!task.projectId){
        defaultOption.selected = true;
    }
    projectSelect.appendChild(defaultOption);
    projects.forEach(project => {
        const projectSelectOption = document.createElement("option");
        projectSelectOption.setAttribute("value", project.id);
        projectSelectOption.textContent = project.title;
        if (projectSelectOption.value === task.projectId) {
            projectSelectOption.selected = true;
        }
        projectSelect.appendChild(projectSelectOption);
    });


    projectGroup.appendChild(projectLabel);
    projectGroup.appendChild(projectSelect);

    const dateGroup = document.createElement("div");
    dateGroup.className = "form-group";

    const dateLabel = document.createElement("label");
    dateLabel.htmlFor = "edit-task-date";
    dateLabel.textContent = "Date";

    const dateInput = document.createElement("input");
    dateInput.name = "edit_task_date";
    dateInput.id = "edit-task-date";
    dateInput.type = "datetime-local";

    const timestamp = task.dueDate;

    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const formatted = `${year}-${month}-${day}T${hours}:${minutes}`;

    dateInput.value = formatted;

    dateGroup.appendChild(dateLabel);
    dateGroup.appendChild(dateInput);

    const priorityGroup = document.createElement("div");
    priorityGroup.className = "form-group";

    const priorityLabel = document.createElement("label");
    priorityLabel.htmlFor = "edit-task-priority";
    priorityLabel.textContent = "Priority";

    const prioritySelect = document.createElement("select");
    prioritySelect.name = "edit_task_priority";
    prioritySelect.id = "edit-task-priority";

    const priorities =
        [{
            title: "highest priority",
            value: 1
        },
        {
            title: "medium priority",
            value: 2
        },
        {
            title: "lowest priority",
            value: 3
        }];

    priorities.forEach(priority => {
        const taskPriorityOption = document.createElement("option");
        taskPriorityOption.setAttribute("value", priority.value);
        if (Number(taskPriorityOption.value) === Number(task.priority)){
            taskPriorityOption.selected = true;
        }
        taskPriorityOption.textContent = `${priority.title}`;
        prioritySelect.appendChild(taskPriorityOption)
    });

    priorityGroup.appendChild(priorityLabel);
    priorityGroup.appendChild(prioritySelect);

    metadataWrapper.appendChild(projectGroup);
    metadataWrapper.appendChild(dateGroup);
    metadataWrapper.appendChild(priorityGroup);

    form.appendChild(mainFormGroup);
    form.appendChild(metadataWrapper);

    dialogContent.appendChild(form);
    dialog.appendChild(dialogContent);

    return dialog;
}