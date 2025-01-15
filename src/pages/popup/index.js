document.addEventListener('DOMContentLoaded', async () => {
    chrome.storage.sync.get({
        toggleEnable
    }, function (items) {
        document.getElementById('toggleEnable').checked = items.toggleEnable;
    });
});

document.getElementById('toggleEnable').addEventListener('change', async () => {
    const toggleEnable = document.getElementById('toggleEnable').checked;
    const rules = {};
    chrome.storage.sync.set({ toggleEnable });
    chrome.storage.sync.get({
        rules
    }, async function (items) {
    if(toggleEnable) {
        await chrome.declarativeNetRequest.updateDynamicRules({
            addRules: items.rules
          });
    }else{
        
        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [...Array(items.rules.length).keys()].map(i => i + 1)
          });
    }
    });

});