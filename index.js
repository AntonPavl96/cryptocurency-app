let selectedCoins

if(localStorage.getItem('selectedCoins') === null) {
    selectedCoins = []
}
else {
    selectedCoins = JSON.parse(localStorage.getItem('selectedCoins'))
}

const myGif = document.querySelector('.loading')
const popUpContainer = document.querySelector('.popUpContainer')

const searchInput = document.querySelector('#searchInput')
const searchBtn = document.querySelector('#searchBtn')
searchBtn.addEventListener('click', searchHandler)

const homeBtn = document.querySelector('#homeBtn')
const homeDiv = document.querySelector('#homeDiv')
homeBtn.addEventListener('click', showHome)

const reportsBtn = document.querySelector('#reportsBtn')
const reportsDiv = document.querySelector('#reportsDiv')
reportsBtn.addEventListener('click', showReports)

const aboutBtn = document.querySelector('#aboutBtn')
const aboutDiv = document.querySelector('#aboutDiv')
aboutBtn.addEventListener('click', showAbout)

showHome()

//=======================show functions=======================

function showAbout() {
    homeDiv.style.display = 'none'
    reportsDiv.style.display = 'none'
    aboutDiv.style.display = 'flex'
}

function showReports() {
    homeDiv.style.display = 'none'
    reportsDiv.style.display = 'flex'
    aboutDiv.style.display = 'none'
}

function showHome() {
    myGif.style.display = 'inline'
    
    // fetch('https://api.coingecko.com/api/v3/coins/list')
    fetch('https://api.coingecko.com/api/v3/coins')
    .then( res => res.json() )
    .then( data => {
        homeDiv.innerHTML = ''
        myGif.style.display = 'none'
        reportsDiv.style.display = 'none'
        aboutDiv.style.display = 'none'
        homeDiv.style.display = 'flex'

        for(let i = 0; i < data.length; i++) {
            createCard(data, i)
        }

    }).catch(error => alert(error))
}
//============================================================

function createCard(data, i) {
    const cardDiv = createDiv(homeDiv, 'card')
    const cardHeader = createDiv(cardDiv, 'card-header')
    createCoinTitle(cardHeader, data, i)
    createSwitch(cardHeader, data, i)
    const cardBody = createDiv(cardDiv, 'card-body')
    createCoinContent(cardBody, data, i)
    const cardFooter = createDiv(cardDiv, 'card-footer')   
    createInfoBtn(cardFooter, data, i)
}
//=================functions for 'createCard'=================

function createCoinTitle(father, data, i) {
    const title = document.createElement('h4')
    title.className = 'coin-title'
    title.innerHTML = data[i].symbol
    father.appendChild(title)
}

function createSwitch(father, data, i) {
    const switchDiv = createDiv(father, 'custom-control custom-switch')
    createCheckbox(switchDiv, 'custom-control-input', data, i)
    createLabel(switchDiv, 'custom-control-label', data, i)
}

function createCheckbox(father, className, data, i) {
    const inputElement = document.createElement('input')
    inputElement.type = 'checkbox'
    inputElement.className = className
    inputElement.id = data[i].symbol
    inputElement.addEventListener('change', switchHandler)

    for(let i = 0; i < selectedCoins.length; i++) {
        if(inputElement.id == selectedCoins[i]) {
            inputElement.checked = true
        }
    }

    father.appendChild(inputElement)
}

function createLabel(father, className, data, i) {
    const labelElement = document.createElement('label')
    labelElement.className = className
    labelElement.id = `${data[i].symbol}-Label`
    labelElement.htmlFor = data[i].symbol
    father.appendChild(labelElement)
}

function createCoinContent(father, data, i) {
    createPar(father, 'coin-content', data[i].name)
}

function createInfoBtn(father, data, i) {
    const infoBtn = document.createElement('button')
    infoBtn.className = 'btn btn-info'
    infoBtn.innerHTML = 'More Info'
    infoBtn.id = data[i].id
    infoBtn.addEventListener('click', infoBtnHandler)
    father.appendChild(infoBtn)
}
//============================================================

