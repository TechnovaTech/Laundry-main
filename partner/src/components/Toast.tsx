'use client'

import { useEffect } from 'react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type = 'info', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const bgColor = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    warning: 'bg-yellow-600',
    info: 'bg-gradient-to-r from-[#452D9B] to-[#07C8D0]'
  }[type]

  const icon = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }[type]

  return (
    <div className="fixed top-4 left-4 right-4 z-50 animate-slide-down">
      <div className={`${bgColor} text-white rounded-xl px-4 py-3 shadow-lg flex items-center gap-3`}>
        <span className="text-xl">{icon}</span>
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button onClick={onClose} className="text-white text-xl leading-none">×</button>
      </div>
    </div>
  )
}
