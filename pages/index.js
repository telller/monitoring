import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

import styles from '../styles/Home.module.css'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getStatus } from '../src/store/actions/status'
import moment from 'moment'

const Home = () => {
  const { status, statusFetching } = useSelector(store => store.status)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getStatus())
  }, [])

  if (statusFetching) return 'Loading...'

  return (
    <div className={styles.container}>
      <ResponsiveContainer width="100%" height="70%">
        <LineChart data={status}>
          <XAxis
            dataKey="createdAt"
            tickFormatter={date => moment(date).format('HH:mm')}
          />
          <YAxis />
          <Tooltip
            labelFormatter={date => moment(date).format('DD.MM.YY HH:mm')}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#ff0000"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="humidity"
            stroke="#0000ff"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Home
