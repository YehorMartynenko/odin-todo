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

        const checkResult = this.validateTodo(todo);
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
        const checkResult = this.validateTodo(updatedTodo);
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

   getTodosByProject(projectId){
        const todos = this.todos.filter(todo => todo.projectId === projectId);
        return todos;
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

    createProject(project = {}) {
        const projectExists = this.projects.find(projectEl => projectEl.id === project.id)
        if (projectExists) {
            console.warn("Project already exists");
            return null;
        }

        const checkResult = this.validateProject(project);
        if (!checkResult.isValid) {
            console.warn(checkResult.errors);
            return null;
        }

        const newProject = new Project(project);
        this.projects.push(newProject);

        this.storage.saveProjects(this.projects);
        return newProject;
    }

    updateProject(changes = {}) {
        const projectIndex = this.projects.findIndex(project => project.id === changes.id);
        if (projectIndex === -1) {
            console.warn("Specified project not found");
            return null;
        }
        const updatedProject = { ...this.projects[projectIndex], ...changes }
        const checkResult = this.validateProject(updatedProject);
        if (!checkResult.isValid) {
            console.warn(checkResult.errors);
            return null;
        }
        this.projects[projectIndex] = new Project(updatedProject);
        this.storage.saveProjects(this.projects);
        return this.projects[projectIndex];
    }

    getAllProjects() {
        return this.projects;
    }

    getProjectById(projectId) {
        const project = this.projects.find(projectEl => projectEl.id === projectId);
        if (!project) {
            console.warn("Requested project not found");
            return null;
        }
        return project;
    }

    deleteProjectById(projectId) {
        const projectIndex = this.projects.findIndex(projectEl => projectEl.id === projectId);
        if (projectIndex === -1) {
            console.warn("Specified project not found");
            return null;
        }
        const projectToDelete = this.projects[projectIndex];
        this.todos.forEach((todo, index) => {
            if(todo.projectId === projectToDelete.id){
                this.todos[index] = new Todo({ ...todo, projectId: null });
            }
        })
        this.storage.saveTodos(this.todos);
        this.projects.splice(projectIndex, 1);
        this.storage.saveProjects(this.projects);
        return projectToDelete;
    }

    isDateValid(dateStr){
        return !isNaN(new Date(dateStr).getTime());
   }

    validateTodo(todo){
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

    validateProject(project) {
        const errors = [];
        if (project.priority && (project.priority > 3 || project.priority < 1)) {
            errors.push("Invalid priority value");
        }

        if (project.dueDate && !this.isDateValid(project.dueDate)) {
            errors.push("Invalid date format");
        }
        return errors.length ? { isValid: false, errors } : { isValid: true };
    }
}
