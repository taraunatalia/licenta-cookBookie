import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { capitalize } from '../common/utils';
import styles from './filters.module.scss';
import SelectFilter from './SelectFilter';

export default function RecipeFilters({ filters, setFilters}){
    const [isVisible, setIsVisible] = useState(false);
	const [selectedOptions, setSelectedOptions] = useState({});

    useEffect(() => {
		const options = {};
		Object.entries(filters).forEach(([key, value]) => {
			const newValue = value.map((val) => ({ value: val, label: capitalize(val) }));
			options[key] = newValue;
		});
		setSelectedOptions(options);
	}, []);

	useEffect(() => {
		const newFilters = {};
		Object.entries(selectedOptions).forEach(([key, value]) => {
			const newValue = value.map((val) => val.value);
			newFilters[key] = newValue;
		});
		setFilters(newFilters);
	}, [selectedOptions]);


	const optionsChangeHandler = (key, options) => {
		const selected = {
			...selectedOptions,
			[key]: options,
		};
		setSelectedOptions(selected);
	};

	const ratingChangeHandler = (option) => {
		const newFilters = {
			...filters,
			rating: option?.value,
		};
		setFilters(newFilters);
	};

    return (
        <div className={styles['filter-container']}>
        <button
            className={`${styles['toggle-button']} ${isVisible ? styles.opened : ''}`}
            onClick={() => setIsVisible(!isVisible)}
            type="button"
        >
         <FontAwesomeIcon icon={faFilter} />
        </button>
        {isVisible && (
            <div className={styles.filters}>
                {Object.keys(data).map((key) => (
                    <SelectFilter
                        key={key}
                        label={key}
                        onChange={(options) => optionsChangeHandler(key, options)}
                        options={data[key]}
                        value={selectedOptions[key]}
                    />
                ))}
                <SelectFilter
                    label="Minimum Rating"
                    multi={false}
                    onChange={ratingChangeHandler}
                    options={[1, 2, 3, 4, 5].map((val) => ({ value: val, label: val }))}
                    value={filters.rating && { value: filters.rating, label: filters.rating }}
                />
            </div>
        )}
    </div>
    )
}