import styles from '../css/Users.module.css';
import { useState } from 'react';

const Paginator = ({ overall, pageSize, portionSize, currentPage, setCurrentPageUsers }) => {
	let items = Math.ceil(overall / pageSize);
	let pages = [];

	for (let i = 1; i <= items; i++) {
		pages.push(i);
	}

	const portions = Math.ceil(items / portionSize);
	let [portionNumber, setPortionNumber] = useState(1);
	let leftPortionPageNumber = (portionNumber - 1) * portionSize + 1;
	let rightPortionPageNumber = portionNumber * portionSize;

	return <>
		{portionNumber > 1 &&
			<button className={styles.paginatorScrollButton} id={styles.prev} onClick={() => {
				setPortionNumber(portionNumber - 1);
			}}>{'<< PREV'}</button>}


		{pages.filter(p => p >= leftPortionPageNumber && p <= rightPortionPageNumber).map((b, id) => {
			return <button key={id}
				className={`${currentPage === b ? styles.current : ''} ${styles.pageButton}`}
				onClick={(e) => setCurrentPageUsers(b)}>{b}</button>;
		})}

		{portions > portionNumber &&
			<button className={styles.paginatorScrollButton} id={styles.next} onClick={() => {
				setPortionNumber(portionNumber + 1);
			}}>{'NEXT >>'}</button>}
	</>;
};

export default Paginator;