var cardContainer = document.getElementById('container-cards');
var submitButton = document.getElementById('btn-submit');
var cardContentInput = document.getElementById('cardContentInput');

submitButton.addEventListener("click", onClickSubmit);
cardContentInput.addEventListener("keyup", onPressEnter);

function onClickSubmit() {
    const inputValue = cardContentInput.value.trim();
    if (inputValue) {
        getColorsToCard().then(res => {
            cardContainer.innerHTML = `<div class="card" style=" background:${res.backColor}; color:${res.textColor};" }>
            <p>${safe_tags_replace(inputValue)}</p>
            </div>`+ cardContainer.innerHTML;
        });
        cardContentInput.value = '';
        cardContentInput.focus();
        submitButtonDisable(true);
        document.title = inputValue;
    }
}

function onPressEnter(event) {
    if (event.key === 'Enter' && !submitButton.disabled)
        onClickSubmit();
    else {
        if (cardContentInput.value.trim())
            submitButtonDisable(false);
        else
            submitButtonDisable(true);
    }
}

function submitButtonDisable(val) {
    if (val)
        submitButton.classList.remove('btn-card-create-active');
    else
        submitButton.classList.add('btn-card-create-active');
}

function getColorsFromServer() {
    return fetch('http://api.creativehandles.com/getRandomColor')
        .then(res => {
            if (res.status >= 400)
                return new Error('Cannot get the colors from server!');
            return res.json();
        });
}

function getColorsToCard() {
    var backgroundColor = '#6d4298';
    var color = '#FFFFFF';
    return new Promise((resolve, reject) => {
        getColorsFromServer()
            .then(res => {
                backgroundColor = res.color;
                color = '#' + res.color.slice(1, res.color.length).split('').reverse().join('');
                resolve({ backColor: backgroundColor, textColor: color });
            })
            .catch(err => {
                console.log(err.message);
                resolve({ backColor: backgroundColor, textColor: color });
            });

        ;
    });
}

// html escaping
var tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};

function replaceTag(tag) {
    return tagsToReplace[tag] || tag;
}

function safe_tags_replace(str) {
    return str.replace(/[&<>]/g, replaceTag);
}