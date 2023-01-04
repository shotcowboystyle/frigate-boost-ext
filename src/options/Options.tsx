// import '../styles/index.css';
import styles from './Options.module.css';

const Options = () => {
  return (
    <div class={styles['options-container']}>
      <header>
        <h1>Frigate Boost options</h1>
      </header>

      <form id="options-form">
        <h3>Frigate Instance Domain</h3>
        <div>
          <label>
            <span>Text</span>
            <input type="text" name="frigate_instance_domain" />
          </label>
        </div>
      </form>
    </div>
  );
};

export default Options;
