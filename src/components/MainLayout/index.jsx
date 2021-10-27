import { useEffect, useState } from 'react'
import { Header, Sider } from 'components'
import styles from './index.module.scss'
import { Layout, Spin } from 'antd'
import Router from 'next/router'

const MainLayout = ({ children }) => {
  const [isLoading, $isLoading] = useState(false)

  useEffect(() => {
    Router.events.on('routeChangeStart', () => $isLoading(true))
    Router.events.on('routeChangeComplete', () => $isLoading(false))
    Router.events.on('routeChangeError', () => $isLoading(false))
  }, [])

  return (
    <Spin spinning={isLoading}>
      <Layout className={styles.mainContainer}>
        <Sider />
        <Layout className={styles.mainContent}>
          <Header />
          <Layout.Content className={styles.content}>{children}</Layout.Content>
        </Layout>
      </Layout>
    </Spin>
  )
}

export default MainLayout
