import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './dialog.module.scss';

export default function Dialog({
	title, children, opened, cancel, confirm = null,
}) {
	return opened && (
		<div
			className={styles['dialog-container']}
			onKeyDown={cancel.callback}
			onMouseDown={cancel.callback}
			role="button"
			tabIndex={0}
		>
			<div
				className={styles.dialog}
				onKeyDown={(e) => e.stopPropagation()}
				onMouseDown={(e) => e.stopPropagation()}
				role="button"
				tabIndex={0}
			>
				<div className={styles.close}>
					<button
						onClick={cancel.callback}
						type="button"
					>
						<FontAwesomeIcon icon={faTimes} />
					</button>
				</div>
				<div className={styles.title}>{title}</div>
				<div className={styles.content}>{children}</div>
				<div className={styles.actions}>
					{cancel?.showCancel && (
						<div className={styles['secondary-container']}>
							<button
								className="link-btn"
								onClick={cancel.callback}
								type="button"
							>
								Anulează
							</button>
						</div>
					)}
					{confirm && (
						<button
							className={confirm.type === 'danger' ? 'danger-btn' : 'primary-btn'}
							disabled={confirm.disabled}
							onClick={confirm.callback}
							type="button"
						>
							{confirm.label || 'Confirm'}
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
