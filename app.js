const btn = document.getElementById('generateBtn');

btn.addEventListener('click', async () => {
  const input = document.getElementById('inputText').value.trim();

  if (!input) {
    alert('请输入一句中文');
    return;
  }

  btn.disabled = true;
  btn.textContent = '生成中...';

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 
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'
      },
      body: JSON.stringify({
        model: 'gpt-5-mini',
        input: `
你是“语行”，一个表达助手。

请把用户输入的中文转换成自然的英文和日文表达。
返回严格 JSON，不要输出别的内容。

JSON 格式：
{
  "cn": "用户原句",
  "en": {
    "natural": "自然表达",
    "polite": "更礼貌表达",
    "casual": "更口语表达"
  },
  "jp": {
    "natural": "自然表达",
    "polite": "更礼貌表达",
    "casual": "更口语表达"
  },
  "scene": "适合场景，例如 朋友 / 工作 / 日常",
  "explain": "1-2句简短解释"
}

要求：
- 英文和日文都要自然
- 不要直译
- 更礼貌适合工作
- 更口语适合朋友
- 解释短一点

用户输入：${input}
        `
      })
    });

    const data = await response.json();

    let text = '';

    if (data.output_text) {
      text = data.output_text;
    } else if (data.output && data.output[0] && data.output[0].content && data.output[0].content[0]) {
      text = data.output[0].content[0].text || '';
    }

    if (!text) {
      throw new Error('AI 没有返回内容');
    }

    const result = JSON.parse(text);

    document.getElementById('cnText').textContent = result.cn || input;
    document.getElementById('enNatural').textContent = result.en?.natural || '';
    document.getElementById('enPolite').textContent = result.en?.polite || '';
    document.getElementById('enCasual').textContent = result.en?.casual || '';
    document.getElementById('jpNatural').textContent = result.jp?.natural || '';
    document.getElementById('jpPolite').textContent = result.jp?.polite || '';
    document.getElementById('jpCasual').textContent = result.jp?.casual || '';
    document.getElementById('sceneText').textContent = result.scene || '';
    document.getElementById('explainText').textContent = result.explain || '';

    document.getElementById('resultSection').classList.remove('hidden');
  } catch (err) {
    alert('生成失败：' + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = '帮我表达';
  }
});
