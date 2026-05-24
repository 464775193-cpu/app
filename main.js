console.log("App 初始化成功");

const API_KEY = "1af35aeb-7705-48e0-a667-1fbd4e1b8307";
const API_BASE_URL = "https://ark.cn-beijing.volces.com/api/v3/bots/chat/completions";
// 火山方舟 Bot 调用使用控制台中的 bot ID。
const API_MODEL = "bot-20260524190425-k2lvg";

const BASE_SYSTEM_PROMPT = [
  "你熟稔四柱八字、五行生克与十神取象，只依据传入的命盘作当下气质与惯性分析。",
  "严禁未来预测、运势吉凶预判、事件预言、时间点断言和宿命化表达。",
  "严禁在正文中出现“系统”“AI”“数据模型”“接口”“算法”等科技词汇。",
  "开篇只用“批注真言：”。全文约300字，语气温润、深邃、清醒。",
  "必须给出至少三条可立即照做的建议，建议要具体、克制、与所问领域高度相关。"
].join("");

const CATEGORY_CONFIG = {
  "学业": {
    title: "学业分析",
    viewId: "study-view",
    mode: "ai",
    startText: "一键开启",
    startLoadingText: "正在点亮文昌星位...",
    aiLoadingText: "正在铺陈文昌批注...",
    readyText: "命盘已定，可请文昌导师批注。",
    aiDirective: "此刻你扮演【文昌导师】。请重点分析专注力、记忆模式、理解吸收、表达输出与性格中的学习驱动力；可借文昌、印星、食伤等意象说明，但不得引申为前途预判。"
  },
  "事业": {
    title: "事业运势",
    viewId: "career-view",
    mode: "ai",
    startText: "一键开启",
    startLoadingText: "正在推演事业格局...",
    aiLoadingText: "正在凝练谋略批注...",
    readyText: "命盘已定，可请职场谋略批注。",
    aiDirective: "此刻你扮演【职场谋略家】。禁用未来预测，只客观分析性格中的执行力与领导力平衡、协作方式、抗压节奏和资源调配习惯；建议必须落在定位、沟通、执行与复盘上。"
  },
  "婚姻": {
    title: "姻缘批断",
    viewId: "marriage-view",
    mode: "ai",
    startText: "一键开启",
    startLoadingText: "正在感应良缘羁绊...",
    aiLoadingText: "正在化开情感脉络...",
    readyText: "命盘已定，可请情感解惑批注。",
    aiDirective: "此刻你扮演【情感解惑者】。请侧重沟通模式、情感表达特质、边界感、亲密关系中的安全感来源与五行气质剖析；不得断言婚恋事件或良缘时间。"
  },
  "专业": {
    title: "命理精盘",
    viewId: "chart-view",
    mode: "tool",
    startText: "开始排盘",
    startLoadingText: "正在铺陈四柱精盘...",
    aiLoadingText: "",
    readyText: "",
    aiDirective: ""
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
  "金": "#64748b",
  "水": "#3b82f6"
};

const BIRTH_TIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/;
const STANDARD_CHART_METHOD = "通用排法";
const RITUAL_LOADING_MS = 3000;
const START_LOADING_MS = 520;

const SHEN_SHA_DESCRIPTIONS = {
  "天乙贵人": "遇事多得助力，适合主动请教、借力成事。",
  "文昌贵人": "利于学习、表达与理解，宜用清晰框架整理思路。",
  "文昌星": "主才思与文气，适合读写、考试、表达型事务。",
  "桃花": "人缘与吸引力较显，也需留意情绪边界。",
  "红鸾": "主情感牵引与亲密互动，宜真诚表达心意。",
  "驿马": "主移动、变化与外部机会，适合主动拓宽场域。",
  "华盖": "主审美、思辨与独处气质，宜深耕专业与创作。",
  "将星": "主掌控与组织力，适合承担协调、管理事务。",
  "禄神": "主承载与资源，宜稳扎稳打积累可复用能力。",
  "日主坐命": "自我意识清楚，遇事宜先稳住自身节奏。",
  "天德": "温厚化解之象，行事以善意与分寸见长。",
  "月德": "人情调和之象，利于缓和关系与积累口碑。",
  "天德贵人": "逢难有缓，宜以正直、克制、耐心化解阻滞。",
  "月德贵人": "处事多有回旋余地，适合用温和方式推进。",
  "天德合": "善缘易聚，适合修复关系与共同协作。",
  "月德合": "人际协调力较佳，宜多做连接与承接。",
  "三合": "同频助力较强，适合结盟、共创、长期合作。",
  "六合": "关系黏合度高，宜以稳定承诺建立信任。",
  "太极贵人": "悟性与抽象理解较强，适合研究复杂体系。",
  "福星贵人": "心性较有福厚之气，宜珍惜稳定资源。",
  "国印贵人": "利于规则、资质与信用，适合走规范路径。",
  "童子": "气质敏感，宜重视身心节律与情绪安顿。",
  "亡神": "心思深潜，宜避免过度内耗，专注可控事项。",
  "劫煞": "行动易急，宜先定边界再推进。",
  "灾煞": "易遇琐碎牵制，宜保留余量、降低冒进。",
  "孤辰": "独立性强，宜主动经营稳定连接。",
  "寡宿": "情感表达偏收，宜练习坦诚沟通。",
  "羊刃": "气势刚烈，宜把锋芒化为纪律与执行。",
  "空亡": "某处气机虚浮，宜用具体行动补足落点。"
};

const viewState = new Map();
let currentView = null;

function getViewState(view) {
  if (!viewState.has(view.id)) {
    viewState.set(view.id, {
      baziData: null
    });
  }

  return viewState.get(view.id);
}

function getCategoryConfig(category) {
  return CATEGORY_CONFIG[category] || CATEGORY_CONFIG["学业"];
}

function isProfessionalCategory(category) {
  return category === "专业";
}

function getFormData(view) {
  const birthTimeInput = view.querySelector(".birth-time");
  const birthTime = birthTimeInput?.value || "";

  if (!birthTime) {
    throw new Error("请先选择诞生良辰");
  }

  const match = birthTime.match(BIRTH_TIME_PATTERN);

  if (!match) {
    throw new Error("诞生良辰格式不正确，请使用 YYYY-MM-DD HH:mm");
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

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getElementOf(char) {
  return GAN_WU_XING[char] || ZHI_WU_XING[char] || "";
}

function getElementColor(char) {
  const element = getElementOf(char);

  return WU_XING_COLORS[element] || "#334155";
}

function getWuXingStats(pillars) {
  const elements = ["木", "火", "土", "金", "水"];
  const counts = Object.fromEntries(elements.map((element) => [element, 0]));

  pillars.forEach((pillar) => {
    [pillar.gan, pillar.zhi, ...pillar.hideGan].forEach((char) => {
      const element = getElementOf(char);

      if (element) {
        counts[element] += 1;
      }
    });
  });

  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

  return elements.map((element) => ({
    element,
    count: counts[element],
    percent: total ? Math.round((counts[element] / total) * 100) : 0,
    color: WU_XING_COLORS[element]
  }));
}

function getAllShenSha(pillars) {
  const shenShaMap = new Map();

  pillars.forEach((pillar) => {
    pillar.shenSha.forEach((name) => {
      if (!shenShaMap.has(name)) {
        shenShaMap.set(name, {
          name,
          sources: []
        });
      }

      shenShaMap.get(name).sources.push(pillar.label);
    });
  });

  return [...shenShaMap.values()].map((item) => ({
    ...item,
    sources: uniqueList(item.sources)
  }));
}

function getShenShaDescription(name) {
  return SHEN_SHA_DESCRIPTIONS[name] || "命盘中显现的辅助星曜，可结合所在四柱观察其作用。";
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
    wuXingStats: getWuXingStats(pillars),
    allShenSha: getAllShenSha(pillars),
    ganZhiList: pillars.map((pillar) => pillar.ganZhi),
    wuXingList: pillars.map((pillar) => pillar.wuXing)
  };
}

function openBusinessView(viewId) {
  const targetView = document.querySelector(`#${viewId}`);
  const homeView = document.querySelector("#home-view");

  if (!targetView || !homeView) {
    return;
  }

  currentView = targetView;
  homeView.classList.remove("is-active");
  homeView.hidden = true;
  document.querySelectorAll(".business-view").forEach((view) => {
    const isTarget = view === targetView;

    view.hidden = !isTarget;
    view.classList.toggle("is-active", isTarget);
  });

  updateAIButtonState(targetView);
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function backToHome() {
  const homeView = document.querySelector("#home-view");

  currentView = null;
  document.querySelectorAll(".business-view").forEach((view) => {
    view.classList.remove("is-active");
    view.hidden = true;
  });
  homeView.hidden = false;
  requestAnimationFrame(() => homeView.classList.add("is-active"));
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function renderBaZi(baziData, view, options = {}) {
  const chartSection = view.querySelector(".chart-section");
  const resultBox = view.querySelector(".result-box");
  const category = view.dataset.category;
  const isCompact = options.compact ?? !isProfessionalCategory(category);
  const pillars = baziData.pillars;

  chartSection.classList.remove("is-empty");
  resultBox.classList.add("has-result");

  if (isCompact) {
    resultBox.innerHTML = renderMiniPillarCards(pillars);
    return;
  }

  const fullRows = [
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
  const bodyRows = fullRows.map((row) => `
    <div class="bazi-table-label">${row.label}</div>
    ${pillars.map((pillar) => `
      <div class="bazi-table-cell">${row.render(pillar)}</div>
    `).join("")}
  `).join("");

  resultBox.innerHTML = `
    <div class="bazi-result-stack">
      ${renderWuXingOverview(baziData.wuXingStats)}
      <div class="bazi-pro-table" role="table" aria-label="四柱八字精盘">
        <div class="bazi-table-corner">四柱</div>
        ${headerCells}
        ${bodyRows}
      </div>
    </div>
  `;
  renderShenShaDetails(baziData, view);
}

function renderMiniPillarCards(pillars) {
  return `
    <div class="mini-pillar-grid" aria-label="天干地支四柱简盘">
      ${pillars.map((pillar) => `
        <article class="mini-pillar-card">
          <span class="mini-pillar-label">${escapeHTML(pillar.label)}</span>
          <div class="mini-gan-zhi">
            ${renderElementText([pillar.gan], "mini-stem")}
            ${renderElementText([pillar.zhi], "mini-branch")}
          </div>
          <span class="mini-element-note">${escapeHTML(getElementOf(pillar.gan) || "-")} / ${escapeHTML(getElementOf(pillar.zhi) || "-")}</span>
        </article>
      `).join("")}
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

function renderWuXingOverview(stats) {
  let start = 0;
  const gradientParts = stats.map((item) => {
    const end = start + item.percent;
    const part = `${item.color} ${start}% ${end}%`;

    start = end;

    return part;
  });
  const conicGradient = gradientParts.some((part) => !part.includes(" 0% 0%"))
    ? `conic-gradient(${gradientParts.join(", ")})`
    : "linear-gradient(180deg, #eef4ef, #f8fbf7)";

  return `
    <div class="energy-panel" aria-label="五行占比">
      <div class="energy-orb" style="background: ${conicGradient}"></div>
      <div class="energy-list">
        ${stats.map((item) => `
          <div class="energy-item">
            <span class="energy-dot" style="background: ${item.color}"></span>
            <span>${item.element}</span>
            <strong>${item.percent}%</strong>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderShenShaDetails(baziData, view) {
  const chartSection = view.querySelector(".chart-section");
  const shenShaBox = view.querySelector(".shen-sha-box");
  const allShenSha = baziData.allShenSha || [];

  chartSection.classList.remove("is-empty");

  if (!shenShaBox) {
    return;
  }

  if (!allShenSha.length) {
    shenShaBox.classList.remove("has-result");
    shenShaBox.innerHTML = "<p>此盘神煞较少，宜重看五行与十神本气。</p>";
    return;
  }

  shenShaBox.classList.add("has-result");
  shenShaBox.innerHTML = `
    <div class="shen-sha-heading">
      <span>方案A</span>
      <h4>众星罗列</h4>
    </div>
    <div class="shen-sha-list">
      ${allShenSha.map((item) => `
        <article class="shen-sha-item">
          <strong>${escapeHTML(item.name)}</strong>
          <em>${escapeHTML(item.sources.join(" / "))}</em>
          <span>${escapeHTML(getShenShaDescription(item.name))}</span>
        </article>
      `).join("")}
    </div>
  `;
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

function renderAIResult(message, view, isError = false) {
  const aiSection = view.querySelector(".ai-section");
  const aiResult = view.querySelector(".ai-result");

  if (!aiSection || !aiResult) {
    return;
  }

  aiSection.classList.remove("is-empty");
  aiResult.classList.remove("is-visible", "is-error", "has-ink-lines");
  aiResult.classList.toggle("is-error", isError);
  aiResult.innerHTML = "";

  if (isError) {
    const content = document.createElement("span");

    content.className = "ai-error-text";
    content.textContent = message;
    aiResult.append(content);
  } else {
    aiResult.classList.add("has-ink-lines");

    const title = document.createElement("h3");

    title.textContent = "批注真言";
    aiResult.append(title);

    getInkLines(message).forEach((line, index) => {
      const lineNode = document.createElement("span");

      lineNode.className = "ink-line";
      lineNode.style.animationDelay = `${index * 130}ms`;
      lineNode.textContent = line;
      aiResult.append(lineNode);
    });
  }

  setTimeout(() => {
    aiResult.classList.add("is-visible");
  }, 0);
}

function getInkLines(message) {
  const text = String(message || "").trim();

  if (!text) {
    return ["批注将在此显现。"];
  }

  return text
    .replace(/^批注真言[:：]\s*/, "")
    .split(/\n+/)
    .flatMap((paragraph) => paragraph.match(/[^。；！？]+[。；！？]?/g) || [paragraph])
    .map((line) => line.trim())
    .filter(Boolean);
}

function renderError(message, view) {
  const chartSection = view.querySelector(".chart-section");
  const resultBox = view.querySelector(".result-box");
  const shenShaBox = view.querySelector(".shen-sha-box");

  chartSection.classList.remove("is-empty");
  resultBox.classList.remove("has-result");
  resultBox.innerHTML = `<p class="result-error">${escapeHTML(message)}</p>`;
  if (shenShaBox) {
    shenShaBox.classList.remove("has-result");
    shenShaBox.innerHTML = "";
  }
  hideAISection(view);
}

function setStartButtonLoading(view, isLoading = false) {
  const button = view.querySelector(".start-button");
  const categoryConfig = getCategoryConfig(view.dataset.category);

  if (!button) {
    return;
  }

  button.disabled = isLoading;
  button.classList.toggle("is-loading", isLoading);
  button.textContent = isLoading ? categoryConfig.startLoadingText : categoryConfig.startText;
}

function updateAIButtonState(view, isLoading = false) {
  const aiButton = view?.querySelector(".ai-button");
  const category = view?.dataset.category;
  const categoryConfig = getCategoryConfig(category);
  const state = view ? getViewState(view) : { baziData: null };

  if (!aiButton) {
    return;
  }

  aiButton.disabled = isLoading || !state.baziData || isProfessionalCategory(category);
  aiButton.classList.toggle("is-loading", isLoading);
  aiButton.textContent = isLoading ? categoryConfig.aiLoadingText : "揭示命运玄机";
}

function updateRitualStatus(view, isVisible = false) {
  const ritualStatus = view.querySelector(".ritual-status");

  if (!ritualStatus) {
    return;
  }

  ritualStatus.classList.toggle("is-visible", isVisible);
}

function hideAISection(view) {
  const aiSection = view.querySelector(".ai-section");
  const aiResult = view.querySelector(".ai-result");

  if (!aiSection || !aiResult) {
    return;
  }

  updateRitualStatus(view);
  aiSection.classList.add("is-empty");
  aiResult.classList.remove("is-visible", "is-error", "has-ink-lines");
  aiResult.innerHTML = "";
  updateAIButtonState(view);
}

function buildAIUserPrompt(baziData, category) {
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
  const wuXingText = baziData.wuXingStats
    .map((item) => `${item.element}:${item.percent}%`)
    .join("，");
  const shenShaText = (baziData.allShenSha || [])
    .map((item) => `${item.name}（${item.sources.join("/")}）`)
    .join("，") || "无";

  return [
    `当前所问领域：${category}`,
    "四柱精盘：",
    pillarText,
    `五行排布：${baziData.wuXingList.join("，")}`,
    `五行占比：${wuXingText}`,
    `众星罗列：${shenShaText}`,
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
          content: buildAIUserPrompt(baziData, category)
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

async function handleStartButtonClick(event) {
  const view = event.currentTarget.closest(".business-view");
  const category = view.dataset.category;
  const categoryConfig = getCategoryConfig(category);
  const state = getViewState(view);

  try {
    const formData = getFormData(view);

    setStartButtonLoading(view, true);
    await wait(START_LOADING_MS);

    const baziData = calculateBaZi(formData);

    state.baziData = baziData;
    renderBaZi(baziData, view, {
      compact: !isProfessionalCategory(category)
    });

    if (isProfessionalCategory(category)) {
      hideAISection(view);
    } else {
      renderAIResult(categoryConfig.readyText, view);
      updateAIButtonState(view);
    }

    view.querySelector(".chart-section").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  } catch (error) {
    state.baziData = null;
    renderError(error.message, view);
    updateAIButtonState(view);
  } finally {
    setStartButtonLoading(view, false);
  }
}

async function handleAIButtonClick(event) {
  const view = event.currentTarget.closest(".business-view");
  const category = view.dataset.category;
  const categoryConfig = getCategoryConfig(category);
  const state = getViewState(view);

  if (isProfessionalCategory(category)) {
    hideAISection(view);
    return;
  }

  if (!state.baziData) {
    renderAIResult("请先排定命盘", view, true);
    return;
  }

  updateAIButtonState(view, true);
  updateRitualStatus(view, true);
  renderAIResult(categoryConfig.aiLoadingText, view);

  try {
    const [interpretationResult] = await Promise.allSettled([
      fetchAIInterpretation(state.baziData, category),
      wait(RITUAL_LOADING_MS)
    ]);

    if (interpretationResult.status === "rejected") {
      throw interpretationResult.reason;
    }

    renderAIResult(interpretationResult.value, view);
  } catch (error) {
    renderAIResult("网络连接失败或 API 密钥未配置", view, true);
  } finally {
    updateRitualStatus(view);
    updateAIButtonState(view);
  }
}

document.querySelectorAll(".module-card[data-view]").forEach((moduleCard) => {
  moduleCard.addEventListener("click", () => {
    openBusinessView(moduleCard.dataset.view);
  });
});

document.querySelectorAll(".back-button").forEach((button) => {
  button.addEventListener("click", backToHome);
});

document.querySelectorAll(".start-button").forEach((button) => {
  button.addEventListener("click", handleStartButtonClick);
});

document.querySelectorAll(".ai-button").forEach((button) => {
  button.addEventListener("click", handleAIButtonClick);
});
