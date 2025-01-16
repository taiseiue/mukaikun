chrome.runtime.onInstalled.addListener(() => {
    let moodleUrl = '';
    let targetExts = '';
    let urlPatterns = '';
    chrome.storage.sync.get({
        moodleUrl, urlPatterns, targetExts
      }, function(items) {
        moodleUrl = items.moodleUrl || '';
        urlPatterns = items.urlPatterns || '';
        targetExts = items.targetExts || 'pdf,png,jpg';
        chrome.storage.sync.set({ moodleUrl, targetExts, urlPatterns }, () => {
            if(moodleUrl == '') {
                // moodleUrlが未設定の場合はオプションページを開く
                chrome.tabs.create({"url": "pages/options/index.html"});
            }
          });
      });
})
