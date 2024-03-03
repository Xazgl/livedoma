import styles from "./footer.module.css";

export function Footer({ }) {

    return <footer className={styles.background}>
            <ul className={styles.row}>
                {/* Логотип */}
                <li className={styles.column}>
                    <div className={styles.logo}>ЛОГО</div>
                    <div className={styles.logoDesc}>© НАЗВАНИЕ 2023. Все права защищены</div>
                </li>

                {/* Строка с 3 колонками */}
                <li className={styles.rowEl}>
                    {/* Колонка 1 */}
                    <div className={styles.columnEl}>
                        <div className={styles.footerEl}>Контакты</div>
                        <div className={styles.footerEl}>Редакция</div>
                    </div>
                    {/* Колонка 2 */}
                    <div className={styles.columnEl + ' ' + styles.columnEl__secondCol} >
                        <div className={styles.footerEl}>Политика конфиденциальности</div>
                        <div className={styles.footerEl}>Условия использования</div>
                        <div className={styles.footerEl}>Реклама</div>
                    </div>
                    {/* Колонка 3  */}
                    <div className={styles.columnEl} >
                        <div className={styles.footerEl}>По любым вопросам  пишите на
                            <p className="text-orange-500 text-base font-regular font-roboto underline break-words">
                                privet@yandex.com
                            </p>
                        </div>
                        <div className={styles.footerEl} id={styles.telegram}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_1519_216)">
                                    <path d="M12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21508 0.913451 7.4078C0.00519941 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693604 16.6689 1.83649 18.807 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0865C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6934 24 14.3734 24 12C24 10.4241 23.6896 8.8637 23.0866 7.4078C22.4835 5.95189 21.5996 4.62902 20.4853 3.51472C19.371 2.40041 18.0481 1.5165 16.5922 0.913445C15.1363 0.310389 13.5759 0 12 0ZM15.816 18.1824C15.7712 18.2945 15.703 18.3957 15.6158 18.4793C15.5287 18.5628 15.4247 18.6267 15.3108 18.6667C15.1969 18.7068 15.0757 18.7219 14.9555 18.7113C14.8352 18.7006 14.7187 18.6643 14.6136 18.6048L11.3556 16.0728L9.2652 18.0024C9.21668 18.0382 9.15993 18.0613 9.10018 18.0695C9.04042 18.0776 8.97956 18.0707 8.9232 18.0492L9.324 14.4624L9.336 14.4732L9.3444 14.4024C9.3444 14.4024 15.2064 9.0648 15.4452 8.838C15.6876 8.6112 15.6072 8.562 15.6072 8.562C15.6216 8.286 15.174 8.562 15.174 8.562L7.4064 13.5588L4.1724 12.4572C4.1724 12.4572 3.6756 12.2796 3.6288 11.8872C3.5796 11.4984 4.188 11.2872 4.188 11.2872L17.0484 6.1776C17.0484 6.1776 18.1056 5.7072 18.1056 6.4872L15.816 18.1824Z" fill="white" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_1519_216">
                                        <rect width="24" height="24" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <p>Подписаться</p>
                        </div>
                    </div>
                </li>


                {/* Колонка 4 с кнопкой  */}
                <li className={styles.column} id={styles.colbtn}>
                    <button className={styles.btn}>Предложить новость</button>
                </li>
            </ul>

    </footer >
}
