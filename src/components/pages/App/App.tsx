import './App.css'
import Map from '../../Map'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../store'
import Sidebar from '../../organisms/Sidebar'
import Content from '../Content'
import { useLoadStops } from '../../../services/useLoadStops'
import { useLoadRoutes } from '../../../services/useLoadRoutes'

export default function App() {
  // Load stops and routes from backend on app initialization
  useLoadStops();
  useLoadRoutes();

  const isDetailOpen = useSelector((state: RootState) => state.appState.isStopDetailOpen || 
      state.appState.isRouteDetailOpen || state.appState.isCalendarDetailOpen || state.appState.isTripDetailOpen);

  // const test = async () => {

  //     const response = await fetch('http://localhost:3000/');
  //     const data = await response.json();
  //     console.log(data);
  // }

  // test();
  return (
    <div className="flex h-[calc(100vh-84px)]">
      <Sidebar />
      <Content />
      <div className={`flex flex-1 duration-300 ${isDetailOpen ? 'mr-[350px]' : 'mr-0'}`}>
        <Map/>
      </div>
    </div>
  )
}
