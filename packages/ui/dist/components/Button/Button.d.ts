import React from 'react';
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * Button variant
     * @default 'primary'
     */
    variant?: ButtonVariant;
    /**
     * Button size
     * @default 'md'
     */
    size?: ButtonSize;
    /**
     * Button content
     */
    children: React.ReactNode;
    /**
     * Is button disabled
     * @default false
     */
    disabled?: boolean;
}
export declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
