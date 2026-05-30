import { Component, type ReactNode, type ErrorInfo } from 'react'
import Button from '@/components/ui/Button'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo)
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          {/* Icon */}
          <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-red-400"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          <h2 className="text-xl font-sora font-semibold text-white mb-2">
            出了点问题
          </h2>
          <p className="text-sm text-slate-400 max-w-md mb-2">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <p className="text-xs text-slate-500 max-w-md mb-8">
            请稍后重试。如果问题持续存在，请刷新页面或联系支持团队。
          </p>

          <Button variant="primary" size="md" onClick={this.handleRetry}>
            重试
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
