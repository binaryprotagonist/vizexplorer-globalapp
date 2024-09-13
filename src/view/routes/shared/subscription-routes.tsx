import React from "react";
import { Routes, Route } from "react-router-dom";
import {
  Subscription as SubscriptionHome,
  ManagePaymentInfo
} from "../../../settings/subscription";

export function SharedSubscriptionRoutes({ children }: { children?: React.ReactNode }) {
  return (
    <Routes>
      <Route path={"payment/edit"} element={<ManagePaymentInfo />} />
      {children}
      <Route index element={<SubscriptionHome />} />
    </Routes>
  );
}
