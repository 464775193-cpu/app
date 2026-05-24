console.log("App 初始化成功");

const API_KEY = "1af35aeb-7705-48e0-a667-1fbd4e1b8307";
const API_BASE_URL = "https://ark.cn-beijing.volces.com/api/v3/bots/chat/completions";
// 火山方舟 Bot 调用使用控制台中的 bot ID。
const API_MODEL = "bot-20260524190425-k2lvg";
const BASE_SYSTEM_PROMPT = "你是一位隐居世外、精通四柱八字与盲派心法的国学命理先生。来者已报生辰，命盘四柱与五行已列于前。请循天干地支、五行生克、十神取象与宫位气势，写一段约 300 字的批注。语气须深邃、温和、有传统国学韵味，可用半文言词句，但要让人读得明白。开篇用“先生批注：”或“【所问之事】批断真言”。不可用生硬标题，不可露出推演之外的器械痕迹。";
const CATEGORY_CONFIG = {
  "学业": {
    title: "学业分析",
    aiDirective: "所问之事为【学业】。请以文昌星、印星、食伤吐秀、心性定力等意象入手，观其求学之路的顺逆、悟性、专注与应试节奏，并给出合乎命局气势的修习建议。"
  },
  "事业": {
    title: "事业运势",
    aiDirective: "所问之事为【事业】。请以官杀、财星、印绶、走运气机与贵人方位等意象入手，剖析其事业格局、行事风格、财运承载与适合发力之处，并给出落地可行的取势建议。"
  },
  "婚姻": {
    title: "婚姻走势",
    aiDirective: "所问之事为【婚姻】。请以夫妻宫、红鸾星、正桃花、日支气象与阴阳相济等意象入手，解读其姻缘羁绊、情感习性、良缘时机与相处之道，并给出温和可行的修合建议。"
  }
};
const PILLAR_METHODS = [
  {
    key: "year",
    label: "年柱",
    ganZhi: "getYear",
    gan: "getYearGan",
    zhi: "getYearZhi",
    hideGan: "getYearHideGan",
    shiShenGan: "getYearShiShenGan",
    shiShenZhi: "getYearShiShenZhi",
    diShi: "getYearDiShi",
    xunKong: "getYearXunKong",
    naYin: "getYearNaYin",
    wuXing: "getYearWuXing"
  },
  {
    key: "month",
    label: "月柱",
    ganZhi: "getMonth",
    gan: "getMonthGan",
    zhi: "getMonthZhi",
    hideGan: "getMonthHideGan",
    shiShenGan: "getMonthShiShenGan",
    shiShenZhi: "getMonthShiShenZhi",
    diShi: "getMonthDiShi",
    xunKong: "getMonthXunKong",
    naYin: "getMonthNaYin",
    wuXing: "getMonthWuXing"
  },
  {
    key: "day",
    label: "日柱",
    ganZhi: "getDay",
    gan: "getDayGan",
    zhi: "getDayZhi",
    hideGan: "getDayHideGan",
    shiShenGan: "getDayShiShenGan",
    shiShenZhi: "getDayShiShenZhi",
    diShi: "getDayDiShi",
    xunKong: "getDayXunKong",
    naYin: "getDayNaYin",
    wuXing: "getDayWuXing"
  },
  {
    key: "time",
    label: "时柱",
    ganZhi: "getTime",
    gan: "getTimeGan",
    zhi: "getTimeZhi",
    hideGan: "getTimeHideGan",
    shiShenGan: "getTimeShiShenGan",
    shiShenZhi: "getTimeShiShenZhi",
    diShi: "getTimeDiShi",
    xunKong: "getTimeXunKong",
    naYin: "getTimeNaYin",
    wuXing: "getTimeWuXing"
  }
];
const GAN_WU_XING = {
  "甲": "木",
  "乙": "木",
  "丙": "火",
  "丁": "火",
  "戊": "土",
  "己": "土",
  "庚": "金",
  "辛": "金",
  "壬": "水",
  "癸": "水"
};
const ZHI_WU_XING = {
  "寅": "木",
  "卯": "木",
  "巳": "火",
  "午": "火",
  "辰": "土",
  "戌": "土",
  "丑": "土",
  "未": "土",
  "申": "金",
  "酉": "金",
  "亥": "水",
  "子": "水"
};
const WU_XING_COLORS = {
  "木": "#22c55e",
  "火": "#ef4444",
  "土": "#d97706",
  "金": "#eab308",
  "水": "#3b82f6"
};
let latestBaZiData = null;
let currentCategory = "学业";
const BIRTH_TIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/;
const STANDARD_CHART_METHOD = "通用排法";

