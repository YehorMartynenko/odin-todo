export function formatDate(dateStr){
    const formatter = new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric"
    })

    const dateObj = new Date(dateStr);

    return formatter.format(dateObj);
}
