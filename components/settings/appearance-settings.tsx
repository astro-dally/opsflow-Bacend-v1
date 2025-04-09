"use client"

import type React from "react"
import { useState } from "react"

export const AppearanceSettings = () => {
  const [theme, setTheme] = useState("system")
  const [compactMode, setCompactMode] = useState(false)

  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(e.target.value)
  }

  const handleCompactModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompactMode(e.target.checked)
  }

  const handleSave = () => {
    // Here you would typically save these settings to your backend
    console.log("Saving settings:", { theme, compactMode })
    // Show success message
    alert("Settings saved successfully!")
  }

  return (
    <div className="space-y-6 p-4">
      <div>
        <h2 className="text-xl font-semibold mb-4">Appearance Settings</h2>
        <p className="text-gray-600 mb-6">Customize the look and feel of your application</p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Theme</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="light"
                name="theme"
                value="light"
                checked={theme === "light"}
                onChange={handleThemeChange}
                className="mr-2"
              />
              <label htmlFor="light">Light</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="dark"
                name="theme"
                value="dark"
                checked={theme === "dark"}
                onChange={handleThemeChange}
                className="mr-2"
              />
              <label htmlFor="dark">Dark</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="system"
                name="theme"
                value="system"
                checked={theme === "system"}
                onChange={handleThemeChange}
                className="mr-2"
              />
              <label htmlFor="system">System (follow device settings)</label>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Layout Density</h3>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="compactMode"
              checked={compactMode}
              onChange={handleCompactModeChange}
              className="mr-2"
            />
            <label htmlFor="compactMode">Compact Mode</label>
          </div>
          <p className="text-sm text-gray-500 mt-1">Reduce spacing between elements for a more compact view</p>
        </div>
      </div>

      <div className="pt-4">
        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Save Changes
        </button>
      </div>
    </div>
  )
}
