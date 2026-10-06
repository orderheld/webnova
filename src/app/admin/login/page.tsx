import { LoginForm } from "@/components/admin/login-form";

export const metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <div className="grid min-h-screen place-items-center px-5">
      <div className="w-full max-w-sm">
        <p className="mb-8 text-center text-[24px] font-semibold tracking-[-0.04em]">
          webnova<span className="text-accent">.</span> <span className="font-normal text-muted">admin</span>
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
