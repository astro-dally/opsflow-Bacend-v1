import Link from "next/link"

export const SettingsHeader = () => {
  return (
    <header className="border-b border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/settings/profile" className="text-gray-600 hover:text-gray-900">
                Profile
              </Link>
            </li>
            <li>
              <Link href="/settings/appearance" className="text-gray-600 hover:text-gray-900 font-medium">
                Appearance
              </Link>
            </li>
            <li>
              <Link href="/settings/notifications" className="text-gray-600 hover:text-gray-900">
                Notifications
              </Link>
            </li>
            <li>
              <Link href="/settings/security" className="text-gray-600 hover:text-gray-900">
                Security
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
