import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { fontFamilies, fontSizes, fontWeights, lineHeights, letterSpacings } from '@comp-lib-proto/tokens';
const meta = {
    title: 'Tokens/Typography',
};
export default meta;
const SampleText = "The quick brown fox jumps over the lazy dog";
const Section = ({ title, children }) => (_jsxs("div", { style: { marginBottom: '3rem' }, children: [_jsx("h2", { style: { marginBottom: '1rem' }, children: title }), children] }));
const FontFamilyExample = ({ name, family }) => (_jsxs("div", { style: { marginBottom: '1rem' }, children: [_jsx("div", { style: { fontFamily: family, fontSize: '1.25rem', marginBottom: '0.5rem' }, children: SampleText }), _jsxs("div", { style: { fontFamily: 'monospace', color: '#666' }, children: [name, ": ", family] })] }));
const FontSizeExample = ({ name, size }) => (_jsxs("div", { style: { marginBottom: '1rem' }, children: [_jsx("div", { style: { fontSize: size, marginBottom: '0.5rem' }, children: SampleText }), _jsxs("div", { style: { fontFamily: 'monospace', color: '#666' }, children: [name, ": ", size] })] }));
const FontWeightExample = ({ name, weight }) => (_jsxs("div", { style: { marginBottom: '1rem' }, children: [_jsx("div", { style: { fontWeight: weight, fontSize: '1.25rem', marginBottom: '0.5rem' }, children: SampleText }), _jsxs("div", { style: { fontFamily: 'monospace', color: '#666' }, children: [name, ": ", weight] })] }));
const LineHeightExample = ({ name, height }) => (_jsxs("div", { style: { marginBottom: '1rem' }, children: [_jsxs("div", { style: {
                lineHeight: height,
                fontSize: '1.25rem',
                marginBottom: '0.5rem',
                backgroundColor: '#f0f0f0',
                padding: '1rem',
            }, children: [SampleText, _jsx("br", {}), SampleText] }), _jsxs("div", { style: { fontFamily: 'monospace', color: '#666' }, children: [name, ": ", height] })] }));
const LetterSpacingExample = ({ name, spacing }) => (_jsxs("div", { style: { marginBottom: '1rem' }, children: [_jsx("div", { style: { letterSpacing: spacing, fontSize: '1.25rem', marginBottom: '0.5rem' }, children: SampleText }), _jsxs("div", { style: { fontFamily: 'monospace', color: '#666' }, children: [name, ": ", spacing] })] }));
export const All = () => (_jsxs("div", { style: { padding: '2rem' }, children: [_jsx("h1", { style: { marginBottom: '2rem' }, children: "Typography Tokens" }), _jsx(Section, { title: "Font Families", children: Object.entries(fontFamilies).map(([name, family]) => (_jsx(FontFamilyExample, { name: name, family: family }, name))) }), _jsx(Section, { title: "Font Sizes", children: Object.entries(fontSizes).map(([name, size]) => (_jsx(FontSizeExample, { name: name, size: size }, name))) }), _jsx(Section, { title: "Font Weights", children: Object.entries(fontWeights).map(([name, weight]) => (_jsx(FontWeightExample, { name: name, weight: weight }, name))) }), _jsx(Section, { title: "Line Heights", children: Object.entries(lineHeights).map(([name, height]) => (_jsx(LineHeightExample, { name: name, height: height }, name))) }), _jsx(Section, { title: "Letter Spacing", children: Object.entries(letterSpacings).map(([name, spacing]) => (_jsx(LetterSpacingExample, { name: name, spacing: spacing }, name))) })] }));
