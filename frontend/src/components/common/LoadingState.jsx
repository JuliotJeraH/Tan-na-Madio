import React from 'react'
import Spinner from './Spinner'

const LoadingState = ({ message = 'Chargement...' }) => (
  <div className="flex flex-col items-center justify-center py-12 gap-4">
    <Spinner size="lg" />
    <p className="text-accent-600">{message}</p>
  </div>
)

export default LoadingState
