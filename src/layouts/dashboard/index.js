/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "layouts/common";

function Dashboard() {
  const navigate=useNavigate()
  const { sales, tasks } = reportsLineChartData;
  const [dashboardData, setDashboardData] = useState({});

  const token = localStorage.getItem("authToken");


  const getDashboardData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}api/admin/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDashboardData(response?.data?.dashboard);
    } catch (error) {
      if (error?.response?.data?.Message === 'jwt expired') {
                      logout(navigate)
                  }
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} sx={{
              "&:hover": {
                transform: "scale(1.01)",
                boxShadow: 2,
              },
            }}>
              <Link to='/users'>
                <ComplexStatisticsCard
                  color="dark"
                  icon="weekend"
                  title="Users"
                  count={dashboardData?.users}
                  percentage={{
                    color: "success",
                    label: "Just updated",
                  }}
                />
              </Link>

            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} sx={{
              "&:hover": {
                transform: "scale(1.01)",
                boxShadow: 2,
              },
            }}>
              <Link to='/invitation'>
                <ComplexStatisticsCard
                  icon="leaderboard"
                  title="Invitations"
                  count={dashboardData?.invitations}
                  percentage={{
                    color: "success",
                    label: "Just updated",
                  }}
                />
              </Link>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} sx={{
              "&:hover": {
                transform: "scale(1.01)",
                boxShadow: 2,
              },
            }}>
              <Link to='/decoration'>
                <ComplexStatisticsCard
                  color="success"
                  icon="store"
                  title="Decoration"
                  count={dashboardData?.decorations}
                  percentage={{
                    color: "success",
                    label: "Just updated",
                  }}
                />
              </Link>

            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} sx={{
              "&:hover": {
                transform: "scale(1.01)",
                boxShadow: 2,
              },
            }}>
              <Link to='/designer'><ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Designers"
                count={dashboardData?.designers}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              /></Link>

            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} sx={{
              "&:hover": {
                transform: "scale(1.01)",
                boxShadow: 2,
              },
            }}>
              <Link to='/sweets'><ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Sweets"
                count={dashboardData?.sweets}
                percentage={{
                  color: "success",
                  label: "Just updated",
                }}
              /></Link>

            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} sx={{
              "&:hover": {
                transform: "scale(1.01)",
                boxShadow: 2,
              },
            }}>
              <Link to='/review'>
                <ComplexStatisticsCard
                  icon="leaderboard"
                  title="Reviews"
                  count={dashboardData?.reviews}
                  percentage={{
                    color: "success",
                    label: "Just updated",
                  }}
                />
              </Link>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Dashboard;
