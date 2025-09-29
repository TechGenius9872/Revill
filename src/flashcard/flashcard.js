function import_quizlet(text) {
    let dictionary = {}
    const list = text.split(/\n/).filter((item) => item.trim() !== "")
    for (let i in list) {
        const pair = list[i].split(/ /).filter(item => item.trim() !== "")
        dictionary[pair[0]] = pair[1]
    }
    return dictionary
}

const jsonResult = import_quizlet(/*propmt("Your flashcard")*/`china  chinese

japan    japanese`)

console.log(jsonResult)