import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { colors } from '@comp-lib-proto/tokens';
const meta = {
    title: 'Tokens/Colors',
};
export default meta;
const ColorSwatch = ({ color, name }) => (_jsxs("div", { style: { marginBottom: '1rem' }, children: [_jsx("div", { style: {
                width: '200px',
                height: '100px',
                backgroundColor: color,
                borderRadius: '4px',
                marginBottom: '0.5rem',
            } }), _jsxs("div", { style: { fontFamily: 'monospace' }, children: [_jsx("div", { children: name }), _jsx("div", { style: { color: '#666' }, children: color })] })] }));
const ColorGroup = ({ name, colors }) => (_jsxs("div", { style: { marginBottom: '2rem' }, children: [_jsx("h2", { style: { marginBottom: '1rem' }, children: name }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }, children: Object.entries(colors).map(([shade, value]) => (_jsx(ColorSwatch, { color: value, name: `${name}-${shade}` }, `${name}-${shade}`))) })] }));
export const All = () => (_jsxs("div", { style: { padding: '2rem' }, children: [_jsx("h1", { style: { marginBottom: '2rem' }, children: "Color Tokens" }), Object.entries(colors).map(([name, shades]) => (_jsx(ColorGroup, { name: name, colors: shades }, name)))] }));
