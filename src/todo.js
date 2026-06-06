export class Todo {
    constructor({
        title = "No title", 
        notes = "", 
        dueDate = null, 
        priority = 3, 
        projectId = null, 
        isComplete = false 
    } = {}) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.notes = notes;
        this.dueDate = dueDate;
        this.priority = priority;
        this.projectId = projectId;
        this.isComplete = isComplete;
    }
}