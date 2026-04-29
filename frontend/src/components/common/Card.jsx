import React from 'react'

const Card = ({ children, className = '', hoverable = false, ...props }) => {
  return (
    <div
      className={`bg-white rounded-lg border border-accent-200 shadow-sm ${hoverable ? 'hover:shadow-md hover:border-primary-200' : ''} transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-accent-200 ${className}`}>{children}</div>
)

const CardBody = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
)

const CardFooter = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-t border-accent-200 bg-accent-50 rounded-b-lg ${className}`}>{children}</div>
)

export { Card, CardHeader, CardBody, CardFooter }
export default Card
