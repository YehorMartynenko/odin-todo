import { createSection, createAddTaskBtn } from "./task-section.js";
import {
  taskListEventsInit,
  inlineFormEventsInit,
  submitEventsInit,
} from "./section-events.js";

const DEFAULT_INBOX_MESSAGE = "Capture now, organize later";
export function InboxPageController(manager) {
  const contentDiv = document.getElementById("right-panel-content");
  contentDiv.innerHTML = "";

  const rootDiv = document.createElement("div");
  rootDiv.id = "today-page-root";

  const pageHeader = document.createElement("h1");
  pageHeader.textContent = "Inbox";
  pageHeader.className = "page-header";

  const inboxSection = createSection({
    todos: manager.getInboxTodos(),
    defaultMessage: DEFAULT_INBOX_MESSAGE,
  });

  const addTaskBtn = createAddTaskBtn();

  inboxSection.appendChild(addTaskBtn);

  rootDiv.append(pageHeader, inboxSection);

  taskListEventsInit({
    rootEl: rootDiv,
    manager: manager,
    rerender: () => InboxPageController(manager),
  });

  inlineFormEventsInit({
    rootEl: rootDiv,
    manager: manager,
  });

  submitEventsInit({
    rootEl: rootDiv,
    manager: manager,
    rerender: () => InboxPageController(manager),
  });

  contentDiv.appendChild(rootDiv);
}
