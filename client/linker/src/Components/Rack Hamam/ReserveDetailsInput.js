import React, { memo } from 'react';

const ReserveDetailsInput = memo(({ name, type, value, onChange, placeholder }) => {
  return (
    <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} />
  );
});

export default ReserveDetailsInput;