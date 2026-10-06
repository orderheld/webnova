import { Logo } from "@/components/logo";
import { LoginForm } from "@/components/admin/login-form";

export const metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <div className="grid min-h-screen place-items-center px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-end justify-center gap-2">
          <Logo tone="dark" className="h-8" /> <span className="text-[14px] text-muted">admin</span>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
