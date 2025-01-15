function getOrigin(url) {
    return new URL(url).origin;
}
function escapeRegex(string) {
    return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}

document.addEventListener('DOMContentLoaded', async () => {
    const rules = '';
    chrome.storage.sync.get({
        moodleUrl, urlPatterns, targetExts, rules
      }, function(items) {
        document.getElementById('urlPatterns').value = items.urlPatterns;
        document.getElementById('moodleUrl').value = items.moodleUrl;
        document.getElementById('targetExts').value = items.targetExts;
      });
});

document.getElementById('save').addEventListener('click', async () => {
    const moodleUrl = getOrigin(document.getElementById('moodleUrl').value);
    const urlPatterns = document.getElementById('urlPatterns').value;
    const targetExts = document.getElementById('targetExts').value;
    
    const truePatterns = urlPatterns
    .split('\n')
    .map(pattern => pattern.trim())
    .filter(pattern => pattern !== '');

    const rules = truePatterns.map((pattern, index) => ({
      id: index + 2,
      priority: 1,
      action: {
        type: 'modifyHeaders',
        responseHeaders: [
          { header: 'Content-Disposition', operation: 'set', value: 'inline' }
        ]
      },
      condition: { urlFilter: pattern, resourceTypes: ['main_frame', 'sub_frame'] }
    }));

    const moodleRule = {
      id: 1,
      priority: 1,
      action: {
        type: 'modifyHeaders',
        responseHeaders: [
          { header: 'Content-Disposition', operation: 'set', value: 'inline' }
        ]
      },
      condition: { regexFilter: escapeRegex(moodleUrl) + '/pluginfile\.php.*('+ escapeRegex(targetExts).replace(",", "|") +')\?forcedownload=1$', resourceTypes: ['main_frame', 'sub_frame'] }
    };
    // moodle用のルールを適用
    rules.push(moodleRule);
    
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: rules.map(rule => rule.id),
      addRules: rules
    });

    chrome.storage.sync.set({ moodleUrl, urlPatterns, targetExts, rules }, () => {
      alert('保存しました');
    });
  });
