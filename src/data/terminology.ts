import type { Term } from '../types'

export const terms: Term[] = [
  // ============ Foundation 基础概念 ============
  {
    id: 'ai',
    term: '人工智能',
    abbreviation: 'AI',
    englishName: 'Artificial Intelligence',
    category: 'foundation',
    definition: '计算机科学的一个分支，旨在创建能够模拟人类智能行为（如学习、推理、感知、决策）的系统。',
    detailedExplanation: '人工智能涵盖机器学习、自然语言处理、计算机视觉、知识推理等多个子领域。现代AI以深度学习为核心驱动，依赖大规模数据和计算能力，实现了从图像识别到自然语言理解等突破性应用。',
    relatedTerms: ['机器学习', '深度学习', 'AGI', '神经网络'],
    tags: ['基础概念', '入门']
  },
  {
    id: 'ml',
    term: '机器学习',
    abbreviation: 'ML',
    englishName: 'Machine Learning',
    category: 'foundation',
    definition: '人工智能的子领域，研究如何让计算机通过数据自动学习和改进，而无需显式编程每个规则。',
    detailedExplanation: '机器学习分为监督学习、无监督学习和强化学习三大范式。传统ML算法包括决策树、SVM、随机森林等；现代ML以深度学习为主流，通过多层神经网络自动提取特征。',
    relatedTerms: ['深度学习', '监督学习', '强化学习', '神经网络'],
    tags: ['基础概念', '入门']
  },
  {
    id: 'dl',
    term: '深度学习',
    abbreviation: 'DL',
    englishName: 'Deep Learning',
    category: 'foundation',
    definition: '机器学习的一个分支，使用多层神经网络（深度神经网络）从数据中自动学习层次化特征表示。',
    relatedTerms: ['神经网络', '反向传播', '梯度下降', '激活函数'],
    tags: ['基础概念', '核心技术']
  },
  {
    id: 'agi',
    term: '通用人工智能',
    abbreviation: 'AGI',
    englishName: 'Artificial General Intelligence',
    category: 'foundation',
    definition: '指具备与人类同等或超越人类的广泛认知能力的人工智能系统，能够理解、学习和执行任何智力任务。',
    detailedExplanation: 'AGI与当前狭义AI（ANI）的关键区别在于通用性和自主性。OpenAI、DeepMind等机构将AGI作为终极目标。GPT-5、Claude Opus等前沿模型的出现引发了关于AGI是否即将到来的广泛讨论。',
    relatedTerms: ['人工智能', 'ASI', '对齐', '涌现能力'],
    tags: ['前沿概念', '重要概念']
  },
  {
    id: 'neural-network',
    term: '神经网络',
    abbreviation: 'NN',
    englishName: 'Neural Network',
    category: 'foundation',
    definition: '受生物神经系统启发的计算模型，由大量相互连接的节点（神经元）组成，通过调整连接权重来学习数据中的模式。',
    relatedTerms: ['深度学习', '反向传播', '激活函数', '权重'],
    tags: ['基础概念', '核心技术']
  },
  {
    id: 'training',
    term: '训练',
    englishName: 'Training',
    category: 'foundation',
    definition: '将数据输入模型，通过优化算法调整模型参数以最小化预测误差的过程。',
    relatedTerms: ['微调', '预训练', '梯度下降', '损失函数'],
    tags: ['基础概念']
  },
  {
    id: 'inference',
    term: '推理',
    englishName: 'Inference',
    category: 'inference',
    definition: '训练完成后的模型对新数据做出预测或生成输出的过程，通常不需要进一步调整模型参数。',
    relatedTerms: ['训练', '前向传播', '延迟', '吞吐量'],
    tags: ['基础概念', '部署']
  },
  {
    id: 'dataset',
    term: '数据集',
    englishName: 'Dataset',
    category: 'foundation',
    definition: '用于训练、验证和测试机器学习模型的结构化数据集合。',
    relatedTerms: ['数据增强', '数据清洗', '标注', '训练集'],
    tags: ['基础概念', '数据']
  },
  {
    id: 'overfitting',
    term: '过拟合',
    englishName: 'Overfitting',
    category: 'training',
    definition: '模型在训练数据上表现极好但在未见过的数据上表现差的现象，说明模型学习到了训练数据中的噪声而非通用模式。',
    relatedTerms: ['欠拟合', '正则化', 'Dropout', '验证集'],
    tags: ['训练', '常见问题']
  },
  {
    id: 'underfitting',
    term: '欠拟合',
    englishName: 'Underfitting',
    category: 'training',
    definition: '模型在训练数据和新数据上都表现不佳的现象，通常说明模型复杂度不足以捕捉数据中的模式。',
    relatedTerms: ['过拟合', '模型容量', '特征工程'],
    tags: ['训练', '常见问题']
  },
  {
    id: 'loss-function',
    term: '损失函数',
    englishName: 'Loss Function',
    category: 'training',
    definition: '衡量模型预测值与真实值之间差异的函数，训练的目标是最小化损失函数的值。',
    detailedExplanation: '常用损失函数包括：均方误差（MSE）用于回归任务，交叉熵损失用于分类任务，CTC损失用于序列识别。在LLM训练中，通常使用交叉熵损失来预测下一个token。',
    relatedTerms: ['梯度下降', '优化器', '反向传播'],
    tags: ['训练', '数学基础']
  },
  {
    id: 'gradient-descent',
    term: '梯度下降',
    englishName: 'Gradient Descent',
    category: 'training',
    definition: '通过计算损失函数对模型参数的梯度，并沿梯度反方向更新参数以最小化损失的优化算法。',
    relatedTerms: ['损失函数', '反向传播', '学习率', '优化器'],
    tags: ['训练', '数学基础']
  },

  // ============ Model 模型相关 ============
  {
    id: 'llm',
    term: '大语言模型',
    abbreviation: 'LLM',
    englishName: 'Large Language Model',
    category: 'model',
    definition: '基于大规模文本数据训练的深度学习模型（通常参数量达数十亿至数万亿），具备理解和生成自然语言的能力。',
    detailedExplanation: 'LLM基于Transformer架构，通过在海量文本上进行自监督预训练，然后在特定任务上微调或通过指令调优来适应应用需求。代表模型包括GPT系列、Claude系列、Gemini系列及开源LLaMA、Qwen等。',
    relatedTerms: ['Transformer', '预训练', '参数', 'Token'],
    tags: ['核心概念', '重要概念']
  },
  {
    id: 'parameters',
    term: '参数',
    englishName: 'Parameters',
    category: 'model',
    definition: '构成神经网络模型中可学习的权重和偏置变量，参数数量通常用来衡量模型的规模和能力。',
    detailedExplanation: '模型参数量从早期的数百万（BERT-base 110M）增长到如今数万亿级别。参数越多通常意味着更强的表达能力，但也意味着更高的计算成本和内存需求。',
    relatedTerms: ['量化', '模型压缩', '训练', '大语言模型'],
    tags: ['基础概念']
  },
  {
    id: 'token',
    term: '令牌',
    englishName: 'Token',
    category: 'model',
    definition: '语言模型处理文本的最小语义单元，可以是单词、子词或字符，模型将文本切分为token序列后进行处理。',
    detailedExplanation: '英文中一个token大约对应0.75个单词，中文中一个token大约对应0.5-1.5个汉字。模型的上下文窗口和计费通常以token为单位。Tokenization方法包括BPE、WordPiece、SentencePiece等。',
    relatedTerms: ['上下文窗口', '嵌入', '分词器'],
    tags: ['基础概念', '必知必会']
  },
  {
    id: 'context-window',
    term: '上下文窗口',
    englishName: 'Context Window',
    category: 'model',
    definition: '语言模型单次可以处理的最大token数量，决定了模型能够"记住"多少前文信息。',
    detailedExplanation: '早期模型上下文窗口仅4K-8K tokens。2024-2025年，GPT-4o支持128K，Claude支持200K，Gemini 2.5 Pro支持200万tokens。长上下文窗口对于处理长文档、多轮对话和代码库分析至关重要。',
    relatedTerms: ['Token', '注意力机制', '位置编码'],
    tags: ['重要概念']
  },
  {
    id: 'open-source-model',
    term: '开源模型',
    englishName: 'Open Source Model',
    category: 'model',
    definition: '模型权重、架构和训练方法向公众开放的AI模型，允许研究者和开发者自由使用、修改和分发。',
    detailedExplanation: '开源模型推动了AI民主化。代表包括Meta的LLaMA、阿里的Qwen、DeepSeek系列、Mistral等。开源模型的优势在于可定制性强、数据隐私可控、成本低，但在某些基准上可能落后于闭源顶级模型。',
    relatedTerms: ['LLaMA', 'Qwen', 'DeepSeek', 'Hugging Face'],
    tags: ['重要概念', '开源']
  },
  {
    id: 'pretrained-model',
    term: '预训练模型',
    englishName: 'Pretrained Model',
    category: 'model',
    definition: '在大规模通用数据上完成初始训练的模型，可作为基础模型通过微调适配特定下游任务。',
    relatedTerms: ['微调', '迁移学习', '基础模型'],
    tags: ['基础概念']
  },
  {
    id: 'foundation-model',
    term: '基础模型',
    englishName: 'Foundation Model',
    category: 'model',
    definition: '在大规模多样化数据上训练的通用的、可适配多种下游任务的大型AI模型。',
    detailedExplanation: '该概念由斯坦福HAI提出。GPT-4、Claude、Gemini等都属于基础模型。它们的核心特征是通过预训练获得广泛知识和能力，无需为每个特定任务从头训练。',
    relatedTerms: ['预训练模型', '大语言模型', '微调'],
    tags: ['核心概念']
  },
  {
    id: 'multimodal',
    term: '多模态',
    englishName: 'Multimodal',
    category: 'model',
    definition: '能够同时处理和理解多种数据类型（如文本、图像、音频、视频）的AI模型能力。',
    detailedExplanation: 'GPT-4o、Gemini系列、Claude 3.5+均为多模态模型，可以接收图像输入并生成文本回复。多模态是迈向通用AI的关键一步，让模型能像人类一样综合多感官信息。',
    relatedTerms: ['视觉语言模型', '文生图', '语音识别'],
    tags: ['重要概念', '前沿技术']
  },
  {
    id: 'mixture-of-experts',
    term: '混合专家',
    abbreviation: 'MoE',
    englishName: 'Mixture of Experts',
    category: 'architecture',
    definition: '一种模型架构，将模型分解为多个"专家"子网络，每个输入只激活部分专家，从而在保持大参数量的同时降低计算成本。',
    detailedExplanation: 'MoE是GPT-4、Mixtral、DeepSeek V3等模型高效运行的关键技术。通过路由机制选择最相关的专家处理每个token，实现参数规模的指数增长而计算量仅线性增长。',
    relatedTerms: ['稀疏激活', '路由', 'DeepSeek V3'],
    tags: ['架构', '前沿技术']
  },

  // ============ Training 训练相关 ============
  {
    id: 'fine-tuning',
    term: '微调',
    englishName: 'Fine-tuning',
    category: 'training',
    definition: '在预训练模型的基础上，使用特定领域或任务的数据继续训练，使模型更好地适应特定应用场景的过程。',
    detailedExplanation: '微调分为全量微调（更新所有参数）和参数高效微调（如LoRA，仅更新少量参数）。全量微调效果好但成本高；LoRA等技术大幅降低了微调门槛，使个人开发者也能在消费级硬件上微调大模型。',
    relatedTerms: ['预训练模型', 'LoRA', '迁移学习', '指令微调'],
    tags: ['核心技术', '必知必会']
  },
  {
    id: 'lora',
    term: '低秩适应',
    abbreviation: 'LoRA',
    englishName: 'Low-Rank Adaptation',
    category: 'training',
    definition: '一种参数高效微调技术，通过在预训练权重旁添加低秩分解矩阵来适配新任务，仅需更新极少量参数。',
    detailedExplanation: 'LoRA的核心思想是权重更新矩阵具有低"内在秩"。通过在原始权重旁注入可训练的低秩矩阵，LoRA仅需更新原参数量的0.1%-1%，大幅降低了微调的GPU显存需求，使得在消费级显卡上微调大模型成为可能。',
    relatedTerms: ['微调', 'QLoRA', '参数高效微调'],
    tags: ['训练', '重要技术']
  },
  {
    id: 'instruction-tuning',
    term: '指令微调',
    englishName: 'Instruction Tuning',
    category: 'training',
    definition: '在（指令，回答）数据对上微调模型，使模型学会遵循人类指令而非仅做文本补全的训练方法。',
    detailedExplanation: '指令微调是ChatGPT等对话模型成功的关键。通过在多样化的指令数据集上训练，模型学会了理解用户意图、遵循复杂指令、拒绝不当请求等行为模式。',
    relatedTerms: ['微调', 'RLHF', '对齐'],
    tags: ['训练', '重要技术']
  },
  {
    id: 'rlhf',
    term: '基于人类反馈的强化学习',
    abbreviation: 'RLHF',
    englishName: 'Reinforcement Learning from Human Feedback',
    category: 'training',
    definition: '使用人类偏好反馈作为奖励信号，通过强化学习优化语言模型输出质量和对齐度的训练方法。',
    detailedExplanation: 'RLHF是InstructGPT/ChatGPT成功的关键技术。流程包括：1)收集人类偏好数据；2)训练奖励模型；3)使用PPO等强化学习算法优化语言模型。RLHF使模型输出更有帮助、更真实、更无害。替代方案包括DPO（直接偏好优化），简化了训练流程。',
    relatedTerms: ['对齐', '指令微调', 'DPO', '奖励模型'],
    tags: ['训练', '核心技术']
  },
  {
    id: 'dpo',
    term: '直接偏好优化',
    abbreviation: 'DPO',
    englishName: 'Direct Preference Optimization',
    category: 'training',
    definition: '一种替代RLHF的对齐方法，直接通过偏好数据优化模型，无需训练单独的奖励模型。',
    detailedExplanation: 'DPO通过数学变换将对齐目标重新参数化，直接使用偏好对（好回答vs差回答）优化策略模型。相比RLHF，DPO更简单、更稳定，已成为主流对齐方法之一。',
    relatedTerms: ['RLHF', '对齐', '指令微调'],
    tags: ['训练', '前沿技术']
  },
  {
    id: 'transfer-learning',
    term: '迁移学习',
    englishName: 'Transfer Learning',
    category: 'training',
    definition: '将在一个任务上学到的知识应用到另一个相关任务上的机器学习方法。',
    relatedTerms: ['微调', '预训练模型', '领域自适应'],
    tags: ['基础概念']
  },
  {
    id: 'data-augmentation',
    term: '数据增强',
    englishName: 'Data Augmentation',
    category: 'training',
    definition: '通过对现有数据进行变换（如旋转、裁剪、回译、同义词替换等）生成新训练样本，以扩充数据集的技术。',
    relatedTerms: ['数据集', '过拟合', '合成数据'],
    tags: ['训练', '数据']
  },
  {
    id: 'curriculum-learning',
    term: '课程学习',
    englishName: 'Curriculum Learning',
    category: 'training',
    definition: '模仿人类学习过程，从简单样本开始逐步过渡到复杂样本的训练策略。',
    relatedTerms: ['训练', '学习率调度'],
    tags: ['训练']
  },

  // ============ Architecture 架构相关 ============
  {
    id: 'transformer',
    term: 'Transformer架构',
    englishName: 'Transformer',
    category: 'architecture',
    definition: '2017年由Vaswani等人在《Attention Is All You Need》中提出的神经网络架构，完全基于自注意力机制，是几乎所有现代大语言模型的基础。',
    detailedExplanation: 'Transformer抛弃了传统RNN的序列处理方式，通过自注意力机制实现并行计算。其核心组件包括多头自注意力、前馈网络、层归一化和残差连接。Transformer的提出彻底改变了NLP领域，并扩展到视觉（ViT）、多模态等领域。',
    relatedTerms: ['注意力机制', '自注意力', '编码器-解码器'],
    tags: ['核心架构', '必知必会']
  },
  {
    id: 'attention',
    term: '注意力机制',
    englishName: 'Attention Mechanism',
    category: 'architecture',
    definition: '让模型在处理输入时动态关注相关信息并忽略无关信息的机制，是Transformer的核心组件。',
    detailedExplanation: '注意力机制通过计算查询（Query）、键（Key）、值（Value）之间的相似度来分配权重。自注意力（Self-Attention）让序列中的每个位置都能关注所有其他位置，捕捉长距离依赖关系。',
    relatedTerms: ['Transformer', '多头注意力', '自注意力'],
    tags: ['核心架构', '必知必会']
  },
  {
    id: 'self-attention',
    term: '自注意力',
    englishName: 'Self-Attention',
    category: 'architecture',
    definition: '注意力机制的一种形式，序列中的每个元素对其他所有元素计算注意力权重，从而捕捉序列内部的依赖关系。',
    relatedTerms: ['注意力机制', 'Transformer', '多头注意力'],
    tags: ['架构']
  },
  {
    id: 'multi-head-attention',
    term: '多头注意力',
    englishName: 'Multi-Head Attention',
    category: 'architecture',
    definition: '并行运行多组自注意力计算，每组关注输入的不同表示子空间，然后将结果拼接，使模型能同时关注多种关系。',
    relatedTerms: ['注意力机制', '自注意力', 'Transformer'],
    tags: ['架构']
  },
  {
    id: 'positional-encoding',
    term: '位置编码',
    englishName: 'Positional Encoding',
    category: 'architecture',
    definition: '为Transformer模型注入序列位置信息的技术，因为自注意力本身不包含位置信息。',
    detailedExplanation: '常见的位置编码包括：正弦位置编码（原始Transformer）、可学习位置嵌入、旋转位置编码（RoPE）。RoPE被LLaMA、Qwen、DeepSeek等主流模型广泛采用，能更好地处理长序列和外推。',
    relatedTerms: ['Transformer', '自注意力', 'RoPE'],
    tags: ['架构']
  },
  {
    id: 'rope',
    term: '旋转位置编码',
    abbreviation: 'RoPE',
    englishName: 'Rotary Position Embedding',
    category: 'architecture',
    definition: '一种通过旋转矩阵编码位置信息的方案，具有良好的长度外推能力，被LLaMA、Qwen、DeepSeek等主流模型采用。',
    relatedTerms: ['位置编码', 'Transformer'],
    tags: ['架构', '重要技术']
  },
  {
    id: 'encoder-decoder',
    term: '编码器-解码器',
    englishName: 'Encoder-Decoder',
    category: 'architecture',
    definition: '一种模型架构模式：编码器将输入编码为中间表示，解码器基于该表示生成输出。广泛用于翻译、摘要等Seq2Seq任务。',
    relatedTerms: ['Transformer', '自编码器'],
    tags: ['架构']
  },
  {
    id: 'quantization',
    term: '量化',
    englishName: 'Quantization',
    category: 'inference',
    definition: '将模型参数从高精度（如FP32/FP16）降低到低精度（如INT8/INT4）的技术，以减少模型存储和推理时的内存占用与计算量。',
    detailedExplanation: '量化是模型部署的关键技术。4-bit量化（如GPTQ、AWQ、GGUF）可使70B模型在消费级GPU上运行。量化通常会带来轻微精度损失，但在多数场景下可忽略。',
    relatedTerms: ['推理', '模型压缩', 'GGUF', 'AWQ'],
    tags: ['部署', '重要技术']
  },
  {
    id: 'rnn',
    term: '循环神经网络',
    abbreviation: 'RNN',
    englishName: 'Recurrent Neural Network',
    category: 'architecture',
    definition: '一种处理序列数据的经典神经网络架构，通过隐藏状态在序列步骤间传递信息。',
    detailedExplanation: 'RNN的变体包括LSTM和GRU，解决了原始RNN的梯度消失问题。虽然Transformer已取代RNN成为NLP主流架构，但RNN在时间序列预测等任务中仍有应用。新兴的RWKV、Mamba等线性注意力模型可视为RNN和Transformer的融合。',
    relatedTerms: ['LSTM', 'Transformer', '序列模型'],
    tags: ['架构', '经典模型']
  },
  {
    id: 'lstm',
    term: '长短期记忆网络',
    abbreviation: 'LSTM',
    englishName: 'Long Short-Term Memory',
    category: 'architecture',
    definition: '一种特殊的RNN变体，通过门控机制（输入门、遗忘门、输出门）有效解决长序列训练中的梯度消失问题。',
    relatedTerms: ['RNN', 'GRU', '序列模型'],
    tags: ['架构', '经典模型']
  },

  // ============ Application 应用相关 ============
  {
    id: 'prompt',
    term: '提示词',
    englishName: 'Prompt',
    category: 'application',
    definition: '用户输入给AI模型的指令或问题文本，引导模型生成期望的输出。',
    detailedExplanation: '提示词可以是简单问题、详细指令、示例或复杂的工作流描述。提示词工程已成为一门专业技能，优秀的提示词能显著提升模型输出质量。',
    relatedTerms: ['提示词工程', '上下文学习', '系统提示'],
    tags: ['应用', '必知必会']
  },
  {
    id: 'prompt-engineering',
    term: '提示词工程',
    englishName: 'Prompt Engineering',
    category: 'application',
    definition: '系统性地设计和优化提示词以引导AI模型产生期望输出的技术和方法论。',
    detailedExplanation: '提示词工程技术包括：零样本提示（Zero-shot）、少样本提示（Few-shot）、思维链（Chain-of-Thought）、角色扮演、格式约束等。随着模型能力提升，提示词工程从"技巧"逐渐演变为系统工程。',
    relatedTerms: ['提示词', '思维链', '上下文学习'],
    tags: ['应用', '重要技能']
  },
  {
    id: 'chain-of-thought',
    term: '思维链',
    abbreviation: 'CoT',
    englishName: 'Chain of Thought',
    category: 'application',
    definition: '一种提示技术，引导模型在给出最终答案前展示中间推理步骤，显著提升复杂推理任务的表现。',
    detailedExplanation: 'CoT提示在数学问题、逻辑推理、多步骤决策等任务中效果显著。DeepSeek R1等推理模型将CoT内化为模型能力（通过强化学习训练），展现了惊人的推理深度。',
    relatedTerms: ['提示词工程', '推理', 'DeepSeek R1'],
    tags: ['应用', '重要技术']
  },
  {
    id: 'in-context-learning',
    term: '上下文学习',
    abbreviation: 'ICL',
    englishName: 'In-Context Learning',
    category: 'application',
    definition: '大语言模型无需参数更新，仅通过提示词中的示例即可学习执行新任务的能力，是LLM涌现能力的典型表现。',
    relatedTerms: ['少样本学习', '提示词', '涌现能力'],
    tags: ['应用']
  },
  {
    id: 'rag',
    term: '检索增强生成',
    abbreviation: 'RAG',
    englishName: 'Retrieval-Augmented Generation',
    category: 'application',
    definition: '结合信息检索与文本生成的技术框架，先从知识库检索相关文档，再将检索结果作为上下文提供给LLM生成更准确、更及时的回复。',
    detailedExplanation: 'RAG有效解决了LLM的知识截止日期限制和幻觉问题。典型RAG流程包括：文档索引→查询编码→相似度检索→上下文整合→生成回答。高级RAG还涉及重排序、混合检索、多步推理等技术。',
    relatedTerms: ['向量数据库', '嵌入', '幻觉', '知识库'],
    tags: ['核心技术', '必知必会']
  },
  {
    id: 'embedding',
    term: '嵌入',
    englishName: 'Embedding',
    category: 'application',
    definition: '将文本、图像等非结构化数据映射到高维向量空间中的数值表示，语义相近的对象在向量空间中距离更近。',
    detailedExplanation: '嵌入是RAG、语义搜索、推荐系统等应用的基础。主流嵌入模型包括OpenAI text-embedding-3、BGE、Jina Embeddings等。嵌入向量的维度通常为768-3072维。',
    relatedTerms: ['向量数据库', 'RAG', '语义搜索'],
    tags: ['基础概念', '核心技术']
  },
  {
    id: 'vector-db',
    term: '向量数据库',
    englishName: 'Vector Database',
    category: 'application',
    definition: '专门用于存储和检索高维向量（嵌入）的数据库系统，支持高效的相似度搜索（ANN近似最近邻搜索）。',
    detailedExplanation: '主流向量数据库包括：Pinecone（云服务）、Milvus（开源）、Weaviate、Qdrant、Chroma。它们通过HNSW、IVF等索引算法实现毫秒级相似向量检索，是RAG、语义搜索的核心基础设施。',
    relatedTerms: ['嵌入', 'RAG', '语义搜索', 'ANN'],
    tags: ['工具', '基础设施']
  },
  {
    id: 'agent',
    term: 'AI智能体',
    englishName: 'AI Agent',
    category: 'application',
    definition: '能够感知环境、制定计划、使用工具并自主执行多步骤任务以实现目标的AI系统。',
    detailedExplanation: 'AI智能体通常基于LLM作为"大脑"，配合工具调用（函数调用）、记忆系统、规划能力来完成任务。代表性框架包括LangChain、CrewAI、AutoGPT等。2025年被称为"AI Agent元年"。',
    relatedTerms: ['函数调用', '工具使用', '多智能体', '规划'],
    tags: ['前沿概念', '重要概念']
  },
  {
    id: 'function-calling',
    term: '函数调用',
    englishName: 'Function Calling / Tool Use',
    category: 'application',
    definition: 'LLM根据用户输入自动选择和调用预定义函数/API的能力，使模型能够与外部系统交互。',
    relatedTerms: ['AI智能体', '工具使用', 'API'],
    tags: ['应用', '重要技术']
  },
  {
    id: 'semantic-search',
    term: '语义搜索',
    englishName: 'Semantic Search',
    category: 'application',
    definition: '基于语义理解而非关键词匹配的搜索技术，通过嵌入向量相似度找到含义相关的文档。',
    relatedTerms: ['嵌入', '向量数据库', 'RAG'],
    tags: ['应用']
  },
  {
    id: 'text-to-image',
    term: '文生图',
    englishName: 'Text-to-Image Generation',
    category: 'application',
    definition: '根据文本描述自动生成对应图像的AI技术。',
    detailedExplanation: '主流文生图模型包括DALL-E 3、Midjourney、Stable Diffusion、Flux等。背后技术涉及扩散模型、CLIP文本编码器和潜在空间生成。2024-2025年，文生图质量已达到照片级真实感。',
    relatedTerms: ['扩散模型', 'DALL-E', 'Stable Diffusion', 'Midjourney'],
    tags: ['应用', '热门技术']
  },
  {
    id: 'text-to-video',
    term: '文生视频',
    englishName: 'Text-to-Video Generation',
    category: 'application',
    definition: '根据文本描述自动生成视频内容的AI技术。',
    detailedExplanation: 'OpenAI Sora的发布标志着文生视频技术的重大突破。其他重要模型包括Runway Gen-3、快手可灵（Kling）、Pika等。技术挑战包括时间一致性、物理规律模拟和生成时长限制。',
    relatedTerms: ['Sora', '扩散模型', '视频生成'],
    tags: ['应用', '前沿技术']
  },
  {
    id: 'tts',
    term: '文本转语音',
    abbreviation: 'TTS',
    englishName: 'Text-to-Speech',
    category: 'application',
    definition: '将书面文本转换为自然流畅的语音输出的AI技术。',
    detailedExplanation: '现代TTS（如ElevenLabs、OpenAI TTS、Fish Audio）能生成高度自然的语音，支持多种语言、情感表达和声音克隆。技术路线包括VITS、Tortoise-TTS、Bark等神经网络声码器方案。',
    relatedTerms: ['语音识别', '多模态'],
    tags: ['应用']
  },
  {
    id: 'asr',
    term: '自动语音识别',
    abbreviation: 'ASR',
    englishName: 'Automatic Speech Recognition',
    category: 'application',
    definition: '将人类语音自动转换为文本的技术，即"语音转文字"。',
    detailedExplanation: 'OpenAI Whisper是目前最广泛使用的开源ASR模型，支持近百种语言。其他方案包括Google Speech-to-Text、Azure语音服务。现代端到端ASR系统如Whisper采用编码器-解码器Transformer架构。',
    relatedTerms: ['Whisper', 'TTS', '多模态'],
    tags: ['应用']
  },

  // ============ Ethics/Training 对齐与伦理 ============
  {
    id: 'alignment',
    term: '对齐',
    englishName: 'AI Alignment',
    category: 'ethics',
    definition: '确保AI系统的行为、目标和价值观与人类的意图、利益和伦理标准相一致的研究领域。',
    detailedExplanation: '对齐问题包括：如何让AI理解并遵循人类复杂模糊的价值观？如何防止AI产生有害输出？Anthropic以" Constitutional AI"为核心方法论，OpenAI使用RLHF。对齐是AI安全的核心挑战。',
    relatedTerms: ['RLHF', 'AI安全', '有害输出', '红队测试'],
    tags: ['伦理', '重要概念']
  },
  {
    id: 'hallucination',
    term: '幻觉',
    englishName: 'Hallucination',
    category: 'ethics',
    definition: 'AI模型自信地生成与事实不符、无根据或完全虚构的内容的现象。',
    detailedExplanation: '幻觉是当前LLM的核心难题之一，根源在于模型本质上是统计预测而非知识检索。缓解方法包括RAG（引入外部知识）、更精细的对齐训练、事实性验证工具等，但尚未根本解决。',
    relatedTerms: ['RAG', '对齐', '事实性'],
    tags: ['常见问题', '必知必会']
  },
  {
    id: 'bias',
    term: '偏见',
    englishName: 'Bias',
    category: 'ethics',
    definition: 'AI模型在训练数据中学习到的系统性、不公平的倾向或歧视，可能导致对特定群体的不公平对待。',
    detailedExplanation: '偏见可能体现在性别、种族、地域、文化等维度。缓解方法包括多样化训练数据、偏见检测工具、公平性约束训练等，但完全消除偏见仍是开放挑战。',
    relatedTerms: ['对齐', '公平性', '红队测试'],
    tags: ['伦理', '重要问题']
  },
  {
    id: 'red-teaming',
    term: '红队测试',
    englishName: 'Red Teaming',
    category: 'ethics',
    definition: '通过模拟攻击者行为，系统性地测试AI模型的安全性、鲁棒性和潜在漏洞的评估方法。',
    detailedExplanation: '红队测试包括：越狱攻击（Jailbreak）、提示注入、有害内容生成测试、偏见审计等。OpenAI、Anthropic、Google等机构在模型发布前都会进行大规模红队测试。',
    relatedTerms: ['对齐', '安全', '越狱', '提示注入'],
    tags: ['伦理', '安全']
  },
  {
    id: 'jailbreak',
    term: '越狱',
    englishName: 'Jailbreak',
    category: 'ethics',
    definition: '使用特殊构造的提示词绕过AI模型的安全限制和内容过滤，使其生成通常被拒绝的有害内容。',
    relatedTerms: ['红队测试', '提示注入', '安全'],
    tags: ['安全', '伦理']
  },
  {
    id: 'prompt-injection',
    term: '提示注入',
    englishName: 'Prompt Injection',
    category: 'ethics',
    definition: '一种安全攻击方式，通过在输入中嵌入恶意指令，劫持或操控LLM的行为。',
    detailedExplanation: '提示注入分为直接注入（用户输入中包含恶意指令）和间接注入（从外部数据源引入恶意指令）。这是AI应用安全的核心威胁之一，尚无完美的防御方案。',
    relatedTerms: ['越狱', '红队测试', '安全'],
    tags: ['安全', '重要问题']
  },
  {
    id: 'explainability',
    term: '可解释性',
    abbreviation: 'XAI',
    englishName: 'Explainable AI',
    category: 'ethics',
    definition: '使AI模型的决策过程和输出结果能够被人类理解和解释的研究方向。',
    detailedExplanation: '深度学习模型通常被视为"黑盒"。可解释性方法包括注意力可视化、特征归因（SHAP、LIME）、机制可解释性（Anthropic的研究方向）等。在医疗、金融等高风险领域，可解释性尤为重要。',
    relatedTerms: ['注意力可视化', '特征归因'],
    tags: ['伦理', '研究前沿']
  },
  {
    id: 'ai-safety',
    term: 'AI安全',
    englishName: 'AI Safety',
    category: 'ethics',
    definition: '研究如何确保AI系统可靠、可控、无害的研究领域，涵盖技术安全、伦理安全和社会影响。',
    relatedTerms: ['对齐', '红队测试', '越狱', '通用人工智能'],
    tags: ['伦理', '重要概念']
  },

  // ============ Tool / Framework 工具与框架 ============
  {
    id: 'hugging-face',
    term: 'Hugging Face',
    englishName: 'Hugging Face',
    category: 'tool',
    definition: '全球最大的AI模型和数据集共享平台，提供Transformers库、模型托管、推理API等核心服务，被誉为"AI界的GitHub"。',
    relatedTerms: ['开源模型', '数据集', 'Transformers'],
    tags: ['平台', '必备工具']
  },
  {
    id: 'langchain',
    term: 'LangChain',
    englishName: 'LangChain',
    category: 'tool',
    definition: '最流行的LLM应用开发框架，提供链（Chain）、智能体（Agent）、检索（Retrieval）等抽象，简化基于LLM的应用构建。',
    relatedTerms: ['AI智能体', 'RAG', 'LlamaIndex'],
    tags: ['框架', '热门工具']
  },
  {
    id: 'pytorch',
    term: 'PyTorch',
    englishName: 'PyTorch',
    category: 'tool',
    definition: 'Meta开源的深度学习框架，支持动态计算图和GPU加速，是AI研究和开发的主流框架。',
    relatedTerms: ['深度学习', 'TensorFlow', '神经网络'],
    tags: ['框架', '必备工具']
  },
  {
    id: 'cuda',
    term: 'CUDA',
    englishName: 'Compute Unified Device Architecture',
    category: 'tool',
    definition: 'NVIDIA开发的并行计算平台和编程模型，使GPU能够执行通用计算任务，是深度学习训练和推理的核心基础设施。',
    relatedTerms: ['GPU', 'PyTorch', '推理', '训练'],
    tags: ['基础设施', '硬件']
  },
  {
    id: 'gpu',
    term: '图形处理器',
    abbreviation: 'GPU',
    englishName: 'Graphics Processing Unit',
    category: 'tool',
    definition: '最初用于图形渲染的专用处理器，因其强大的并行计算能力成为深度学习训练和推理的核心硬件。',
    detailedExplanation: 'NVIDIA GPU（A100、H100、B200等）主导了AI计算市场。H100是目前最主流的AI训练GPU。2024-2025年的GPU供应紧张成为AI行业瓶颈之一。',
    relatedTerms: ['CUDA', '推理', '训练', '显存'],
    tags: ['硬件', '基础设施']
  },
  {
    id: 'vllm',
    term: 'vLLM',
    englishName: 'vLLM',
    category: 'tool',
    definition: '高性能LLM推理引擎，通过PagedAttention等技术实现高吞吐量、低延迟的模型服务。',
    relatedTerms: ['推理', '部署', 'KV缓存'],
    tags: ['工具', '部署']
  },
  {
    id: 'ollama',
    term: 'Ollama',
    englishName: 'Ollama',
    category: 'tool',
    definition: '简化本地运行开源大语言模型的工具，提供一键下载和运行、REST API等功能，极大降低了本地LLM的使用门槛。',
    relatedTerms: ['开源模型', '本地推理', 'LLaMA'],
    tags: ['工具', '热门工具']
  },
  {
    id: 'docker',
    term: 'Docker',
    englishName: 'Docker',
    category: 'tool',
    definition: '容器化平台，将AI应用及其依赖打包为可移植的容器，是AI应用部署的标准方式。',
    relatedTerms: ['部署', '微服务', 'Kubernetes'],
    tags: ['工具', '基础设施']
  },
  {
    id: 'openai-api',
    term: 'OpenAI API',
    englishName: 'OpenAI API',
    category: 'tool',
    definition: 'OpenAI提供的云端AI模型调用接口，开发者可通过API集成GPT-4o、DALL-E、Whisper等模型能力。',
    relatedTerms: ['GPT-4o', '函数调用', '嵌入'],
    tags: ['平台', 'API']
  },
  {
    id: 'langsmith',
    term: 'LangSmith',
    englishName: 'LangSmith',
    category: 'tool',
    definition: 'LangChain推出的LLM应用可观测性平台，提供调试、测试、评估和监控功能。',
    relatedTerms: ['LangChain', '可观测性', '评估'],
    tags: ['工具', '开发工具']
  },

  // ============ Model categories / 模型相关 (more) ============
  {
    id: 'diffusion-model',
    term: '扩散模型',
    englishName: 'Diffusion Model',
    category: 'model',
    definition: '一类生成模型，通过逐步向数据添加噪声然后学习逆向去噪过程来生成新数据，是文生图技术的核心架构。',
    detailedExplanation: '扩散模型通过前向过程（加噪）和反向过程（去噪）来学习数据分布。DDPM、Stable Diffusion（在潜空间中进行扩散）、DiT（结合Transformer）是代表性架构。Sora使用DiT架构实现视频生成。',
    relatedTerms: ['文生图', 'Stable Diffusion', 'DALL-E', 'Sora'],
    tags: ['模型架构', '生成模型']
  },
  {
    id: 'gan',
    term: '生成对抗网络',
    abbreviation: 'GAN',
    englishName: 'Generative Adversarial Network',
    category: 'model',
    definition: '由生成器和判别器组成的对抗性训练框架，两者相互博弈推动生成质量提升。',
    relatedTerms: ['扩散模型', '生成模型', '图像生成'],
    tags: ['模型架构', '经典模型']
  },
  {
    id: 'vlm',
    term: '视觉语言模型',
    abbreviation: 'VLM',
    englishName: 'Vision-Language Model',
    category: 'model',
    definition: '能够同时理解和处理图像与文本信息的多模态AI模型。',
    detailedExplanation: 'VLM通常结合视觉编码器（如ViT、SigLIP）和语言模型。GPT-4o、Gemini 2.5 Pro、Claude 3.5+、Qwen-VL、LLaVA等均为VLM。应用包括图像描述、视觉问答、图表理解、OCR等。',
    relatedTerms: ['多模态', '计算机视觉', '文生图'],
    tags: ['模型类型', '热门方向']
  },

  // ============ Training / Optimization ============
  {
    id: 'epoch',
    term: '训练轮次',
    englishName: 'Epoch',
    category: 'training',
    definition: '模型在整个训练数据集上完成一次完整的前向传播和反向传播的过程。',
    relatedTerms: ['训练', '批量大小', '学习率'],
    tags: ['训练']
  },
  {
    id: 'batch-size',
    term: '批量大小',
    englishName: 'Batch Size',
    category: 'training',
    definition: '每次梯度更新时使用的训练样本数量。较大的批量可以提供更稳定的梯度估计，但需要更多显存。',
    relatedTerms: ['训练', '梯度下降', '显存'],
    tags: ['训练']
  },
  {
    id: 'learning-rate',
    term: '学习率',
    englishName: 'Learning Rate',
    category: 'training',
    definition: '控制每次参数更新步长大小的超参数，是训练过程中最关键的超参数之一。',
    detailedExplanation: '学习率过大可能导致训练振荡甚至发散；过小则收敛缓慢。现代训练通常使用学习率调度策略，如warmup+cosine decay、ReduceLROnPlateau等。',
    relatedTerms: ['梯度下降', '优化器', '超参数'],
    tags: ['训练']
  },
  {
    id: 'optimizer',
    term: '优化器',
    englishName: 'Optimizer',
    category: 'training',
    definition: '根据损失函数的梯度更新模型参数的算法。AdamW是目前训练大模型最常用的优化器。',
    relatedTerms: ['梯度下降', '学习率', 'Adam'],
    tags: ['训练']
  },
  {
    id: 'backpropagation',
    term: '反向传播',
    englishName: 'Backpropagation',
    category: 'training',
    definition: '通过链式法则计算神经网络中各层参数梯度的核心算法，是深度学习训练的基础。',
    relatedTerms: ['梯度下降', '损失函数', '链式法则'],
    tags: ['训练', '数学基础']
  },
  {
    id: 'dropout',
    term: '随机失活',
    englishName: 'Dropout',
    category: 'training',
    definition: '一种正则化技术，训练时随机丢弃一部分神经元，防止过拟合。',
    relatedTerms: ['过拟合', '正则化', '训练'],
    tags: ['训练']
  },
  {
    id: 'normalization',
    term: '归一化',
    englishName: 'Normalization',
    category: 'training',
    definition: '对数据进行标准化处理使其均值为0、方差为1的技术。在神经网络中包括批归一化（BatchNorm）、层归一化（LayerNorm）等。',
    relatedTerms: ['训练', '层归一化', 'Transformer'],
    tags: ['训练']
  },
  {
    id: 'synthetic-data',
    term: '合成数据',
    englishName: 'Synthetic Data',
    category: 'training',
    definition: '由AI模型自动生成而非人工标注的训练数据，用于扩充数据集或训练模型。',
    detailedExplanation: '合成数据在LLM训练中日益重要，可用于生成对话数据、代码指令数据等。但也存在"模型自噬"风险——用模型生成的数据训练可能导致质量退化。',
    relatedTerms: ['数据增强', '训练数据', '蒸馏'],
    tags: ['训练', '数据']
  },

  // ============ Inference / Deployment ============
  {
    id: 'latency',
    term: '延迟',
    englishName: 'Latency',
    category: 'inference',
    definition: '从发送请求到收到完整响应之间的时间间隔，是衡量模型推理速度的关键指标。',
    relatedTerms: ['推理', '吞吐量', 'TTFT'],
    tags: ['推理', '性能']
  },
  {
    id: 'throughput',
    term: '吞吐量',
    englishName: 'Throughput',
    category: 'inference',
    definition: '系统在单位时间内处理的请求数量或生成的token数量，衡量系统的并发处理能力。',
    relatedTerms: ['推理', '延迟', '批量推理'],
    tags: ['推理', '性能']
  },
  {
    id: 'kv-cache',
    term: 'KV缓存',
    englishName: 'KV Cache',
    category: 'inference',
    definition: '在Transformer自回归生成过程中缓存已计算的Key-Value对，避免重复计算，是LLM推理加速的核心技术。',
    detailedExplanation: 'KV缓存使LLM生成每个新token时无需重新计算历史token的Key-Value。vLLM的PagedAttention通过分页管理KV缓存，大幅提升了推理效率。',
    relatedTerms: ['推理', 'vLLM', '注意力机制'],
    tags: ['推理', '核心技术']
  },
  {
    id: 'speculative-decoding',
    term: '推测解码',
    englishName: 'Speculative Decoding',
    category: 'inference',
    definition: '使用小型"草稿模型"快速生成候选token，再用大模型并行验证的推理加速技术。',
    relatedTerms: ['推理', '延迟', 'KV缓存'],
    tags: ['推理', '前沿技术']
  },
  {
    id: 'api',
    term: '应用程序接口',
    abbreviation: 'API',
    englishName: 'Application Programming Interface',
    category: 'application',
    definition: '允许不同软件系统之间进行交互和通信的接口。在AI中，通常指通过HTTP请求调用云端模型服务。',
    relatedTerms: ['OpenAI API', 'REST', '函数调用'],
    tags: ['基础概念']
  },

  // ============ Architectures (more) ============
  {
    id: 'cnn',
    term: '卷积神经网络',
    abbreviation: 'CNN',
    englishName: 'Convolutional Neural Network',
    category: 'architecture',
    definition: '一种专门用于处理网格结构数据（如图像）的神经网络，通过卷积操作提取局部特征。',
    relatedTerms: ['计算机视觉', '图像分类', 'ViT'],
    tags: ['架构', '经典模型']
  },
  {
    id: 'vit',
    term: '视觉Transformer',
    abbreviation: 'ViT',
    englishName: 'Vision Transformer',
    category: 'architecture',
    definition: '将Transformer架构直接应用于图像处理，将图像切分为patch序列进行处理的模型架构。',
    relatedTerms: ['Transformer', 'CNN', '计算机视觉'],
    tags: ['架构', '前沿架构']
  },
  {
    id: 'mamba',
    term: 'Mamba',
    englishName: 'Mamba / State Space Model',
    category: 'architecture',
    definition: '基于状态空间模型（SSM）的新型序列建模架构，以线性时间复杂度处理长序列，是Transformer的有力竞争者。',
    detailedExplanation: 'Mamba通过选择机制（Selective SSM）使状态空间模型能根据输入动态调整参数，克服了传统SSM的局限性。在长序列任务上展现出比Transformer更好的效率和扩展性。',
    relatedTerms: ['Transformer', '注意力机制', 'RWKV'],
    tags: ['架构', '前沿架构']
  },
  {
    id: 'activation-function',
    term: '激活函数',
    englishName: 'Activation Function',
    category: 'architecture',
    definition: '为神经网络引入非线性变换的函数，使网络能学习复杂模式。常见的有ReLU、GELU、SiLU/SwiGLU等。',
    relatedTerms: ['神经网络', '反向传播'],
    tags: ['架构', '数学基础']
  },

  // ============ Benchmarks 评估 ============
  {
    id: 'benchmark',
    term: '基准测试',
    englishName: 'Benchmark',
    category: 'application',
    definition: '用于评估和比较AI模型性能的标准化测试集和指标。',
    detailedExplanation: '常见LLM基准包括：MMLU（多学科知识）、HumanEval（代码生成）、GSM8K（数学推理）、HellaSwag（常识推理）、MT-Bench（多轮对话）等。选择基准时需注意数据污染和评估偏差问题。',
    relatedTerms: ['MMLU', '评估', '过拟合'],
    tags: ['评估', '重要概念']
  },
  {
    id: 'mmlu',
    term: '大规模多任务语言理解',
    abbreviation: 'MMLU',
    englishName: 'Massive Multitask Language Understanding',
    category: 'application',
    definition: '涵盖57个学科的多选题基准测试，是衡量LLM知识广度和推理能力的最权威指标之一。',
    relatedTerms: ['基准测试', '评估', 'HumanEval'],
    tags: ['评估']
  },

  // ============ Advanced / 前沿概念 ============
  {
    id: 'emergence',
    term: '涌现能力',
    englishName: 'Emergent Ability',
    category: 'model',
    definition: '当模型规模超过某个临界点后，突然表现出在较小模型上不存在或极弱的能力，如复杂推理、代码生成等。',
    relatedTerms: ['缩放定律', '大语言模型', 'AGI'],
    tags: ['前沿概念']
  },
  {
    id: 'scaling-law',
    term: '缩放定律',
    englishName: 'Scaling Law',
    category: 'model',
    definition: '描述模型性能随参数量、数据量和计算量增长而变化规律的实证定律。',
    detailedExplanation: 'OpenAI和DeepMind的研究表明，模型性能遵循幂律缩放：更大的模型、更多数据和更多计算能可靠地提升性能。这驱动了"大模型竞赛"。但也存在边际收益递减和数据墙的担忧。',
    relatedTerms: ['涌现能力', '参数', '训练'],
    tags: ['前沿概念', '研究']
  },
  {
    id: 'distillation',
    term: '知识蒸馏',
    englishName: 'Knowledge Distillation',
    category: 'training',
    definition: '使用大型"教师模型"的输出训练小型"学生模型"，将大模型的知识和能力迁移到更小、更高效的模型中的技术。',
    detailedExplanation: 'DeepSeek R1通过蒸馏将大规模推理能力迁移到小模型中效果显著。蒸馏不仅包括输出蒸馏，还包括特征蒸馏、关系蒸馏等多种形式。',
    relatedTerms: ['模型压缩', '量化', '微调'],
    tags: ['训练', '重要技术']
  },
  {
    id: 'constitutional-ai',
    term: '宪法AI',
    abbreviation: 'CAI',
    englishName: 'Constitutional AI',
    category: 'ethics',
    definition: 'Anthropic提出的对齐方法，通过一套原则（"宪法"）让AI自我评判和改进输出，减少对人类反馈的依赖。',
    detailedExplanation: '宪法AI的训练流程包括：监督学习阶段（模型根据宪法原则自我修订有害输出）和RL阶段（使用AI反馈的偏好数据训练）。这种方法使Claude系列在安全性上有独特优势。',
    relatedTerms: ['对齐', 'RLHF', 'Anthropic'],
    tags: ['伦理', '前沿方法']
  },
  {
    id: 'multimodal-agent',
    term: '多模态智能体',
    englishName: 'Multimodal Agent',
    category: 'application',
    definition: '能够处理图像、语音、文本等多种模态输入，并使用多种工具执行复杂任务的AI智能体。',
    relatedTerms: ['AI智能体', '多模态', '工具使用'],
    tags: ['前沿概念']
  },

  // ============ More Application/Tool ============
  {
    id: 'chatgpt',
    term: 'ChatGPT',
    englishName: 'ChatGPT',
    category: 'application',
    definition: 'OpenAI推出的对话式AI产品，基于GPT系列模型，是全球最广泛使用的AI聊天应用。',
    detailedExplanation: 'ChatGPT于2022年11月发布，两个月内获得1亿用户，引爆了全球AI热潮。目前提供免费版（GPT-4o mini）、Plus版（GPT-4o）和Pro版（GPT-5）等订阅方案。',
    relatedTerms: ['GPT-4o', 'OpenAI', '大语言模型'],
    tags: ['产品', '重要产品']
  },
  {
    id: 'copilot',
    term: 'GitHub Copilot',
    englishName: 'GitHub Copilot',
    category: 'application',
    definition: 'GitHub与OpenAI联合推出的AI编程助手，集成在IDE中提供实时代码补全和生成功能。',
    relatedTerms: ['代码生成', 'Cursor', 'AI编程'],
    tags: ['产品', '开发工具']
  },
  {
    id: 'cursor',
    term: 'Cursor',
    englishName: 'Cursor',
    category: 'tool',
    definition: '基于AI的现代化代码编辑器，深度融合了LLM能力，支持全文件编辑、上下文理解和智能调试。',
    relatedTerms: ['GitHub Copilot', 'AI编程', '代码生成'],
    tags: ['工具', '热门工具']
  },
  {
    id: 'windsurf',
    term: 'Windsurf',
    englishName: 'Windsurf (Codeium)',
    category: 'tool',
    definition: 'Codeium公司推出的AI IDE，支持多文件上下文感知和多模型切换，是Cursor的主要竞品。',
    relatedTerms: ['Cursor', 'GitHub Copilot', 'AI编程'],
    tags: ['工具', '热门工具']
  },

  // ============ More Terms ============
  {
    id: 'tokenization',
    term: '分词',
    englishName: 'Tokenization',
    category: 'model',
    definition: '将原始文本切分为token序列的预处理步骤，是语言模型处理文本的第一步。',
    detailedExplanation: '常用分词方法：BPE（GPT系列）、WordPiece（BERT）、SentencePiece（LLaMA、T5）、Unigram。分词质量直接影响模型的多语言能力和效率。对中文等非空格分隔语言，分词尤为重要。',
    relatedTerms: ['Token', '嵌入', '语言模型'],
    tags: ['基础概念']
  },
  {
    id: 'temperature',
    term: '温度参数',
    englishName: 'Temperature',
    category: 'inference',
    definition: '控制LLM输出随机性的参数。温度越高输出越多样/随机，温度越低输出越确定/保守。',
    detailedExplanation: 'Temperature范围通常0-2。温度=0时模型总是选择概率最高的token（确定性输出）；温度=1时按原始概率分布采样。创意写作宜用高温（0.7-1.0），代码生成宜用低温（0-0.3）。',
    relatedTerms: ['推理', 'Top-P', 'Top-K'],
    tags: ['推理', '常用参数']
  },
  {
    id: 'top-p',
    term: '核采样',
    englishName: 'Top-P (Nucleus Sampling)',
    category: 'inference',
    definition: '一种token采样策略，仅从累积概率达到阈值P的最小token集合中采样，平衡多样性和质量。',
    relatedTerms: ['温度参数', 'Top-K', '推理'],
    tags: ['推理', '常用参数']
  },
  {
    id: 'system-prompt',
    term: '系统提示',
    englishName: 'System Prompt',
    category: 'application',
    definition: '在对话开始时设置的指令，用于定义AI助手的角色、行为准则和回答风格，优先级高于用户消息。',
    relatedTerms: ['提示词', '提示词工程', '角色扮演'],
    tags: ['应用', '常用概念']
  },
  {
    id: 'zero-shot',
    term: '零样本学习',
    englishName: 'Zero-Shot Learning',
    category: 'application',
    definition: '模型在没有见过任何示例的情况下直接执行任务，仅依赖预训练获得的知识和指令理解能力。',
    relatedTerms: ['少样本学习', '提示词工程', '上下文学习'],
    tags: ['应用']
  },
  {
    id: 'few-shot',
    term: '少样本学习',
    englishName: 'Few-Shot Learning',
    category: 'application',
    definition: '在提示词中提供少量示例（通常2-5个），帮助模型理解任务格式和期望输出的方法。',
    relatedTerms: ['零样本学习', '提示词工程', '上下文学习'],
    tags: ['应用']
  },
  {
    id: 'supervised-learning',
    term: '监督学习',
    englishName: 'Supervised Learning',
    category: 'foundation',
    definition: '使用带标签的训练数据学习输入到输出映射的机器学习范式。',
    relatedTerms: ['无监督学习', '强化学习', '训练'],
    tags: ['基础概念']
  },
  {
    id: 'unsupervised-learning',
    term: '无监督学习',
    englishName: 'Unsupervised Learning',
    category: 'foundation',
    definition: '在无标签数据中发现隐藏模式、结构或分布的机器学习范式。',
    relatedTerms: ['监督学习', '自监督学习', '聚类'],
    tags: ['基础概念']
  },
  {
    id: 'self-supervised-learning',
    term: '自监督学习',
    englishName: 'Self-Supervised Learning',
    category: 'training',
    definition: '从无标签数据中自动构造监督信号进行学习的范式，LLM的预训练（如下一个token预测）即为自监督学习。',
    relatedTerms: ['预训练', '大语言模型', '无监督学习'],
    tags: ['训练', '重要技术']
  },
  {
    id: 'reinforcement-learning',
    term: '强化学习',
    abbreviation: 'RL',
    englishName: 'Reinforcement Learning',
    category: 'foundation',
    definition: '智能体通过与环境交互、试错并根据奖励信号学习最优策略的机器学习范式。',
    relatedTerms: ['RLHF', '深度学习', 'AI智能体'],
    tags: ['基础概念']
  },
  {
    id: 'rag-pipeline',
    term: 'RAG流水线',
    englishName: 'RAG Pipeline',
    category: 'application',
    definition: 'RAG系统的完整数据处理流程，包括文档加载→文本分割→嵌入生成→向量存储→查询检索→上下文生成。',
    relatedTerms: ['RAG', '向量数据库', '嵌入'],
    tags: ['应用', '架构']
  },
  {
    id: 'chunking',
    term: '文本分割',
    englishName: 'Text Chunking / Splitting',
    category: 'application',
    definition: '将长文档分割为适当大小的文本块以适配嵌入模型和检索需求的技术，是RAG系统的关键预处理步骤。',
    detailedExplanation: '分割策略包括固定长度分割、语义分割（按段落/句子）、递归分割等。分割大小需平衡检索精度（小块更精确）和上下文完整性（大块信息更完整）。常用块大小范围256-2048 tokens。',
    relatedTerms: ['RAG', '嵌入', '向量数据库'],
    tags: ['应用']
  },
  {
    id: 'reranking',
    term: '重排序',
    englishName: 'Reranking',
    category: 'application',
    definition: '对初次检索结果进行二次排序以提升相关性的技术，使用更精细的模型（如Cross-Encoder）对候选文档重新打分。',
    relatedTerms: ['RAG', '嵌入', '语义搜索'],
    tags: ['应用', '优化技术']
  },
  {
    id: 'hybrid-search',
    term: '混合检索',
    englishName: 'Hybrid Search',
    category: 'application',
    definition: '结合稀疏检索（如BM25关键词匹配）和稠密检索（向量语义匹配）优势的检索策略。',
    relatedTerms: ['语义搜索', 'RAG', '重排序'],
    tags: ['应用', '优化技术']
  },
  {
    id: 'compute',
    term: '算力',
    englishName: 'Compute / Computing Power',
    category: 'tool',
    definition: '执行AI计算任务所需的计算资源，通常以GPU/TPU数量、算力小时（如GPU-hours）或FLOPs来衡量。',
    detailedExplanation: 'LLM训练的算力需求呈指数增长。GPT-4的训练估计使用了约25000个A100 GPU运行90-100天。算力成本和可获得性已成为AI发展的核心制约因素。',
    relatedTerms: ['GPU', '训练', '缩放定律'],
    tags: ['基础设施']
  },
  {
    id: 'flops',
    term: '浮点运算次数',
    englishName: 'FLOPs (Floating Point Operations)',
    category: 'tool',
    definition: '衡量计算任务所需浮点运算数量的单位，常用于估算模型训练和推理所需的计算量。',
    relatedTerms: ['算力', 'GPU', '训练'],
    tags: ['基础设施', '性能']
  },
  {
    id: 'telemetry',
    term: '可观测性',
    englishName: 'Observability',
    category: 'application',
    definition: '对AI应用进行实时监控、日志记录和性能分析的能力，包括token使用量、延迟、错误率、成本等指标。',
    relatedTerms: ['LangSmith', '推理', 'API'],
    tags: ['应用', '运维']
  },

  // ============ More ethics / safety ============
  {
    id: 'content-moderation',
    term: '内容审核',
    englishName: 'Content Moderation',
    category: 'ethics',
    definition: '使用AI或人工审查用户生成内容，过滤违规、有害或不当内容的安全保障机制。',
    relatedTerms: ['对齐', '红队测试', '安全'],
    tags: ['伦理', '安全']
  },
  {
    id: 'privacy',
    term: '数据隐私',
    englishName: 'Data Privacy',
    category: 'ethics',
    definition: '保护用户数据不被未经授权访问、使用或泄露的权利和技术措施，是AI应用的关键合规问题。',
    detailedExplanation: 'AI领域的数据隐私关注：训练数据是否包含个人隐私、用户对话数据如何被存储和使用、模型是否可能"记忆"并泄露训练数据中的隐私信息。GDPR等法规对AI隐私提出严格要求。',
    relatedTerms: ['对齐', '安全', 'GDPR'],
    tags: ['伦理', '合规']
  },
  {
    id: 'carbon-footprint',
    term: '碳足迹',
    englishName: 'Carbon Footprint',
    category: 'ethics',
    definition: 'AI模型训练和推理过程中消耗电力和资源所产生的温室气体排放总量。',
    detailedExplanation: '大规模AI训练的碳排放引发环保担忧。据估计，GPT-3训练产生约500吨CO2排放。行业正在探索绿色AI（使用可再生能源、模型压缩、高效架构）以减少碳足迹。',
    relatedTerms: ['训练', '算力', '绿色AI'],
    tags: ['伦理', '可持续性']
  },
  {
    id: 'model-collapse',
    term: '模型退化',
    englishName: 'Model Collapse',
    category: 'ethics',
    definition: '当AI模型使用其他AI生成的数据进行训练时，模型性能逐渐退化的现象。',
    relatedTerms: ['合成数据', '训练', '数据质量'],
    tags: ['伦理', '研究前沿']
  },
  {
    id: 'deepfake',
    term: '深度伪造',
    englishName: 'Deepfake',
    category: 'ethics',
    definition: '使用AI（特别是生成模型）创建逼真但虚假的图像、音频或视频内容的技术，带来严重的社会和伦理挑战。',
    relatedTerms: ['生成模型', 'GAN', '内容审核'],
    tags: ['伦理', '社会影响']
  },

  // ============ More misc ============
  {
    id: 'pre-training',
    term: '预训练',
    englishName: 'Pre-training',
    category: 'training',
    definition: '在大规模通用数据（如网页、书籍、代码）上训练基础模型的过程，目的是让模型学习广泛的知识和语言能力。',
    relatedTerms: ['微调', '基础模型', '自监督学习'],
    tags: ['训练', '核心步骤']
  },
  {
    id: 'sft',
    term: '监督微调',
    abbreviation: 'SFT',
    englishName: 'Supervised Fine-Tuning',
    category: 'training',
    definition: '使用人工标注的高质量（指令，回答）数据对预训练模型进行微调，使其学会遵循指令的监督学习方法。',
    relatedTerms: ['微调', '指令微调', 'RLHF'],
    tags: ['训练', '核心步骤']
  },
  {
    id: 'grpo',
    term: '分组相对策略优化',
    abbreviation: 'GRPO',
    englishName: 'Group Relative Policy Optimization',
    category: 'training',
    definition: 'DeepSeek提出的强化学习训练方法，在组内比较多个输出样本的质量来优化模型，无需单独的奖励模型。',
    detailedExplanation: 'GRPO是DeepSeek R1成功训练的核心技术之一，通过组内相对比较替代绝对奖励打分，降低了训练复杂度同时保持了效果。',
    relatedTerms: ['RLHF', 'DPO', 'DeepSeek R1'],
    tags: ['训练', '前沿技术']
  },
  {
    id: 'cot-decoding',
    term: '思维链解码',
    englishName: 'Chain-of-Thought Decoding',
    category: 'inference',
    definition: '在推理时引导模型展示中间推理过程的技术，无需修改模型训练即可提升复杂任务的准确率。',
    relatedTerms: ['思维链', '推理', 'DeepSeek R1'],
    tags: ['推理']
  },
  {
    id: 'recall',
    term: '召回率',
    englishName: 'Recall',
    category: 'application',
    definition: '衡量检索系统找到所有相关文档能力的指标：检索到的相关文档数 / 所有相关文档总数。',
    relatedTerms: ['精确率', 'RAG', '评估'],
    tags: ['评估', '指标']
  },
  {
    id: 'precision',
    term: '精确率',
    englishName: 'Precision',
    category: 'application',
    definition: '衡量检索结果准确性的指标：检索结果中相关文档数 / 检索到的文档总数。',
    relatedTerms: ['召回率', 'RAG', '评估'],
    tags: ['评估', '指标']
  },
  {
    id: 'guardrails',
    term: '护栏',
    englishName: 'Guardrails / Safety Guardrails',
    category: 'ethics',
    definition: '部署在AI系统输入输出端的安全过滤机制，用于检测和阻止有害、违规或不安全的交互。',
    detailedExplanation: '护栏包括输入护栏（检测恶意提示）和输出护栏（过滤有害生成）。实现方式包括规则匹配、分类器模型、LLM-as-judge等。NVIDIA NeMo Guardrails、Guardrails AI是代表性框架。',
    relatedTerms: ['对齐', '内容审核', '安全'],
    tags: ['安全', '工具']
  },
  {
    id: 'cost-per-token',
    term: '每Token成本',
    englishName: 'Cost per Token',
    category: 'application',
    definition: '调用云端LLM API时按token计价的单位成本，通常分为输入token和输出token不同价格。',
    relatedTerms: ['Token', 'OpenAI API', '定价'],
    tags: ['应用', '成本']
  },
  {
    id: 'tensor',
    term: '张量',
    englishName: 'Tensor',
    category: 'foundation',
    definition: '多维数组的数学概念，是深度学习中的基本数据结构。标量是0维张量，向量是1维张量，矩阵是2维张量。',
    relatedTerms: ['神经网络', 'PyTorch', 'GPU'],
    tags: ['基础概念', '数学基础']
  }
]
