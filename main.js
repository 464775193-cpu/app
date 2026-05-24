console.log("App 初始化成功");

const API_KEY = "1af35aeb-7705-48e0-a667-1fbd4e1b8307";
const API_BASE_URL = "https://ark.cn-beijing.volces.com/api/v3/bots/chat/completions";
// 火山方舟 Bot 调用使用控制台中的 bot ID。
const API_MODEL = "bot-20260524190425-k2lvg";

const CURRENT_FLOW_YEAR = {
  year: 2026,
  ganZhi: "丙午",
  gan: "丙",
  zhi: "午",
  note: "火旺之极"
};

const BASE_SYSTEM_PROMPT = [
  "你是一位深谙子平八字与大运流年推演的严谨命理大家。",
  "当前分析锚点固定为 2026 年，岁次丙午，丙火透干，午火当令，火旺之极。",
  "你必须以四柱原局、大运信息、2026 丙午流年三者互参为依据；若大运信息未提供或不完整，须明示仅能以原局与流年互参，不得虚构。",
  "拒绝心理鸡汤、玄虚恐吓、绝对化江湖断语，不输出无法从干支、十神、宫位、星运推回来的结论。",
  "严禁出现“系统”“AI”“数据模型”“接口”“算法”等科技词汇。",
  "不要使用神煞作为主要论证，不要输出神煞列表。",
  "你必须直接输出纯文本内容。严禁输出 Markdown 代码块，严禁输出 JSON 格式，严禁包含任何大括号或键值对名称。"
].join("");

const CATEGORY_CONFIG = {
  "学业": {
    title: "学业分析",
    topbarKicker: "文昌问学",
    note: "填入诞生良辰，合参 2026 丙午流年，剖析学习结构与用神消长。",
    startText: "开启批算",
    startLoadingText: "正在排演命理盘局...",
    focus: "学业",
    directive: "当前板块为【学业】。请聚焦印星、食伤、文书表达、记忆吸收、专注稳定度与考试/研究节奏。"
  },
  "事业": {
    title: "事业运势",
    topbarKicker: "官印谋局",
    note: "填入诞生良辰，合参 2026 丙午流年，推演财官印授与承载之势。",
    startText: "开启批算",
    startLoadingText: "正在排演命理盘局...",
    focus: "事业",
    directive: "当前板块为【事业】。请聚焦财星、官杀、印授、执行力、领导力、资源承载、组织协作与职业定位。"
  },
  "婚姻": {
    title: "姻缘批断",
    topbarKicker: "红鸾照心",
    note: "填入诞生良辰，合参 2026 丙午流年，辨析夫妻宫与情感表达结构。",
    startText: "开启批算",
    startLoadingText: "正在排演命理盘局...",
    focus: "婚姻",
    directive: "当前板块为【婚姻】。请聚焦日支夫妻宫、财官对配偶取象、沟通方式、情感表达、边界感与亲密关系稳定度。"
  },
  "专业": {
    title: "命理精盘",
    topbarKicker: "四柱全盘",
    note: "此页只做专业排盘，不唤起任何批注。",
    startText: "开始排盘",
    startLoadingText: "正在铺陈四柱精盘...",
    focus: "专业",
    directive: ""
  }
};

