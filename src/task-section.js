import { formatDate, getTodayEndDateTimeLocalValue } from "./utils.js";
import { PRIORITIES } from "./constants.js";
import * as domHelper from "./dom-helpers.js";

export function createSection({ todos, sectionName, defaultMessage }) {
  const section = document.createElement("section");
  section.className = "page-section";
  const sectionHeader = document.createElement("h2");

  sectionHeader.textContent = sectionName;
  section.appendChild(sectionHeader);

  if (todos.length === 0) {
    const sectionPara = document.createElement("p");
    sectionPara.textContent = defaultMessage;
    sectionPara.className = "default-section-text";
    section.appendChild(sectionPara);
    return section;
  }

  todos.forEach((todoEl) => {
    const taskSectionItem = document.createElement("div");
    taskSectionItem.className = "section-task-item";
    taskSectionItem.dataset.id = todoEl.id;

    const taskCheckBox = domHelper.createInput({
      type: "checkbox",
      className: ["task-checkbox"],
    });
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

export function createAddTaskForm(manager) {
  const myForm = document.createElement("form");
  myForm.className = "add-task-form";

  const taskTitleInput = domHelper.createInput({
    id: "task-title",
    type: "text",
    name: "task_title",
    placeholder: "Enter your task title here...",
  });
  taskTitleInput.required = true;

  const taskDescInput = domHelper.createTextarea({
    id: "task-desc",
    name: "task_desc",
    placeholder: "Description",
  });

  const wrapper = document.createElement("div");
  wrapper.className = "selection-wrapper";

  const taskDateInput = domHelper.createInput({
    id: "task-date",
    name: "task_date",
    type: "datetime-local",
  });
  taskDateInput.style.display = "none";

  const todayDiv = document.createElement("div");
  todayDiv.className = "today-div";

  const todayP = document.createElement("p");
  todayP.textContent = "Today";

  const cancelTodayBtn = domHelper.createButton({
    text: "x",
    className: ["cancel-today-btn"],
  });

  todayDiv.appendChild(todayP);
  todayDiv.appendChild(cancelTodayBtn);

  taskDateInput.value = getTodayEndDateTimeLocalValue();

  const taskPrioritySelect = domHelper.createSelect({
    id: "task-priority-select",
    name: "task_priority",
    options: PRIORITIES,
  });

  const projects = manager.getAllProjects();
  const projectSelect = domHelper.createSelect({
    id: "project-select",
    name: "task_project",
    options: projects,
    defaultOption: { value: "", title: "Select project" },
  });

  wrapper.appendChild(taskDateInput);
  wrapper.appendChild(todayDiv);
  wrapper.appendChild(taskPrioritySelect);
  wrapper.appendChild(projectSelect);

  const btnWrapper = document.createElement("div");
  btnWrapper.setAttribute("class", "btn-wrapper");

  const cancelBtn = domHelper.createButton({
    text: "Cancel",
    className: ["cancel-btn"],
  });

  const submitBtn = domHelper.createButton({
    text: "Submit",
    className: ["submit-btn"],
    type: "submit",
  });

  btnWrapper.appendChild(cancelBtn);
  btnWrapper.appendChild(submitBtn);

  myForm.appendChild(taskTitleInput);
  myForm.appendChild(taskDescInput);
  myForm.appendChild(wrapper);
  myForm.appendChild(btnWrapper);

  return myForm;
}

export function createAddTaskBtn() {
  return domHelper.createButton({
    text: "Add Task",
    className: ["today-task-item", "add-task-second-btn"],
  });
}
