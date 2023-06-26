import Dialog from '../../common/dialog/Dialog';

export default function ConfirmUserDeleteDialog({
	opened, cancel, onConfirm, email, profile = false,
}) {
	return (
		<Dialog
			cancel={{ showCancel: true, callback: cancel }}
			confirm={{ callback: onConfirm, label: 'Șterge', type: 'danger' }}
			opened={opened}
			title={`Delete ${profile ? 'account' : 'user'}`}
		>
			Ești sigur că dorești să îți ștergi contul?
			{` ${profile ? 'your' : 'the'} user `}
			{email}
			?
		</Dialog>
	);
}
