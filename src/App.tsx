import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import PageTitle from "./components/PageTitle";
import { ROUTES } from "./constants/routes";
import { useAppDispatch } from "./store";
import { getUsersData } from "./store/user/user-extra";

function App() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUsersData());
  }, []);

  return (
    <Routes>
      {ROUTES.map(({ title, path, element }, index) => (
        <Route
          key={index}
          path={path}
          element={
            <>
              <PageTitle
                title={`${title} - Admin Dashboard`}
              />
              {element}
            </>
          }
        />
      ))}
    </Routes>
  );
}

export default App;
