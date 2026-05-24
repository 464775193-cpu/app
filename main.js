console.log("App 初始化成功");

const API_KEY = "1af35aeb-7705-48e0-a667-1fbd4e1b8307";
const API_BASE_URL = "https://ark.cn-beijing.volces.com/api/v3/bots/chat/completions";
// 火山方舟 Bot 调用使用控制台中的 bot ID。
const API_MODEL = "bot-20260524190425-k2lvg";
const SYSTEM_PROMPT = "你是一个严谨的命理结构分析专家。系统会传入一组八字干支和五行数据。请基于五行生克，输出一份 300 字左右的客观结构分析报告。严格红线警告：你的分析必须且只能针对当前的五行能量结构、性格特质进行描述。请把任何窥探未来（future-looking）的功能或前瞻性的预测从你的词库中拿掉，绝不允许做任何运势吉凶预判。 语气要现代、专业、温暖。";
const PILLAR_LABELS = ["年柱", "月柱", "日柱", "时柱"];
let latestBaZiData = null;

function getFormData() {
  const birthTimeInput = document.querySelector("#birth-time");
  const birthTime = birthTimeInput.value;

  if (!birthTime) {
    throw new Error("请先选择出生时间");
  }

  const match = birthTime.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);

  if (!match) {
    throw new Error("出生时间格式不正确");
  }

  const [, year, month, day, hour, minute, second = "0"] = match;

  return {
    year: Number(year),
    month: Number(month),
    day: Number(day),
    hour: Number(hour),
    minute: Number(minute),
    second: Number(second)
  };
}

function calculateBaZi(formData) {
  if (!window.Solar) {
    throw new Error("排盘库加载失败，请检查网络后重试");
  }

  const solar = Solar.fromYmdHms(
    formData.year,
    formData.month,
    formData.day,
    formData.hour,
    formData.minute,
    formData.second
  );
  const eightChar = solar.getLunar().getEightChar();

  const pillars = [
    {
      label: PILLAR_LABELS[0],
      ganZhi: eightChar.getYear(),
      wuXing: eightChar.getYearWuXing()
    },
    {
      label: PILLAR_LABELS[1],
      ganZhi: eightChar.getMonth(),
      wuXing: eightChar.getMonthWuXing()
    },
    {
      label: PILLAR_LABELS[2],
      ganZhi: eightChar.getDay(),
      wuXing: eightChar.getDayWuXing()
    },
    {
      label: PILLAR_LABELS[3],
      ganZhi: eightChar.getTime(),
      wuXing: eightChar.getTimeWuXing()
    }
  ];

  return {
    pillars,
    ganZhiList: pillars.map((pillar) => pillar.ganZhi),
    wuXingList: pillars.map((pillar) => pillar.wuXing)
  };
}

function renderBaZi(baziData) {
  const resultBox = document.querySelector("#result-box");
  const pillars = baziData.pillars;
  const pillarCells = pillars.map((pillar) => `
    <div class="bazi-cell pillar">
      <span class="bazi-label">${pillar.label}</span>
      <strong class="bazi-value">${pillar.ganZhi}</strong>
    </div>
  `).join("");
  const elementCells = pillars.map((pillar) => `
    <div class="bazi-cell">
      <span class="bazi-label">五行</span>
      <strong class="bazi-element">${pillar.wuXing}</strong>
    </div>
  `).join("");

  resultBox.classList.add("has-result");
  resultBox.innerHTML = `
    <div class="bazi-grid">
      ${pillarCells}
      ${elementCells}
    </div>
  `;
}

function renderAIResult(message, isError = false) {
  const aiResult = document.querySelector("#ai-result");

  aiResult.classList.remove("is-visible", "is-error");
  aiResult.classList.toggle("is-error", isError);
  aiResult.innerHTML = "";

  const content = document.createElement("span");
  content.className = isError ? "ai-error-text" : "";
  content.textContent = message;
  aiResult.append(content);

  setTimeout(() => {
    aiResult.classList.add("is-visible");
  }, 0);
}

function renderError(message) {
  const resultBox = document.querySelector("#result-box");

  resultBox.classList.remove("has-result");
  resultBox.innerHTML = `<p class="result-error">${message}</p>`;
}

function updateAIButtonState(isLoading = false) {
  const aiButton = document.querySelector("#ai-button");

  aiButton.disabled = isLoading || !latestBaZiData;
  aiButton.classList.toggle("is-loading", isLoading);
  aiButton.textContent = isLoading ? "解析生成中..." : "生成深度状态解析";
}

function buildAIUserPrompt(baziData) {
  const pillarText = baziData.pillars
    .map((pillar) => `${pillar.label}:${pillar.ganZhi}`)
    .join("，");
  const wuxingText = baziData.pillars
    .map((pillar) => `${pillar.label}:${pillar.wuXing}`)
    .join("，");

  return [
    `四柱干支：${pillarText}`,
    `五行数组：${JSON.stringify(baziData.wuXingList)}`,
    `五行对应：${wuxingText}`
  ].join("\n");
}

function getChatCompletionUrl() {
  const baseUrl = API_BASE_URL.trim().replace(/\/$/, "");

  if (!baseUrl) {
    throw new Error("API_BASE_URL 未配置");
  }

  return baseUrl.endsWith("/chat/completions")
    ? baseUrl
    : `${baseUrl}/chat/completions`;
}

async function fetchAIInterpretation(baziData) {
  if (!API_KEY.trim()) {
    throw new Error("API_KEY 未配置");
  }

  const response = await fetch(getChatCompletionUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: API_MODEL,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: buildAIUserPrompt(baziData)
        }
      ],
      temperature: 0.3,
      max_tokens: 700
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("AI 请求失败", {
      status: response.status,
      statusText: response.statusText,
      body: errorText
    });

    if (response.status === 404) {
      throw new Error("火山方舟返回 404：请将 API_MODEL 替换为控制台中的 ep- 推理接入点 ID");
    }

    throw new Error("AI 请求失败");
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error("AI 返回内容为空");
  }

  return content;
}

function handleStartButtonClick() {
  try {
    const formData = getFormData();
    const baziData = calculateBaZi(formData);

    latestBaZiData = baziData;
    renderBaZi(baziData);
    renderAIResult("深度状态解析将在这里展示");
    updateAIButtonState();
  } catch (error) {
    latestBaZiData = null;
    renderError(error.message);
    renderAIResult("请先完成有效排盘");
    updateAIButtonState();
  }
}

async function handleAIButtonClick() {
  if (!latestBaZiData) {
    renderAIResult("请先完成有效排盘", true);
    return;
  }

  updateAIButtonState(true);
  renderAIResult("正在生成深度状态解析，请稍候...");
  await new Promise((resolve) => setTimeout(resolve, 120));

  try {
    const content = await fetchAIInterpretation(latestBaZiData);

    renderAIResult(content);
  } catch (error) {
    renderAIResult(error.message || "网络连接失败或 API 密钥未配置", true);
  } finally {
    updateAIButtonState();
  }
}

document.querySelector("#start-button").addEventListener("click", handleStartButtonClick);
document.querySelector("#ai-button").addEventListener("click", handleAIButtonClick);
