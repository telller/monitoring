import styles from './index.module.scss'
import { Layout } from 'antd'

const Sider = () => {
  return (
    <Layout.Sider className={styles.sider} width={70}>
      Sider
    </Layout.Sider>
  )
}

export default Sider
