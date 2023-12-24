import { UserOutlined } from '@ant-design/icons'
import styles from './index.module.scss'
import { Layout, Avatar } from 'antd'

const Header = () => {
  return (
    <Layout.Header className={styles.header}>
      <div>Dashboard deploy test</div>
      <div className={styles.avatar}>
        Vlad Golyachenko
        <Avatar
          size="large"
          icon={<UserOutlined />}
          style={{ marginLeft: '10px' }}
        />
      </div>
    </Layout.Header>
  )
}

export default Header
