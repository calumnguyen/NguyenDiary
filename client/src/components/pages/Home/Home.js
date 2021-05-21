import React, { PureComponent } from 'react'
import styles from './Home.module.css';

export class Home extends PureComponent {
    render() {
        return (
            <div className={styles.home}>
                Hello guys
            </div>
        )
    }
}

export default Home
