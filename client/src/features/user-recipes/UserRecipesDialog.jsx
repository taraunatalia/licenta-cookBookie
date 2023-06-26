import Dialog from '../common/dialog/Dialog';
import { capitalize } from '../common/utils';
import styles from './userRecipe.module.scss';

export default function UserRecipesDialog({
	userRecipes, cancel, primaryField, secondaryField, opened, title, entity,
}) {
	return (
		<Dialog
			cancel={{ showCancel: false, callback: cancel }}
			confirm={null}
			opened={opened}
			title={title}
		>
			{userRecipes.map((userRecipe) => (
				<div
					className={styles['recipe-container']}
					key={userRecipe?._id}
				>
					<div className={styles.details}>
						<p>{capitalize(primaryField)}</p>
						<span className={userRecipe?.[primaryField]?.[secondaryField]
							? '' : styles.canceled}
						>
							{userRecipe?.[primaryField]?.[secondaryField] ?? 'Deleted recipe'}
						</span>
					</div>
				</div>
			))}
			{userRecipes.length === 0 && (
				<div className={styles['recipe-container']}>
					There are no recipes for this
					{' '}
					{entity}
				</div>
			)}
		</Dialog>
	);
}