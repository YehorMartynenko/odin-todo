import { createSection } from "../task-section.js";
import { taskListEventsInit } from "../section-events.js";

const DEFAULT_PROJECT_TODOS_MESSAGE = "This project have no tasks yet.";
export function ProjectPageController(project, manager) {
  const contentDiv = document.getElementById("right-panel-content");
  contentDiv.innerHTML = "";

  const rootDiv = document.createElement("div");
  rootDiv.id = "today-page-root";

  const pageHeader = document.createElement("h1");
  pageHeader.textContent = project.title;
  pageHeader.className = "page-header";

  const projectTodosSection = createSection({
    todos: manager.getTodosByProject(project.id),
    defaultMessage: DEFAULT_PROJECT_TODOS_MESSAGE,
  });

  rootDiv.append(pageHeader, projectTodosSection);

  taskListEventsInit({
    rootEl: rootDiv,
    manager: manager,
    rerender: () => ProjectPageController(project, manager),
  });

  contentDiv.appendChild(rootDiv);
}
