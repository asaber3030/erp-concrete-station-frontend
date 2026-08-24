import { useState } from "react"
import { useUpdateAccountMutation } from "#/features/account/hooks/use-account"
import { useAuthStore } from "#/features/auth/model/store"
import { Button } from "#/shared/components/ui/button"
import { Input } from "#/shared/components/ui/input"

export function AccountPage() {
  const user = useAuthStore((state) => state.user)
  const [name, setName] = useState(user?.name ?? "")
  const [password, setPassword] = useState("")

  const mutation = useUpdateAccountMutation()

  return (
    <section className="grid max-w-2xl gap-4">
      <div>
        <h2 className="text-2xl font-bold">الحساب</h2>
        <p className="mt-1 text-sm text-muted-foreground">تعديل بيانات الحساب الحالي.</p>
      </div>

      <form
        className="grid gap-4 rounded-md border bg-white p-4"
        onSubmit={(event) => {
          event.preventDefault()
          mutation.mutate(
            { name, password: password || undefined },
            {
              onSuccess: () => setPassword(""),
            },
          )
        }}
      >
        <label className="grid gap-1 text-sm font-medium">
          الاسم
          <Input value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          كلمة المرور الجديدة
          <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <div className="flex items-center gap-2">
          <Button type="submit" disabled={mutation.isPending} loading={mutation.isPending}>
            حفظ
          </Button>
          {mutation.isSuccess && <p className="text-sm text-green-700">تم حفظ البيانات</p>}
          {mutation.isError && <p className="text-sm text-destructive">تعذر حفظ البيانات</p>}
        </div>
      </form>
    </section>
  )
}
