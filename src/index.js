import { App } from "./app.js";
const myApp = new App();

console.log(myApp.manager.createProject({id: "1", title: "newProject"}));
myApp.manager.createTodo({title: "todo1"});
myApp.manager.createTodo({ title: "todo2Bindedd", projectId: "1"});
myApp.manager.deleteProjectById("1");
