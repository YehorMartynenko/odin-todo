export class Project {
    constructor({
        title = "No title",
        notes = "",
        dueDate = null,
        priority = 3,
        isComplete = false
    } = {}) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.notes = notes;
        this.dueDate = dueDate;
        this.priority = priority;
        this.isComplete = isComplete;
    }
}