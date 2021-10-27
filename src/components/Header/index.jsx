import styles from './index.module.scss'
import { Layout } from 'antd'

const Header = () => {
  return (
    <Layout.Header className={styles.header}>
      <div>logo</div>
      <div>user</div>
    </Layout.Header>
  )
}

export default Header
