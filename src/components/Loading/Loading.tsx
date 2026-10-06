interface LoadingProps {
  message?: string;
}

import styles from './Loading.module.css';

export function Loading({
  message = 'Cargando...',
}: LoadingProps) {
  return (
    <div className={styles.container} role="status">
      <span className={styles.spinner} aria-hidden="true" />
      <span className={styles.message}>{message}</span>
    </div>
  );
}