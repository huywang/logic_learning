import "./style.css";

type LessonType = "逻辑推理" | "算法思维" | "Scratch 项目";

interface Lesson {
  id: number;
  week: number;
  title: string;
  type: LessonType;
  goal: string;
  duration: string;
  materials: string[];
  setup: string[];
  prompt: string[];
  guide: string[];
  hints: string[];
  solution: string[];
  recap: string;
  extension: string;
}

interface ProgressState {
  selectedLessonId: number;
  completed: number[];
  notes: Record<number, string>;
  initiative: Record<number, number>;
  persistence: Record<number, number>;
}

const rawLessons = [
  {
    week: 1,
    title: "信息表和排除法",
    type: "逻辑推理",
    goal: "从口头推理升级为表格推理。",
    prompt: ["甲、乙、丙、丁分别喜欢数学、语文、科学、体育。", "甲不喜欢语文也不喜欢体育。乙不喜欢数学。丙喜欢科学或体育。丁不喜欢体育。", "问：有哪些确定信息？还缺哪条信息才能唯一确定？"],
    guide: ["先画 4x4 表格。", "哪些格子可以直接划掉？", "哪些格子只能保留可能性？", "为什么不能强行给出唯一答案？"],
    hints: ["先处理否定条件。", "每一行每一列只能有一个答案。", "区分“能推出”和“猜起来像”。"],
    solution: ["甲只能是数学或科学。乙不能是数学。丁不能是体育。丙只能是科学或体育。", "这些条件不足以推出唯一分配。", "关键训练点是发现信息不足，而不是硬猜答案。"],
    extension: "让她补充一条条件，使答案唯一，并证明唯一。",
  },
  {
    week: 1,
    title: "二分猜数策略",
    type: "算法思维",
    goal: "把“猜得快”变成可解释策略。",
    prompt: ["你想一个 1 到 128 的数。", "她每次只能问“大于某个数吗”。", "要求她设计最多 7 次猜中的策略。"],
    guide: ["第一次问哪里最公平？", "每次问完，最多还剩多少可能？", "为什么 128 和 7 有关系？", "如果范围变成 1 到 1000 呢？"],
    hints: ["每次切一半。", "128 = 2 的 7 次方。", "剩余可能数变化：128, 64, 32, 16, 8, 4, 2, 1。"],
    solution: ["每次问当前范围中点。", "7 次问题最多能区分 2 的 7 次方，也就是 128 种情况。", "1 到 1000 需要约 10 次，因为 2 的 10 次方是 1024。"],
    extension: "让她解释为什么从 1 开始顺序猜不是好策略。",
  },
  {
    week: 1,
    title: "Scratch 猜数策略器",
    type: "Scratch 项目",
    goal: "用程序展示二分策略。",
    prompt: ["做一个程序：玩家想 1 到 128 的数，电脑来猜。", "玩家点击“大了”“小了”“对了”。", "电脑每次猜当前范围中点。"],
    guide: ["电脑需要记住哪些变量？", "如果猜大了，范围怎么变？", "如果猜小了，范围怎么变？", "什么时候结束？"],
    hints: ["变量：low、high、guess、次数。", "guess = floor((low + high) / 2)。", "大了就 high = guess - 1，小了就 low = guess + 1。"],
    solution: ["这个项目把二分查找做成可视化。", "重点不是界面，而是范围每次如何缩小。"],
    extension: "加一行显示当前可能范围，例如 33 到 64。",
  },
  {
    week: 2,
    title: "真假话进阶",
    type: "逻辑推理",
    goal: "用假设检验复杂真假条件。",
    prompt: ["A、B、C 三人中只有一人打碎杯子。", "A 说：不是我。B 说：是 C。C 说：B 说谎。", "已知三句话中恰好两句真话。问谁打碎了杯子？"],
    guide: ["先假设 A 做的，会有几句真话？", "再假设 B 做的。", "再假设 C 做的。", "哪个假设满足恰好两句真话？"],
    hints: ["把三种假设写成三行。", "每行分别判断 A、B、C 的话真假。", "只保留真话数量等于 2 的行。"],
    solution: ["假设 C 做的：A 真，B 真，C 假，恰好两真。", "答案是 C。"],
    extension: "把条件改成“恰好一句真话”，重新求解。",
  },
  {
    week: 2,
    title: "排序效率比较",
    type: "算法思维",
    goal: "从“能排序”升级为“比较方法成本”。",
    prompt: ["用 8 张牌做两种排序。", "方法 A：每轮找最小。方法 B：相邻两张逆序就交换，多轮扫过去。", "记录比较次数和交换次数。"],
    guide: ["哪种方法步骤更稳定？", "比较次数和交换次数是不是同一件事？", "牌已经接近有序时，哪种方法可能更快？"],
    hints: ["每比较一次画一笔。", "每交换一次单独记录。", "先用 5 张牌演示，再用 8 张牌。"],
    solution: ["选择排序比较次数稳定，但交换少。", "冒泡排序在接近有序时可提前结束。", "算法评价要看正确性、步骤数、是否容易出错。"],
    extension: "让她设计第三种排序方法，并说明优缺点。",
  },
  {
    week: 2,
    title: "Scratch 排序可视化",
    type: "Scratch 项目",
    goal: "把抽象算法变成可见过程。",
    prompt: ["做 6 个不同高度的柱子。", "点击“下一步”按钮，每次执行一次比较或交换。", "显示当前比较的是哪两根柱子。"],
    guide: ["柱子的高度表示什么？", "怎么让观众知道正在比较哪两个？", "交换前后状态如何变化？"],
    hints: ["先不要自动排序，只做手动下一步。", "用颜色标出正在比较的柱子。", "每次交换后暂停。"],
    solution: ["可视化项目的目标是解释过程。", "孩子能讲清楚每一步，比程序自动跑完更重要。"],
    extension: "增加比较次数计数器。",
  },
  {
    week: 3,
    title: "反例和证明",
    type: "逻辑推理",
    goal: "训练数学表达的严谨性。",
    prompt: ["判断并说明：所有偶数都能被 4 整除。", "所有正方形都是长方形。", "所有长方形都是正方形。", "两个奇数相加一定是偶数。"],
    guide: ["遇到“所有”，先找什么？", "一个反例够不够？", "最后一句能不能用一般形式说明？"],
    hints: ["先试 2、4、6、8。", "画一个 2x3 的长方形。", "奇数可以写成 2a+1。"],
    solution: ["第一句错，2 是反例。第二句对。第三句错，2x3 长方形是反例。", "(2a+1)+(2b+1)=2(a+b+1)，所以两个奇数相加一定是偶数。"],
    extension: "让她自己写 3 个“所有”命题，你来找反例。",
  },
  {
    week: 3,
    title: "抽屉原理",
    type: "算法思维",
    goal: "理解为什么有些结论不靠运气。",
    prompt: ["班里有 37 个同学。", "不看生日，能不能保证至少有 4 个人出生在同一个月份？", "为什么？"],
    guide: ["月份有几个抽屉？", "如果每个月最多 3 人，一共最多多少人？", "37 人时会发生什么？"],
    hints: ["12 个月，每个月最多 3 人就是 36 人。", "第 37 个人必须让某个月达到 4 人。"],
    solution: ["能保证。因为 12x3=36，37 人放进 12 个月，至少一个月有 4 人。"],
    extension: "如果要保证某个月至少 5 人，最少需要多少人？",
  },
  {
    week: 3,
    title: "Scratch 抽屉模拟器",
    type: "Scratch 项目",
    goal: "用模拟验证推理。",
    prompt: ["做一个程序，随机生成 37 个同学的生日月份。", "统计每个月人数。", "显示人数最多的月份。"],
    guide: ["月份如何随机？", "12 个月人数用什么记录？", "怎么找最大值？"],
    hints: ["可以先用 12 个变量，不急着用列表。", "每生成一个月份，对应变量加 1。", "最后逐个比较找最大。"],
    solution: ["模拟不能代替证明，但能帮助看见规律。", "抽屉原理是保证结论，随机模拟是现象展示。"],
    extension: "把人数改成 25、36、37、49，观察变化。",
  },
  {
    week: 4,
    title: "组合计数入门",
    type: "逻辑推理",
    goal: "系统数清楚，不重不漏。",
    prompt: ["有 3 件上衣、2 条裤子、2 双鞋。", "一共有多少种搭配？", "如果红上衣不能配蓝裤子，剩多少种？"],
    guide: ["没有限制时能不能用乘法？", "被禁止的搭配有多少种？", "减掉时有没有重复减？"],
    hints: ["无约束：3x2x2。", "红上衣固定，蓝裤子固定，鞋有 2 种。", "总数减去违规数。"],
    solution: ["无约束 12 种。", "红上衣配蓝裤子时鞋有 2 种，所以违规 2 种。", "剩 10 种。"],
    extension: "让她自己设计一个有两个限制条件的搭配题。",
  },
  {
    week: 4,
    title: "最短路径计数",
    type: "算法思维",
    goal: "从找一条路升级到数所有最短路。",
    prompt: ["在 3x3 方格上，从左下角到右上角，只能向右或向上。", "最短路径有多少条？", "如果中间一个点不能走呢？"],
    guide: ["总共要走几步？", "其中几步向右，几步向上？", "不同顺序是不是不同路径？", "障碍点会排除哪些路径？"],
    hints: ["3 步右，3 步上。", "问题变成 6 个位置里选 3 个放右。", "有障碍时，可以数经过障碍的路径再减掉。"],
    solution: ["无障碍共有 C(6,3)=20 条。", "障碍版本要看障碍坐标，先数所有，再减经过障碍的路径。"],
    extension: "换成 4x4 方格，只求无障碍路径数。",
  },
  {
    week: 4,
    title: "Scratch 路径计数器",
    type: "Scratch 项目",
    goal: "用程序枚举小规模路径。",
    prompt: ["做一个 3x3 网格。", "让角色只能向右或向上走到终点。", "每找到一条路径，计数加 1。"],
    guide: ["路径如何表示？", "什么叫到达终点？", "怎样避免走出边界？"],
    hints: ["先手动点击方向按钮生成路径。", "到终点后计数加 1。", "下一步再尝试让电脑自动枚举。"],
    solution: ["先让孩子理解状态：当前位置、已走路径、路径数。", "小规模枚举比直接讲递归更自然。"],
    extension: "增加障碍格，看看路径数如何变化。",
  },
  {
    week: 5,
    title: "必要条件和充分条件",
    type: "逻辑推理",
    goal: "区分“必须有”和“有了就够”。",
    prompt: ["下雨是地面湿的充分条件吗？必要条件吗？", "考试满分是成绩优秀的充分条件吗？必要条件吗？", "会 Scratch 是会编程思维的充分条件吗？"],
    guide: ["如果 A 发生，B 一定发生吗？", "如果没有 A，B 还可能发生吗？", "能不能举反例？"],
    hints: ["地面湿也可能是洒水。", "成绩优秀不一定满分。", "会工具不等于会思考。"],
    solution: ["下雨通常可导致地面湿，但不是必要条件。", "满分足以说明成绩优秀，但优秀不需要满分。", "Scratch 是训练媒介，不是思维能力本身。"],
    extension: "让她用生活例子各造一个充分条件和必要条件。",
  },
  {
    week: 5,
    title: "状态机游戏",
    type: "算法思维",
    goal: "理解系统会在状态之间切换。",
    prompt: ["设计一个门锁系统。", "状态有：锁着、输入中、已打开、报警。", "输入正确密码、输错、输错三次分别如何变化？"],
    guide: ["系统一开始在哪个状态？", "每个动作会让状态变成什么？", "有没有动作在某些状态下无效？"],
    hints: ["画状态圆圈。", "用箭头表示动作。", "输错次数也是状态的一部分。"],
    solution: ["状态机适合描述规则清楚的系统。", "门锁不是一堆 if，而是状态和事件的组合。"],
    extension: "把“电梯”设计成状态机。",
  },
  {
    week: 5,
    title: "Scratch 密码门",
    type: "Scratch 项目",
    goal: "实现一个小状态机。",
    prompt: ["做密码门：输入正确显示打开。", "连续错 3 次显示报警。", "点击重置回到锁着。"],
    guide: ["需要哪些变量？", "错误次数什么时候加 1？", "报警后还能继续输入吗？"],
    hints: ["变量：状态、错误次数、密码。", "状态为报警时，输入无效。", "重置时错误次数清零。"],
    solution: ["这个项目训练状态控制。", "重点是防止状态混乱，比如报警后还能打开。"],
    extension: "增加临时锁定 10 秒的规则。",
  },
  {
    week: 6,
    title: "递归分解",
    type: "逻辑推理",
    goal: "理解大问题由同类小问题组成。",
    prompt: ["一次可以走 1 阶或 2 阶。", "走到第 6 阶有几种走法？", "不要直接列全，试着用前面结果推。"],
    guide: ["到第 n 阶，最后一步可能从哪里来？", "第 6 阶和第 5、4 阶有什么关系？", "为什么不是乘法？"],
    hints: ["f(1)=1，f(2)=2。", "f(n)=f(n-1)+f(n-2)。", "依次算到 f(6)。"],
    solution: ["f(3)=3，f(4)=5，f(5)=8，f(6)=13。", "因为最后一步来自 n-1 或 n-2，两类情况不重叠，所以相加。"],
    extension: "继续算第 7、8 阶，观察数列。",
  },
  {
    week: 6,
    title: "汉诺塔 4 层",
    type: "算法思维",
    goal: "用递归策略解决更大规模。",
    prompt: ["用 4 个圆片玩汉诺塔。", "先不乱试，写出策略。", "最少需要多少步？"],
    guide: ["要移动最大圆片，前 3 个要去哪？", "移动 3 层需要几步？", "4 层步数和 3 层步数有什么关系？"],
    hints: ["T(1)=1。", "T(n)=2T(n-1)+1。", "T(4)=2T(3)+1。"],
    solution: ["T(2)=3，T(3)=7，T(4)=15。", "策略：先把 3 层移到中间，移动最大，再把 3 层移到目标。"],
    extension: "问她 5 层要多少步，不必真的操作。",
  },
  {
    week: 6,
    title: "Scratch 递归图形",
    type: "Scratch 项目",
    goal: "用自制积木表达重复结构。",
    prompt: ["用自制积木画树枝。", "每画一根树枝，就分成两根更短的树枝。", "深度到 0 停止。"],
    guide: ["什么参数会变？", "什么时候停止？", "如果不停止会怎样？"],
    hints: ["参数：长度、深度。", "每次长度变短，深度减 1。", "深度为 0 就返回。"],
    solution: ["递归必须有停止条件。", "每层做相似但更小的事情。"],
    extension: "调整角度和长度比例，观察图形差异。",
  },
  {
    week: 7,
    title: "概率直觉纠偏",
    type: "逻辑推理",
    goal: "区分短期结果和长期概率。",
    prompt: ["连续抛硬币 5 次都是正面。", "第 6 次更可能是反面吗？", "为什么很多人会觉得是？"],
    guide: ["硬币会记得前 5 次吗？", "每次抛掷是否独立？", "长期接近一半，是否要求短期补回来？"],
    hints: ["公平硬币每次正反都是 1/2。", "独立事件不会因为之前结果改变概率。", "这是赌徒谬误。"],
    solution: ["第 6 次仍然正反各 1/2。", "长期比例接近一半，不代表短期必须反向补偿。"],
    extension: "让她举一个生活里的“以为会补回来”的例子。",
  },
  {
    week: 7,
    title: "期望值入门",
    type: "算法思维",
    goal: "用平均收益判断游戏是否划算。",
    prompt: ["游戏 A：付 3 元，掷骰子，掷到 6 得 12 元，否则 0 元。", "长期玩是否划算？"],
    guide: ["掷到 6 的概率是多少？", "平均每次能拿回多少钱？", "和成本 3 元比呢？"],
    hints: ["收益期望 = 1/6 x 12 + 5/6 x 0。", "先算平均拿回，再减成本。"],
    solution: ["平均拿回 2 元。", "付出 3 元，所以平均每次亏 1 元。", "单次可能赢，长期不划算。"],
    extension: "把奖金改成多少才公平？",
  },
  {
    week: 7,
    title: "Scratch 概率实验室",
    type: "Scratch 项目",
    goal: "用大量模拟观察概率。",
    prompt: ["做一个掷骰子模拟器。", "点击一次模拟 100 次。", "显示 1 到 6 出现次数。"],
    guide: ["如何生成 1 到 6？", "如何记录每个点数次数？", "100 次和 1000 次结果有什么不同？"],
    hints: ["先用 6 个变量记录次数。", "循环 100 次，每次随机一个点数。", "对应点数变量加 1。"],
    solution: ["次数越多，分布通常越接近均匀。", "模拟帮助理解，但概率结论来自数学推理。"],
    extension: "模拟两个骰子的和，观察 7 是否最多。",
  },
  {
    week: 8,
    title: "不变量",
    type: "逻辑推理",
    goal: "寻找变化中不变的东西。",
    prompt: ["桌上有 10 枚硬币，正反随意。", "每次必须翻转 2 枚硬币。", "能否从 1 枚正面变成 10 枚正面？"],
    guide: ["每次翻两枚，正面数量会怎么变？", "正面数量的奇偶性会变吗？", "1 和 10 的奇偶性相同吗？"],
    hints: ["翻两枚可能让正面数 +2、0、-2。", "奇偶性不变。", "1 是奇数，10 是偶数。"],
    solution: ["不能。每次正面数量变化为偶数，所以奇偶性不变。", "从 1 枚正面无法变成 10 枚正面。"],
    extension: "如果每次翻 3 枚，奇偶性还不变吗？",
  },
  {
    week: 8,
    title: "图和最短路",
    type: "算法思维",
    goal: "把地图抽象成点和边。",
    prompt: ["画 6 个地点 A-F，连上不同道路并标距离。", "从 A 到 F 找最短路线。", "要求说明为什么不是另一条。"],
    guide: ["地点是什么？道路是什么？距离是什么？", "能不能先列出候选路线？", "如何避免漏掉？"],
    hints: ["用点表示地点，用线表示道路。", "先从 A 的邻居开始扩展。", "记录到每个点目前最短距离。"],
    solution: ["这是图的最短路问题。", "小学阶段不必完整讲 Dijkstra，但可以训练“记录当前最优并更新”。"],
    extension: "把地铁换乘设计成图。",
  },
  {
    week: 8,
    title: "Scratch 最短路演示",
    type: "Scratch 项目",
    goal: "可视化图搜索。",
    prompt: ["做 6 个城市节点。", "点击两个城市显示路线长度。", "手动选择路线，程序计算总长度。"],
    guide: ["城市和道路怎么表示？", "路线总长度怎么累计？", "怎么知道走过哪些城市？"],
    hints: ["先做手动路线选择，不急着自动搜索。", "变量记录总距离。", "列表记录走过城市。"],
    solution: ["这个项目先训练建模：点、边、权重、路径。", "自动搜索可以作为下一阶段。"],
    extension: "增加“撤销上一步”。",
  },
  {
    week: 9,
    title: "博弈策略",
    type: "逻辑推理",
    goal: "用倒推找必胜策略。",
    prompt: ["桌上有 15 颗石子。", "两人轮流拿，每次拿 1 到 3 颗。", "拿到最后一颗的人赢。你先手，怎么保证赢？"],
    guide: ["最后一步想留给对方什么局面？", "如果轮到对方时剩 4 颗，会怎样？", "要让对方依次面对哪些数？"],
    hints: ["4 是失败局面。", "让对方面对 4、8、12。", "15 开局先拿 3，剩 12。"],
    solution: ["先拿 3，剩 12。之后对方拿 k 颗，你拿 4-k 颗。", "这样每轮合计拿 4，最终让对方面对 4。"],
    extension: "如果每次可拿 1 到 4 颗，失败局面是什么？",
  },
  {
    week: 9,
    title: "贪心是否总对",
    type: "算法思维",
    goal: "理解局部最优不一定全局最优。",
    prompt: ["硬币面值有 1、3、4。", "要凑 6 元，每次都拿不超过剩余金额的最大硬币。", "贪心法拿几枚？最少其实几枚？"],
    guide: ["贪心第一步拿什么？", "剩下多少？", "有没有更少枚数的组合？", "为什么这个例子能说明贪心不总对？"],
    hints: ["贪心：4 + 1 + 1。", "另一种：3 + 3。", "比较枚数。"],
    solution: ["贪心得 3 枚，最优是 2 枚。", "局部看最大的选择，不一定带来整体最优。"],
    extension: "找一个贪心有效的硬币系统，比如 1、5、10。",
  },
  {
    week: 9,
    title: "Scratch 取石子游戏",
    type: "Scratch 项目",
    goal: "实现一个有策略的小游戏。",
    prompt: ["做 15 颗石子的游戏。", "玩家每次拿 1 到 3 颗。", "电脑用必胜策略回应。"],
    guide: ["剩余石子如何记录？", "玩家拿 k 颗后电脑拿几颗？", "什么时候判断胜负？"],
    hints: ["变量：剩余、玩家拿、电脑拿。", "电脑目标是让一轮合计 4。", "剩余为 0 时结束。"],
    solution: ["电脑策略：玩家拿 k，电脑拿 4-k。", "如果开局是 15，电脑后手可能不一定必胜，先让电脑先手演示。"],
    extension: "增加“玩家先手”和“电脑先手”两种模式。",
  },
  {
    week: 10,
    title: "命题和量词",
    type: "逻辑推理",
    goal: "准确使用所有、存在、不一定。",
    prompt: ["把下面句子改写得更严谨：", "有些同学喜欢数学。所有会编程的人逻辑都好。没有努力就一定不会进步。"],
    guide: ["这句话是在说所有人，还是一部分人？", "有没有反例？", "怎样表达才不会过度绝对？"],
    hints: ["“所有”需要非常强的证据。", "“存在一个”只需要一个例子。", "“不一定”常比“一定”更准确。"],
    solution: ["“有些同学喜欢数学”是存在命题。", "“所有会编程的人逻辑都好”太强，容易被反例推翻。", "“努力通常提高进步概率，但不是唯一条件”更严谨。"],
    extension: "让她把生活里的 5 句绝对化表达改严谨。",
  },
  {
    week: 10,
    title: "数据和偏差",
    type: "算法思维",
    goal: "理解样本会影响结论。",
    prompt: ["你问 10 个乒乓球队同学喜不喜欢乒乓球，9 个说喜欢。", "能不能推出全校 90% 同学喜欢乒乓球？为什么？"],
    guide: ["样本从哪里来？", "这个样本代表全校吗？", "要更可靠应该怎么抽样？"],
    hints: ["乒乓球队样本有偏。", "样本不代表总体。", "随机抽样更好。"],
    solution: ["不能推出。因为调查对象本身偏向喜欢乒乓球。", "这是选择偏差。"],
    extension: "设计一个更公平的校园兴趣调查方案。",
  },
  {
    week: 10,
    title: "Scratch 调查统计",
    type: "Scratch 项目",
    goal: "做一个简单数据收集工具。",
    prompt: ["做一个兴趣调查程序。", "输入兴趣类别：运动、阅读、编程、绘画、其他。", "程序统计每类人数并显示最多类别。"],
    guide: ["类别怎么记录？", "如何避免输入乱写？", "怎么比较哪个最多？"],
    hints: ["用按钮代替自由输入。", "每类一个变量。", "最后逐个比较最大值。"],
    solution: ["限制输入能让数据更干净。", "统计不仅是计数，还要考虑样本来源。"],
    extension: "增加总人数和百分比。",
  },
  {
    week: 11,
    title: "自己设计证明题",
    type: "逻辑推理",
    goal: "从解题转向造题和验证。",
    prompt: ["请她设计一道题，答案必须用排除法或反例解决。", "题目要有唯一答案。", "她要写出参考解法。"],
    guide: ["你希望考什么方法？", "题目有没有歧义？", "别人是否可能得到另一个答案？"],
    hints: ["先定方法，再造题。", "再定答案。", "最后补条件让答案唯一。"],
    solution: ["能造题说明她开始理解方法结构。", "你要重点检查条件是否足够、答案是否唯一。"],
    extension: "把题目给家人做，记录他们卡住的位置。",
  },
  {
    week: 11,
    title: "项目规则说明书",
    type: "算法思维",
    goal: "训练把想法写成可执行规则。",
    prompt: ["给最终项目写一页规则说明。", "包括目标、操作、变量、胜负条件、异常情况。"],
    guide: ["玩家第一步做什么？", "系统每一步如何反馈？", "如果玩家乱点怎么办？", "什么时候结束？"],
    hints: ["先写最小版本。", "异常情况单独列。", "每条规则都要可测试。"],
    solution: ["说明书不是作文，是程序设计前的结构化思考。", "规则越清楚，写 Scratch 越少返工。"],
    extension: "让她用流程图表达规则。",
  },
  {
    week: 11,
    title: "最终项目开工",
    type: "Scratch 项目",
    goal: "做出可运行的核心循环。",
    prompt: ["三选一：策略取石子、概率实验室、最短路演示。", "本课只做核心循环，不做美化。"],
    guide: ["最小可运行版本是什么？", "最重要的变量有哪些？", "哪一步最容易出 bug？"],
    hints: ["先做输入。", "再做状态更新。", "最后做反馈。"],
    solution: ["项目优先级：能运行、能解释、再好看。", "每完成一小步就测试。"],
    extension: "写下下一课要修的 3 个问题。",
  },
  {
    week: 12,
    title: "项目调试清单",
    type: "逻辑推理",
    goal: "用测试思维改进作品。",
    prompt: ["为最终项目设计 8 个测试。", "至少包括正常情况、边界情况、乱操作情况。"],
    guide: ["什么输入最普通？", "什么输入最极端？", "玩家如果乱点会怎样？", "测试通过的标准是什么？"],
    hints: ["每个测试写：操作、预期结果、实际结果。", "先测最核心规则。", "发现 bug 后一次只改一个。"],
    solution: ["调试就是用证据检查规则。", "边界情况比普通情况更容易暴露问题。"],
    extension: "让家人按测试清单试玩。",
  },
  {
    week: 12,
    title: "作品讲解和追问",
    type: "算法思维",
    goal: "确认她真的理解系统。",
    prompt: ["她展示作品 5 分钟。", "你追问变量、规则、策略、bug。", "她说明下一版会怎么改。"],
    guide: ["最核心的变量是什么？", "如果删掉这条规则会怎样？", "哪个 bug 最难找？", "你的程序用了哪种思维方法？"],
    hints: ["先让她完整讲，不打断。", "追问原因，不只看结果。", "记录她最有表达欲的部分。"],
    solution: ["能讲清楚系统，说明不只是照着做。", "下阶段方向看她最愿意讲的部分。"],
    extension: "让她录一个 3 分钟作品讲解视频。",
  },
  {
    week: 12,
    title: "下阶段路线选择",
    type: "Scratch 项目",
    goal: "基于 12 周观察选择下一条路。",
    prompt: ["回看 12 周记录。", "找出主动性最高的 3 课、坚持度最高的 3 课、最愿意讲的 3 课。", "选择下一阶段方向。"],
    guide: ["她在哪类问题上主动？", "她在哪类问题上卡住也不烦？", "她是更爱证明、策略、数据，还是创作？"],
    hints: ["不要只看做得对不对。", "看困难之后是否回来继续。", "看她是否会主动改题或加功能。"],
    solution: ["若偏证明和反例，走数学思维。若偏策略和算法，走信息学启蒙。若偏作品表达，走项目制编程。若偏数据，走科学实验和统计。"],
    extension: "制定下一阶段 4 周计划，每周只保留一个主线。",
  },
] satisfies Array<Omit<Lesson, "id" | "duration" | "materials" | "setup" | "recap">>;