const PILLAR_METHODS = [
  {
    key: "year",
    label: "年柱",
    palace: "祖上、早年环境、外部名分",
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
    palace: "月令提纲、事业环境、成事节令",
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
    palace: "日主自身、夫妻宫、核心关系位",
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
    palace: "后劲、输出、子女/成果位",
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

const GAN_YIN_YANG = {
  "甲": "阳",
  "乙": "阴",
  "丙": "阳",
  "丁": "阴",
  "戊": "阳",
  "己": "阴",
  "庚": "阳",
  "辛": "阴",
  "壬": "阳",
  "癸": "阴"
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

const ELEMENT_GENERATES = {
  "木": "火",
  "火": "土",
  "土": "金",
  "金": "水",
  "水": "木"
};

const ELEMENT_CONTROLS = {
  "木": "土",
  "土": "水",
  "水": "火",
  "火": "金",
  "金": "木"
};

const ZHI_ORDER = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const CHANG_SHENG_STATES = ["长生", "沐浴", "冠带", "临官", "帝旺", "衰", "病", "死", "墓", "绝", "胎", "养"];
const CHANG_SHENG_START = {
  "甲": "亥",
  "乙": "午",
  "丙": "寅",
  "丁": "酉",
  "戊": "寅",
  "己": "酉",
  "庚": "巳",
  "辛": "子",
  "壬": "申",
  "癸": "卯"
};

const BIRTH_TIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/;
const STANDARD_CHART_METHOD = "通用排法";
const RITUAL_LOADING_MS = 3000;
const START_LOADING_MS = 420;
const DOSSIER_CACHE_PREFIX = "tianji_dossier_v1";
const DOSSIER_CACHE_NOTICE = "命盘已解：此良辰曾排演，已为您调取天机卷宗。";

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
let currentAnalysisCategory = "学业";

function getViewState(view) {
  if (!viewState.has(view.id)) {
    viewState.set(view.id, {
      baziData: null,
      category: view.dataset.category || "学业"
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
  const genderSelect = view.querySelector(".gender-select");
  const birthTime = birthTimeInput?.value || "";
  const gender = genderSelect?.value || "";

  if (!birthTime) {
    throw new Error("请先选择诞生良辰");
  }

  if (!gender) {
    throw new Error("请选择性别，以便排定大运顺逆");
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
    second: Number(second),
    gender,
    genderText: gender === "male" ? "男" : "女",
    birthText: birthTime
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
      palace: method.palace,
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
  const dayMaster = eightChar.getDayGan();

  return {
    chartMethod,
    formData,
    solarText: solar.toYmdHms(),
    lunarText: lunar.toString(),
    pillars,
    dayMaster,
    dayMasterElement: getElementOf(dayMaster),
    liuNian: analyzeLiuNian(pillars, dayMaster),
    daYun: extractDaYunInfo(eightChar, formData.gender),
    wuXingStats: getWuXingStats(pillars),
    allShenSha: getAllShenSha(pillars),
    ganZhiList: pillars.map((pillar) => pillar.ganZhi),
    wuXingList: pillars.map((pillar) => pillar.wuXing)
  };
}

function readMethod(target, methodName) {
  try {
    return typeof target?.[methodName] === "function" ? target[methodName]() : "";
  } catch (error) {
    return "";
  }
}

function extractDaYunInfo(eightChar, gender) {
  if (typeof eightChar.getYun !== "function") {
    return {
      available: false,
      text: "当前排盘库未暴露大运接口，仅能以四柱原局与 2026 丙午流年互参。"
    };
  }

  try {
    const genderNumber = gender === "male" ? 1 : 0;
    const yun = eightChar.getYun(genderNumber, 1);
    const daYunList = normalizeList(readMethod(yun, "getDaYun")).map((daYun) => {
      const startYear = Number(readMethod(daYun, "getStartYear"));
      const endYear = Number(readMethod(daYun, "getEndYear"));

      return {
        ganZhi: readMethod(daYun, "getGanZhi"),
        startAge: readMethod(daYun, "getStartAge"),
        endAge: readMethod(daYun, "getEndAge"),
        startYear,
        endYear,
        xunKong: readMethod(daYun, "getXunKong")
      };
    });
    const current = daYunList.find((item) => item.startYear <= CURRENT_FLOW_YEAR.year && CURRENT_FLOW_YEAR.year <= item.endYear) || null;

    return {
      available: true,
      startYear: readMethod(yun, "getStartYear"),
      startMonth: readMethod(yun, "getStartMonth"),
      startDay: readMethod(yun, "getStartDay"),
      current,
      list: daYunList.slice(0, 8),
      text: current
        ? `${current.startYear}-${current.endYear} ${current.ganZhi}大运（${current.startAge}-${current.endAge}岁）`
        : "未定位到覆盖 2026 年的大运段。"
    };
  } catch (error) {
    return {
      available: false,
      text: "大运接口读取失败，仅能以四柱原局与 2026 丙午流年互参。"
    };
  }
}

function getTenGod(dayGan, targetGan) {
  const dayElement = getElementOf(dayGan);
  const targetElement = getElementOf(targetGan);
  const samePolarity = GAN_YIN_YANG[dayGan] === GAN_YIN_YANG[targetGan];

  if (!dayElement || !targetElement) {
    return "";
  }

  if (dayElement === targetElement) {
    return samePolarity ? "比肩" : "劫财";
  }

  if (ELEMENT_GENERATES[dayElement] === targetElement) {
    return samePolarity ? "食神" : "伤官";
  }

  if (ELEMENT_CONTROLS[dayElement] === targetElement) {
    return samePolarity ? "偏财" : "正财";
  }

  if (ELEMENT_CONTROLS[targetElement] === dayElement) {
    return samePolarity ? "七杀" : "正官";
  }

  if (ELEMENT_GENERATES[targetElement] === dayElement) {
    return samePolarity ? "偏印" : "正印";
  }

  return "";
}

function getChangShengState(dayGan, targetZhi) {
  const startZhi = CHANG_SHENG_START[dayGan];

  if (!startZhi) {
    return "";
  }

  const startIndex = ZHI_ORDER.indexOf(startZhi);
  const targetIndex = ZHI_ORDER.indexOf(targetZhi);
  const isYangGan = ["甲", "丙", "戊", "庚", "壬"].includes(dayGan);
  const offset = isYangGan
    ? (targetIndex - startIndex + 12) % 12
    : (startIndex - targetIndex + 12) % 12;

  return CHANG_SHENG_STATES[offset] || "";
}

function analyzeLiuNian(pillars, dayMaster) {
  const branches = pillars.map((pillar) => pillar.zhi);
  const ganNotes = pillars.map((pillar) => {
    const relation = getGanRelation(CURRENT_FLOW_YEAR.gan, pillar.gan);

    return `${CURRENT_FLOW_YEAR.gan}火临${pillar.label}${pillar.gan}，${relation || "以五行生克观其消长"}`;
  });
  const zhiNotes = pillars.flatMap((pillar) => getZhiRelations(pillar.zhi, branches).map((note) => `${CURRENT_FLOW_YEAR.zhi}临${pillar.label}${pillar.zhi}：${note}`));

  return {
    year: CURRENT_FLOW_YEAR.year,
    ganZhi: CURRENT_FLOW_YEAR.ganZhi,
    tenGod: getTenGod(dayMaster, CURRENT_FLOW_YEAR.gan),
    dayMasterInWu: getChangShengState(dayMaster, CURRENT_FLOW_YEAR.zhi),
    ganNotes,
    zhiNotes: uniqueList(zhiNotes)
  };
}

function getGanRelation(flowGan, natalGan) {
  const fiveHe = {
    "甲己": "天干相合，化土之象需看月令能否承化",
    "乙庚": "天干相合，金木相牵，主规则与生发互相牵制",
    "丙辛": "丙辛相合，火金相制而有合水之名，须看原局水气能否承接",
    "丁壬": "天干相合，火水相济，重在印食与情绪流通",
    "戊癸": "天干相合，土水相制，重在承载与流动的平衡"
  };
  const key = [flowGan, natalGan].sort().join("");
  const flowElement = getElementOf(flowGan);
  const natalElement = getElementOf(natalGan);

  if (fiveHe[key]) {
    return fiveHe[key];
  }

  if (ELEMENT_GENERATES[flowElement] === natalElement) {
    return `${flowElement}生${natalElement}，流年之气生扶原局天干`;
  }

  if (ELEMENT_GENERATES[natalElement] === flowElement) {
    return `${natalElement}生${flowElement}，原局天干泄向流年之气`;
  }

  if (ELEMENT_CONTROLS[flowElement] === natalElement) {
    return `${flowElement}克${natalElement}，流年之气制约原局天干`;
  }

  if (ELEMENT_CONTROLS[natalElement] === flowElement) {
    return `${natalElement}克${flowElement}，原局天干反制流年之气`;
  }

  return "";
}

function getZhiRelations(natalZhi, allNatalZhi) {
  const notes = [];

  if (natalZhi === "子") {
    notes.push("子午冲，水火正冲，动象明显，需看冲在何柱何宫");
  }

  if (natalZhi === "午") {
    notes.push("午午自刑，火势重叠，易见内在焦灼与重复耗力");
  }

  if (natalZhi === "未") {
    notes.push("午未六合，火土相引，合象需看是否化土成局");
  }

  if (natalZhi === "丑") {
    notes.push("丑午相害，湿土与烈火暗伤，重在隐性消耗");
  }

  if (natalZhi === "寅" || natalZhi === "戌") {
    notes.push("寅午戌火局有半合之势，火气被引动");
  }

  if (allNatalZhi.includes("寅") && allNatalZhi.includes("戌")) {
    notes.push("原局见寅戌，逢午可成寅午戌三合火局");
  }

  return uniqueList(notes);
}

function openModule(viewId, category) {
  if (category === "专业") {
    showView("chart-view");
    return;
  }

  currentAnalysisCategory = category;
  configureAnalysisView(category);
  showView("analysis-view");
}

function configureAnalysisView(category) {
  const view = document.querySelector("#analysis-view");
  const config = getCategoryConfig(category);
  const state = getViewState(view);

  view.dataset.category = category;
  state.category = category;
  state.baziData = null;
  document.querySelector("#analysis-title").textContent = config.title;
  document.querySelector("#analysis-kicker").textContent = config.topbarKicker;
  document.querySelector("#analysis-note").textContent = config.note;
  resetAnalysisOutput(view);
  setStartButtonLoading(view, false);
}

function showView(viewId) {
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

function resetAnalysisOutput(view) {
  const chartSection = view.querySelector(".chart-section");
  const resultBox = view.querySelector(".result-box");
  const academicSection = view.querySelector(".academic-section");
  const followUpInput = view.querySelector(".follow-up-input");

  renderCacheNotice(view, false);
  chartSection?.classList.add("is-empty");
  resultBox?.classList.remove("has-result");
  if (resultBox) {
    resultBox.innerHTML = "";
  }
  academicSection?.classList.add("is-empty");
  academicSection?.classList.remove("is-loading");
  setAcademicOutput(view, "summary", "批算完成后在此展开。");
  setAcademicOutput(view, "positions", "批算完成后在此展开。");
  renderFollowUpResult(view, "", false);
  if (followUpInput) {
    followUpInput.value = "";
  }
  updateRitualStatus(view, false);
}

function createDossierCacheKey(formData, category) {
  const birthKey = [
    formData.yearText,
    String(formData.month).padStart(2, "0"),
    String(formData.day).padStart(2, "0"),
    String(formData.hour).padStart(2, "0"),
    String(formData.minute).padStart(2, "0"),
    String(formData.second).padStart(2, "0")
  ].join("");

  return `${DOSSIER_CACHE_PREFIX}_${birthKey}_${formData.genderText}_${category}`;
}

function readDossierCache(cacheKey) {
  try {
    const rawCache = localStorage.getItem(cacheKey);

    if (!rawCache) {
      return null;
    }

    const parsedCache = JSON.parse(rawCache);

    if (!parsedCache?.summary || !parsedCache?.positions) {
      return null;
    }

    return {
      summary: sanitizePlainText(parsedCache.summary),
      positions: sanitizePlainText(parsedCache.positions)
    };
  } catch (error) {
    console.warn("天机卷宗读取失败", error);
    return null;
  }
}

function writeDossierCache(cacheKey, payload) {
  if (!payload?.summary || !payload?.positions) {
    return;
  }

  try {
    localStorage.setItem(cacheKey, JSON.stringify({
      summary: sanitizePlainText(payload.summary),
      positions: sanitizePlainText(payload.positions),
      createdAt: new Date().toISOString()
    }));
  } catch (error) {
    console.warn("天机卷宗写入失败", error);
  }
}

function renderCacheNotice(view, isVisible = false) {
  const chartSection = view.querySelector(".chart-section");

  if (!chartSection) {
    return;
  }

  let notice = chartSection.querySelector(".cache-notice");

  if (!notice) {
    notice = document.createElement("p");
    notice.className = "cache-notice";
    notice.style.margin = "0 0 10px";
    notice.style.color = "#5e8f78";
    notice.style.fontSize = "12px";
    notice.style.fontWeight = "800";
    notice.style.lineHeight = "1.6";
    notice.style.textAlign = "center";
    chartSection.querySelector(".section-heading")?.after(notice);
  }

  notice.hidden = !isVisible;
  notice.textContent = isVisible ? DOSSIER_CACHE_NOTICE : "";
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
    <div class="mini-pillar-grid" aria-label="天干地支四柱彩盘">
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

function showAcademicSection(view) {
  const academicSection = view.querySelector(".academic-section");

  academicSection?.classList.remove("is-empty");
}

function setAcademicOutput(view, type, content, isError = false) {
  const output = view.querySelector(`[data-output="${type}"]`);

  if (!output) {
    return;
  }

  output.classList.toggle("is-error", isError);
  output.innerHTML = renderParagraphLines(content);
}

function renderParagraphLines(content) {
  const lines = String(content || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) {
    return "";
  }

  return lines.map((line) => `<p>${escapeHTML(line)}</p>`).join("");
}

function renderAcademicResult(view, payload, isError = false) {
  showAcademicSection(view);
  setAcademicOutput(view, "summary", payload.summary || "未能生成运势总结。", isError);
  setAcademicOutput(view, "positions", payload.positions || "未能生成盘位星位。", isError);
}

function renderFollowUpResult(view, message, isError = false) {
  const result = view.querySelector(".follow-up-result");

  if (!result) {
    return;
  }

  result.classList.toggle("is-error", isError);
  result.innerHTML = message ? renderParagraphLines(message) : "";
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
  updateRitualStatus(view, false);
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

function setFollowUpLoading(view, isLoading = false) {
  const button = view.querySelector(".follow-up-button");

  if (!button) {
    return;
  }

  button.disabled = isLoading;
  button.classList.toggle("is-loading", isLoading);
  button.textContent = isLoading ? "先生正在审视命主疑惑..." : "定向追问";
}

function updateRitualStatus(view, isVisible = false) {
  const ritualStatus = view.querySelector(".ritual-status");
  const academicSection = view.querySelector(".academic-section");

  if (!ritualStatus) {
    return;
  }

  if (isVisible) {
    academicSection?.classList.remove("is-empty");
  }
  ritualStatus.classList.toggle("is-visible", isVisible);
}

function buildAIUserPrompt(baziData, category, options = {}) {
  const pillarText = baziData.pillars.map((pillar) => [
    `${pillar.label}:${pillar.ganZhi}`,
    `宫位:${pillar.palace}`,
    `主星:${pillar.shiShenGan}`,
    `天干:${pillar.gan}(${getElementOf(pillar.gan)})`,
    `地支:${pillar.zhi}(${getElementOf(pillar.zhi)})`,
    `藏干:${pillar.hideGan.join("/")}`,
    `副星:${pillar.shiShenZhi.join("/")}`,
    `星运:${pillar.diShi}`,
    `空亡:${pillar.xunKong}`,
    `纳音:${pillar.naYin}`
  ].join("，")).join("\n");
  const wuXingText = baziData.wuXingStats
    .map((item) => `${item.element}:${item.percent}%`)
    .join("，");
  const liuNianText = [
    `${CURRENT_FLOW_YEAR.year} ${CURRENT_FLOW_YEAR.ganZhi}，${CURRENT_FLOW_YEAR.note}`,
    `流年天干${CURRENT_FLOW_YEAR.gan}对日主${baziData.dayMaster}为${baziData.liuNian.tenGod || "待定十神"}`,
    `日主${baziData.dayMaster}在午地十二长生为${baziData.liuNian.dayMasterInWu || "待定"}`,
    `天干作用:${baziData.liuNian.ganNotes.join("；")}`,
    `地支作用:${baziData.liuNian.zhiNotes.join("；") || "原局未见明显子午冲、午午自刑、午未合、丑午害、寅午戌火局触发"}`
  ].join("\n");
  const modeText = options.mode === "followUp"
    ? `追问:${options.question}`
    : "任务:按【运势总结】与【盘位星位】两个标题输出纯文本内容。";

  return [
    `当前板块:${category}`,
    `出生:${baziData.formData.birthText}，性别:${baziData.formData.genderText}`,
    `日主:${baziData.dayMaster}，日主五行:${baziData.dayMasterElement}`,
    `四柱精盘:\n${pillarText}`,
    `五行占比:${wuXingText}`,
    `大运信息:${baziData.daYun.text}`,
    `2026丙午流年互参:\n${liuNianText}`,
    modeText,
    "请严格依据以上信息，不得另造生辰。"
  ].join("\n");
}

function buildSystemPrompt(category, mode = "initial") {
  const directive = CATEGORY_CONFIG[category]?.directive || "";
  const outputRule = mode === "followUp"
    ? "追问模式必须直接输出纯文本，不要标题，不要编号，不要 JSON，不要 Markdown，不要大括号，不要 followUp 或 answer 等键名。内容不少于180字，围绕用户具体疑问，代入四柱原局、大运与2026丙午流年，给出局部焦点解答；必须客观理性，不作绝对化断言。"
    : [
      "初始批断必须直接输出纯文本，只能包含【运势总结】与【盘位星位】两个标题段落，不要输出任何 JSON、键值对或大括号。",
      "【运势总结】规范：从日主五行强弱喜忌出发，论述 2026 丙午年火旺之极对当前板块的财官印授消长、用神到位或受克的宏观总揽。",
      "【盘位星位】规范：必须指出天干五行生克、地支刑冲合害、十神宫位权重，并结合长生十二神在午地的状态进行论述。"
    ].join("");

  return `${BASE_SYSTEM_PROMPT}${directive}${outputRule}`;
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

async function fetchAIInterpretation(baziData, category, options = {}) {
  if (!API_KEY.trim()) {
    throw new Error("API_KEY 未配置");
  }

  const mode = options.mode || "initial";
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
          content: buildSystemPrompt(category, mode)
        },
        {
          role: "user",
          content: buildAIUserPrompt(baziData, category, options)
        }
      ],
      temperature: 0,
      top_p: 0,
      max_tokens: mode === "followUp" ? 900 : 1300
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

  return parseAIContent(content, mode);
}

function parseAIContent(content, mode) {
  const cleaned = stripCodeFence(content);

  try {
    const parsed = JSON.parse(cleaned);

    if (mode === "followUp") {
      return {
        followUp: sanitizePlainText(parsed.followUp || parsed.answer || parsed.content || parsed.text || "")
      };
    }

    return {
      summary: sanitizePlainText(parsed.summary || parsed["运势总结"] || ""),
      positions: sanitizePlainText(parsed.positions || parsed["盘位星位"] || "")
    };
  } catch (error) {
    if (mode === "followUp") {
      return {
        followUp: sanitizePlainText(cleaned)
      };
    }

    return splitFallbackAcademicText(cleaned);
  }
}

function splitFallbackAcademicText(text) {
  const cleaned = stripCodeFence(text);
  const summaryMatch = cleaned.match(/(?:【?运势总结】?|summary)[:：\s]*([\s\S]*?)(?:【?盘位星位】?|positions)[:：\s]*/i);
  const positionsMatch = cleaned.match(/(?:【?盘位星位】?|positions)[:：\s]*([\s\S]*)/i);

  return {
    summary: sanitizePlainText(summaryMatch ? summaryMatch[1] : cleaned),
    positions: sanitizePlainText(positionsMatch ? positionsMatch[1] : "原文未能分段，请检查模型返回格式。")
  };
}

function stripCodeFence(value) {
  return String(value ?? "")
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}

function sanitizePlainText(value) {
  const stripped = stripCodeFence(value);
  let text = stripped;

  try {
    const parsed = JSON.parse(stripped);

    if (typeof parsed === "string") {
      text = parsed;
    } else if (parsed && typeof parsed === "object") {
      text = parsed.followUp || parsed.answer || parsed.content || parsed.text || parsed.summary || parsed.positions || Object.values(parsed).join(" ");
    }
  } catch (error) {
    text = stripped;
  }

  return String(text ?? "")
    .replace(/\\n/g, " ")
    .replace(/\r?\n/g, " ")
    .replace(/followUp|follow_up|answer|content|summary|positions/gi, "")
    .replace(/运势总结|盘位星位/g, "")
    .replace(/[{}"]/g, "")
    .replace(/^\s*[:：,，]+/, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

async function handleStartButtonClick(event) {
  const view = event.currentTarget.closest(".business-view");
  const category = view.dataset.category;
  const state = getViewState(view);

  try {
    const formData = getFormData(view);

    setStartButtonLoading(view, true);
    await wait(START_LOADING_MS);

    const baziData = calculateBaZi(formData);

    state.baziData = baziData;
    state.category = category;
    renderBaZi(baziData, view, {
      compact: !isProfessionalCategory(category)
    });

    if (isProfessionalCategory(category)) {
      renderCacheNotice(view, false);
      view.querySelector(".chart-section").scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
      return;
    }

    const cacheKey = createDossierCacheKey(formData, category);
    const cachedInterpretation = readDossierCache(cacheKey);

    showAcademicSection(view);
    renderFollowUpResult(view, "", false);

    if (cachedInterpretation) {
      renderCacheNotice(view, true);
      renderAcademicResult(view, cachedInterpretation);
      view.querySelector(".academic-section").scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
      return;
    }

    renderCacheNotice(view, false);
    updateRitualStatus(view, true);
    setAcademicOutput(view, "summary", "正在排演命理盘局...");
    setAcademicOutput(view, "positions", "接入人生中...");

    const [interpretationResult] = await Promise.allSettled([
      fetchAIInterpretation(baziData, category, { mode: "initial" }),
      wait(RITUAL_LOADING_MS)
    ]);

    if (interpretationResult.status === "rejected") {
      throw interpretationResult.reason;
    }

    writeDossierCache(cacheKey, interpretationResult.value);
    renderAcademicResult(view, interpretationResult.value);
    view.querySelector(".academic-section").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  } catch (error) {
    state.baziData = null;
    renderCacheNotice(view, false);

    if (isProfessionalCategory(category)) {
      renderError(error.message, view);
    } else {
      showAcademicSection(view);
      renderAcademicResult(view, {
        summary: "网络连接失败或 API 密钥未配置",
        positions: "网络连接失败或 API 密钥未配置"
      }, true);
    }
  } finally {
    updateRitualStatus(view, false);
    setStartButtonLoading(view, false);
  }
}

async function handleFollowUpClick(event) {
  const view = event.currentTarget.closest(".business-view");
  const state = getViewState(view);
  const category = state.category || view.dataset.category;
  const question = view.querySelector(".follow-up-input")?.value.trim() || "";

  if (!state.baziData) {
    renderFollowUpResult(view, "请先开启批算，待命盘落定后再追问。", true);
    return;
  }

  if (!question) {
    renderFollowUpResult(view, "请先写下一个具体追问。", true);
    return;
  }

  setFollowUpLoading(view, true);
  renderFollowUpResult(view, "先生正在审视命主疑惑...");

  try {
    const payload = await fetchAIInterpretation(state.baziData, category, {
      mode: "followUp",
      question
    });

    renderFollowUpResult(view, payload.followUp || "未能生成追问解析。");
  } catch (error) {
    renderFollowUpResult(view, "网络连接失败或 API 密钥未配置", true);
  } finally {
    setFollowUpLoading(view, false);
  }
}

document.querySelectorAll(".module-card[data-view]").forEach((moduleCard) => {
  moduleCard.addEventListener("click", () => {
    openModule(moduleCard.dataset.view, moduleCard.dataset.category);
  });
});

document.querySelectorAll(".back-button").forEach((button) => {
  button.addEventListener("click", backToHome);
});

document.querySelectorAll(".start-button").forEach((button) => {
  button.addEventListener("click", handleStartButtonClick);
});

document.querySelectorAll(".follow-up-button").forEach((button) => {
  button.addEventListener("click", handleFollowUpClick);
});
