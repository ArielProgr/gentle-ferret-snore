import React from 'react'
import { Download } from 'lucide-react'

interface ExportButtonProps {
  data: any[]
  filename: string
}

const ExportButton: React.FC<ExportButtonProps> = ({ data, filename }) => {
  const exportToCSV = () => {
    if (data.length === 0) return

    // Get headers from the first object
    const headers = Object.keys(data[0])

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header]
          // Handle arrays and objects
          if (Array.isArray(value)) {
            return `"${value.join('; ')}"`
          } else if (typeof value === 'object' && value !== null) {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`
          } else {
            // Escape double quotes and wrap in quotes if needed
            const stringValue = String(value ?? '')
            return stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')
              ? `"${stringValue.replace(/"/g, '""')}"`
              : stringValue
          }
        }).join(',')
      )
    ].join('\n')

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button
      onClick={exportToCSV}
      disabled={data.length === 0}
      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
        data.length === 0
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
      }`}
    >
      <Download className="h-4 w-4 mr-2" />
      Export CSV
    </button>
  )
}

export default ExportButton