import Link from 'next/link';

import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.title}>
          Podcaster
        </Link>
      </div>
    </header>
  );
}