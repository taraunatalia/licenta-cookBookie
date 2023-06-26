import {
	useEffect, useCallback, useState,
} from 'react';
import useFetch from '../../common/hooks/useFetch';
//import ReservationsDialog from '../../reservations/ReservationsDialog';

export default function UserRecipesDialog({ user, cancel }) {
	const [recipes, setRecipes] = useState([]);
	const customFetch = useFetch();

	const getRecipes = useCallback(async () => {
		if (!user) {
			return;
		}
		const recipesUrl = new URL(
			'http://localhost:8080/recipes/user',
		);
		recipesUrl.searchParams.append('id', user._id);
		const res = await customFetch(recipesUrl);
		if (res.status === 200) {
			const result = await res.json();
			setRecipes(result.recipes);
		}
	}, [user]);

	useEffect(getRecipes, [user]);

	return (
		<ReservationsDialog
			cancel={cancel}
			entity="user"
			opened={user}
			primaryField="bike"
			reservations={reservations}
			secondaryField="model"
			title="User reservations"
		/>
	);
}