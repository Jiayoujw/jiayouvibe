import { useState, useRef, useEffect, useCallback } from 'react'
import { Sparkles, Bot, Send, X, MessageCircle } from 'lucide-react'
import { cn } from '@/utils/cn'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface ChatState {
  status: 'idle' | 'loading' | 'streaming' | 'error'
  errorMessage: string
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'
const DEEPSEEK_MODEL = 'deepseek-chat'

const INITIAL_GREETING: Message = {
  id: 'greeting',
  role: 'assistant',
  content:
    '你好！我是 jiayouvibe AI 助手，可以帮你解答AI相关问题、推荐模型和工具。',
  timestamp: Date.now(),
}

const SUGGESTED_QUESTIONS = [
  '推荐最适合编程的大模型',
  'RAG和微调的区别',
  '2025年最值得关注的AI工具',
]

const EMPTY_STATE_TEXT = '有什么我可以帮你的？'

// ---------------------------------------------------------------------------
// Helper: generate a simple unique id
// ---------------------------------------------------------------------------

let _msgCounter = 0
function nextId(): string {
  _msgCounter += 1
  return `msg-${Date.now()}-${_msgCounter}`
}

// ---------------------------------------------------------------------------
// AIChatWidget
// ---------------------------------------------------------------------------

export default function AIChatWidget() {
  // ---------- panel visibility ----------
  const [open, setOpen] = useState(false)
  const [hasOpened, setHasOpened] = useState(false) // track first-open for greeting

  // ---------- chat state ----------
  const [messages, setMessages] = useState<Message[]>([INITIAL_GREETING])
  const [input, setInput] = useState('')
  const [chatState, setChatState] = useState<ChatState>({
    status: 'idle',
    errorMessage: '',
  })

  // ---------- refs ----------
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // ---------- auto-scroll to bottom ----------
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (open) {
      scrollToBottom()
    }
  }, [messages, open, scrollToBottom])

  // ---------- focus input when panel opens ----------
  useEffect(() => {
    if (open) {
      // small delay so the panel transition finishes
      const timer = setTimeout(() => inputRef.current?.focus(), 200)
      return () => clearTimeout(timer)
    }
  }, [open])

  // ---------- first open: reset to greeting ----------
  useEffect(() => {
    if (open && !hasOpened) {
      setHasOpened(true)
      setMessages([INITIAL_GREETING])
      setChatState({ status: 'idle', errorMessage: '' })
    }
  }, [open, hasOpened])

  // ---------- close panel ----------
  const handleClose = useCallback(() => {
    // abort any in-flight request
    abortControllerRef.current?.abort()
    setOpen(false)
  }, [])

  // ---------- toggle ----------
  const handleToggle = useCallback(() => {
    if (open) {
      handleClose()
    } else {
      setOpen(true)
    }
  }, [open, handleClose])

  // ---------- send message ----------
  const handleSend = useCallback(
    async (text?: string) => {
      const messageText = (text ?? input).trim()
      if (!messageText) return
      if (chatState.status === 'loading' || chatState.status === 'streaming') return

      // append user message
      const userMsg: Message = {
        id: nextId(),
        role: 'user',
        content: messageText,
        timestamp: Date.now(),
      }

      // placeholder for AI response
      const aiMsg: Message = {
        id: nextId(),
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, userMsg, aiMsg])
      setInput('')
      setChatState({ status: 'loading', errorMessage: '' })

      // reset textarea height
      if (inputRef.current) {
        inputRef.current.style.height = 'auto'
      }

      // Build conversation history
      const currentMessages = [...messages, userMsg]
      const apiMessages = currentMessages
        .filter((m) => m.id !== 'greeting') // greeting is not part of API context
        .map((m) => ({
          role: m.role,
          content: m.content,
        }))

      // Get API key
      const apiKey =
        (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_DEEPSEEK_API_KEY) ||
        ''

      if (!apiKey) {
        // No key configured — show friendly error
        setMessages((prev) => {
          const copy = [...prev]
          const last = copy[copy.length - 1]
          if (last.role === 'assistant') {
            last.content =
              '抱歉，AI 助手尚未配置 API Key。请在项目根目录创建 `.env` 文件并添加 `VITE_DEEPSEEK_API_KEY=你的DeepSeek API密钥`，然后重启开发服务器。\n\n🔑 获取免费 API Key: https://platform.deepseek.com/api_keys'
          }
          return copy
        })
        setChatState({
          status: 'error',
          errorMessage: 'API Key 未配置',
        })
        return
      }

      // Start streaming
      setChatState({ status: 'streaming', errorMessage: '' })

      const controller = new AbortController()
      abortControllerRef.current = controller

      let fullContent = ''

      try {
        const response = await fetch(DEEPSEEK_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: DEEPSEEK_MODEL,
            messages: [
              {
                role: 'system',
                content:
                  '你是 jiayouvibe AI 助手，一个专注于AI知识导航的智能助手。你的回答应该简洁、专业、友好，使用中文。你可以帮助用户解答AI相关问题、推荐大模型和AI工具、解释AI概念和术语。回答长度控制在合理范围内，避免过于冗长。',
              },
              ...apiMessages,
            ],
            stream: true,
            temperature: 0.7,
            max_tokens: 2048,
          }),
          signal: controller.signal,
        })

        if (!response.ok) {
          const errorBody = await response.text().catch(() => '')
          throw new Error(
            `API 请求失败 (${response.status}): ${errorBody || response.statusText}`,
          )
        }

        const reader = response.body?.getReader()
        if (!reader) {
          throw new Error('无法读取响应流')
        }

        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n').filter((line) => line.trim() !== '')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim()
              if (data === '[DONE]') continue

              try {
                const parsed = JSON.parse(data)
                const delta = parsed.choices?.[0]?.delta?.content
                if (delta) {
                  fullContent += delta
                  setMessages((prev) => {
                    const copy = [...prev]
                    const last = copy[copy.length - 1]
                    if (last.role === 'assistant') {
                      last.content = fullContent
                    }
                    return copy
                  })
                }
              } catch {
                // ignore malformed JSON chunks
              }
            }
          }
        }

        setChatState({ status: 'idle', errorMessage: '' })
      } catch (err: any) {
        if (err.name === 'AbortError') {
          // request was cancelled — do nothing
          setChatState({ status: 'idle', errorMessage: '' })
          return
        }

        const errorMsg = err.message || '未知错误'
        setMessages((prev) => {
          const copy = [...prev]
          const last = copy[copy.length - 1]
          if (last.role === 'assistant') {
            if (!last.content) {
              last.content = `抱歉，请求出错了：${errorMsg}\n\n请稍后重试，或检查网络连接与 API Key 配置。`
            }
          }
          return copy
        })
        setChatState({
          status: 'error',
          errorMessage: errorMsg,
        })
      } finally {
        abortControllerRef.current = null
      }
    },
    [input, messages, chatState.status],
  )

  // ---------- keyboard: Enter to send, Shift+Enter for newline ----------
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend],
  )

  // ---------- auto-resize textarea ----------
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value)
      // reset then set to scrollHeight
      e.target.style.height = 'auto'
      e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
    },
    [],
  )

  // ---------- click suggestion ----------
  const handleSuggestionClick = useCallback(
    (question: string) => {
      setInput(question)
      // small defer so state settles, then send
      setTimeout(() => handleSend(question), 50)
    },
    [handleSend],
  )

  // ---------- derived state ----------
  const isProcessing =
    chatState.status === 'loading' || chatState.status === 'streaming'
  const showEmptyState =
    messages.length === 1 &&
    messages[0].id === 'greeting' &&
    chatState.status === 'idle'

  // ---------- render ----------
  return (
    <>
      {/* ---------- Floating Toggle Button ---------- */}
      <button
        onClick={handleToggle}
        aria-label={open ? '关闭AI助手' : '打开AI助手'}
        className={cn(
          'fixed bottom-6 right-6 z-50 flex h-12 w-12 min-w-[44px] min-h-[44px] items-center justify-center rounded-2xl',
          'border border-[var(--color-border)]/50 bg-[var(--color-bg-secondary)]/70 backdrop-blur-lg',
          'text-[var(--color-text-secondary)] shadow-lg shadow-black/20',
          'transition-all duration-300 ease-in-out active:scale-95',
          'hover:text-cyan-400 hover:border-cyan-500/40 hover:shadow-[0_0_16px_rgba(0,219,231,0.25)]',
          open && 'opacity-0 pointer-events-none',
        )}
      >
        <Sparkles className="h-5 w-5" />
      </button>

      {/* ---------- Chat Panel ---------- */}
      <div
        className={cn(
          'fixed bottom-6 right-6 z-50 flex flex-col',
          'w-[380px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-6rem)]',
          'rounded-2xl overflow-hidden',
          'border border-[var(--color-border)]/50',
          'shadow-2xl shadow-black/30',
          'transition-all duration-300 ease-in-out origin-bottom-right',
          'bg-[var(--color-bg-secondary)]/85 backdrop-blur-xl',
          open
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none',
        )}
        style={{
          // glass-card look
          background:
            'linear-gradient(135deg, rgba(30,41,59,0.92) 0%, rgba(15,23,42,0.94) 100%)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
        }}
      >
        <div className="flex flex-col h-full">
          {/* ---------- Header ---------- */}
          <div
            className={cn(
              'flex items-center justify-between shrink-0 px-4 py-3',
              'border-b border-[var(--color-border)]/40',
              'bg-[var(--color-bg-secondary)]/60',
            )}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-xl',
                  'bg-gradient-to-br from-cyan-400 to-purple-500',
                  'shadow-[0_0_12px_rgba(6,182,212,0.3)]',
                )}
              >
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                AI 助手
              </span>
              {isProcessing && (
                <span className="flex items-center gap-0.5 ml-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse [animation-delay:0.2s]" />
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse [animation-delay:0.4s]" />
                </span>
              )}
            </div>
            <button
              onClick={handleClose}
              aria-label="关闭"
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-lg',
                'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]',
                'hover:bg-[var(--color-bg-tertiary)]/60 transition-colors',
              )}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* ---------- Messages ---------- */}
          <div
            className={cn(
              'flex-1 overflow-y-auto px-4 py-3 space-y-3',
              'scrollbar-thin scrollbar-thumb-[var(--color-border)]',
            )}
          >
            {showEmptyState ? (
              /* ---- Empty state ---- */
              <div className="flex flex-col items-center justify-center h-full text-center px-2">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20 border border-cyan-400/20">
                  <MessageCircle className="h-6 w-6 text-cyan-400" />
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                  {EMPTY_STATE_TEXT}
                </p>
                <div className="flex flex-col gap-2 w-full">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSuggestionClick(q)}
                      className={cn(
                        'text-left text-xs px-3 py-2 rounded-xl',
                        'border border-[var(--color-border)]/40',
                        'bg-[var(--color-bg-primary)]/50 hover:bg-[var(--color-bg-primary)]',
                        'text-[var(--color-text-secondary)] hover:text-cyan-400',
                        'hover:border-cyan-500/30 transition-all',
                      )}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* ---- Message list ---- */
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex gap-2.5 max-w-[85%]',
                      msg.role === 'user'
                        ? 'ml-auto flex-row-reverse'
                        : 'mr-auto',
                    )}
                  >
                    {/* Avatar */}
                    {msg.role === 'assistant' && (
                      <div
                        className={cn(
                          'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg mt-0.5',
                          'bg-gradient-to-br from-cyan-400/20 to-purple-500/20',
                          'border border-cyan-400/20',
                        )}
                      >
                        <Bot className="h-3.5 w-3.5 text-cyan-400" />
                      </div>
                    )}

                    {/* Bubble */}
                    <div
                      className={cn(
                        'rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words',
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-tr-md'
                          : 'bg-[var(--color-bg-tertiary)]/70 backdrop-blur-sm border border-[var(--color-border)]/30 text-[var(--color-text-primary)] rounded-tl-md',
                      )}
                    >
                      {msg.content ||
                        (msg.role === 'assistant' &&
                          chatState.status === 'loading' && (
                            <span className="flex items-center gap-1 py-1">
                              <span className="inline-block h-2 w-2 rounded-full bg-cyan-400 animate-bounce" />
                              <span
                                className="inline-block h-2 w-2 rounded-full bg-cyan-400 animate-bounce"
                                style={{ animationDelay: '0.15s' }}
                              />
                              <span
                                className="inline-block h-2 w-2 rounded-full bg-cyan-400 animate-bounce"
                                style={{ animationDelay: '0.3s' }}
                              />
                            </span>
                          ))}
                    </div>
                  </div>
                ))}

                {/* Error indicator */}
                {chatState.status === 'error' && (
                  <div className="flex items-center gap-2 text-xs text-red-400 px-1">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-400" />
                    {chatState.errorMessage}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* ---------- Input Area ---------- */}
          <div
            className={cn(
              'shrink-0 px-3 py-2.5',
              'border-t border-[var(--color-border)]/40',
              'bg-[var(--color-bg-secondary)]/60',
            )}
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="输入你的问题..."
                rows={1}
                disabled={isProcessing}
                className={cn(
                  'flex-1 resize-none rounded-xl px-3 py-2 text-sm',
                  'bg-[var(--color-bg-primary)]/70 border border-[var(--color-border)]/50',
                  'text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]',
                  'focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30',
                  'disabled:opacity-50 transition-colors',
                  'scrollbar-none',
                )}
                style={{ maxHeight: '120px' }}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isProcessing}
                aria-label="发送"
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                  'bg-gradient-to-r from-cyan-400 to-purple-500',
                  'text-white shadow-[0_0_10px_rgba(6,182,212,0.3)]',
                  'transition-all duration-200 active:scale-90',
                  'disabled:opacity-40 disabled:shadow-none disabled:active:scale-100',
                  'hover:shadow-[0_0_16px_rgba(6,182,212,0.45)]',
                )}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1.5 text-[10px] text-[var(--color-text-tertiary)] text-center">
              由 DeepSeek 提供支持 · AI 回答仅供参考
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
