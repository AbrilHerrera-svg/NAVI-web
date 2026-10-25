import type { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes <HTMLDivElement>
{
 children: ReactNode;
}

export default function Card({
    className ="", children, ...rest}: CardProps){
        return(
            <div className={`bg-white border border-slate-200 rounded-xl p-5 shadow-sm ${className}`}
      {...rest}
    >
        {children}
    </div>
        )
    }