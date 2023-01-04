// import '../styles/index.css';
import styles from './Popup.module.css';

const Popup = () => {
  return (
    <div class={styles['popup-container']}>
      <header>
        <p class="font-bold">Get started with Frigate Boost.</p>
      </header>
    </div>
  );
};

export default Popup;
