const input_ele = document.querySelector("#csvImport")
const submit_btn = document.querySelector("#submit_btn")

function import_quizlet(text) {
    let dictionary = {}
    const list = text.split(/\n/).filter((item) => item.trim() !== "")
    for (let i in list) {
        const pair = list[i].split(/ /).filter(item => item.trim() !== "")
        dictionary[pair[0]] = pair[1]
    }
    return dictionary
}

