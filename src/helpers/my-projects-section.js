import * as domHelper from "./dom-helpers.js";

export function createSection({ projects, sectionName, defaultMessage }) {
  const section = document.createElement("section");
  section.className = "page-section";
  const sectionHeader = document.createElement("h2");

  sectionHeader.textContent = sectionName;
  section.appendChild(sectionHeader);

  if (projects.length === 0) {
    const sectionPara = document.createElement("p");
    sectionPara.textContent = defaultMessage;
    sectionPara.className = "default-section-text";
    section.appendChild(sectionPara);
    return section;
  }

  projects.forEach((projectsEl) => {
    const taskSectionItem = document.createElement("div");
    taskSectionItem.className = "section-task-item";
    taskSectionItem.dataset.id = projectsEl.id;

    const taskTextSpan = document.createElement("span");
    taskTextSpan.setAttribute("class", "task-text");
    taskTextSpan.textContent = projectsEl.title;

    const taskWrapperDiv = document.createElement("div");
    taskWrapperDiv.className = "task-content-wrapper";

    taskWrapperDiv.appendChild(taskTextSpan);
    taskSectionItem.appendChild(taskWrapperDiv);
    section.appendChild(taskSectionItem);
  });

  return section;
}

export function createAddProjectForm() {
  const myForm = document.createElement("form");
  myForm.className = "add-task-form";

  const projectTitleInput = domHelper.createInput({
    id: "task-title",
    type: "text",
    name: "project_title",
    placeholder: "Enter your project title here...",
  });
  projectTitleInput.required = true;

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

  myForm.appendChild(projectTitleInput);
  myForm.appendChild(btnWrapper);
  return myForm;
}

export function createAddProjectBtn() {
  return domHelper.createButton({
    text: "Add Project",
    className: ["today-task-item", "add-task-second-btn"],
  });
}