function infoBtnHandler(e) {
    const clickTime = new Date().getTime()
    const keyName = e.target.id
    
    if(e.target.innerHTML == 'More Info') {
        if(localStorage.getItem(keyName) === null) {
            myGif.style.display = 'inline'
            fetch(`https://api.coingecko.com/api/v3/coins/${keyName}`)
            .then( res => res.json() )
            .then( data => {
                myGif.style.display = 'none'
                const coinInfo = createInfoObj(e, data)
                localStorage.setItem(keyName, JSON.stringify(coinInfo))
                createInfoPop(e, coinInfo)
            }).catch(error => alert(error))
        }
        else {
            const coinInfo = getFromLs(e)
            if(clickTime - coinInfo.timeStamp > 120000) {
                const bodyDiv = getCardBody(e)
                const coinInfoDiv = bodyDiv.childNodes[1]
                if(coinInfoDiv !== undefined) {
                    coinInfoDiv.remove()
                }
                myGif.style.display = 'inline'
                fetch(`https://api.coingecko.com/api/v3/coins/${keyName}`)
                .then( res => res.json() )
                .then( data => {
                    myGif.style.display = 'none'
                    const coinInfo = createInfoObj(e, data)
                    coinInfo.timeStamp = clickTime
                    localStorage.setItem(keyName, JSON.stringify(coinInfo))
                    createInfoPop(e, coinInfo)
                }).catch(error => alert(error))   
            }
            else {
                // coinInfo.timeStamp = clickTime
                // localStorage.setItem(keyName, JSON.stringify(coinInfo))
                createInfoPop(e, coinInfo)
            }
        }
        e.target.innerHTML = 'Less Info'
    }

    else {
        const bodyDiv = getCardBody(e)
        const coinInfoDiv = bodyDiv.childNodes[1]
        bodyDiv.firstChild.style.display = 'inline'
        coinInfoDiv.remove()
        e.target.innerHTML = 'More Info'
    }
}
//===============functions for 'infoBtnHandler'===============

function createInfoObj(e, data) {
    const keyName = e.target.id
    const coinInfo = {}
    coinInfo.id = keyName
    coinInfo.src = data.image.small
    coinInfo.usd = `USD: ${data.market_data.current_price.usd}$`
    coinInfo.eur = `EUR: ${data.market_data.current_price.eur}€`
    coinInfo.ils = `ILS: ${data.market_data.current_price.ils}₪`
    coinInfo.timeStamp = new Date().getTime()
    return coinInfo
}

function getFromLs(e) {
    const keyName = e.target.id
    const coinInfo = JSON.parse(localStorage.getItem(keyName))
    return coinInfo
}

function getCardBody(e) {
    const btn = e.target
    const footer = btn.parentElement
    const card = footer.parentElement
    const cardbody = card.childNodes[1]
    return cardbody
}

function createInfoPop(e, coinInfo) {
    const coinBody = getCardBody(e)
    coinBody.firstChild.style.display = 'none'
    const infoDiv = createDiv(coinBody, 'info-div')
    createImg(infoDiv, 'card-img', coinInfo.src)
    const priceDiv = createDiv(infoDiv, 'prices-div')
    createPar(priceDiv, 'price', coinInfo.usd)
    createPar(priceDiv, 'price', coinInfo.eur)
    createPar(priceDiv, 'price', coinInfo.ils)
}
//============================================================

//==================Toggle Switch Functions===================

