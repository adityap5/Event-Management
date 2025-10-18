import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchProfiles } from "./store/profileSlice"
import ProfileManager from "./components/Profile/ProfileManger"
import EventForm from "./components/Event/EventForm"
import EventList from "./components/Event/EventList"

function App() {
  const dispatch = useDispatch()
  const { currentProfile } = useSelector((state) => state.profiles)

  useEffect(() => {
    dispatch(fetchProfiles())
  }, [dispatch])

  return (
    <div className="app">
      <header className="page-header">
        <div className="page-header-inner">
          <div className="page-titles">
            <h1 className="page-title">Event Management</h1>
            <p className="page-subtitle">Create and manage events across multiple timezones</p>
          </div>
          <div className="page-controls">
        
            <ProfileManager showTimezone={false} />
          </div>
        </div>
      </header>

      <div className="main-content">
        <div className="content-grid">
          <EventForm />
          <EventList />
        </div>
      </div>
    </div>
  )
}

export default App
