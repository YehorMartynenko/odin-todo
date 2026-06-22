import {
  createAddProjectForm,
  createAddProjectBtn,
} from "./helpers/my-projects-section.js";
import { ProjectPageController } from "./controllers/project-page.js";

export function projectListEvents({ rootEl, manager }) {
  rootEl.addEventListener("click", (event) => {
    const selectedProject = event.target.closest(".section-task-item");

    if (selectedProject) {
      const project = manager.getProjectById(selectedProject.dataset.id);

      ProjectPageController(project, manager);

      return;
    }
  });
}

export function inlineFormEventsInit({ rootEl, manager }) {
  rootEl.addEventListener("click", (event) => {
    const addProject = event.target.closest(".add-task-second-btn");
    const cancelInlineForm = event.target.closest(".add-task-form .cancel-btn");

    if (addProject) {
      const myForm = createAddProjectForm(manager);
      addProject.replaceWith(myForm);
      return;
    }

    if (cancelInlineForm) {
      const myBtn = createAddProjectBtn();
      const myForm = document.querySelector(".add-task-form");
      myForm.replaceWith(myBtn);
      return;
    }
  });
}

export function submitEventsInit({ rootEl, manager, rerender }) {
  rootEl.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.target;

    if (!form.classList.contains("add-task-form")) return;

    manager.createProject({
      title: form.elements.project_title.value.trim(),
    });

    rerender();
  });
}
