import Dialog from '../../common/dialog/Dialog';

export default function TryRecipeDialog({
	recipe, confirm, cancel, 
}) {
	return (
		<Dialog
			cancel={{ showCancel: true, callback: cancel }}
			confirm={{ callback: confirm, label: 'Confirm' }}
			opened={Boolean(recipe)}
			title="Confirmă"
		>
			<p>
				Ai salvat rețeta la favorite!
			</p>
		</Dialog>
	);
}