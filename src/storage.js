export class Storage {
    saveTodos(todosArr){
        localStorage.setItem("todo", JSON.stringify(todosArr));
    }

    getTodos(){
        const todosArr = localStorage.getItem("todo");
        return todosArr ? JSON.parse(todosArr) : [];
    }
}