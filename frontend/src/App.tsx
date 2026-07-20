import { Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import {
  CreateTaskPage,
  DashboardPage,
  EditTaskPage,
  LoginPage,
  TaskDetailPage,
  TaskListPage,
} from './pages'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="tasks" element={<TaskListPage />} />
          <Route path="tasks/new" element={<CreateTaskPage />} />
          <Route path="tasks/:id/edit" element={<EditTaskPage />} />
          <Route path="tasks/:id" element={<TaskDetailPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
