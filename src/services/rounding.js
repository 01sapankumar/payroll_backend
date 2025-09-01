export function applyRounding(val, mode='nearest'){
if (mode === 'none') return val;
if (mode === 'floor') return Math.floor(val);
if (mode === 'ceil') return Math.ceil(val);
return Math.round(val);
};