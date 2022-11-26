// ====================================================== VARIABLES =====================================================
const $newsLetterForm = document.querySelector('#newsLetterForm')

const $offerList = document.querySelector('.offerList')
const $moreOffers = document.querySelector('.moreOffers')
let offerHTML = ''

// ============================================= NEWSLETTER FORM VALIDATION =============================================
$newsLetterForm.onsubmit = e => {
    e.preventDefault()

    let isThereAnError = false
    
    const { name, email, cpf, genre } = $newsLetterForm
    
    if (!name.value) {
        isThereAnError = true
        name.nextElementSibling.innerText = 'campo vazio!' 
        name.classList.add('inputError')
    } else { 
        name.nextElementSibling.innerText = ''
        name.classList.remove('inputError')
    }

    if (!email.value) {
        isThereAnError = true
        email.nextElementSibling.innerText = 'campo vazio!'
        email.classList.add('inputError')
    } else {
        email.nextElementSibling.innerText = ''
        email.classList.remove('inputError')
    } 

    if (!cpf.value) {
        isThereAnError = true
        cpf.nextElementSibling.innerText = 'campo vazio!'
        cpf.classList.add('inputError')
    } else {
        cpf.nextElementSibling.innerText = ''
        cpf.classList.remove('inputError') 
    }

    genre.forEach(item => {
        const masc = genre.item(0)
        const fem = genre.item(1)

        if (masc.checked == false && fem.checked == false) {
            isThereAnError = true
            const label = item.nextElementSibling
            label.classList.add('inputError')
        } else {
            const label = item.nextElementSibling
            label.classList.remove('inputError')
        }
    })

    if (!isThereAnError) {
        newsLetterFeedback()
    }
}

function newsLetterFeedback() {
    const $newsLetterMessage = document.querySelector('.newsLetterMessage')
    const $secondsToReturn = document.querySelector('.secondsToReturn')
    
    $newsLetterForm.style.display = 'none'
    $newsLetterMessage.style.display = 'flex'
    
    let count = 31
    
    const countDown = setInterval(() => {
        count--
        $secondsToReturn.innerText = `Retornando em ${count} segundos`

        if (count === 0) {
            clearInterval(countDown)
            formReturn()
        }
    }, 1000)
    
    function formReturn() {
        $secondsToReturn.innerText = 'Retornando em...'
        $newsLetterForm.style.display = 'block'
        $newsLetterMessage.style.display = 'none'
        formReset()
    }
}

function formReset() {
    const { name, email, cpf, genre } = $newsLetterForm

    name.value = ''
    email.value = ''
    cpf.value = ''

    genre.forEach(item => {
        item.checked = false
      })
}

// =========================================== API REQUEST AND DATA CONSTRUCT ===========================================
document.body.onload = () => {
    formReset()
    request()
} 

function request(link) {
    if (!link) {
        fetch('https://frontend-intern-challenge-api.iurykrieger.vercel.app/products?page=1')
        .then(getResponse)
        .then(dataShow)
        .catch(error)
    } else {
        fetch(`https://${link}`)
        .then(getResponse)
        .then(dataShow)
        .catch(error)
    }
}

function getResponse(response) {
    if (response.status === 200) {
        return response.json()
    }
}


function dataShow(data) {
    const { products, nextPage } = data


    for (let product of products) {
        const { image, id, description, oldPrice, price, installments: {count, value} } = product
        
        offerHTML += `
            <li class="offer">
                <div class="thumbnail" style="background-image: url(${image});"></div>

                <span class="name"> Produto número ${id + 1} </span>

                <p class="description">
                    ${description}
                </p>

                <span class="oldPrice">De: ${oldPrice} </span>

                <h4 class="newPrice">Por: ${price} </h4>

                <span class="installments">
                    ou ${count}x de R$${value.toString().replace('.', ',')}
                </span>

                <button>Comprar</button>
            </li>
        `

        $offerList.innerHTML = offerHTML
    }

    $moreOffers.onclick = () => {
        offerHTML = offerHTML
        request(nextPage)
    }
}

function error() {
    console.log('ops, ocorreu um erro!')
}