import { openTaskDialog } from "./helpers/task-dialog.js";
import { createAddTaskForm, createAddTaskBtn } from "./task-section.js";

export function taskListEventsInit({ rootEl, manager, rerender }) {
  rootEl.addEventListener("click", (event) => {
    const checkbox = event.target.closest(".task-checkbox");
    const selectedTask = event.target.closest(".section-task-item");

    if (checkbox) {
      const taskItem = event.target.closest("[data-id]");
      const task = manager.getTodoById(taskItem.dataset.id);

      manager.toggleStatus(task.id);
      rerender();
      return;
    }

    if (selectedTask) {
      const task = manager.getTodoById(selectedTask.dataset.id);

      openTaskDialog({
        task: task,
        projects: manager.getAllProjects(),
        onSubmit: (data) => {
          manager.updateTodo({
            id: task.id,
            ...data,
          });

          rerender();
        },
      });

      return;
    }
  });
}

export function inlineFormEventsInit({ rootEl, manager }) {
  rootEl.addEventListener("click", (event) => {
    const addTask = event.target.closest(".add-task-second-btn");
    const cancelInlineForm = event.target.closest(".add-task-form .cancel-btn");
    const cancelTodayBtn = event.target.closest(".cancel-today-btn");

    if (addTask) {
      const myForm = createAddTaskForm(manager);
      addTask.replaceWith(myForm);
      return;
    }

    if (cancelInlineForm) {
      const myBtn = createAddTaskBtn();
      const myForm = document.querySelector(".add-task-form");
      myForm.replaceWith(myBtn);
      return;
    }

    if (cancelTodayBtn) {
      const form = cancelTodayBtn.closest(".add-task-form");

      const todayDiv = form.querySelector(".today-div");
      todayDiv.style.display = "none";

      const taskDateInput = form.querySelector("#task-date");
      taskDateInput.style.display = "block";
      return;
    }
  });
}

export function submitEventsInit({ rootEl, manager, rerender }) {
  rootEl.addEventListener("submit", (event) => {
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

    rerender();
  });
}
