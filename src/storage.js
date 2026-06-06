export class Storage {
    saveTodos(todos){
        localStorage.setItem("todo", JSON.stringify(todos));
    }

    saveProjects(projects){
        localStorage.setItem("project", JSON.stringify(projects));
    }

    getTodos(){
        const todos = localStorage.getItem("todo");
        return todos ? JSON.parse(todos) : [];
    }

    getProjects(){
        const projects = localStorage.getItem("project");
        return projects ? JSON.parse(projects) : [];
    }
}