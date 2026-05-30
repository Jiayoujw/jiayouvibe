import type { DirectoryEntry } from '../types'

export const directoryEntries: DirectoryEntry[] = [
  // ============ Model Platforms ============
  {
    id: 'openai-platform',
    name: 'OpenAI Platform',
    url: 'https://platform.openai.com',
    description: '全球最大AI模型API平台，提供GPT-5、GPT-4o、DALL-E、Whisper等最前沿模型调用服务。',
    category: 'model-platform',
    tags: ['API', 'LLM', '多模态', '模型调用'],
    language: 'en',
    featured: true
  },
  {
    id: 'anthropic-console',
    name: 'Anthropic Console',
    url: 'https://console.anthropic.com',
    description: 'Claude模型官方API平台，提供Opus、Sonnet、Haiku全系列模型的调用、调优和监控。',
    category: 'model-platform',
    tags: ['API', 'Claude', '安全', '企业级'],
    language: 'en',
    featured: true
  },
  {
    id: 'google-ai-studio',
    name: 'Google AI Studio',
    url: 'https://aistudio.google.com',
    description: 'Google官方AI开发平台，免费使用Gemini系列模型进行原型开发和测试。',
    category: 'model-platform',
    tags: ['API', 'Gemini', '多模态', '免费', 'Google'],
    language: 'en',
    featured: true
  },
  {
    id: 'deepseek-platform',
    name: 'DeepSeek Platform',
    url: 'https://platform.deepseek.com',
    description: '深度求索官方平台，提供DeepSeek V3和R1模型的API调用，以极高性价比著称。',
    category: 'model-platform',
    tags: ['API', 'DeepSeek', '开源', '推理', '中文'],
    language: 'zh',
    featured: true
  },
  {
    id: 'tongyi-aliyun',
    name: '阿里云百炼（通义千问）',
    url: 'https://bailian.console.aliyun.com',
    description: '阿里云大模型服务平台，提供Qwen系列全尺寸模型API、模型训练和应用搭建一站式服务。',
    category: 'model-platform',
    tags: ['API', 'Qwen', '开源', '模型训练', '中文'],
    language: 'zh',
    featured: true
  },
  {
    id: 'zhipu-openplatform',
    name: '智谱AI开放平台',
    url: 'https://open.bigmodel.cn',
    description: '智谱AI官方API平台，提供GLM系列模型调用，是中国领先的大模型开放平台之一。',
    category: 'model-platform',
    tags: ['API', 'GLM', '中文', '企业级'],
    language: 'zh',
    featured: false
  },
  {
    id: 'mistral-platform',
    name: 'Mistral AI Platform',
    url: 'https://console.mistral.ai',
    description: '欧洲领先AI公司Mistral的官方平台，提供Large、Small等多款模型API。',
    category: 'model-platform',
    tags: ['API', 'Mistral', '开源', '欧洲'],
    language: 'en',
    featured: false
  },
  {
    id: 'replicate',
    name: 'Replicate',
    url: 'https://replicate.com',
    description: '模型托管和推理平台，汇集数万个开源模型（SD、LLaMA等），一键部署API。',
    category: 'model-platform',
    tags: ['API', '开源模型', '托管', '社区'],
    language: 'en',
    featured: true
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    url: 'https://huggingface.co',
    description: '全球最大的AI模型和数据集共享平台，被誉为"AI界的GitHub"，提供模型托管、推理API和社区协作。',
    category: 'model-platform',
    tags: ['模型库', '数据集', '社区', '开源', '必备'],
    language: 'en',
    featured: true
  },
  {
    id: 'together-ai',
    name: 'Together AI',
    url: 'https://www.together.ai',
    description: 'AI加速云平台，提供开源模型（LLaMA、Mixtral等）的极速推理API和训练服务。',
    category: 'model-platform',
    tags: ['API', '开源模型', '推理加速', '训练'],
    language: 'en',
    featured: false
  },
  {
    id: 'groq',
    name: 'Groq',
    url: 'https://groq.com',
    description: '以极致推理速度著称的AI芯片公司，提供LPU驱动的超低延迟开源模型API。',
    category: 'model-platform',
    tags: ['API', '推理加速', 'LPU', '低延迟'],
    language: 'en',
    featured: false
  },

  // ============ Dev Tools ============
  {
    id: 'cursor-editor',
    name: 'Cursor',
    url: 'https://cursor.com',
    description: '革命性的AI驱动代码编辑器，深度融合Claude和GPT，支持全文件编辑和上下文感知编程。',
    category: 'dev-tool',
    tags: ['IDE', 'AI编程', '编辑器', '开发工具'],
    language: 'en',
    featured: true
  },
  {
    id: 'windsurf-editor',
    name: 'Windsurf',
    url: 'https://codeium.com/windsurf',
    description: 'Codeium推出的AI IDE，Cascade流式多文件编辑和多模型自由切换是其核心竞争力。',
    category: 'dev-tool',
    tags: ['IDE', 'AI编程', '多文件编辑', '开发工具'],
    language: 'en',
    featured: true
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    url: 'https://github.com/features/copilot',
    description: '全球最广泛使用的AI编程助手，深度集成VS Code和JetBrains等主流IDE。',
    category: 'dev-tool',
    tags: ['AI编程', 'GitHub', '插件', '代码补全'],
    language: 'en',
    featured: true
  },
  {
    id: 'v0-dev',
    name: 'v0 by Vercel',
    url: 'https://v0.dev',
    description: 'Vercel推出的AI前端UI生成工具，用自然语言描述即可生成React/Tailwind组件代码。',
    category: 'dev-tool',
    tags: ['前端', 'React', 'UI生成', 'Vercel'],
    language: 'en',
    featured: false
  },
  {
    id: 'bolt-new',
    name: 'bolt.new',
    url: 'https://bolt.new',
    description: 'StackBlitz推出的浏览器内AI全栈应用开发工具，输入提示词即可生成完整应用。',
    category: 'dev-tool',
    tags: ['全栈', '快速原型', 'Web开发'],
    language: 'en',
    featured: false
  },
  {
    id: 'comfyui',
    name: 'ComfyUI',
    url: 'https://github.com/comfyanonymous/ComfyUI',
    description: '节点式AI图像/视频生成工作流工具，支持Stable Diffusion、Flux等模型的可视化编排。',
    category: 'dev-tool',
    tags: ['图像生成', '工作流', 'Stable Diffusion', '开源'],
    language: 'en',
    featured: false
  },
  {
    id: 'langsmith',
    name: 'LangSmith',
    url: 'https://www.langchain.com/langsmith',
    description: 'LangChain推出的LLM应用可观测性平台，提供调试、测试、评估和全链路监控。',
    category: 'dev-tool',
    tags: ['LLMOps', '调试', '监控', 'LangChain'],
    language: 'en',
    featured: false
  },

  // ============ Learning Resources ============
  {
    id: 'deeplearning-ai',
    name: 'DeepLearning.AI',
    url: 'https://www.deeplearning.ai',
    description: 'Andrew Ng创办的AI教育平台，提供从入门到高级的系统性AI/ML在线课程。',
    category: 'learning-resource',
    tags: ['课程', 'Andrew Ng', '入门', '系统学习'],
    language: 'en',
    featured: true
  },
  {
    id: 'fast-ai',
    name: 'fast.ai',
    url: 'https://www.fast.ai',
    description: '以实用为导向的免费深度学习课程，强调实践和从零实现，社区活跃友好。',
    category: 'learning-resource',
    tags: ['课程', '深度学习', '免费', '实践'],
    language: 'en',
    featured: false
  },
  {
    id: 'lil-log',
    name: 'Lil\'Log',
    url: 'https://lilianweng.github.io',
    description: 'OpenAI研究科学家Lilian Weng的技术博客，深入浅出介绍LLM、Agent、RL等前沿主题。',
    category: 'learning-resource',
    tags: ['博客', 'LLM', '技术深度', 'OpenAI'],
    language: 'en',
    featured: true
  },
  {
    id: 'waytoagi',
    name: '通往AGI之路',
    url: 'https://waytoagi.feishu.cn',
    description: '中文AI学习社区中最全面的知识库之一，涵盖AI工具、教程、论文解读等海量资源。',
    category: 'learning-resource',
    tags: ['知识库', '中文', 'AI工具', '社区'],
    language: 'zh',
    featured: true
  },
  {
    id: 'jiqizhixin',
    name: '机器之心',
    url: 'https://www.jiqizhixin.com',
    description: '中国最专业的AI技术媒体之一，提供最新AI技术新闻、论文解读和深度分析。',
    category: 'learning-resource',
    tags: ['新闻', '论文', '中文', '技术媒体'],
    language: 'zh',
    featured: true
  },
  {
    id: 'theresanaiforthat',
    name: 'There\'s An AI For That',
    url: 'https://theresanaiforthat.com',
    description: '全球最大的AI工具导航网站之一，收录上万个AI应用，按场景分类索引。',
    category: 'learning-resource',
    tags: ['AI工具', '导航', '发现', '产品'],
    language: 'en',
    featured: false
  },
  {
    id: 'paperswithcode',
    name: 'Papers With Code',
    url: 'https://paperswithcode.com',
    description: '将AI研究论文与实现代码关联的平台，追踪各任务State-of-the-Art排名。',
    category: 'learning-resource',
    tags: ['论文', '代码', 'SOTA', '研究'],
    language: 'en',
    featured: true
  },
  {
    id: 'arxiv-cs',
    name: 'arXiv CS / AI',
    url: 'https://arxiv.org/list/cs.AI/recent',
    description: '康奈尔大学运营的预印本论文平台，是最新AI研究的首选阅读来源。',
    category: 'learning-resource',
    tags: ['论文', '预印本', '研究', '学术'],
    language: 'en',
    featured: false
  },

  // ============ Communities ============
  {
    id: 'huggingface-community',
    name: 'Hugging Face 社区',
    url: 'https://huggingface.co',
    description: '全球最活跃的AI开源社区，模型、数据集、讨论和技术分享的聚集地。',
    category: 'community',
    tags: ['开源', '社区', '模型分享', '国际'],
    language: 'en',
    featured: true
  },
  {
    id: 'reddit-ml',
    name: 'r/MachineLearning',
    url: 'https://www.reddit.com/r/MachineLearning/',
    description: 'Reddit上最大的机器学习社区，讨论最新论文、技术和行业动态。',
    category: 'community',
    tags: ['Reddit', '讨论', '论文', '英文'],
    language: 'en',
    featured: false
  },
  {
    id: 'reddit-localllama',
    name: 'r/LocalLLaMA',
    url: 'https://www.reddit.com/r/LocalLLaMA/',
    description: '专注于本地运行和微调开源大语言模型的Reddit社区，技术讨论深入活跃。',
    category: 'community',
    tags: ['Reddit', '开源模型', '本地部署', '微调'],
    language: 'en',
    featured: false
  },
  {
    id: 'twitter-ai',
    name: 'X/Twitter AI圈',
    url: 'https://x.com',
    description: 'AI研究者、工程师和创业者在X上的实时讨论，是最快获取AI动态的渠道。',
    category: 'community',
    tags: ['社交媒体', '实时', '动态', '英文'],
    language: 'en',
    featured: false
  },
  {
    id: 'jiqizhixin-community',
    name: '机器之心社区',
    url: 'https://www.jiqizhixin.com',
    description: '中文AI技术讨论社区，汇集了大量AI从业者和研究者，提供文章、活动和技术交流。',
    category: 'community',
    tags: ['中文社区', '技术讨论', '活动', '职业'],
    language: 'zh',
    featured: false
  },
  {
    id: 'kaggle',
    name: 'Kaggle',
    url: 'https://www.kaggle.com',
    description: '全球最大的数据科学竞赛平台，提供数据集、Notebook环境和丰富的机器学习竞赛。',
    category: 'community',
    tags: ['竞赛', '数据集', 'Notebook', '数据科学'],
    language: 'en',
    featured: true
  },
  {
    id: 'discord-midjourney',
    name: 'Midjourney Discord',
    url: 'https://discord.gg/midjourney',
    description: 'Midjourney官方Discord服务器，全球最活跃的AI图像生成创意社区。',
    category: 'community',
    tags: ['Discord', '图像生成', 'Midjourney', '创意'],
    language: 'en',
    featured: false
  },
  {
    id: 'aigc-open',
    name: 'AIGC开放社区',
    url: 'https://www.aigc.cn',
    description: '中文AIGC领域专业社区，汇集AI工具资讯、教程和行业分析。',
    category: 'community',
    tags: ['AIGC', '中文社区', '资讯', '工具'],
    language: 'zh',
    featured: true
  },
  {
    id: 'xiaohongshu-ai',
    name: '小红书 AI圈',
    url: 'https://www.xiaohongshu.com',
    description: '小红书平台上的AI内容社区，涵盖AI绘画、AI工具测评和AI学习等年轻人关注的话题。',
    category: 'community',
    tags: ['中文社区', 'AI绘画', '工具测评', '小红书'],
    language: 'zh',
    featured: false
  },

  // ============ Data ============
  {
    id: 'huggingface-datasets',
    name: 'Hugging Face Datasets',
    url: 'https://huggingface.co/datasets',
    description: '全球最大的开源AI数据集托管平台，涵盖NLP、CV、语音等各领域的海量数据集。',
    category: 'data',
    tags: ['数据集', '开源', 'NLP', 'CV', '多模态'],
    language: 'en',
    featured: true
  },
  {
    id: 'kaggle-datasets',
    name: 'Kaggle Datasets',
    url: 'https://www.kaggle.com/datasets',
    description: 'Kaggle数据集库，汇集各领域高质量数据集，支持在线分析和社区讨论。',
    category: 'data',
    tags: ['数据集', '竞赛', '数据科学', '各领域'],
    language: 'en',
    featured: false
  },
  {
    id: 'datawhale',
    name: 'Datawhale',
    url: 'https://www.datawhale.cn',
    description: '中文AI/数据科学开源学习社区，提供丰富的中文数据集和学习资源。',
    category: 'data',
    tags: ['中文数据集', '学习社区', '开源', '教育'],
    language: 'zh',
    featured: false
  },
  {
    id: 'common-crawl',
    name: 'Common Crawl',
    url: 'https://commoncrawl.org',
    description: '非营利组织维护的开放网络爬虫数据集，是训练大语言模型的基础数据来源之一。',
    category: 'data',
    tags: ['网页数据', 'LLM训练', '开源', '大规模'],
    language: 'en',
    featured: false
  },
  {
    id: 'tianchi',
    name: '阿里云天池',
    url: 'https://tianchi.aliyun.com',
    description: '阿里云旗下大数据竞赛平台，提供丰富的中文数据集和AI竞赛。',
    category: 'data',
    tags: ['竞赛', '数据集', '中文', '阿里云'],
    language: 'zh',
    featured: false
  },

  // ============ Other ============
  {
    id: 'ollama',
    name: 'Ollama',
    url: 'https://ollama.com',
    description: '本地运行开源大模型的最便捷工具，一键下载运行LLaMA、Qwen、DeepSeek等模型。',
    category: 'other',
    tags: ['本地推理', '开源模型', '工具', '必备'],
    language: 'en',
    featured: true
  },
  {
    id: 'lm-studio',
    name: 'LM Studio',
    url: 'https://lmstudio.ai',
    description: '桌面端本地LLM运行工具，提供图形化界面下载和管理开源模型。',
    category: 'other',
    tags: ['本地推理', '桌面工具', '开源模型', 'GUI'],
    language: 'en',
    featured: false
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    url: 'https://openrouter.ai',
    description: '统一的LLM API网关，一个API Key即可调用GPT、Claude、Gemini等200+模型。',
    category: 'other',
    tags: ['API', '模型路由', '统一接口', '多模型'],
    language: 'en',
    featured: true
  },
  {
    id: 'poe',
    name: 'Poe',
    url: 'https://poe.com',
    description: 'Quora推出的多模型AI聊天平台，一站式体验ChatGPT、Claude、Gemini等多个AI助手。',
    category: 'other',
    tags: ['聊天平台', '多模型', '对比', 'Quora'],
    language: 'en',
    featured: false
  },
  {
    id: 'openai-chatgpt',
    name: 'ChatGPT',
    url: 'https://chat.openai.com',
    description: 'OpenAI官方聊天产品，全球用户量最大的AI助手应用。',
    category: 'other',
    tags: ['聊天', 'OpenAI', 'GPT', '应用'],
    language: 'en',
    featured: true
  },
  {
    id: 'claude-ai',
    name: 'Claude.ai',
    url: 'https://claude.ai',
    description: 'Anthropic官方聊天产品，以安全性、长上下文和深度分析见长。',
    category: 'other',
    tags: ['聊天', 'Anthropic', 'Claude', '应用'],
    language: 'en',
    featured: true
  },
  {
    id: 'gemini-google',
    name: 'Gemini',
    url: 'https://gemini.google.com',
    description: 'Google官方AI助手，深度整合Google搜索和服务生态。',
    category: 'other',
    tags: ['聊天', 'Google', 'Gemini', '搜索'],
    language: 'en',
    featured: false
  },
  {
    id: 'kimi',
    name: 'Kimi Chat',
    url: 'https://kimi.moonshot.cn',
    description: '月之暗面推出的中文AI助手，以超长上下文和联网搜索能力著称。',
    category: 'other',
    tags: ['聊天', '中文', '长上下文', '月之暗面'],
    language: 'zh',
    featured: true
  },
  {
    id: 'doubao',
    name: '豆包',
    url: 'https://www.doubao.com',
    description: '字节跳动推出的AI对话助手，与抖音、飞书等字节生态深度整合。',
    category: 'other',
    tags: ['聊天', '中文', '字节跳动', '生态'],
    language: 'zh',
    featured: true
  },
  {
    id: 'yuanbao',
    name: '腾讯元宝',
    url: 'https://yuanbao.tencent.com',
    description: '腾讯推出的AI助手，基于混元大模型，与微信和腾讯生态深度整合。',
    category: 'other',
    tags: ['聊天', '中文', '腾讯', '微信'],
    language: 'zh',
    featured: false
  },
  {
    id: 'perplexity',
    name: 'Perplexity AI',
    url: 'https://www.perplexity.ai',
    description: 'AI驱动的搜索引擎，提供实时、有引用来源的专业答案，是传统搜索引擎的AI替代。',
    category: 'other',
    tags: ['搜索', 'AI搜索', '引用', '实时'],
    language: 'en',
    featured: true
  }
]
