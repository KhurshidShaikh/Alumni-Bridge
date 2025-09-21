import * as React from "react"
import { cn } from "@/lib/utils"

// Simple tabs implementation with state management
const Tabs = ({ defaultValue, children, className, ...props }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue)

  const childrenArray = React.Children.toArray(children)
  const tabsList = childrenArray.find(child => child.type === TabsList)
  const tabsContents = childrenArray.filter(child => child.type === TabsContent)

  return (
    <div className={cn("w-full", className)} {...props}>
      {tabsList && React.cloneElement(tabsList, {
        children: React.Children.map(tabsList.props.children, (trigger) => {
          if (trigger.type === TabsTrigger) {
            const value = trigger.props.value
            const isActive = value === activeTab
            return React.cloneElement(trigger, {
              onClick: () => setActiveTab(value),
              'data-state': isActive ? 'active' : 'inactive',
              className: cn(
                trigger.props.className,
                isActive 
                  ? "bg-white text-gray-900 shadow-sm border" 
                  : "text-gray-600 hover:text-gray-900"
              )
            })
          }
          return trigger
        })
      })}
      
      {tabsContents.map((content) => {
        const value = content.props.value
        const isActive = value === activeTab
        return isActive ? React.cloneElement(content, { key: value }) : null
      })}
    </div>
  )
}

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 w-full",
      className
    )}
    {...props}
  />
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef(({ className, value, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1",
      className
    )}
    {...props}
  >
    {children}
  </button>
))
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef(({ className, value, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
      className
    )}
    {...props}
  >
    {children}
  </div>
))
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
