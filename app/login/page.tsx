import { Link } from "@nextui-org/react";
import { login, signup } from "./actions";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-slate-100">
      <div className="sm:shadow-xl px-8 pb-8 pt-12 sm:bg-white rounded-xl space-y-10">
        <h1 className="font-semibold text-2xl">Login</h1>
        <LoginForm />
        <p className="text-center">
          Need to create an account?{" "}
          <Link className="text-indigo-500 hover:underline" href="/register">
            Create Account
          </Link>{" "}
        </p>
      </div>
    </div>
  );
}
