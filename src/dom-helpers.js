export function createButton({ text, type = "button", className = [] }){
    const button = document.createElement("button");

    if (text) button.textContent = text;
    if (type) button.type = type;
    addClasses(button, className);

    return button;
}

export function createInput({id, className = [], type = "text", name, placeholder}){
    const input = document.createElement("input");
    if (id) input.id = id;
    if (type) input.type = type;
    if (name) input.name = name;
    if (placeholder) input.placeholder = placeholder;
    addClasses(input, className);

    return input;
}

export function createTextarea({ id, className = [], name, placeholder }) {
    const textarea = document.createElement("textarea");
    if (id) textarea.id = id;
    if (name) textarea.name = name;
    if (placeholder) textarea.placeholder = placeholder;
    addClasses(textarea, className);

    return textarea;
}

export function createSelect({id, name, className = [], options = [], defaultOption, selectedOption}){
    const select = document.createElement("select");
    if (id) select.id = id;
    if (name) select.name = name;
    addClasses(select, className);

    if(defaultOption){
        const option = document.createElement("option");
        option.value = defaultOption.value;
        option.textContent = defaultOption.title;
        select.appendChild(option)
    }

    options.forEach(optionEl => {
        const option = document.createElement("option");
        if (String(selectedOption) === String(optionEl.id)){
            option.selected = true;
        }
        option.value = optionEl.id;
        option.textContent = optionEl.title;
        select.appendChild(option);
    });

    return select;
}

function addClasses(element, classes = []){
    if (Array.isArray(classes)) {
        element.classList.add(...classes);
    } else {
        element.className = classes;
    }

    return element;
}