const lessons: Lesson[] = rawLessons.map((lesson, index) => ({
  id: index + 1,
  duration: lesson.type === "Scratch 项目" ? "45 分钟" : "35 分钟",
  materials:
    lesson.type === "Scratch 项目"
      ? ["Scratch", "纸笔", "上一课记录"]
      : lesson.type === "算法思维"
        ? ["纸笔", "扑克牌或方格纸", "计数表"]
        : ["纸笔", "草稿纸"],
  setup:
    lesson.type === "Scratch 项目"
      ? ["先用纸写清变量、规则和反馈。", "只做最小可运行版本，暂时不美化。"]
      : ["先让她独立思考 5 到 8 分钟。", "要求她写出推理过程，不只说答案。"],
  recap: lesson.goal,
  ...lesson,
}));

const typeClass: Record<LessonType, string> = {
  逻辑推理: "logic",
  算法思维: "algorithm",
  "Scratch 项目": "scratch",
};

const state = loadState();
let currentLesson = lessons.find((lesson) => lesson.id === state.selectedLessonId) ?? lessons[0];
let visibleHintCount = 0;
let solutionVisible = false;

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <header class="app-header">
    <div>
      <p class="eyebrow">10 岁进阶版 · 上海四年级 · 有 Scratch 基础</p>
      <h1>儿童逻辑推理交互教案</h1>
      <p class="header-copy">从谜题兴趣出发，逐步进入证明、反例、算法策略、概率统计和 Scratch 项目化表达。</p>
    </div>
    <div class="progress-box">
      <span id="progressCount">0/36</span>
      <div class="progress-track"><div id="progressBar"></div></div>
    </div>
  </header>
  <main class="app-shell">
    <aside class="lesson-nav" aria-label="课程导航">
      <div class="nav-title">12 周课程</div>
      <div id="weekTabs" class="week-tabs"></div>
      <div id="lessonList" class="lesson-list"></div>
    </aside>
    <section class="lesson-panel">
      <div id="lessonContent"></div>
    </section>
    <aside class="coach-panel">
      <section class="coach-card">
        <h2>课堂记录</h2>
        <label>
          主动性
          <input id="initiativeRange" type="range" min="1" max="5" step="1" />
          <span id="initiativeValue"></span>
        </label>
        <label>
          卡住后坚持度
          <input id="persistenceRange" type="range" min="1" max="5" step="1" />
          <span id="persistenceValue"></span>
        </label>
        <label>
          观察笔记
          <textarea id="notesInput" rows="8" placeholder="记录她在哪一步眼睛发亮、哪里卡住、说出了什么关键思路。"></textarea>
        </label>
        <button id="completeBtn" class="primary-action" type="button"></button>
      </section>
      <section class="coach-card compact">
        <h2>进阶带法</h2>
        <ul>
          <li>先问她“为什么”，再看答案。</li>
          <li>鼓励发现“信息不足”。</li>
          <li>遇到所有、一定，先找反例。</li>
          <li>Scratch 只做表达工具，不刷语法。</li>
          <li>每 4 周根据记录调整方向。</li>
        </ul>
      </section>
    </aside>
  </main>
