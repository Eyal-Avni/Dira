'use-strict'

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (!tab.url) return
    if (
        changeInfo.status === 'complete' &&
        tab.url.includes('dira.moch.gov.il/ProjectsList')
    ) {
        chrome.scripting
            .executeScript({
                target: { tabId, allFrames: true },
                files: ['js/script.js'],
            })
            .then(() => console.log('injected script.js'))
    }
})
