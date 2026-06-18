import { da } from "date-fns/locale";

export function formatDate(dateStr){
    if(!dateStr) return;
    const formatter = new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric"
    })

    const dateObj = new Date(dateStr);

    return formatter.format(dateObj);
}

export function getTodayEndDateTimeLocalValue(){
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}T23:59`;
}

export function timestampToDate(timestamp){
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const formatted = `${year}-${month}-${day}T${hours}:${minutes}`;
    return formatted;
}
