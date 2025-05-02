import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { spacing } from '@comp-lib-proto/tokens';
const meta = {
    title: 'Tokens/Spacing',
};
export default meta;
const SpacingBlock = ({ size, value }) => (_jsxs("div", { style: { marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }, children: [_jsx("div", { style: {
                width: value,
                height: '40px',
                backgroundColor: '#1890ff',
                borderRadius: '4px',
            } }), _jsxs("div", { style: { fontFamily: 'monospace' }, children: [_jsxs("div", { children: ["spacing-", size] }), _jsx("div", { style: { color: '#666' }, children: value })] })] }));
export const All = () => (_jsxs("div", { style: { padding: '2rem' }, children: [_jsx("h1", { style: { marginBottom: '2rem' }, children: "Spacing Tokens" }), _jsx("div", { children: Object.entries(spacing).map(([size, value]) => (_jsx(SpacingBlock, { size: size, value: value }, size))) })] }));
