'use-strict'

window.onload = init()

function init() {
    removeOldCols()
    getAllResponses().then(() => {
        getData()
            .then(() => {
                setTimeout(() => {
                    var elTable = document.querySelector('.table-apartments')
                    var dirInHagrala = getColumnElementsByIdxColumn(elTable, 7)
                    var dirForBeneiMakom = getColumnElementsByIdxColumn(
                        elTable,
                        8
                    )
                    var totalNirshamin = getColumnElementsByIdxColumn(
                        elTable,
                        9
                    )
                    var percCol = calcPercent(
                        dirInHagrala,
                        dirForBeneiMakom,
                        totalNirshamin
                    )
                    reprintTable(elTable, percCol)
                    handlePagination()
                }, 3000)
            })
            .catch((error) => {
                console.error('There was a problem getting the data:', error)
            })
    })
}

function getAllResponses() {
    const urls = [
        'https://www.dira.moch.gov.il/api/Invoker?method=Lookup&param=%3FtableName%3DProjectsCities',
        'https://www.dira.moch.gov.il/api/Invoker?method=Lookup&param=%3FtableName%3DProjectStatus',
        'https://www.dira.moch.gov.il/api/Invoker?method=Lookup&param=%3FtableName%3DEntitlement',
        'https://www.dira.moch.gov.il/api/Invoker?method=Lookup&param=%3FtableName%3DPlanName',
        'https://www.dira.moch.gov.il/api/Invoker?method=Projects&param=%3FfirstApplicantIdentityNumber%3D%26secondApplicantIdentityNumber%3D%26ProjectStatus%3D4%26Entitlement%3D1%26PageNumber%3D1%26PageSize%3D50%26IsInit%3Dtrue%26',
        'https://www.dira.moch.gov.il/api/Invoker?method=Projects&param=%3FfirstApplicantIdentityNumber%3D%26secondApplicantIdentityNumber%3D%26ProjectStatus%3D4%26Entitlement%3D1%26PageNumber%3D1%26PageSize%3D50%26IsInit%3Dtrue%26',
    ]
    const promises = urls.map((url) => fetch(url))
    return Promise.all(promises)
}

function getData() {
    return fetch(
        'https://www.dira.moch.gov.il/api/Invoker?method=Projects&param=%3FfirstApplicantIdentityNumber%3D%26secondApplicantIdentityNumber%3D%26ProjectStatus%3D4%26Entitlement%3D1%26PageNumber%3D1%26PageSize%3D50%26IsInit%3Dtrue%26',
        {
            headers: {
                accept: 'application/json, text/plain, */*',
                'accept-language': 'en-US,en;q=0.9,he;q=0.8',
                'sec-ch-ua':
                    '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
            },
            referrer: 'https://www.dira.moch.gov.il/ProjectsList',
            referrerPolicy: 'strict-origin-when-cross-origin',
            body: null,
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
        }
    )
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            return response.json()
        })
        .catch((error) => {
            console.error(
                'There was a problem with the fetch operation:',
                error
            )
        })
}

function handlePagination() {
    var elPaginationControls = document.querySelectorAll('.pagination a')
    elPaginationControls.forEach((page) => {
        page.onclick = init
    })
}

function getColumnElementsByIdxColumn(elTable, IdxColumn) {
    var elTableRows = elTable.querySelectorAll('tr')
    var columnElements = []
    for (row of elTableRows) {
        var columnElement = row.children[IdxColumn].innerText
        columnElement = columnElement.replaceAll(',', '')
        columnElement = parseInt(columnElement)
        columnElements.push(columnElement)
    }
    return columnElements
}

function calcPercent(dirInHagrala, dirForBeneiMakom, totalNirshamin) {
    var percent = []
    dirInHagrala.forEach((dir, Idx) => {
        var misht = totalNirshamin[Idx]
        var dirBenei = dirForBeneiMakom[Idx]
        percent[Idx] = ((dir - dirBenei) / (misht - dirBenei)).toLocaleString(
            undefined,
            {
                style: 'percent',
                minimumFractionDigits: 3,
            }
        )
    })
    percent[0] = 'סיכוי לזכות עבור לא בן מקום'
    return percent
}

function reprintTable(elTable, percCol) {
    var elTableRows = elTable.querySelectorAll('tr')
    var i = 0
    for (row of elTableRows) {
        var TD = document.createElement('td')
        TD.classList.add('added-cell')
        TD.setAttribute('style', 'background-color: yellow !important')
        TD.innerHTML = percCol[i]
        row.appendChild(TD)
        i++
    }
    var elheader = elTableRows[0].querySelector('.added-cell')
    elheader.setAttribute(
        'style',
        'background-color: #4c7fc1 !important; font-weight: bold; font-size: 15px; color: white !important; font-family: open_sans_hebrewbold;'
    )
}

function removeOldCols() {
    var elCellsToRemove = document.querySelectorAll('.added-cell')
    elCellsToRemove.forEach((cell) => {
        cell.remove()
    })
}
