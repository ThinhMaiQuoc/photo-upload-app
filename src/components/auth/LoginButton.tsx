"use client"

import { signIn } from "next-auth/react"
import { Button } from "antd"
import { GoogleOutlined } from "@ant-design/icons"

export default function LoginButton() {
  return (
    <Button
      type="primary"
      icon={<GoogleOutlined />}
      size="large"
      onClick={() => signIn("google", { callbackUrl: "/" })}
    >
      Sign in with Google
    </Button>
  )
}
