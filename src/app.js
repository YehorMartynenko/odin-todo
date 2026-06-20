import { Manager } from "./manager.js";
import { Storage } from "./storage.js";
import { ScreenController } from "./screen-controller.js";

export class App {
  constructor() {
    this.storage = new Storage();
    this.manager = new Manager(this.storage);
    this.screenController = new ScreenController(this.manager);
  }

  startApp() {
    this.screenController.initialLoad();
  }
}
