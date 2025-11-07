'use client'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
  title: string
  message: string
  type?: 'info' | 'success' | 'warning' | 'error' | 'confirm'
  confirmText?: string
  cancelText?: string
}

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'info',
  confirmText = 'OK',
  cancelText = 'Cancel'
}: ModalProps) {
  if (!isOpen) return null

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅'
      case 'warning': return '⚠️'
      case 'error': return '❌'
      case 'confirm': return '❓'
      default: return 'ℹ️'
    }
  }

  const getColor = () => {
    switch (type) {
      case 'success': return '#10b981'
      case 'warning': return '#f59e0b'
      case 'error': return '#ef4444'
      case 'confirm': return '#3b82f6'
      default: return '#6b7280'
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          maxWidth: '500px',
          width: '90%',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{getIcon()}</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: getColor(), marginBottom: '0.75rem', margin: '0 0 0.75rem 0' }}>
            {title}
          </h3>
          <p style={{ color: '#6b7280', fontSize: '1rem', lineHeight: '1.5', margin: 0 }}>
            {message}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {type === 'confirm' && onConfirm ? (
            <>
              <button
                onClick={onClose}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  minWidth: '100px'
                }}
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm()
                  onClose()
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: getColor(),
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  minWidth: '100px'
                }}
              >
                {confirmText}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: getColor(),
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                minWidth: '120px'
              }}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
