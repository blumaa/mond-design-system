import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { radii } from '@comp-lib-proto/tokens';
const meta = {
    title: 'Tokens/Radii',
};
export default meta;
const RadiusExample = ({ name, radius }) => (_jsxs("div", { style: { marginBottom: '2rem' }, children: [_jsx("div", { style: {
                width: '200px',
                height: '100px',
                backgroundColor: '#1890ff',
                borderRadius: radius,
                marginBottom: '1rem',
            } }), _jsxs("div", { style: { fontFamily: 'monospace' }, children: [_jsx("div", { children: name }), _jsx("div", { style: { color: '#666' }, children: radius })] })] }));
export const All = () => (_jsxs("div", { style: { padding: '2rem' }, children: [_jsx("h1", { style: { marginBottom: '2rem' }, children: "Border Radius Tokens" }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2rem' }, children: Object.entries(radii).map(([name, radius]) => (_jsx(RadiusExample, { name: name, radius: radius }, name))) })] }));
