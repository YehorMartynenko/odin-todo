import {
  createSection,
  createAddProjectBtn,
} from "../helpers/my-projects-section.js";
import {
  inlineFormEventsInit,
  submitEventsInit,
  projectListEvents,
} from "../project-events.js";

const DEFAULT_PROJECT_MESSAGE =
  "You have no projects yet. Click the button below to create one.";
export function ProjectsPageController(manager) {
  const contentDiv = document.getElementById("right-panel-content");
  contentDiv.innerHTML = "";

  const rootDiv = document.createElement("div");
  rootDiv.id = "today-page-root";

  const pageHeader = document.createElement("h1");
  pageHeader.textContent = "My Projects";
  pageHeader.className = "page-header";

  const inboxSection = createSection({
    projects: manager.getAllProjects(),
    defaultMessage: DEFAULT_PROJECT_MESSAGE,
  });

  const addProjectBtn = createAddProjectBtn();

  inboxSection.appendChild(addProjectBtn);

  rootDiv.append(pageHeader, inboxSection);

  inlineFormEventsInit({
    rootEl: rootDiv,
    manager: manager,
  });

  submitEventsInit({
    rootEl: rootDiv,
    manager: manager,
    rerender: () => ProjectsPageController(manager),
  });

  projectListEvents({
    rootEl: rootDiv,
    manager: manager,
  });

  contentDiv.appendChild(rootDiv);
}
