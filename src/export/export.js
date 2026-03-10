export function export2csv(object, title, term_terminator = ',', line_terminator = '\n') {
    const keys = Object.keys(object);
    const values = Object.values(object);
    let csv = "";
    
    for (let i in keys) {
        // Properly escape both key and value
        const escapedKey = escapeCsvField(keys[i], term_terminator);
        const escapedValue = escapeCsvField(values[i], term_terminator);
        
        csv = `${csv}${escapedKey}${term_terminator}${escapedValue}${line_terminator}`;
    }
    download(csv, title, 'text/csv');
}

function escapeCsvField(field, delimiter = ',') {
    const stringField = String(field);
    
    if (stringField.includes(delimiter) || 
        stringField.includes('"') || 
        stringField.includes('\n') || 
        stringField.includes('\r')) {
        return `"${stringField.replace(/"/g, '""')}"`;
    }
    return stringField;
}

function download(object, title,the_type='application/json') {
    const blob = new Blob([object],{type:the_type})
    const url_obj = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url_obj
    a.download = title
    document.body.appendChild(a)
    a.click();
    document.body.removeChild(a)
    URL.revokeObjectURL(url_obj)
}

document.querySelector("#hi").addEventListener("click",() => {
    export2csv({"Morni,ng":"Goo,d","Afternoon":"Also good"},"testing.csv",",","\n")
})