import styles from './Unread.module.css'



const Unread = ({ count }) => {

  return (
    <div className={styles.numberBubble}>
      <span className={styles.count}>{count}</span>
    </div>
  )
}

export default Unread;
