function disappearById(ids, hide = false) {
    return new Promise((resolve, reject) => {
        ids.forEach(id => {
            const element = document.getElementById(id)
            element.classList.add('scale-out')
        })
        if (hide) {
            setTimeout(() => {
                ids.forEach(id => {
                    const element = document.getElementById(id)
                    element.classList.add('hide')
                })
                resolve('Succes disappear and hide')
            }, 700)
        } else {
            setTimeout(() => {
                resolve('Succes disappear')
            }, 700)
        }
    })
}

function appearById(...ids) {
    ids.forEach(id => {
        const element = document.getElementById(id)
        element.classList.remove('scale-out')
    })
}

const modifyById = (id, text) => document.getElementById(id).innerHTML = text

const modifyByClass = ($class, texts) => {
    let i = 0
    const els = [...document.getElementsByClassName($class)]
        // console.log(els)
    return els.forEach(element => {
        //console.log(`Element: ${element} text: ${texts[i]}`)
        element.innerHTML = texts[i]
        i++
    })
}

const quitHide = (id) => document.getElementById(id).classList.remove('hide')
const quitCheked = () => [...document.getElementsByTagName('input')].forEach(el => el.checked = false)

let questionIndex = 0
let correctAnswers = 0

function startGame() {
	if (innerWidth < 600) {
		disappearById(['title']).then(() => {
			document.getElementById('title').classList.add('hide')
		})
	}
    quitCheked()
    disappearById(['startBtn', 'pregunta']).then(() => {
            quitHide('form')
            modifyById('pregunta', data.preguntas[questionIndex].pregunta)
            modifyByClass('respuestas', data.preguntas[questionIndex].respuestas)
            appearById('form', 'pregunta')
        })
        //console.log(data)
}

function restartGame() {
    disappearById(['finalDiv'], true)
    quitHide('pregunta')
    questionIndex = 0
    correctAnswers = 0
    startGame()
}

function nextQuestion() {
    disappearById(['pregunta', 'respuestas']).then(() => {
        quitCheked()
        modifyById('pregunta', data.preguntas[questionIndex].pregunta)
        modifyByClass('respuestas', data.preguntas[questionIndex].respuestas)
        appearById('respuestas', 'pregunta')
    })
}

function validateAnswer() {
    const answer = document.forms["questionsForm"]["group1"].value

    function finishValidation() {
        questionIndex++

        if (questionIndex >= data.preguntas.length) {
            return showResult('finish')
        } else {
            return nextQuestion()
        }
    }

    if (answer == "") {
        return M.toast({
            html: 'Por favor seleccione una respuesta',
            displayLength: 1000
        })
    } else if (answer == data.preguntas[questionIndex].correcto) {
        correctAnswers++

        swal({
            icon: 'success',
            title: `Pregunta ${questionIndex + 1}: Correcta!`,
            button: 'Siguiente'
        }).then((value) => finishValidation() )
    } else { 
        const correct = data.preguntas[questionIndex].respuestas[data.preguntas[questionIndex].correcto]
        const el = document.createElement('p')
        el.innerHTML = `Respuesta correcta: </br><div class="respuesta">${correct}</div>`

        swal({
            icon: 'error',
            title: `Pregunta ${questionIndex + 1}: incorrecta`,
            content: {element:el},
            button: 'Siguiente'
        }).then((value) => finishValidation())
    }
}

function showResult() {
    disappearById(['pregunta', 'form', 'startBtn'], true).then(() => {
        modifyById('corrects', correctAnswers)
        quitHide('finalDiv')
        appearById('finalDiv')
    })
}