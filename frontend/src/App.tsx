import { Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import {
  CreateTaskPage,
  DashboardPage,
  EditTaskPage,
  TaskDetailPage,
  TaskListPage,
} from './pages'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="tasks" element={<TaskListPage />} />
        <Route path="tasks/new" element={<CreateTaskPage />} />
        <Route path="tasks/:id/edit" element={<EditTaskPage />} />
        <Route path="tasks/:id" element={<TaskDetailPage />} />
      </Route>
    </Routes>
  )
}

export default App
