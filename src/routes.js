import React from "react";
// Admin Imports
import MainDashboard from "views/admin/default";
// Placeholder imports for new pages
import RiskAnalysis from "views/admin/RiskAnalysis";
import AccessibilityReports from "views/admin/AccessibilityReports";
import Settings from "views/admin/Settings";
// Icon Imports
import { MdHome, MdAssessment, MdAccessibility, MdSettings } from "react-icons/md";

const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  {
    name: "Risk Analysis",
    layout: "/admin",
    path: "risk-analysis",
    icon: <MdAssessment className="h-6 w-6" />,
    component: <RiskAnalysis />,
  },
  {
    name: "Accessibility Reports",
    layout: "/admin",
    path: "accessibility-reports",
    icon: <MdAccessibility className="h-6 w-6" />,
    component: <AccessibilityReports />,
  },
  {
    name: "Settings",
    layout: "/admin",
    path: "settings",
    icon: <MdSettings className="h-6 w-6" />,
    component: <Settings />,
  },
];
export default routes;
