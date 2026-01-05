import { forwardRef } from 'react';

interface InputProps {
    placeholder: string;
    type?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ placeholder, type = "text" }, ref) => {
        return (
            <div>
                <input
                    ref={ref}
                    type={type}
                    placeholder={placeholder}
                    className="border rounded m-2 px-4 py-2 w-full"
                />
            </div>
        );
    }
);

Input.displayName = 'Input';