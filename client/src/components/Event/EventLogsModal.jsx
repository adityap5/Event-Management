import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchEventLogs } from "../../store/eventSlice"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(utc)
dayjs.extend(timezone)

function EventLogsModal({ eventId, onClose, userTimezone }) {
  const dispatch = useDispatch()
  const { logs } = useSelector((state) => state.events)

  useEffect(() => {
    if (eventId) {
      dispatch(fetchEventLogs(eventId))
    }
  }, [dispatch, eventId])

  const formatDateTime = (date) => {
    return dayjs(date).tz(userTimezone).format("MMM D, YYYY [at] h:mm A")
  }

  // const formatValue = (changeType, value) => {
  //   if (changeType === "Start date/time updated" || changeType === "End date/time updated") {
  //     return formatDateTime(value)
  //   }
  //   return value
  // }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Event Update History</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="logs-container">
          {logs.length === 0 ? (
            <div className="no-logs">No update history available</div>
          ) : (
            <div className="logs-list">
              {logs.map((log, index) => (
                <div key={log._id || index} className="log-item">
                  <div className="log-timestamp">🕐 {formatDateTime(log.timestamp)}</div>
                  <div className="log-change">
                    <strong>{log.changeType}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventLogsModal