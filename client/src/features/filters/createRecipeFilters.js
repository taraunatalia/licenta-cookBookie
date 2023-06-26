import { capitalize } from '../common/utils';

export default function creatRecipeFilters(recipes) {
	const filters = {};
	recipes.forEach((recipe) => {
		Object.entries(recipe).forEach(([key, value]) => {
			if (key === '_id' || typeof value !== 'string') {
				return;
			}
			if (!filters[key]?.find(
				(val) => val.value === value.trim().toLowerCase(),
			)) {
				filters[key] = [
					...(filters[key] || []),
					{ value: value.trim().toLowerCase(), label: capitalize(value) },
				];
			}
		});
	});
	return filters;
}
