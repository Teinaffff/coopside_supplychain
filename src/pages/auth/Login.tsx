import { Lock, ShieldCheck } from "lucide-react";
import { useAuth } from "../../hooks/use-auth";
import { LoginForm } from "./LoginForm";

const LoginPage = () => {
  const { loading, handleLogin } = useAuth();

  return (
    <div>
      <section
        className={`relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 ${
          loading && "opacity-50"
        }`}
      >
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-200/60 blur-3xl dark:bg-cyan-900/30" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-sky-200/60 blur-3xl dark:bg-sky-900/30" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-md items-center px-6 py-12">
          <div className="w-full rounded-xl border border-gray-100 bg-white/80 shadow-xl backdrop-blur dark:border-gray-700 dark:bg-gray-900/60">
            <div className="flex items-center justify-center pt-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 text-white shadow-md">
                <Lock size={22} />
              </div>
            </div>
            <div className="space-y-4 md:space-y-6 px-6 pb-8 pt-6">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  Welcome back
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Sign in to continue to your dashboard
                </p>
              </div>
              <LoginForm onSubmit={handleLogin} loading={loading} />
              <div className="flex items-center gap-2 rounded-md bg-cyan-50 p-3 text-cyan-700 ring-1 ring-cyan-100 dark:bg-cyan-900/20 dark:text-cyan-300 dark:ring-cyan-900/40">
                <ShieldCheck size={16} />
                <p className="text-xs">
                  We use industry-standard security to protect your account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
