import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { shadows } from '@comp-lib-proto/tokens';
const meta = {
    title: 'Tokens/Shadows',
};
export default meta;
const ShadowExample = ({ name, shadow }) => (_jsxs("div", { style: { marginBottom: '2rem' }, children: [_jsx("div", { style: {
                width: '200px',
                height: '100px',
                backgroundColor: 'white',
                borderRadius: '4px',
                boxShadow: shadow,
                marginBottom: '1rem',
            } }), _jsxs("div", { style: { fontFamily: 'monospace' }, children: [_jsx("div", { children: name }), _jsx("div", { style: { color: '#666' }, children: shadow })] })] }));
export const All = () => (_jsxs("div", { style: { padding: '2rem', backgroundColor: '#f5f5f5', minHeight: '100vh' }, children: [_jsx("h1", { style: { marginBottom: '2rem' }, children: "Shadow Tokens" }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2rem' }, children: Object.entries(shadows).map(([name, shadow]) => (_jsx(ShadowExample, { name: name, shadow: shadow }, name))) })] }));