function switchHandler(e) {
    const mySwitch = e.target
    const headerDiv = mySwitch.parentElement.parentElement
    const namePar = headerDiv.firstChild
    const parContent = namePar.innerHTML
    if(selectedCoins.length < 5) {

        if(mySwitch.checked == true) {
            selectedCoins.push(parContent)
            localStorage.setItem('selectedCoins', JSON.stringify(selectedCoins))
        }
        else {
            const index = selectedCoins.indexOf(parContent)
            selectedCoins.splice(index, 1)
            localStorage.setItem('selectedCoins', JSON.stringify(selectedCoins))
        }
    }
    else if(selectedCoins.length == 5) {

        if(mySwitch.checked == true) {
            popUpContainer.style.display = 'block'
            mySwitch.checked = false
            createPopUp(mySwitch)
        }
        else {
            const index = selectedCoins.indexOf(parContent)
            selectedCoins.splice(index, 1)
            localStorage.setItem('selectedCoins', JSON.stringify(selectedCoins))            
        }
    }
}

function createPopUp(mySwitch) {
    const popUpDiv = document.querySelector(".popUpDiv")
    for(let i = 0; i < 5; i++) {
        const innerDiv = createDiv(popUpDiv, 'innerDiv')
        createPar(innerDiv, 'innerPar', selectedCoins[i])
        createBtn(innerDiv, 'btn btn-danger', 'Remove', removeCard)
    }
    createBtn(popUpDiv, 'btn btn-success', 'Submit', ()=>{submitHandler(mySwitch)})
}

function removeCard(e) {
    const fatherElement = e.target.parentElement
    const pContent = fatherElement.firstChild.innerHTML
    const index = selectedCoins.indexOf(pContent)
    selectedCoins.splice(index, 1)
    localStorage.setItem('selectedCoins', JSON.stringify(selectedCoins))
    const checkbox = document.getElementById(pContent)
    if(checkbox != null) {
        checkbox.checked = false
    }
    fatherElement.remove()
}

function submitHandler(mySwitch) {
    if(selectedCoins.length == 5) {
        alert('No changes were made')
    }
    else {
        const cardHeader = mySwitch.parentElement.parentElement
        const coinSymbol = cardHeader.firstChild.innerHTML
        selectedCoins.push(coinSymbol)
        localStorage.setItem('selectedCoins', JSON.stringify(selectedCoins))
        mySwitch.checked = true
    }
    const popUpDiv = document.querySelector(".popUpDiv")
    popUpDiv.innerHTML = ''
    popUpContainer.style.display = 'none'
}
//============================================================


//======================Search function=======================

function searchHandler() {
    myGif.style.display = 'inline'
    // fetch('https://api.coingecko.com/api/v3/coins/list')
    fetch('https://api.coingecko.com/api/v3/coins')
    .then( res => res.json() )
    .then( data => {
        myGif.style.display = 'none'
        reportsDiv.style.display = 'none'
        aboutDiv.style.display = 'none'
        const searchValue = searchInput.value
        const index = search(searchValue, data)
        if(index != undefined) {
            homeDiv.innerHTML = ''
            homeDiv.style.display = 'flex'

            createCard(data, index)
        }
        else {
            alert("Coin with this name doesn't exist")
            showHome()
        }
    }).catch(error => alert(error))
}

function search(nameKey, data) {
    for(let i = 0; i < data.length; i++) {
        if(data[i].symbol == nameKey || data[i].id == nameKey) {
            return i
        }
    }
}
//============================================================



//===========usefull functions throughout the code============

function createDiv(father, className) {
    const divElement = document.createElement('div')
    divElement.className = className
    father.appendChild(divElement)
    return divElement;
}

function createPar(father, className, innerContent) {
    const parElement = document.createElement('p')
    parElement.className = className
    parElement.innerHTML = innerContent
    father.appendChild(parElement)
}

function createImg(father, className, src) {
    const imgElement = document.createElement('img')
    imgElement.className = className
    imgElement.src = src
    father.appendChild(imgElement)
}

function createBtn(father, className, innerContent, eventHandler) {
    const btn = document.createElement('button')
    btn.className = className
    btn.innerHTML = innerContent
    btn.addEventListener('click', eventHandler)
    father.appendChild(btn)
}