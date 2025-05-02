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
     * Click event handler
     */
    onClick: (evt: React.MouseEvent<HTMLButtonElement>) => void;
    /**
     * Is button disabled
     * @default false
     */
    disabled?: boolean;
    /**
     * Dark mode
     * @default false
     */
    isDarkMode?: boolean;
}
export declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
