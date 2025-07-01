// Import React and icon type from Lucide React icon library
import React from 'react'
import { LucideIcon } from 'lucide-react'

/**
 * Props interface for the StatCard component
 * Defines all the data needed to display a statistic card
 */
interface StatCardProps {
  /** The text label describing what this statistic represents (e.g., "Total Emissions") */
  label: string
  /** The actual numeric or text value to display prominently (e.g., "245.3" or "12") */
  value: string | number
  /** The unit of measurement for the value (e.g., "kg CO2", "projects", "%") */
  unit: string
  /** A Lucide React icon component to display alongside the statistic */
  icon: LucideIcon
  /** CSS class name for the icon color (e.g., "text-green-400", "text-red-500") */
  iconColor: string
  /** CSS class name for the icon background color (e.g., "bg-green-400/20") */
  iconBgColor: string
}

/**
 * StatCard Component
 * 
 * A reusable card component for displaying key statistics in the dashboard.
 * Each card shows a statistic with its value, unit, label, and an accompanying icon.
 * 
 * Features:
 * - Clean, modern card design with rounded corners and consistent spacing
 * - Color-coded icons to help users quickly identify different types of data
 * - Responsive text sizing that looks good on different screen sizes
 * - Memoized for performance (only re-renders when props actually change)
 * 
 * Usage Example:
 * ```tsx
 * <StatCard 
 *   label="Carbon Emissions"
 *   value="245.3"
 *   unit="kg CO2"
 *   icon={Activity}
 *   iconColor="text-green-400"
 *   iconBgColor="bg-green-400/20"
 * />
 * ```
 * 
 * @param label - Text description of the statistic
 * @param value - The numeric or text value to display
 * @param unit - Unit of measurement (displayed below the value)
 * @param icon - Lucide icon component (passed as Icon prop)
 * @param iconColor - CSS class for icon text color
 * @param iconBgColor - CSS class for icon background color
 */
const StatCard = React.memo(function StatCard({ 
  label, 
  value, 
  unit, 
  icon: Icon,  // Rename 'icon' prop to 'Icon' since it's a React component
  iconColor, 
  iconBgColor 
}: StatCardProps) {
  return (
    // Main card container with consistent styling and padding
    <div className="gp-card rounded-2xl p-6">
      {/* Flex container to space out text content and icon */}
      <div className="flex items-center justify-between">
        
        {/* LEFT SIDE: Text Content */}
        <div>
          {/* Statistic label - smaller, muted text */}
          <p className="text-gray-300 text-sm font-medium">{label}</p>
          
          {/* Main value - large, bold, prominent text */}
          <p className="text-3xl font-bold text-white">{value}</p>
          
          {/* Unit of measurement - smaller text with color matching the icon */}
          <p className={`text-sm ${iconColor}`}>{unit}</p>
        </div>
        
        {/* RIGHT SIDE: Icon */}
        {/* Circular background container for the icon */}
        <div className={`${iconBgColor} p-3 rounded-full`}>
          {/* The actual icon with size and color styling */}
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  )
})

export default StatCard
