import styles from './Unread.module.css'



const Unread = ({ count }) => {

  return (
    <div className={count < 10?styles.singleBubble:styles.doubleBubble}>
      <span className={styles.count}>{count}</span>
    </div>
  )
}

export default Unread;
