import { Todo } from "./todo.js";
import { Project } from "./project.js";
import { isPast, isValid, compareAsc, isDate } from "date-fns";

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
        
        todo.dueDate = this.normalizeDueDate(todo.dueDate);
        const newTodo = new Todo(todo);
        this.todos.push(newTodo);

        this.storage.saveTodos(this.todos);
        return newTodo;
   }

    isDateOnly(value) {
        return /^\d{4}-\d{2}-\d{2}$/.test(value);
    }

    normalizeDueDate(value) {
        if (this.isDateOnly(value)) {
            const [year, month, day] = value.split("-").map(Number);
            return new Date(year, month - 1, day, 23, 59, 59, 999).getTime();
        }

        return new Date(value).getTime();
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

   toggleStatus(elementId){
       const element = this.getTodoById(elementId) ? this.getTodoById(elementId) : this.getProjectById(elementId);
    if(element.isComplete){
        this.updateTodo({id: elementId, isComplete: false});
    } else {
        this.updateTodo({ id: elementId, isComplete: true });
    }
   }

   getAllTodos(){
        return this.todos;
   }

   getOverdueTodos(){
    const overdueTodos = this.todos.filter(todo => isPast(todo.dueDate) && !todo.isComplete);
    const sortedOverdueTodos = this.sortByDates(overdueTodos);
    return sortedOverdueTodos;
   }

    getCurrentTodos(){
        const notOverdueTodos = this.todos.filter(todo => !isPast(todo.dueDate) && !todo.isComplete);
        const sorted = this.sortByDates(notOverdueTodos);
        return sorted;
    }

   getTodayTodos(){
    const todayTodos = this.todos.filter(todo => {
        const isSameDate = new Date(todo.dueDate).toDateString() === new Date().toDateString();
        const isOverdue = isPast(todo.dueDate, Date.now());
        if (todo.dueDate && isSameDate && !isOverdue && !todo.isComplete){
            return true;
        }
    })
       const sortedTodayTodos = this.sortByDates(todayTodos);
    return sortedTodayTodos;
   }

   sortByDates(arr){
    for (let i = 1; i<arr.length; i++){
        let key = arr[i];
        let j = i-1;
        while (j >= 0 && (compareAsc(arr[j].dueDate, key.dueDate) > 0)) {
            arr[j+1] = arr[j];
            j--;
        }
        arr[j+1] = key;
    }
    return arr;
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

   getInboxTodos(){
    const todos = this.todos.filter(todo => !todo.projectId && !todo.isComplete);
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

        if (todo.dueDate && !isValid(new Date(todo.dueDate))) {
            console.log(todo.dueDate);
            errors.push("Invalid date format");
        } 
        return errors.length ? { isValid: false, errors } : { isValid: true };
   }

    validateProject(project) {
        const errors = [];
        if (project.priority && (project.priority > 3 || project.priority < 1)) {
            errors.push("Invalid priority value");
        }

        if (project.dueDate && !isValid(project.dueDate)) {
            errors.push("Invalid date format");
        }
        return errors.length ? { isValid: false, errors } : { isValid: true };
    }
}
