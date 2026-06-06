import { Manager } from "./manager.js";
import { Storage } from "./storage.js";

export class App {
    constructor(){
        this.storage = new Storage();
        this.manager = new Manager(this.storage);
    }
}