`;

const weekTabs = required<HTMLDivElement>("#weekTabs");
const lessonList = required<HTMLDivElement>("#lessonList");
const lessonContent = required<HTMLDivElement>("#lessonContent");
const progressCount = required<HTMLSpanElement>("#progressCount");
const progressBar = required<HTMLDivElement>("#progressBar");
const initiativeRange = required<HTMLInputElement>("#initiativeRange");
const initiativeValue = required<HTMLSpanElement>("#initiativeValue");
const persistenceRange = required<HTMLInputElement>("#persistenceRange");
const persistenceValue = required<HTMLSpanElement>("#persistenceValue");
const notesInput = required<HTMLTextAreaElement>("#notesInput");
const completeBtn = required<HTMLButtonElement>("#completeBtn");

renderWeekTabs();
renderLessonList();
renderLesson();
bindRecordEvents();

function renderWeekTabs() {
  weekTabs.innerHTML = Array.from({ length: 12 }, (_, index) => {
    const week = index + 1;
    const active = currentLesson.week === week ? "active" : "";
    return `<button class="${active}" data-week="${week}" type="button">第 ${week} 周</button>`;
  }).join("");

  weekTabs.querySelectorAll<HTMLButtonElement>("button").forEach((button) => {
    button.addEventListener("click", () => {
      const week = Number(button.dataset.week);
      selectLesson(lessons.find((lesson) => lesson.week === week) ?? lessons[0]);
    });
  });
}

function renderLessonList() {
  lessonList.innerHTML = lessons
    .filter((lesson) => lesson.week === currentLesson.week)
    .map((lesson) => {
      const active = lesson.id === currentLesson.id ? "active" : "";
      const done = state.completed.includes(lesson.id) ? "done" : "";
      return `
        <button class="lesson-item ${active} ${done}" data-lesson="${lesson.id}" type="button">
          <span class="lesson-number">${lesson.id}</span>
          <span>
            <strong>${lesson.title}</strong>
            <small>${lesson.type} · ${lesson.duration}</small>
          </span>
        </button>
      `;
    })
    .join("");

  lessonList.querySelectorAll<HTMLButtonElement>("button").forEach((button) => {
    button.addEventListener("click", () => {
      const lesson = lessons.find((item) => item.id === Number(button.dataset.lesson));
      if (lesson) selectLesson(lesson);
    });
  });
}

function renderLesson() {
  visibleHintCount = 0;
  solutionVisible = false;
  state.selectedLessonId = currentLesson.id;
  saveState();
  updateProgress();

  lessonContent.innerHTML = `
    <div class="lesson-hero">
      <div>
        <span class="type-pill ${typeClass[currentLesson.type]}">${currentLesson.type}</span>
        <h2>第 ${currentLesson.id} 课：${currentLesson.title}</h2>
        <p>${currentLesson.goal}</p>
      </div>
      <div class="meta-grid">
        <span>第 ${currentLesson.week} 周</span>
        <span>${currentLesson.duration}</span>
      </div>
    </div>
    <div class="content-grid">
      ${section("准备材料", currentLesson.materials)}
      ${section("课前设置", currentLesson.setup)}
    </div>
    <article class="teaching-block">
      <div class="block-head"><span>题目</span></div>
      ${list(currentLesson.prompt, "prompt-list")}
    </article>
    <article class="teaching-block">
      <div class="block-head"><span>解决引导</span></div>
      ${list(currentLesson.guide, "guide-list")}
    </article>
    <article class="teaching-block">
      <div class="block-head">
        <span>提示阶梯</span>
        <button id="hintBtn" class="secondary-action" type="button">显示下一条提示</button>
      </div>
      <ol id="hintList" class="hint-list"></ol>
    </article>
    <article class="teaching-block">
      <div class="block-head">
        <span>参考解法</span>
        <button id="solutionBtn" class="secondary-action" type="button">显示解法</button>
      </div>
      <div id="solutionBox" class="solution-box hidden-content">${list(currentLesson.solution, "solution-list")}</div>
    </article>
    <div class="recap-band">
      <strong>复盘句</strong>
      <span>${currentLesson.recap}</span>
    </div>
    <div class="extension-box">
      <strong>加深任务</strong>
      <span>${currentLesson.extension}</span>
    </div>
  `;

  required<HTMLButtonElement>("#hintBtn").addEventListener("click", showNextHint);
  required<HTMLButtonElement>("#solutionBtn").addEventListener("click", toggleSolution);
  syncRecordControls();
}

function section(title: string, items: string[]) {
  return `
    <article class="mini-card">
      <h3>${title}</h3>
      ${list(items, "mini-list")}
    </article>
  `;
}

function list(items: string[], className: string) {
  return `<ul class="${className}">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function showNextHint() {
  const hintList = required<HTMLOListElement>("#hintList");
  const hintBtn = required<HTMLButtonElement>("#hintBtn");

  if (visibleHintCount < currentLesson.hints.length) {
    const item = document.createElement("li");
    item.textContent = currentLesson.hints[visibleHintCount];
    hintList.appendChild(item);
    visibleHintCount += 1;
  }

  if (visibleHintCount >= currentLesson.hints.length) {
    hintBtn.textContent = "提示已全部显示";
    hintBtn.disabled = true;
  }
}