function getFormData() {
  const birthTimeInput = document.querySelector("#birth-time");
  const birthTime = birthTimeInput.value;

  if (!birthTime) {
    throw new Error("请先选择出生时间");
  }

  const match = birthTime.match(BIRTH_TIME_PATTERN);

  if (!match) {
    throw new Error("出生时间格式不正确，请使用 YYYY-MM-DD HH:mm");
  }

  const [, year, month, day, hour, minute, second = "0"] = match;
  const parsedTime = {
    yearText: year,
    year: Number(year),
    month: Number(month),
    day: Number(day),
    hour: Number(hour),
    minute: Number(minute),
    second: Number(second)
  };

  validateBirthTimeParts(parsedTime);

  return parsedTime;
}

function validateBirthTimeParts(timeParts) {
  if (!/^\d{4}$/.test(timeParts.yearText)) {
    throw new Error("出生年份必须为 4 位数字（YYYY）");
  }

  if (timeParts.year < 1 || timeParts.year > 9999) {
    throw new Error("出生年份必须在 0001 至 9999 之间");
  }

  if (timeParts.month < 1 || timeParts.month > 12) {
    throw new Error("出生月份不正确");
  }

  const daysInMonth = [
    31,
    isLeapYear(timeParts.year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31
  ];

  if (timeParts.day < 1 || timeParts.day > daysInMonth[timeParts.month - 1]) {
    throw new Error("出生日期不正确");
  }

  if (timeParts.hour < 0 || timeParts.hour > 23) {
    throw new Error("出生小时不正确");
  }

  if (timeParts.minute < 0 || timeParts.minute > 59 || timeParts.second < 0 || timeParts.second > 59) {
    throw new Error("出生分钟或秒数不正确");
  }
}

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  return value ? [value] : [];
}

function uniqueList(list) {
  return [...new Set(list.filter((item) => item && item !== "无"))];
}

function getElementOf(char) {
  return GAN_WU_XING[char] || ZHI_WU_XING[char] || "";
}

function getElementColor(char) {
  const element = getElementOf(char);

  return WU_XING_COLORS[element] || "#334155";
}

function getCommonShenSha(eightChar, targetGan, targetZhi) {
  const dayGan = eightChar.getDayGan();
  const dayZhi = eightChar.getDayZhi();
  const yearZhi = eightChar.getYearZhi();
  const result = [];
  const tianYiMap = {
    "甲": ["丑", "未"],
    "戊": ["丑", "未"],
    "庚": ["丑", "未"],
    "乙": ["子", "申"],
    "己": ["子", "申"],
    "丙": ["亥", "酉"],
    "丁": ["亥", "酉"],
    "壬": ["巳", "卯"],
    "癸": ["巳", "卯"],
    "辛": ["午", "寅"]
  };
  const wenChangMap = {
    "甲": "巳",
    "乙": "午",
    "丙": "申",
    "戊": "申",
    "丁": "酉",
    "己": "酉",
    "庚": "亥",
    "辛": "子",
    "壬": "寅",
    "癸": "卯"
  };
  const luMap = {
    "甲": "寅",
    "乙": "卯",
    "丙": "巳",
    "戊": "巳",
    "丁": "午",
    "己": "午",
    "庚": "申",
    "辛": "酉",
    "壬": "亥",
    "癸": "子"
  };
  const groupRules = [
    {
      branches: ["申", "子", "辰"],
      taoHua: "酉",
      yiMa: "寅",
      huaGai: "辰",
      jiangXing: "子"
    },
    {
      branches: ["寅", "午", "戌"],
      taoHua: "卯",
      yiMa: "申",
      huaGai: "戌",
      jiangXing: "午"
    },
    {
      branches: ["巳", "酉", "丑"],
      taoHua: "午",
      yiMa: "亥",
      huaGai: "丑",
      jiangXing: "酉"
    },
    {
      branches: ["亥", "卯", "未"],
      taoHua: "子",
      yiMa: "巳",
      huaGai: "未",
      jiangXing: "卯"
    }
  ];

  if (tianYiMap[dayGan]?.includes(targetZhi)) {
    result.push("天乙贵人");
  }

  if (wenChangMap[dayGan] === targetZhi) {
    result.push("文昌贵人");
  }

  if (luMap[dayGan] === targetZhi) {
    result.push("禄神");
  }

  [dayZhi, yearZhi].forEach((sourceZhi) => {
    const matchedRule = groupRules.find((rule) => rule.branches.includes(sourceZhi));

    if (!matchedRule) {
      return;
    }

    if (matchedRule.taoHua === targetZhi) {
      result.push("桃花");
    }
    if (matchedRule.yiMa === targetZhi) {
      result.push("驿马");
    }
    if (matchedRule.huaGai === targetZhi) {
      result.push("华盖");
    }
    if (matchedRule.jiangXing === targetZhi) {
      result.push("将星");
    }
  });

  if (targetGan === dayGan && targetZhi === dayZhi) {
    result.push("日主坐命");
  }

  return uniqueList(result);
}

