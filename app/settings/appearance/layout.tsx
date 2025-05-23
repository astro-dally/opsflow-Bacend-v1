import type React from "react"
export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="settings-layout">{children}</div>
}
