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
import { Progress, DatePicker, Segmented, Flex, Spin } from 'antd'
import { get } from 'lodash'
import dayjs from 'dayjs'

const Home = () => {
  const { status, statusFetching, statistic, statisticFetching } = useSelector(
    store => store.status
  )
  const [dateRange, $dateRange] = useState([
    dayjs().startOf('day'),
    dayjs().endOf('day'),
  ])
  const [selectedPeriod, $selectedPeriod] = useState('today')
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getStatistic(dateRange))
    dispatch(getStatus(dateRange))
  }, [dateRange])

  const onChange = value => {
    const date = dayjs().utc().local()
    const ACTIONS = {
      today: [date.startOf('day'), date.endOf('day')],
      yesterday: [
        date.subtract(1, 'day').startOf('day'),
        date.subtract(1, 'day').endOf('day'),
      ],
      week: [date.subtract(1, 'week').startOf('day'), date.endOf('day')],
      month: [date.subtract(1, 'month').startOf('day'), date.endOf('day')],
      quoter: [date.subtract(3, 'month').startOf('day'), date.endOf('day')],
      year: [date.subtract(1, 'year').startOf('day'), date.endOf('day')],
    }

    if (value !== 'custom') {
      $dateRange(ACTIONS[value])
    }

    $selectedPeriod(value)
  }

  return (
    <div className={styles.container}>
      <div className={styles.containerHeader}>
        <Flex align="end" vertical>
          <Segmented
            options={[
              {
                label: 'Сьогодні',
                value: 'today',
              },
              {
                label: 'Вчора',
                value: 'yesterday',
              },
              {
                label: '7 днів',
                value: 'week',
              },
              {
                label: 'Місяць',
                value: 'month',
              },
              {
                label: 'Квартал',
                value: 'quoter',
              },
              {
                label: 'Рік',
                value: 'year',
              },

              {
                label: 'Обрати',
                value: 'custom',
              },
            ]}
            value={selectedPeriod}
            onChange={onChange}
          />
          {selectedPeriod === 'custom' && (
            <DatePicker.RangePicker
              onChange={val => $dateRange(val)}
              defaultValue={dateRange}
              value={dateRange}
              showTime
            />
          )}
        </Flex>
      </div>
      <Spin spinning={statusFetching || statisticFetching}>
        <Flex flex={1} vertical>
          <div className={styles.general}>
            <Progress
              percent={get(statistic, 'temperature', 0)}
              format={value => <span>{value}&deg;C</span>}
              style={{ marginRight: '30px' }}
              strokeColor="#ff0000"
              strokeWidth={10}
              type="circle"
              size={200}
            />
            <Progress
              percent={get(statistic, 'humidity', 0)}
              strokeColor="#0000ff"
              strokeWidth={10}
              type="circle"
              size={200}
            />
          </div>
          <div className={styles.detailed}>
            <ResponsiveContainer>
              <LineChart data={status}>
                <XAxis
                  dataKey="createdAt"
                  tickFormatter={date => dayjs(date).format('HH:mm')}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={date => dayjs(date).format('DD.MM.YY HH:mm')}
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
        </Flex>
      </Spin>
    </div>
  )
}

export default Home
