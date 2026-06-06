export class Project {
    constructor({
        id = crypto.randomUUID(),
        title = "No title",
        notes = "",
        dueDate = null,
        priority = 3,
        isComplete = false
    } = {}) {
        this.id = id
        this.title = title;
        this.notes = notes;
        this.dueDate = dueDate;
        this.priority = priority;
        this.isComplete = isComplete;
    }
}