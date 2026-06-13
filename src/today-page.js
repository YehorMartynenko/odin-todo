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

    const myForm = createAddTaskForm(manager);
    rootDiv.appendChild(myForm);

    rootDiv.addEventListener("click", (event) => {
        const checkbox = event.target.closest(".task-checkbox");
        const addTask = event.target.closest(".add-task-second-btn");

        if (checkbox) {
            const affectedTask = manager.getTodoById(checkbox.dataset.id);
            manager.toggleStatus(affectedTask.id);
            TodayPageController(manager);
        }
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

    const addTaskBtn = document.createElement("button");
    addTaskBtn.textContent = "Add Task";
    addTaskBtn.setAttribute("class", "today-task-item add-task-second-btn");

    todayTaskListSection.appendChild(addTaskBtn);

    return todayTaskListSection;
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
    taskTitleInput.setAttribute("placeholder", "Enter your task title here...");

    const taskDescInput = document.createElement("input");
    taskDescInput.setAttribute("id", "task-desc");
    taskTitleInput.setAttribute("name", "task_desc");
    taskDescInput.setAttribute("type", "textarea");
    taskDescInput.setAttribute("placeholder", "Description");

    const taskDateInput = document.createElement("input");
    taskDateInput.setAttribute("id", "task-date");
    taskTitleInput.setAttribute("name", "task_date");
    taskDateInput.setAttribute("type", "date");

    const taskPrioritySelect = document.createElement("select");
    taskPrioritySelect.setAttribute("id", "task-priority-select");
    const taskPriorityOptionOne = document.createElement("option");
    taskPriorityOptionOne.setAttribute("value", "1");
    taskPriorityOptionOne.textContent = "Priority 1";
    const taskPriorityOptionTwo = document.createElement("option");
    taskPriorityOptionTwo.setAttribute("value", "2");
    taskPriorityOptionTwo.textContent = "Priority 2"
    const taskPriorityOptionThree = document.createElement("option");
    taskPriorityOptionThree.setAttribute("value", "3");
    taskPriorityOptionThree.textContent = "Priority 3"

    taskPrioritySelect.appendChild(taskPriorityOptionOne);
    taskPrioritySelect.appendChild(taskPriorityOptionTwo);
    taskPrioritySelect.appendChild(taskPriorityOptionThree);

    myForm.appendChild(taskTitleInput);
    myForm.appendChild(taskDescInput);
    myForm.appendChild(taskDateInput);
    myForm.appendChild(taskPrioritySelect);

    return myForm;
}