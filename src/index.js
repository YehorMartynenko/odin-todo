import { App } from "./app.js";
const myApp = new App();

console.log(myApp.manager.updateTodo({priority: "2"}));