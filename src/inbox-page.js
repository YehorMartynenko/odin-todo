import { formatDate } from "./utils.js"
import * as domHelper from "./dom-helpers.js";

export function InboxPageController(manager) {
    const contentDiv = document.getElementById("right-panel-content");
    contentDiv.innerHTML = "";

    const rootDiv = document.createElement("div");
    rootDiv.setAttribute("id", "root-container");

    const myHeader = document.createElement("h1");
    myHeader.textContent = "Inbox";
    myHeader.className = "today";
    rootDiv.appendChild(myHeader);

    const inboxSection = createInboxSection(manager.getCurrentTodos());
    rootDiv.appendChild(inboxSection);

    contentDiv.appendChild(rootDiv);
}

function createInboxSection(todos){
    const inboxTaskListSection = document.createElement("div");
    inboxTaskListSection.setAttribute("class", "today-task-list");

    todos.forEach(todoEl => {
        const todayTaskItemDiv = document.createElement("div");
        todayTaskItemDiv.setAttribute("class", "section-task-item");
        todayTaskItemDiv.dataset.id = todoEl.id;

        const myCheckBox = createCheckbox();
        const taskTextSpan = createTaskTitle(todoEl);

        todayTaskItemDiv.appendChild(myCheckBox);
        todayTaskItemDiv.appendChild(taskTextSpan);
        inboxTaskListSection.appendChild(todayTaskItemDiv);
    });

    return inboxTaskListSection;
}

function createCheckbox() {
    const myCheckBox = domHelper.createInput({ type: "checkbox", className: ["task-checkbox"] });
    return myCheckBox;
}

function createTaskTitle(todoEl) {
    const taskTextSpan = document.createElement("span");
    taskTextSpan.setAttribute("class", "task-text");
    taskTextSpan.textContent = todoEl.title;
    return taskTextSpan;
}