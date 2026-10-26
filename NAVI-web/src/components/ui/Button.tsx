import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success";
}

const variants = {
  primary: "bg-[#5960A1] hover:bg-[#484e85] text-white font-semibold shadow-xs",
  secondary:
    "border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold",
  danger: "bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-xs",
  success: "bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs",
};

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-lg text-xs transition cursor-pointer ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
