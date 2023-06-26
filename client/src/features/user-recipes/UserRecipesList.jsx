import { NavLink } from 'react-router-dom';
import { capitalize } from '../common/utils';
import styles from './user-recipe-list.module.scss';


export default function UserRecipesList ({
    recipes, deleteAction, editAction, cancelFavoriteRecipe, headerAction, isAdmin = false,
}) {
    return (
        <div className="category-container">
			<div className="title-row">
				<p className="title">
					Rețete Personale (
					{recipes.length}
					)
				</p>
				{headerAction}
			</div>
			{recipes.map((recipe) => (
				<div
					className={`list-item-container ${styles['recipe-container']} ${isAdmin
						? styles['admin-recipe-container'] : ''}`}
					key={recipe._id}
				>
					<div className={styles['svg-container']}>
						<img className={styles['recipe-image']} src={`http://localhost:8080/uploads/${recipe.imageCover}`} alt="Recipe Cover" />
					</div>
					<div className={styles['recipe-details-container']}>
						<p className={`${styles['recipe-title']} ${styles['small-title']}`}>
							{capitalize(recipe.name)}
							{' '}
							{capitalize(recipe.category)}
							{', '}
							{capitalize(recipe.servings)}
						</p>
						<div className={styles['recipe-body-container']}>
							<div className={styles['recipe-details']}>
								<p className={`${styles['recipe-title']} ${styles['large-title']}`}>
									{capitalize(recipe.name)}
								</p>
								<ul className={styles['details-list']}>
									<li>
										<span>Nume: </span>
										{capitalize(recipe.name)}
									</li>
									<li>
										<span>Categorie: </span>
										{capitalize(recipe.category)}
									</li>
									<li>
										<span>Dificultate: </span>
										{capitalize(recipe.difficulty)}
									</li>
									<li>
										<span>Rating: </span>
										{recipe.rating || '-'}
									</li>
									<li>
										<span>Autor: </span>
										{recipe.user.name || 'N/A'}
									</li>
									{isAdmin && (
										<li>
											<span>Available: </span>
											{recipe.private ? 'Yes' : 'No'}
										</li>
									)}
								</ul>
							</div>
							<div className={styles['action-container']}>
								<button
									className={isAdmin ? 'danger-btn' : 'primary-btn'}
									onClick={() => deleteAction(recipe)}
									type="button"
								>
									{ 'Șterge' }
								</button>
                                {/* <ConfirmRecipeDeleteDialog
				                    recipe={recipeToDelete}
				                    cancel={() => setRecipeToDelete(null)}
				                    onConfirm={deleteRecipe}
			                    /> */}
								<button
									className={isAdmin ? 'danger-btn' : 'primary-btn'}
									onClick={() => editAction(recipe)}
									type="button"
								>
									{ 'Editează' }
								</button>
								<NavLink
									className={isAdmin ? 'secondary-btn' : 'link-btn'}
									to={`${isAdmin ? '' : ''}/recipe/${recipe._id}`}
								>
									{'Detalii'}
								</NavLink>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
    )
}