import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useDispatch, useSelector } from 'react-redux'
import styles from 'styles/pages/index.module.scss'
import { getStatus } from 'store/actions'
import { useEffect } from 'react'
import { Progress } from 'antd'
import { get } from 'lodash'
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
      <div className={styles.general}>
        <Progress
          percent={get(status, `[${status.length - 1}].temperature`, 0)}
          format={value => <span>{value}&deg;C</span>}
          style={{ marginRight: '30px' }}
          strokeColor="#ff0000"
          strokeWidth={10}
          type="circle"
          width={200}
        />
        <Progress
          percent={get(status, `[${status.length - 1}].humidity`, 0)}
          strokeColor="#0000ff"
          strokeWidth={10}
          type="circle"
          width={200}
        />
      </div>
      <div className={styles.detailed}>
        <ResponsiveContainer>
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
    </div>
  )
}

export default Home
