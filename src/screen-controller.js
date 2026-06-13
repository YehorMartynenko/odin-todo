import { TodayPageController } from "./today-page.js";
export class ScreenController {
    constructor(manager){
        this.manager = manager;
    }

    initialLoad(){
        TodayPageController(this.manager);
        
        const leftPanel = document.getElementById("left-panel");
        leftPanel.addEventListener("click", (event) => {
            const button = event.target.closest("li");

            if(!button) return;

            if (button.dataset.btn === "today-btn"){
                TodayPageController(this.manager);
            }
        })
    }
}