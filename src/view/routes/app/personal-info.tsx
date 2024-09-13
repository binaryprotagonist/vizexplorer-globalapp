import { Routes, Route } from "react-router-dom";
import {
  BasicInfoUpdate,
  PersonalInfo as PersonalInfoHome
} from "../../../settings/personal-info";

export function PersonalInfoRoutes() {
  return (
    <Routes>
      <Route path={"basic-info/edit"} element={<BasicInfoUpdate />} />
      <Route index element={<PersonalInfoHome />} />
    </Routes>
  );
}
