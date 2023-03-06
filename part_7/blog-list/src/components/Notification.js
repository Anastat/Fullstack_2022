import { useNotificationValue } from "../NotificationContext"

const Notification = ({ notificationClass }) => {
  const message = useNotificationValue()

  if (message === null) {
    return null
  }

  return <div className={notificationClass}>{message}</div>
}

export default Notification
