const STORAGE_KEY = 'yuxing_web_saved_v1';
let cards = [];
let currentCard = null;

async function loadCards() {
  const btn = document.getElementById("generateBtn");

btn.addEventListener("click", async () => {
  const input = document.getElementById("inputText").value;

  if (!input) {
    alert("请输入一句中文");
    return;
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer 
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"
    },
    body: JSON.stringify({
      model: "gpt-5-mini",
      input: `把这句话变成自然的英文和日文表达：${input}`
    })
  });

  const data = await response.json();

  document.getElementById("cnText").textContent = input;
  document.getElementById("enNatural").textContent = data.output[0].content[0].text;
});
  cards = await res.json();
}

function hashInput(input) {
  return [...input].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

function pickCard(input) {
  if (!cards.length) return null;
  const sample = cards[hashInput(input) % cards.length];
  return {
    cn: input || "",
    en: sample.en,
    jp: sample.jp,
    scene: sample.scene,
    explain: sample.explain
  };
}

function renderCard(item) {
  currentCard = item;
  document.getElementById('cnText').textContent = item.cn;
  document.getElementById('enNatural').textContent = item.en.natural;
  document.getElementById('enPolite').textContent = item.en.polite;
  document.getElementById('enCasual').textContent = item.en.casual;
  document.getElementById('jpNatural').textContent = item.jp.natural;
  document.getElementById('jpPolite').textContent = item.jp.polite;
  document.getElementById('jpCasual').textContent = item.jp.casual;
  document.getElementById('sceneText').textContent = item.scene;
  document.getElementById('explainText').textContent = item.explain;
  document.getElementById('resultSection').classList.remove('hidden');
}

function getSaved() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function setSaved(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function renderSaved() {
  const list = document.getElementById('savedList');
  const saved = getSaved();
  if (!saved.length) {
    list.innerHTML = '<p class="sub">还没有收藏内容。先生成一条语行卡吧。</p>';
    return;
  }
  list.innerHTML = saved.map(item => `
    <div class="saved-item">
      <div class="saved-cn">${escapeHtml(item.cn)}</div>
      <div class="saved-en">${escapeHtml(item.en.natural)}</div>
    </div>
  `).join('');
}

function saveCurrent() {
  if (!currentCard) return;
  const saved = getSaved();
  if (!saved.some(x => x.cn === currentCard.cn)) {
    saved.unshift(currentCard);
    setSaved(saved);
    renderSaved();
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[m]));
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {}
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadCards();
  renderSaved();

  document.getElementById('generateBtn').addEventListener('click', () => {
    const input = document.getElementById('inputText').value.trim();
    if (!input) {
      alert('请输入一句中文');
      return;
    }
    renderCard(pickCard(input));
  });

  document.getElementById('sampleBtn').addEventListener('click', () => {
    const sample = cards[Math.floor(Math.random() * cards.length)];
    document.getElementById('inputText').value = sample.cn;
    renderCard(sample);
  });

  document.getElementById('saveBtn').addEventListener('click', saveCurrent);

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.target;
      const text = document.getElementById(id).textContent;
      await copyText(text);
      const old = btn.textContent;
      btn.textContent = '已复制';
      setTimeout(() => btn.textContent = old, 1200);
    });
  });
});