function getPillarShenSha(lunar, eightChar, pillar) {
  const dayShenSha = pillar.key === "day"
    ? [
      ...normalizeList(lunar.getDayJiShen?.()),
      ...normalizeList(lunar.getDayXiongSha?.())
    ]
    : [];

  return uniqueList([
    ...getCommonShenSha(eightChar, pillar.gan, pillar.zhi),
    ...dayShenSha
  ]);
}

function calculateBaZi(formData) {
  if (!window.Solar) {
    throw new Error("排盘库加载失败，请检查网络后重试");
  }

  const chartMethod = STANDARD_CHART_METHOD;
  const solar = Solar.fromYmdHms(
    formData.year,
    formData.month,
    formData.day,
    formData.hour,
    formData.minute,
    formData.second
  );
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();
  const pillars = PILLAR_METHODS.map((method) => {
    const pillar = {
      key: method.key,
      label: method.label,
      ganZhi: eightChar[method.ganZhi](),
      gan: eightChar[method.gan](),
      zhi: eightChar[method.zhi](),
      hideGan: normalizeList(eightChar[method.hideGan]()),
      shiShenGan: eightChar[method.shiShenGan](),
      shiShenZhi: normalizeList(eightChar[method.shiShenZhi]()),
      diShi: eightChar[method.diShi](),
      xunKong: eightChar[method.xunKong](),
      naYin: eightChar[method.naYin](),
      wuXing: eightChar[method.wuXing]()
    };

    pillar.shenSha = getPillarShenSha(lunar, eightChar, pillar);

    return pillar;
  });

  return {
    chartMethod,
    pillars,
    ganZhiList: pillars.map((pillar) => pillar.ganZhi),
    wuXingList: pillars.map((pillar) => pillar.wuXing)
  };
}

function renderBaZi(baziData) {
  const resultBox = document.querySelector("#result-box");
  const pillars = baziData.pillars;
  const rows = [
    {
      label: "主星",
      render: (pillar) => `<span class="ten-god">${escapeHTML(pillar.shiShenGan)}</span>`
    },
    {
      label: "天干",
      render: (pillar) => renderElementText([pillar.gan], "stem-branch")
    },
    {
      label: "地支",
      render: (pillar) => renderElementText([pillar.zhi], "stem-branch")
    },
    {
      label: "藏干",
      render: (pillar) => renderElementText(pillar.hideGan, "hidden-stems")
    },
    {
      label: "副星",
      render: (pillar) => renderTagList(pillar.shiShenZhi)
    },
    {
      label: "星运",
      render: (pillar) => `<span>${escapeHTML(pillar.diShi)}</span>`
    },
    {
      label: "空亡",
      render: (pillar) => `<span>${escapeHTML(pillar.xunKong)}</span>`
    },
    {
      label: "纳音",
      render: (pillar) => `<span>${escapeHTML(pillar.naYin)}</span>`
    },
    {
      label: "神煞",
      render: (pillar) => renderTagList(pillar.shenSha, "compact")
    }
  ];
  const headerCells = pillars.map((pillar) => `
    <div class="bazi-table-head">${escapeHTML(pillar.label)}</div>
  `).join("");
  const bodyRows = rows.map((row) => `
    <div class="bazi-table-label">${row.label}</div>
    ${pillars.map((pillar) => `
      <div class="bazi-table-cell">${row.render(pillar)}</div>
    `).join("")}
  `).join("");

  resultBox.classList.add("has-result");
  resultBox.innerHTML = `
    <div class="bazi-pro-table" role="table" aria-label="四柱八字精盘">
      <div class="bazi-table-corner">四柱</div>
      ${headerCells}
      ${bodyRows}
    </div>
  `;
}

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderElementText(chars, className = "") {
  return normalizeList(chars).map((char) => `
    <span class="element-text ${className}" style="color: ${getElementColor(char)}">${escapeHTML(char)}</span>
  `).join("");
}

