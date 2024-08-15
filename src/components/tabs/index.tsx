"use client"

import React, { ReactNode, useState } from "react"

interface Tab {
  title: string
  content: ReactNode
}

interface TabsProps {
  tabs: Tab[]
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="w-full mx-auto ">
      <div className="flex">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`px-8 py-2 text-center ${
              activeTab === index
                ? " bg-primary text-white rounded-xl"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div className="py-4">
        <p>{tabs[activeTab].content}</p>
      </div>
    </div>
  )
}

export default Tabs
