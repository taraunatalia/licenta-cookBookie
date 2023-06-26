import {
	useContext,
	useMemo, useEffect, useCallback, useState,
} from 'react';
//import { NavLink } from 'react-router-dom';
import Store from '../../store';
import AddRecipeDialog from '../recipes/recipe-dialogs/AddRecipeDialog';
import Dialog from '../common/dialog/Dialog';
import useFetch from '../common/hooks/useFetch';
import PageContainer from '../common/page-container/PageContainer';
import UserRecipesList from './UserRecipesList';
import FavoriteRecipesList from './FavoriteRecipesList';
import ConfirmRecipeDeleteDialog from '../recipes/recipe-dialogs/ConfirmRecipeDeleteDialog';
import UpdateRecipeDialog from '../recipes/recipe-dialogs/UpdateRecipeDialog';
import styles from './userRecipe.module.scss';
import { NavLink } from 'react-router-dom';

export default function UserRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [preferRecipes, setPreferRecipes] = useState([]);
	const [userRecipeToCancel, setUserRecipeToCancel] = useState(null);
    const [addRecipeOpen, setAddRecipeOpen]= useState(false);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [ratingFilter, setRatingFilter] = useState('');
    const [recipeToDelete, setRecipeToDelete] = useState(null);
    const [recipeToEdit, setRecipeToEdit] = useState(null);
    const customFetch = useFetch();
    const store = useContext(Store);


    //retetele postate de utilizator
	const getUserRecipes = useCallback(async () => {
		const res = await customFetch('http://localhost:8080/recipes/user',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
		if (res.status === 200) {
			const result = await res.json();
			setRecipes(result.recipes);
		}
	}, []);

    useEffect(() => {
        getUserRecipes();
    }, []);

    const onRecipeAdded = useCallback(() => {
        getUserRecipes();
        setAddRecipeOpen(false);
     }, []);

    // retetele favorite
	const getFavoriteRecipes = useCallback(async () => {
		const res = await customFetch('http://localhost:8080/recipes/try',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
		if (res.status === 200) {
			const result = await res.json();
			setPreferRecipes(result.recipes);
		}
	}, []);

    useEffect(() => {
        getFavoriteRecipes();
    }, []);

    //filtrarea retetelor postate de utilizator in functie de categorie si rating
    const filteredRecipes = useMemo(() => recipes.filter((recipe) => {
        if (categoryFilter && ratingFilter) {
            return (
                recipe.category.toLowerCase() === categoryFilter.toLowerCase() &&
                recipe.rating >= ratingFilter
            );
        } else if (categoryFilter) {
            return recipe.category.toLowerCase() === categoryFilter.toLowerCase();
        } else if (ratingFilter) {
            return recipe.rating >= ratingFilter;
        }
        return true;
    }), [categoryFilter, ratingFilter, recipes]);

	const filteredPreferedRecipes = useMemo(() => preferRecipes?.filter((recipe) => {
        if (categoryFilter && ratingFilter) {
            return (
                recipe.category.toLowerCase() === categoryFilter.toLowerCase() &&
                recipe.rating >= ratingFilter
            );
        } else if (categoryFilter) {
            return recipe.category.toLowerCase() === categoryFilter.toLowerCase();
        } else if (ratingFilter) {
            return recipe.rating >= ratingFilter;
        }
        return true;
    }) ?? [], [categoryFilter, ratingFilter, preferRecipes]);

    
    
    //sterg propria reteta
    const deleteRecipe = useCallback(async () => {
		setRecipeToDelete(null);
		const res = await customFetch('http://localhost:8080/recipe/user', {
			method: 'DELETE',
			body: JSON.stringify({ recipeId: recipeToDelete._id }),
		});
		if (res.status === 200) {
			store.addToast({ message: 'Recipe deleted successfully!' });
			getUserRecipes();
		}
	}, [recipeToDelete, store]);

    //sterg retetele de la favorite
	const cancelUserRecipe = useCallback(async () => {
		const userRecipe = {
			id: userRecipeToCancel._id,
		};
		const res = await customFetch('http://localhost:8080/recipe/try', {
			method: 'DELETE',
			body: JSON.stringify(userRecipe),
		});
		if (res.status === 200) {
			store.addToast({ message: 'Recipe cancelled', type: 'success' });
			getFavoriteRecipes();
		}
		setUserRecipeToCancel(null);
	}, [userRecipeToCancel, store]);

	const onRecipeUpdate = () => {
		setRecipeToEdit(null);
		getUserRecipes();
	}

	// useEffect(() => {
	// 	getUserRecipes();
	// }, []);

    //
    

	// const renderUserRecipe = useCallback((res, cancel) => (
	// 	<div
	// 		className={`list-item-container ${styles['item-container']}`}
	// 		key={res._id}
	// 	>
	// 		<div>
	// 			<span className={res.recipe ? styles.link : styles.canceled}>
	// 				<NavLink
	// 					to={`/recipe/${res.recipe?._id}`}
	// 				>
	// 					{res.recipe ? `${capitalize(res.recipe.category)}
	// 					${capitalize(res.recipe.name)}
	// 					in ${capitalize(res.recipe.servings)}` : 'Deleted recipe'}
	// 				</NavLink>
	// 			</span>
	// 		</div>
	// 		<div>
	// 			{cancel ? (
	// 				<button
	// 					className="danger-btn"
	// 					onClick={() => setUserRecipeToCancel(res)}
	// 					type="button"
	// 				>
	// 					Cancel
	// 				</button>
	// 			) : (
	// 				<span className={styles.canceled}>
	// 					{res.status !== 'active'
	// 						? capitalize(res.status) : ''}
	// 				</span>
	// 			)}
	// 		</div>
	// 	</div>
	// ));

    
    const addButton = (
        <button
          className='primary-btn'
          onClick={() => setAddRecipeOpen(true)}
          type="button"
        >
        Adauga Reteta
        </button>
    );

	return (
	    <PageContainer navLinks={[{link: 'userRecipes', name: 'Retele mele'}]}>
        <div className={`list-item-container ${styles['filter-header']}`}>
		<h2 className={styles.heading}>Filtrează rețetele</h2>
		<div className={styles['date-row']}>
		<div className={styles['date-range-container']}>
		<div className={styles['category-label']}>Categorie</div>
		<select className={styles.category}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
		>
            <option value="">Toate categoriile</option>
            <option value="Aperitive">Aperitive</option>
            <option value="Ciorbe si Supa">Ciorbe si Supa</option>
            <option value="Feluri principale">Feluri principale</option>
            <option value="Deserturi">Deserturi</option>
        </select>
		<hr />
                   
		<div className={styles['rating-row']}>
		<div className={styles['rating-label']}>Rating minim</div>
		<select className={styles.rating}
			value={ratingFilter || ''}
			onChange={(e) => setRatingFilter(parseFloat(e.target.value))}
		>
            <option value="-">0</option>
			<option value="1">1</option>
            <option value="2">2</option>
			<option value="3">3</option>
			<option value="4">4</option>
			<option value="5">5</option>
		</select>
		</div>
	    </div>
		{/* <button
			className={'primary-btn'}
			onClick={getUserRecipes}
			type="button"
		>
			Caută
		</button> */}
		</div>
		</div>
        <UserRecipesList
			recipes={filteredRecipes}
            headerAction={addButton}
			deleteAction={setRecipeToDelete}
            editAction={setRecipeToEdit}
		/>

		{filteredRecipes.length === 0 && (
			<div className={`list-item-container ${styles['item-container']}`}>
				<span className={styles.canceled}>Nu aveți rețete postate</span>
			</div>
			)}
		<FavoriteRecipesList
        	recipes={filteredPreferedRecipes}
            cancelFavoriteRecipe={setUserRecipeToCancel}
        />
		{filteredPreferedRecipes.length === 0 && (
			<div className={`list-item-container ${styles['item-container']}`}>
				<span className={styles.canceled}>Nu aveți rețete favorite</span>
			</div>
		)}
        <AddRecipeDialog
		    cancel={() => setAddRecipeOpen(false)}
			onRecipeAdded={onRecipeAdded}
			opened={addRecipeOpen}
		/> 
        <ConfirmRecipeDeleteDialog
			recipe={recipeToDelete}
			cancel={() => setRecipeToDelete(null)}
			onConfirm={deleteRecipe}
		/>
        <UpdateRecipeDialog
			recipeToEdit={recipeToEdit}
			cancel={() => setRecipeToEdit(null)}
			onRecipeUpdate={onRecipeUpdate}
		/>
		
		<Dialog
			cancel={{ showCancel: false, callback: () => setUserRecipeToCancel(null) }}
			confirm={{ callback: cancelUserRecipe, label: 'Da', type: 'danger' }}
			opened={Boolean(userRecipeToCancel)}
			title="Confirmă eliminarea"
		>
		</Dialog>
        </PageContainer>
	);
}
