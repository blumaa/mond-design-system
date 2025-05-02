import { jsx as _jsx } from "react/jsx-runtime";
import { Button } from './Button';
const meta = {
    title: 'Components/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: ['primary', 'secondary', 'outline', 'ghost'],
        },
        size: {
            control: { type: 'select' },
            options: ['sm', 'md', 'lg'],
        },
        disabled: {
            control: { type: 'boolean' },
        },
        isDarkMode: {
            control: { type: 'boolean' },
            description: 'Toggle between dark and light mode',
        },
        onClick: { action: 'clicked' },
    },
    decorators: [
        (Story, context) => {
            const isDark = context.args.isDarkMode;
            return (_jsx("div", { style: {
                    padding: '3rem',
                    backgroundColor: isDark ? '#27374D' : '#F2F3F4',
                    borderRadius: '8px',
                }, children: _jsx(Story, {}) }));
        },
    ],
};
export default meta;
const Template = {
    render: (args) => _jsx(Button, { ...args }),
};
export const Primary = {
    ...Template,
    args: {
        variant: 'primary',
        children: 'Primary Button',
        isDarkMode: false,
    },
};
export const PrimaryDark = {
    ...Template,
    args: {
        ...Primary.args,
        isDarkMode: true,
    },
};
export const Secondary = {
    ...Template,
    args: {
        variant: 'secondary',
        children: 'Secondary Button',
        isDarkMode: false,
    },
};
export const SecondaryDark = {
    ...Template,
    args: {
        ...Secondary.args,
        isDarkMode: true,
    },
};
export const Outline = {
    ...Template,
    args: {
        variant: 'outline',
        children: 'Outline Button',
        isDarkMode: false,
    },
};
export const OutlineDark = {
    ...Template,
    args: {
        ...Outline.args,
        isDarkMode: true,
    },
};
export const Ghost = {
    ...Template,
    args: {
        variant: 'ghost',
        children: 'Ghost Button',
        isDarkMode: false,
    },
};
export const GhostDark = {
    ...Template,
    args: {
        ...Ghost.args,
        isDarkMode: true,
    },
};
export const Small = {
    ...Template,
    args: {
        size: 'sm',
        children: 'Small Button',
        isDarkMode: false,
    },
};
export const Medium = {
    ...Template,
    args: {
        size: 'md',
        children: 'Medium Button',
        isDarkMode: false,
    },
};
export const Large = {
    ...Template,
    args: {
        size: 'lg',
        children: 'Large Button',
        isDarkMode: false,
    },
};
export const Disabled = {
    ...Template,
    args: {
        disabled: true,
        children: 'Disabled Button',
        isDarkMode: false,
    },
};
