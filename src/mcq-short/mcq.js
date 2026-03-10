function BULLSHIT() {
    document.querySelector('.answer').style.display = 'block';
    document.querySelector('.correct').style.display = 'block';
    document.querySelector('.incorrect').style.display = 'none';
}

function WRONG() {
    document.querySelector('.answer').style.display = 'block';
    document.querySelector('.correct').style.display = 'none';
    document.querySelector('.incorrect').style.display = 'block';
}

function Next() {
    document.querySelector('.answer').style.display = "block";// Change to the URL of the next question
    document.querySelector('.correct').style.display = 'none';
    document.querySelector('.incorrect').style.display = 'none';
}
console.log("mcq.js loaded");