function renderTagList(items, size = "") {
  const list = normalizeList(items);

  if (!list.length) {
    return '<span class="muted-text">-</span>';
  }

  return `
    <div class="tag-list ${size === "compact" ? "tag-list-compact" : ""}">
      ${list.map((item) => `<span class="mini-tag">${escapeHTML(item)}</span>`).join("")}
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
  aiButton.textContent = isLoading ? "正在排演命理盘局..." : "揭示命运玄机";
}

function switchView(targetViewId) {
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("is-active", view.id === targetViewId);
  });
}

function resetAnalysisOutput() {
  const resultBox = document.querySelector("#result-box");

  latestBaZiData = null;
  resultBox.classList.remove("has-result");
  resultBox.innerHTML = "<p>命盘将在此呈现</p>";
  renderAIResult("先生批注将在此显现");
  updateAIButtonState();
}

function openCategory(category) {
  const categoryConfig = CATEGORY_CONFIG[category];

  if (!categoryConfig) {
    return;
  }

  currentCategory = category;
  document.querySelector("#detail-title").textContent = categoryConfig.title;
  resetAnalysisOutput();
  switchView("detail-view");
}

function backToHome() {
  switchView("home-view");
}

function buildAIUserPrompt(baziData) {
  const pillarText = baziData.pillars.map((pillar) => [
    `${pillar.label}:${pillar.ganZhi}`,
    `主星:${pillar.shiShenGan}`,
    `天干:${pillar.gan}`,
    `地支:${pillar.zhi}`,
    `藏干:${pillar.hideGan.join("/")}`,
    `副星:${pillar.shiShenZhi.join("/")}`,
    `星运:${pillar.diShi}`,
    `空亡:${pillar.xunKong}`,
    `纳音:${pillar.naYin}`,
    `神煞:${pillar.shenSha.join("/") || "无"}`
  ].join("，")).join("\n");

  return [
    "四柱精盘：",
    pillarText,
    `五行排布：${baziData.wuXingList.join("，")}`,
    "请以此命盘为准，勿另造生辰。"
  ].join("\n");
}

function buildSystemPrompt(category) {
  const categoryDirective = CATEGORY_CONFIG[category]?.aiDirective || "";

  return `${BASE_SYSTEM_PROMPT}\n${categoryDirective}`;
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

async function fetchAIInterpretation(baziData, category) {
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
          content: buildSystemPrompt(category)
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
    console.error("批注请求失败", {
      status: response.status,
      statusText: response.statusText,
      body: errorText
    });

    if (response.status === 404) {
      throw new Error("火山方舟返回 404：请检查 Bot ID 或 bots/chat/completions 调用路径");
    }

    throw new Error("批注暂未生成");
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error("批注暂未生成");
  }

  return content;
}

function handleStartButtonClick() {
  try {
    const formData = getFormData();
    const baziData = calculateBaZi(formData);

    latestBaZiData = baziData;
    renderBaZi(baziData);
    renderAIResult("命盘已定，可启玄机。");
    updateAIButtonState();
  } catch (error) {
    latestBaZiData = null;
    renderError(error.message);
    renderAIResult("请先排定命盘");
    updateAIButtonState();
  }
}

async function handleAIButtonClick() {
  if (!latestBaZiData) {
    renderAIResult("请先排定命盘", true);
    return;
  }

  updateAIButtonState(true);
  renderAIResult("正在排演命理盘局...");
  await new Promise((resolve) => setTimeout(resolve, 120));

  try {
    const content = await fetchAIInterpretation(latestBaZiData, currentCategory);

    renderAIResult(content);
  } catch (error) {
    renderAIResult("命盘暂未通达，请稍后再试", true);
  } finally {
    updateAIButtonState();
  }
}

document.querySelectorAll(".module-card[data-category]").forEach((moduleCard) => {
  moduleCard.addEventListener("click", () => {
    openCategory(moduleCard.dataset.category);
  });
});

document.querySelector("#back-button").addEventListener("click", backToHome);
document.querySelector("#start-button").addEventListener("click", handleStartButtonClick);
document.querySelector("#ai-button").addEventListener("click", handleAIButtonClick);
