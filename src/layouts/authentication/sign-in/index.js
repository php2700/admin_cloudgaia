// /**
// =========================================================
// * Material Dashboard 2 React - v2.2.0
// =========================================================

// * Product Page: https://www.creative-tim.com/product/material-dashboard-react
// * Copyright 2023 Creative Tim (https://www.creative-tim.com)

// Coded by www.creative-tim.com

//  =========================================================

// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// */

// import { useState } from "react";
// import axios from 'axios';


// // react-router-dom components
// import { Link, useNavigate } from "react-router-dom";

// // @mui material components
// import Card from "@mui/material/Card";
// import Switch from "@mui/material/Switch";
// import Grid from "@mui/material/Grid";
// import MuiLink from "@mui/material/Link";

// // @mui icons
// import FacebookIcon from "@mui/icons-material/Facebook";
// import GitHubIcon from "@mui/icons-material/GitHub";
// import GoogleIcon from "@mui/icons-material/Google";

// // Material Dashboard 2 React components
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
// import MDInput from "components/MDInput";
// import MDButton from "components/MDButton";

// // Authentication layout components
// import BasicLayout from "layouts/authentication/components/BasicLayout";

// // Images
// import bgImage from "assets/images/bg-sign-in-basic.jpeg";

// function Basic() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [emailError, setEmailError] = useState("");
//   const [passwordError, setPasswordError] = useState("");
//   const navigate = useNavigate();
//   const [rememberMe, setRememberMe] = useState(false);

//   const handleSetRememberMe = () => setRememberMe(!rememberMe);

//   // const getToken = localStorage.getItem('authToken');
//   // if (getToken)
//   //   navigate('/dashboard');

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     setEmailError("");
//     setPasswordError("");

//     if (!email) {
//       setEmailError("Email is required.");
//       return;
//     }
//     if (!password) {
//       setPasswordError("Password is required.");
//       return;
//     }

//     try {
//       const response = await axios.post(`${process.env.REACT_APP_BASE_URL}api/admin/admin_login`, {
//         email,
//         password,
//       });

//       const token = response?.data?.token;
//       localStorage.setItem('authToken', token);
//       navigate('/dashboard');
//     } catch (error) {
//       if (error.response) {
//         setErrorMessage(error.response?.data?.message);
//       } else {
//         setErrorMessage('An error occurred. Please try again.');
//       }
//     }
//   };

//   return (
//     <BasicLayout image={bgImage}>
//       <Card>
//         <MDBox
//           variant="gradient"
//           bgColor="info"
//           borderRadius="lg"
//           coloredShadow="info"
//           mx={2}
//           mt={-3}
//           p={2}
//           mb={1}
//           textAlign="center"
//         >
//           <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
//             Sign in
//           </MDTypography>
//         </MDBox>
//         <MDBox pt={4} pb={3} px={3}>
//           <MDBox component="form" onSubmit={handleLogin} role="form">
//             <MDBox mb={2}>
//               <MDInput type="email" label="Email" fullWidth value={email}
//                 onChange={(e) => setEmail(e.target.value)} />
//               {emailError && (
//                 <MDTypography variant="caption" color="error">
//                   {emailError}
//                 </MDTypography>
//               )}
//             </MDBox>
//             <MDBox mb={2}>
//               <MDInput type="password" label="Password" fullWidth value={password}
//                 onChange={(e) => setPassword(e.target.value)} />
//               {passwordError && (
//                 <MDTypography variant="caption" color="error">
//                   {passwordError}
//                 </MDTypography>

//               )}
//               {errorMessage && (
//                 <MDTypography variant="caption" color="error">
//                   {errorMessage}
//                 </MDTypography>

//               )}
//             </MDBox>
//             <MDBox display="flex" alignItems="center" ml={-1}>
//               <Switch checked={rememberMe} onChange={handleSetRememberMe} />
//               <MDTypography
//                 variant="button"
//                 fontWeight="regular"
//                 color="text"
//                 onClick={handleSetRememberMe}
//                 sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
//               >
//                 &nbsp;&nbsp;Remember me
//               </MDTypography>
//             </MDBox>
//             <MDBox mt={4} mb={1}>
//               <MDButton variant="gradient" color="info" fullWidth type="submit">
//                 sign in
//               </MDButton>
//             </MDBox>
//           </MDBox>
//         </MDBox>
//       </Card>
//     </BasicLayout>
//   );
// }

// export default Basic;
import { useState, useEffect } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

// MUI components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Layout
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

function Basic() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  // Optional: Auto-redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      axios.get(`${process.env.REACT_APP_BASE_URL}api/admin/protected_route`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(() => {
        navigate('/dashboard');
      }).catch((error) => {
        if (error.response?.data?.redirectTo) {
          localStorage.removeItem('authToken');
          navigate(error.response.data.redirectTo);
        }
      });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    setEmailError('');
    setPasswordError('');
    setErrorMessage('');

    if (!email) {
      setEmailError("Email is required.");
      return;
    }
    if (!password) {
      setPasswordError("Password is required.");
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}api/admin/admin_login`, {
        email,
        password,
      });

      const token = response?.data?.token;
      if (token) {
        localStorage.setItem('authToken', token);
        navigate('/dashboard');
      } else {
        setErrorMessage("Unexpected response, please try again.");
      }

    } catch (error) {
      if (error.response) {
        const msg = error.response.data?.Message || error.response.data?.message;

        setErrorMessage(msg);

        if (error.response?.data?.redirectTo) {
          setTimeout(() => {
            navigate(error.response.data.redirectTo);
          }, 1500); // Optional delay before redirect
        }
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" onSubmit={handleLogin} role="form">
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && (
                <MDTypography variant="caption" color="error">
                  {emailError}
                </MDTypography>
              )}
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && (
                <MDTypography variant="caption" color="error">
                  {passwordError}
                </MDTypography>
              )}
              {errorMessage && (
                <MDTypography variant="caption" color="error">
                  {errorMessage}
                </MDTypography>
              )}
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                sign in
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;

