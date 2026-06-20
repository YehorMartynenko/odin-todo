export class Project {
    constructor({
        id = crypto.randomUUID(),
        title = "No title",
    } = {}) {
        this.id = id
        this.title = title;
    }
}