import type { Metadata } from "next"
import { SettingsHeader } from "@/components/settings/settings-header"
import { AppearanceSettings } from "@/components/settings/appearance-settings"

export const metadata: Metadata = {
  title: "Appearance Settings | WonderFlow",
  description: "Customize the look and feel of your application",
}

export default function AppearancePage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <SettingsHeader />
      <main className="flex-1 w-full p-4 md:p-6">
        <div className="w-full max-w-6xl mx-auto">
          <AppearanceSettings />
        </div>
      </main>
    </div>
  )
}