function toggleSolution() {
  const solutionBox = required<HTMLDivElement>("#solutionBox");
  const solutionBtn = required<HTMLButtonElement>("#solutionBtn");

  solutionVisible = !solutionVisible;
  solutionBox.classList.toggle("hidden-content", !solutionVisible);
  solutionBtn.textContent = solutionVisible ? "隐藏解法" : "显示解法";
}

function selectLesson(lesson: Lesson) {
  currentLesson = lesson;
  renderWeekTabs();
  renderLessonList();
  renderLesson();
}

function bindRecordEvents() {
  initiativeRange.addEventListener("input", () => {
    state.initiative[currentLesson.id] = Number(initiativeRange.value);
    initiativeValue.textContent = `${initiativeRange.value} 分`;
    saveState();
  });

  persistenceRange.addEventListener("input", () => {
    state.persistence[currentLesson.id] = Number(persistenceRange.value);
    persistenceValue.textContent = `${persistenceRange.value} 分`;
    saveState();
  });

  notesInput.addEventListener("input", () => {
    state.notes[currentLesson.id] = notesInput.value;
    saveState();
  });

  completeBtn.addEventListener("click", () => {
    const completed = new Set(state.completed);
    if (completed.has(currentLesson.id)) {
      completed.delete(currentLesson.id);
    } else {
      completed.add(currentLesson.id);
    }
    state.completed = [...completed].sort((a, b) => a - b);
    saveState();
    renderLessonList();
    syncRecordControls();
    updateProgress();
  });
}

function syncRecordControls() {
  initiativeRange.value = String(state.initiative[currentLesson.id] ?? 3);
  persistenceRange.value = String(state.persistence[currentLesson.id] ?? 3);
  initiativeValue.textContent = `${initiativeRange.value} 分`;
  persistenceValue.textContent = `${persistenceRange.value} 分`;
  notesInput.value = state.notes[currentLesson.id] ?? "";
  completeBtn.textContent = state.completed.includes(currentLesson.id) ? "标记为未完成" : "标记本课完成";
}

function updateProgress() {
  const done = state.completed.length;
  progressCount.textContent = `${done}/${lessons.length}`;
  progressBar.style.width = `${(done / lessons.length) * 100}%`;
}

function loadState(): ProgressState {
  const fallback: ProgressState = {
    selectedLessonId: 1,
    completed: [],
    notes: {},
    initiative: {},
    persistence: {},
  };

  try {
    const raw = localStorage.getItem("logic-course-progress-advanced");
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

function saveState() {
  localStorage.setItem("logic-course-progress-advanced", JSON.stringify(state));
}

function required<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing element: ${selector}`);
  return element;
}
