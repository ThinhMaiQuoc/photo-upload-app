"use client"

import { Component, ReactNode } from "react"
import { Button, Result } from "antd"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Result
            status="error"
            title="Something went wrong"
            subTitle="We're sorry, but something unexpected happened. Please try refreshing the page."
            extra={[
              <Button
                type="primary"
                key="refresh"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>,
              <Button key="home" onClick={() => (window.location.href = "/")}>
                Go Home
              </Button>,
            ]}
          />
        </div>
      )
    }

    return this.props.children
  }
}
