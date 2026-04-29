import React from 'react'
import { AlertCircle, RotateCcw } from 'lucide-react'
import Button from './Button'

const ErrorState = ({ message = 'Une erreur est survenue', onRetry, showRetry = true }) => (
  <div className="flex flex-col items-center justify-center py-12 gap-4">
    <AlertCircle className="w-12 h-12 text-red-500" />
    <p className="text-accent-600 text-center">{message}</p>
    {showRetry && onRetry && (
      <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
        <RotateCcw className="w-4 h-4" />
        Réessayer
      </Button>
    )}
  </div>
)

export default ErrorState
