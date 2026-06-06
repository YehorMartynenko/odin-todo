import { Todo } from "./todo.js";
import { Project } from "./project.js";

export class Manager {
    constructor(storage){
        this.storage = storage;
        const rawTodos = this.storage.getTodos();
        this.todos = rawTodos.map(todo => new Todo(todo));
        const rawProjects = this.storage.getProjects();
        this.projects = rawProjects.map(project => new Project(project)); 
   }

    createTodo(todo = {}){
        if(todo.projectId){
            const isPresent = this.projects.some(project => project.id === todo.projectId);
            if(!isPresent){
                console.warn("Specified project not found");
                return null;
            }
        }

        if(todo.priority && todo.priority > 3 || todo.priority < 1){
           console.warn("Wrong prioroty value");
           return null; 
        }

        const newTodo = new Todo(todo);
        this.todos.push(newTodo);
        this.storage.saveTodos(this.todos);
        
        return newTodo;
   }
}
