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
        const todoExists = this.todos.find(todoEl => todoEl.id === todo.id)
        if(todoExists){
            console.warn("Todo already exists");
            return null;
        }

        const checkResult = this.todoValidation(todo);
        if(!checkResult.isValid){
            console.warn(checkResult.errors);
            return null;
        }

        const newTodo = new Todo(todo);
        this.todos.push(newTodo);

        this.storage.saveTodos(this.todos);
        return newTodo;
   }

    updateTodo(changes = {}) {
        const todoIndex = this.todos.findIndex(todo => todo.id === changes.id);
        if (todoIndex === -1){
            console.warn("Specified todo not found");
            return null;
        }
        const updatedTodo = {...this.todos[todoIndex], ...changes }
        const checkResult = this.todoValidation(updatedTodo);
        if (!checkResult.isValid) {
            console.warn(checkResult.errors);
            return null;
        }
        this.todos[todoIndex] = new Todo(updatedTodo);
        this.storage.saveTodos(this.todos);
        return this.todos[todoIndex];
   }

   getAllTodos(){
        return this.todos;
   }

   getTodoById(todoId){
        const todo = this.todos.find(todoEl => todoEl.id === todoId);
        if(!todo){
            console.warn("Requested todo not found");
            return null;
        }
        return todo;
   }

   deleteTodoById(todoId){
        const todoIndex = this.todos.findIndex(todoEl => todoEl.id === todoId);
        if(todoIndex === -1){
            console.warn("Specified todo not found");
            return null;
        }
        const todoToDelete = this.todos[todoIndex];
        this.todos.splice(todoIndex, 1);
        this.storage.saveTodos(this.todos);
        return todoToDelete;
   }

    isDateValid(dateStr){
        return !isNaN(new Date(dateStr).getTime());
   }

    todoValidation(todo){
        const errors = [];
        if (todo.projectId) {
            const isPresent = this.projects.some(project => project.id === todo.projectId);
            if (!isPresent) {
                errors.push("Specified project not found.");
            }
        }

        if (todo.priority && (todo.priority > 3 || todo.priority < 1)) {
            errors.push("Invalid priority value");
        }

        if (todo.dueDate && !this.isDateValid(todo.dueDate)) {
            errors.push("Invalid date format");
        }
        return errors.length ? { isValid: false, errors } : { isValid: true };
   }
}
