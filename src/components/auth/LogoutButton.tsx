"use client"

import { signOut } from "next-auth/react"
import { Button } from "antd"
import { LogoutOutlined } from "@ant-design/icons"

export default function LogoutButton() {
  return (
    <Button
      icon={<LogoutOutlined />}
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      Sign out
    </Button>
  )
}
