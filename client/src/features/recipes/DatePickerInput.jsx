import { forwardRef } from 'react';

const DatePickerInput = forwardRef(({ value, onClick, onChange }, ref) => (
	<input
		className="form-control"
		onChange={onChange}
		onClick={onClick}
		ref={ref}
		type="text"
		value={value}
	/>
));

export default DatePickerInput;
