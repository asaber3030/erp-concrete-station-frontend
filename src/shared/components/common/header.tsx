import type React from "react"

type Props = {
  children?: React.ReactNode
  title: React.ReactNode
}

export const PageHeader = ({ children, title }: Props) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>
      <div className="flex gap-2 items-center">{children}</div>
    </div>
  )
}
