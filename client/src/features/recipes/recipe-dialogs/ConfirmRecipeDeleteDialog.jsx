import Dialog from '../../common/dialog/Dialog';
import { capitalize } from '../../common/utils';

export default function ConfirmRecipeDeleteDialog({
	cancel, onConfirm, recipe,
}) {
	return (
		<Dialog
			cancel={{ showCancel: true, callback: cancel }}
			confirm={{ callback: onConfirm, label: 'Șterge', type: 'danger' }}
			opened={recipe}
			title="Șterge rețeta"
		>
			Ești sigur că dorești să ștergi această rețetă?
			<b>{` ${capitalize(recipe?.name)} ${capitalize(recipe?.servings)} `}</b>
			din
			<b>
				{` ${capitalize(recipe?.category)}`}
			</b>
			?
		</Dialog>
	);
}