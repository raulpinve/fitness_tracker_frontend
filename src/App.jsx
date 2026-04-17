import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./shared/components/ProtectedRoute";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import RootRedirect from "./shared/components/RootRedirect";
import PublicRoute from "./shared/components/PublicRoute";
import MobileLayout from "./shared/components/MobileLayout";
import ExercisesPage from "./pages/exercises/ExercisesPage";
import ExercisesCreatePage from "./pages/exercises/ExerciseCreatePage";
import { Toaster } from 'sonner';
import ExerciseEditPage from "./pages/exercises/ExerciseEditPage";
import RoutinesPage from "./pages/routines/RoutinesPage";
import RoutineCreatePage from "./pages/routines/RoutineCreatePage";
import RoutineUpdatePage from "./pages/routines/RoutineUpdatePage";
import RoutineExercisePage from "./pages/routineExercise/RoutineExercisePage";
import RoutineExerciseCreatePage from "./pages/routineExercise/RoutineExerciseCreatePage";
import RoutineExerciseEditPage from "./pages/routineExercise/RoutineExerciseEditPage";
import WorkoutsPage from "./pages/workouts/WorkoutsPage";
import WorkoutsCreatePage from "./pages/workouts/WorkoutsCreatePage";
import WorkoutDetailPage from "./pages/workouts/WorkoutDetailPage";
import WorkoutSummaryPage from "./pages/workouts/WorkoutSummaryPage";
import ExerciseDetailPage from "./pages/exercises/ExerciseDetailPage";
import ProfilePage from "./pages/profile/ProfilePage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />

          {/* Public routes */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>

          {/* Proteted routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MobileLayout />}>

              {/* exercises */}
              <Route path="/exercises" element={<ExercisesPage />} />
              <Route path="/exercises/:exerciseId" element={<ExerciseDetailPage />} />
              <Route path="/exercises/create" element={<ExercisesCreatePage />} />
              <Route path="/exercises/:exerciseId/edit" element={<ExerciseEditPage />} />

              {/* Routines */}
              <Route path="/routines" element={<RoutinesPage />} />
              <Route path="/routines/create" element={<RoutineCreatePage />} />
              <Route path="/routines/:routineId/update" element={<RoutineUpdatePage />} />
              
              {/* Routine exercises */}
              <Route path="/routines/:routineExerciseId/exercises" element={<RoutineExercisePage />} />
              <Route path="/routines/:routineId/exercises/create" element={<RoutineExerciseCreatePage/> }/>
              <Route path="/routines/:routineExerciseId/exercises/edit" element={<RoutineExerciseEditPage/> }/>

              {/* Workouts */}
              <Route path="/workouts" element={<WorkoutsPage />} />
              <Route path="/workouts/create" element = {<WorkoutsCreatePage />} /> 
              <Route path="/workouts/:workoutId" element={<WorkoutDetailPage />} />
              <Route path="/workouts/:workoutId/summary" element={<WorkoutSummaryPage />} />

              {/* Profile */}
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
        </Route>
      </Routes>

      </BrowserRouter>
        <Toaster
          position="bottom-center"
          offset={80}
          theme="dark"
        />
    </>
  );
}

export default App
