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
import { getStatistic, getStatus } from 'store/actions'
import { useEffect, useState } from 'react'
import { Progress, DatePicker } from 'antd'
import { get } from 'lodash'
import moment from 'moment'

const Home = () => {
  const { status, statusFetching, statistic, statisticFetching } = useSelector(
    store => store.status
  )
  const [dateRange, $dateRange] = useState([
    moment().startOf('day'),
    moment().endOf('day'),
  ])
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getStatistic(dateRange))
    dispatch(getStatus(dateRange))
  }, [dateRange])

  console.log({ statistic, statisticFetching })

  if (statusFetching) return 'Loading...'

  return (
    <div className={styles.container}>
      <div className={styles.containerHeader}>
        <DatePicker.RangePicker
          onChange={val => $dateRange(val)}
          defaultValue={dateRange}
          value={dateRange}
          showTime
        />
      </div>
      <div className={styles.general}>
        <Progress
          percent={get(statistic, 'temperature', 0)}
          format={value => <span>{value}&deg;C</span>}
          style={{ marginRight: '30px' }}
          strokeColor="#ff0000"
          strokeWidth={10}
          type="circle"
          width={200}
        />
        <Progress
          percent={get(statistic, 'humidity', 0)}
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
