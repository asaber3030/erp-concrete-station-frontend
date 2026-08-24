import { LoginForm } from "./login-form"
import { APP_CONFIG } from "#/shared/config/app"

export function LoginPage() {
  return (
    <main dir="rtl" className="grid min-h-screen place-items-center bg-[#f5f7fb] p-4 text-slate-950">
      <section className="w-full max-w-md rounded-md border bg-white p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">تسجيل الدخول</p>
          <h1 className="mt-1 text-2xl font-bold">{APP_CONFIG.appName}</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">ادخل بيانات المستخدم للوصول إلى لوحة التحكم وإدارة التشغيل والمخزون.</p>
        </div>
        <LoginForm />
      </section>
    </main>
  )
}
