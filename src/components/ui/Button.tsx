import type { ReactNode } from "react";

type Variants = 'primary' | 'secondary';

interface ButtonProps {
    variant: Variants;
    size: 'sm' | 'md' | 'lg';
    text: string;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    onClick: () => void;
}

const variantStyles = {
    "primary": "bg-purple-600 text-white",
    "secondary": "bg-purple-300 text-purple-600",
}   

const sizeStyles = {
    "sm": "px-2 py-1",
    "md": "px-4 py-2",
    "lg": "px-8 py-4",
}

const defaultStyles = "rounded-md flex";


export const Button = (props: ButtonProps) => {
    return <button className={`${variantStyles[props.variant]} ${defaultStyles} ${sizeStyles[props.size]}`}>
        {props.startIcon ? <div className="pr-2">{props.startIcon}</div> : null} {props.text} {props.endIcon}
    </button>;
}


<Button variant="primary" size="md" onClick={()=>{}} text={"asd"}/>