import React from 'react'
import { LucideIcon } from 'lucide-react'

interface CardAdminProps {
  statistics: any
  icons: LucideIcon
  title: string
}

const CardAdmin: React.FC<CardAdminProps> = ({ statistics, icons: Icon, title }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {statistics}
          </p>
        </div>
        <div className="bg-blue-100 p-3 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  )
}

export default CardAdmin