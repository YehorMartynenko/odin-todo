import { TodayPageController } from "./today-page.js";
import { InboxPageController } from "./inbox-page.js";
import { ProjectsPageController } from "./my-projects-page.js";
import { openTaskDialog } from "../helpers/task-dialog.js";

export class ScreenController {
  constructor(manager) {
    this.manager = manager;
    this.currentPage = "today";
  }

  initialLoad() {
    this.loadTodayPage();
    this.initLeftPanelEvents();
  }

  initLeftPanelEvents() {
    const leftPanel = document.getElementById("left-panel");

    leftPanel.addEventListener("click", (event) => {
      const addTask = event.target.closest(".add-task-main-btn");
      const navButton = event.target.closest("li");

      if (addTask) {
        this.openCreateTaskDialog();
        return;
      }

      if (!navButton) return;

      if (navButton.dataset.btn === "today-btn") {
        this.loadTodayPage();
        return;
      }

      if (navButton.dataset.btn === "inbox-btn") {
        this.loadInboxPage();
        return;
      }

      if (navButton.dataset.btn === "my-projects-btn") {
        this.loadProjectsPage();
        return;
      }
    });
  }

  openCreateTaskDialog() {
    openTaskDialog({
      projects: this.manager.getAllProjects(),
      onSubmit: (data) => {
        this.manager.createTodo(data);
        this.renderCurrentPage();
      },
    });
  }

  loadTodayPage() {
    this.currentPage = "today";
    TodayPageController(this.manager);
  }

  loadInboxPage() {
    this.currentPage = "inbox";
    InboxPageController(this.manager);
  }

  loadProjectsPage() {
    this.currentPage = "projects";
    ProjectsPageController(this.manager);
  }

  renderCurrentPage() {
    if (this.currentPage === "today") {
      TodayPageController(this.manager);
      return;
    }

    if (this.currentPage === "inbox") {
      InboxPageController(this.manager);
      return;
    }

    if (this.currentPage === "projects") {
      ProjectsPageController(this.manager);
      return;
    }
  }
}
