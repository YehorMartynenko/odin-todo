import { Todo } from "./todo.js";
import { Project } from "./project.js";

export class Manager {
    constructor(storage){
        this.storage = storage;
        const rawTodos = this.storage.getTodos();
        this.todosArr = rawTodos.map(todo => new Todo(todo));
   }

    createTodo(todo = {}){
        const newTodo = new Todo(todo);
        this.todosArr.push(newTodo);
        this.storage.saveTodos(this.todosArr);
        
        return newTodo;
   }
}
