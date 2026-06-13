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
    const overdueSection = createOvedueSection(manager);
    rootDiv.appendChild(overdueSection);

    // Build Today section
    const todayTaskListSection = createTodaySection(manager);
    rootDiv.appendChild(todayTaskListSection);

    rootDiv.addEventListener("click", (event) => {
        const checkbox = event.target.closest(".task-checkbox");
        const addTask = event.target.closest(".add-task-second-btn");
        const cancelBtn = event.target.closest(".cancel-btn");

        if (checkbox) {
            const affectedTask = manager.getTodoById(checkbox.dataset.id);
            manager.toggleStatus(affectedTask.id);
            TodayPageController(manager);
        }

        if(addTask) {
            const myForm = createAddTaskForm(manager);
            const addTaskBtn = document.querySelector(".add-task-second-btn");
            todayTaskListSection.removeChild(addTaskBtn);
            todayTaskListSection.appendChild(myForm);
        }

        if(cancelBtn) {
            const myBtn = createAddTaskBtn();
            const myForm = document.querySelector(".add-task-form")
            todayTaskListSection.removeChild(myForm);
            todayTaskListSection.appendChild(myBtn);
        }
    });

    rootDiv.addEventListener("submit", (event) => {
        event.preventDefault();
        const form = event.target;
        manager.createTodo({
            title: form.elements.task_title.value,
            notes: form.elements.task_desc.value,
            dueDate: form.elements.task_date.value,
            priority: form.elements.task_priority.value,
            projectId: form.elements.task_project.value,
        });
        TodayPageController(manager);
    })

    contentDiv.appendChild(rootDiv);
    
}

function createOvedueSection(manager){
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

        const myCheckBox = createCheckbox(todoEl);
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

        const myCheckBox = createCheckbox(todoEl);
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

function createCheckbox(todoEl){
    const myCheckBox = document.createElement("input");
    myCheckBox.setAttribute("type", "checkbox");
    myCheckBox.setAttribute("class", "task-checkbox");
    myCheckBox.dataset.id = todoEl.id;
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
    {    title: "lowest prioroty",
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