const input_ele = document.querySelector("#csvImport")
const submit_btn = document.querySelector("#submit_btn")

function import_quizlet(text) {
    try {
        let dictionary = {}
        const list = text.split(/\n/).filter((item) => item.trim() !== "") // split the text into pairs
        for (let i in list) {
            const pair = list[i].split(/\t/).filter(item => item.trim() !== "")
            dictionary[pair[0]] = pair[1]
        }
        return {"status":true, "result":dictionary}
    } catch (err) {
        return {"status":false,"error":err}
    }
}

submit_btn.addEventListener("click",() => {
    const import_result = import_quizlet(input_ele.value)
    console.log(import_result)
    if (import_result.status) {
        localStorage.setItem("imported_flashcard",JSON.stringify(import_result.result))
        window.close()
    } else {
        sendError(import_result.error)
    }
})