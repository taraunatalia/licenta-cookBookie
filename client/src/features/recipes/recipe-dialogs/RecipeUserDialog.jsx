import {
	useEffect, useCallback, useState,
} from 'react';
import useFetch from '../../common/hooks/useFetch';
import UserRecipesDialog from '../../user-recipes/UserRecipesDialog';

export default function RecipeUserDialog({ recipe, cancel }) {
	const [userRecipes, setUserRecipes] = useState([]);
	const customFetch = useFetch();

	const getUserRecipes = useCallback(async () => {
		if (!recipe) {
			return;
		}
		const userRecipeUrl = new URL(
			'http://localhost:8080/recipes/try',
		);
		userRecipeUrl.searchParams.append('id', recipe._id);
		const res = await customFetch(userRecipeUrl);
		if (res.status === 200) {
			const result = await res.json();
			setUserRecipes(result.userRecipes);
		}
	}, [bike]);

	useEffect(getUserRecipes, [recipe]);

	return (
		<UserRecipesDialog
			cancel={cancel}
			entity="recipe"
			opened={recipe}
			primaryField="user"
			userRecipes={userRecipes}
			secondaryField="email"
			title="User recipe"
		/>
	);
}