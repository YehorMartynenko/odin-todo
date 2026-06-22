import { createSection, createAddTaskBtn } from "./task-section.js";
import {
  taskListEventsInit,
  inlineFormEventsInit,
  submitEventsInit,
} from "../section-events.js";

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

  taskListEventsInit({
    rootEl: rootDiv,
    manager: manager,
    rerender: () => TodayPageController(manager),
  });

  inlineFormEventsInit({
    rootEl: rootDiv,
    manager: manager,
  });

  submitEventsInit({
    rootEl: rootDiv,
    manager: manager,
    rerender: () => TodayPageController(manager),
  });

  contentDiv.appendChild(rootDiv);
}
