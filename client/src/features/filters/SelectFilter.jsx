import ReactSelect, { components } from 'react-select';
import { capitalize } from '../common/utils';
import styles from './filters.module.scss';

function Option(props) {
    return (
        <div>
            <components.Option {...props}>
                <input
                  checked={props.isSelected}
                  onChange={() => null}
                  type="checkbox"
                />
                {' '}
                <label>{props.label}</label>
            </components.Option>
        </div>
    )
}

function MultiValueContainer({selectProps, data}){
    const { label } = data;
	const allSelected = selectProps.value;
	const index = allSelected.findIndex((selected) => selected.label === label);
	const isLastSelected = index === allSelected.length - 1;
	const labelSuffix = isLastSelected ? '' : ', ';
	const val = `${label}${labelSuffix}`;
	return val;
}
const textOverflowStyles = {
	textOverflow: 'ellipsis',
	maxWidth: '90%',
	whiteSpace: 'nowrap',
	overflow: 'hidden',
};

const customStyles = {
	valueContainer: (provided) => ({
		...provided,
		...textOverflowStyles,
		display: 'initial',
	}),
};

const customEmptyStyles = {
	valueContainer: (provided) => ({
		...provided,
		...textOverflowStyles,
		display: 'flex',
	}),
};

export default function SelectFilter({
    options, value, onChange, label, multi = true,
}) {
    return (
        <div className={styles['select-container']}>
        <label htmlFor={label}>{capitalize(label)}</label>
        <ReactSelect
            allowSelectAll
            closeMenuOnScroll
            closeMenuOnSelect={false}
            components={multi ? {
                Option,
                MultiValueContainer,
            } : {}}
            hideSelectedOptions={false}
            id={label}
            isClearable
            isMulti={multi}
            isSearchable={false}
            onChange={onChange}
            options={options}
            styles={value && value.length ? customStyles : customEmptyStyles}
            value={value}
        />
    </div>
    )
}