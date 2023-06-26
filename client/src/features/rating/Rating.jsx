import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useCallback } from 'react';
import styles from './rating.module.scss';

export default function Rating({
	value, updateValue, readOnly, stars = 5, label = null,
}) {
	const [hoverValue, setHoverValue] = useState(null);

	const isActive = useCallback((index) => {
		if (!readOnly && hoverValue) {
			return (index + 1) <= hoverValue;
		}
		return (index + 1) <= value;
	}, [value, hoverValue]);

	return (
		<div className={styles['rating-container']}>
			{new Array(stars).fill(0)
				.map((v, index) => (
					<button
						className={`${styles.star} ${isActive(index) ? styles.active : ''}`}
						// eslint-disable-next-line react/no-array-index-key
						key={index}
						onClick={() => (readOnly ? {} : updateValue(index + 1))}
						onMouseEnter={() => setHoverValue(index + 1)}
						onMouseLeave={() => setHoverValue(null)}
						type="button"
					>
						<FontAwesomeIcon icon={isActive(index) ? faStar : farStar} />
					</button>
				))}
			{label && <p className={styles.label}>{label}</p>}
		</div>
	);
}