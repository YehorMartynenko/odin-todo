import * as domHelper from "./dom-helpers.js";
import { timestampToDate, getTodayEndDateTimeLocalValue } from "./utils.js";
import { PRIORITIES } from "./constants.js";

export function openTaskDialog({ task = null, projects = [], onSubmit }) {
    const dialog = createTaskDialog({ task, projects, onSubmit });

    document.body.appendChild(dialog);
    dialog.showModal();

    return dialog;
}

function createTaskDialog({ task, projects, mode, onSubmit }) {
    const isEditMode = Boolean(task);

    const dialog = document.createElement("dialog");
    dialog.id = "task-dialog";

    const dialogContent = document.createElement("div");
    dialogContent.className = "dialog-content";

    const form = document.createElement("form");
    form.id = "task-dialog-form";

    if (isEditMode) {
        form.dataset.taskId = task.id;
    }

    const mainFormGroup = document.createElement("div");
    mainFormGroup.className = "form-group";

    const taskDescWrapper = document.createElement("div");
    taskDescWrapper.className = "form-task-desc-wrapper";

    const titleInput = domHelper.createInput({ 
        id: "task-dialog-title", 
        name: "task_title", 
        type: "text",
        placeholder: "Task title",
    });
    titleInput.required = true;
    titleInput.value = task?.title ?? "";

    const descTextarea = domHelper.createTextarea({ 
        id: "task-dialog-desc",
        name: "task_desc", 
        placeholder: "Add description" 
    });
    descTextarea.value = task?.notes ?? "";

    taskDescWrapper.append(titleInput, descTextarea);

    const buttonsWrapper = document.createElement("div");
    buttonsWrapper.className = "form-buttons-wrapper";

    const cancelButton = domHelper.createButton({
        text: "Cancel",
        className: ["cancel-btn"],
        type: "button",
    });

    const submitButton = domHelper.createButton({
        text: isEditMode ? "Save" : "Create",
        className: ["submit-btn"],
        type: "submit"
    });

    buttonsWrapper.append(cancelButton, submitButton);

    mainFormGroup.append(taskDescWrapper, buttonsWrapper);

    const metadataWrapper = document.createElement("div");
    metadataWrapper.className = "form-metadata-wrapper";

    const projectGroup = createFormGroup({
        labelText: "Project",
        htmlFor: "task-dialog-project",
        field: createProjectSelect(projects, task?.projectId ?? ""),
    });

    const dateGroup = createFormGroup({
        labelText: "Date",
        htmlFor: "task-dialog-date",
        field: createDateInput(task),
    });

    const priorityGroup = createFormGroup({
        labelText: "Priority",
        htmlFor: "task-dialog-priority",
        field: createPrioritySelect(task?.priority ?? 2),
    });

    metadataWrapper.append(projectGroup, dateGroup, priorityGroup);

    form.append(mainFormGroup, metadataWrapper);
    dialogContent.appendChild(form);
    dialog.appendChild(dialogContent);

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const data = {
            title: form.elements.task_title.value.trim(),
            notes: form.elements.task_desc.value.trim(),
            dueDate: form.elements.task_date.value,
            priority: Number(form.elements.task_priority.value),
            projectId: form.elements.task_project.value || null,
        };

        if (!data.title) return;

        onSubmit(data);
        dialog.close();
    });

    cancelButton.addEventListener("click", () => {
        dialog.close();
    });

    dialog.addEventListener("close", () => {
        dialog.remove();
    }, { once: true });

    return dialog;
}


function createFormGroup({ labelText, htmlFor, field }) {
    const group = document.createElement("div");
    group.className = "form-group";

    const label = document.createElement("label");
    label.htmlFor = htmlFor;
    label.textContent = labelText;

    group.append(label, field);

    return group;
}

function createProjectSelect(projects, selectedProjectId) {
    return domHelper.createSelect({
        id: "task-dialog-project",
        name: "task_project",
        options: projects,
        defaultOption: { value: "", title: "No Project" },
        selectedOption: selectedProjectId,
    });
}

function createDateInput(task) {
    const dateInput = domHelper.createInput({
        id: "task-dialog-date",
        name: "task_date",
        type: "datetime-local",
    });

    dateInput.value = task?.dueDate
        ? timestampToDate(task.dueDate)
        : getTodayEndDateTimeLocalValue();

    return dateInput;
}

function createPrioritySelect(selectedPriority) {
    return domHelper.createSelect({
        id: "task-dialog-priority",
        name: "task_priority",
        options: PRIORITIES,
        selectedOption: Number(selectedPriority),
    });
}