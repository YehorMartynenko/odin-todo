import { formatDate, getTodayEndDateTimeLocalValue } from "./utils.js";
import { openTaskDialog } from "./task-dialog.js";
import { PRIORITIES } from "./constants.js";
import * as domHelper from "./dom-helpers.js";

const DEFAULT_OVERDUE_MESSAGE = "Wow! You don't have any overdues so far!";
const DEFAULT_TODAY_MESSAGE = "You don't have any task for today!";

export function TodayPageController(manager) {
    const contentDiv = document.getElementById("right-panel-content");
    contentDiv.innerHTML = "";

    const rootDiv = document.createElement("div");
    rootDiv.id = "today-page-root";

    const pageHeader = document.createElement("h1");
    pageHeader.textContent = "Today";
    pageHeader.className = "page-header";

    const overdueSection = createSection({
        todos: manager.getOverdueTodos(),
        sectionName: "Overdue",
        defaultMessage: DEFAULT_OVERDUE_MESSAGE,
    });

    const todaySection = createSection({
        todos: manager.getTodayTodos(),
        sectionName: "Today",
        defaultMessage: DEFAULT_TODAY_MESSAGE,
    });

    const addTaskBtn = createAddTaskBtn();

    todaySection.appendChild(addTaskBtn);
    rootDiv.append(pageHeader, overdueSection, todaySection);

    const leftPanel = document.getElementById("left-panel");

    rootDiv.addEventListener("click", (event) => {
        const checkbox = event.target.closest(".task-checkbox");
        const addTask = event.target.closest(".add-task-second-btn");
        const cancelInlineForm = event.target.closest(".add-task-form .cancel-btn");
        const cancelTodayBtn = event.target.closest(".cancel-today-btn");
        const selectedTask = event.target.closest(".section-task-item");

        if (checkbox) {
            const taskItem = event.target.closest("[data-id]");
            const task = manager.getTodoById(taskItem.dataset.id);

            manager.toggleStatus(task.id);
            TodayPageController(manager);
            return;
        }

        if(addTask) {
            const myForm = createAddTaskForm(manager);
            addTask.replaceWith(myForm);
            return;
        }

        if (cancelInlineForm) {
            const myBtn = createAddTaskBtn();
            const myForm = document.querySelector(".add-task-form")
            myForm.replaceWith(myBtn);  
            return;
        }
        
        if(cancelTodayBtn) {
            const form = cancelTodayBtn.closest(".add-task-form");

            const todayDiv = form.querySelector(".today-div");
            todayDiv.style.display = "none";

            const taskDateInput = form.querySelector("#task-date");
            taskDateInput.style.display = "block";
            return;
        }

        if (selectedTask){
            const task = manager.getTodoById(selectedTask.dataset.id);

            openTaskDialog({
                task: task,
                projects: manager.getAllProjects(),
                onSubmit: (data) => {
                    manager.updateTodo({
                        id: task.id,
                        ...data,
                    });

                    TodayPageController(manager);
                }
            });

            return;
        }
    });

    rootDiv.addEventListener("submit", (event) => {
        event.preventDefault();

        const form = event.target;

        if (!form.classList.contains("add-task-form")) return;

        manager.createTodo({
            title: form.elements.task_title.value.trim(),
            notes: form.elements.task_desc.value.trim(),
            dueDate: form.elements.task_date.value,
            priority: Number(form.elements.task_priority.value),
            projectId: form.elements.task_project.value || null,
        });

        TodayPageController(manager);
    })

    contentDiv.appendChild(rootDiv);
}

function createSection({ todos, sectionName, defaultMessage }){
    const section = document.createElement("section");
    section.className = "page-section";
    const sectionHeader = document.createElement("h2");

    sectionHeader.textContent = sectionName;
    section.appendChild(sectionHeader);

    if (todos.length === 0){
        const sectionPara = document.createElement("p");
        sectionPara.textContent = defaultMessage;
        sectionPara.className = "default-section-text";
        section.appendChild(sectionPara);
        return section;
    }

    todos.forEach(todoEl => {
        const taskSectionItem = document.createElement("div");
        taskSectionItem.className = "section-task-item";
        taskSectionItem.dataset.id = todoEl.id;

        const taskCheckBox = domHelper.createInput({ type: "checkbox", className: ["task-checkbox"] });
        const taskTextSpan = document.createElement("span");
        taskTextSpan.setAttribute("class", "task-text");
        taskTextSpan.textContent = todoEl.title;

        const taskWrapperDiv = document.createElement("div");
        taskWrapperDiv.className = "task-content-wrapper";

        const deadlineSpan = document.createElement("span");
        deadlineSpan.className = "deadline-info";
        deadlineSpan.textContent = formatDate(todoEl.dueDate);

        taskWrapperDiv.appendChild(taskTextSpan);
        taskWrapperDiv.appendChild(deadlineSpan);
        taskSectionItem.appendChild(taskCheckBox);
        taskSectionItem.appendChild(taskWrapperDiv);
        section.appendChild(taskSectionItem);
    });

    return section;
}

function createAddTaskForm(manager){
    const myForm = document.createElement("form");
    myForm.className = "add-task-form";

    const taskTitleInput = domHelper.createInput({
         id: "task-title",
        type: "text",
        name: "task_title", 
        placeholder: "Enter your task title here..."
    });
    taskTitleInput.required = true;

    const taskDescInput = domHelper.createTextarea({ id: "task-desc", name: "task_desc", placeholder: "Description"});

    const wrapper = document.createElement("div");
    wrapper.className = "selection-wrapper";

    const taskDateInput = domHelper.createInput({ id: "task-date", name: "task_date", type: "datetime-local" });
    taskDateInput.style.display = "none";

    const todayDiv = document.createElement("div");
    todayDiv.className = "today-div";

    const todayP = document.createElement("p");
    todayP.textContent = "Today";

    const cancelTodayBtn = domHelper.createButton({
        text: "x",
        className: ["cancel-today-btn"]
    });

    todayDiv.appendChild(todayP);
    todayDiv.appendChild(cancelTodayBtn);

    taskDateInput.value = getTodayEndDateTimeLocalValue();

    const taskPrioritySelect = domHelper.createSelect({ id: "task-priority-select", name: "task_priority", options: PRIORITIES });

    const projects = manager.getAllProjects();
    const projectSelect = domHelper.createSelect({ id: "project-select", name: "task_project", options: projects, 
        defaultOption: { value: "", title: "Select project" }});

    wrapper.appendChild(taskDateInput);
    wrapper.appendChild(todayDiv);
    wrapper.appendChild(taskPrioritySelect);
    wrapper.appendChild(projectSelect);

    const btnWrapper = document.createElement("div");
    btnWrapper.setAttribute("class", "btn-wrapper");

    const cancelBtn = domHelper.createButton({
        text: "Cancel",
        className: ["cancel-btn"]
    });

    const submitBtn = domHelper.createButton({
        text: "Submit",
        className: ["submit-btn"],
        type: "submit"
    });

    btnWrapper.appendChild(cancelBtn);
    btnWrapper.appendChild(submitBtn);

    myForm.appendChild(taskTitleInput);
    myForm.appendChild(taskDescInput);
    myForm.appendChild(wrapper);
    myForm.appendChild(btnWrapper);

    return myForm;
}

function createAddTaskBtn() {
    return domHelper.createButton({
        text: "Add Task",
        className: ["today-task-item", "add-task-second-btn"]
    });
}