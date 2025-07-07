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
import MDSnackbar from "components/MDSnackbar";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MasterCard from "examples/Cards/MasterCard";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";

// Billing page components

import { Card } from "@mui/material";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMaterialUIController } from "context";
import { logout } from "layouts/common";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import MDButton from "components/MDButton";

const label = { inputProps: { 'aria-label': 'Switch demo' } };

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block'],
        ['link'],
        ['clean'],
    ],
};

const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet',
    'blockquote', 'code-block', 'link',
];

function CookieSetting() {
    const [controller] = useMaterialUIController();
    const { sidenavColor } = controller;
    const [content, setContent] = useState('');
    const [successSB, setSuccessSB] = useState(false);

    const token = localStorage.getItem("authToken");
    const getCookieSettingData = async () => {
        try {
            await axios
                .get(`${process.env.REACT_APP_BASE_URL}api/user/cookie-setting`)
                .then((res) => {
                    setContent(res?.data?.cookiesettingData?.description)
                })
                .catch((error) => {
                    console.log(error);
                });
        } catch (err) {
            console.error("Unexpected error:", err);
        }
    };

    useEffect(() => {
        getCookieSettingData();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const cookieData = {
            description: content
        };

        axios.post(`${process.env.REACT_APP_BASE_URL}api/admin/cookie-setting`, cookieData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            setSuccessSB(true);
            getCookieSettingData();
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <>
            <DashboardLayout>
                <DashboardNavbar />
                <MDBox pt={6} pb={3}>
                    <Grid container spacing={6}>
                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", boxShadow: "1px 1px 1px 1px #888888", background: 'white', width: '60% ', padding: '20px', borderRadius: '10px', gap: '5px' }}>
                                <MDTypography variant="h6" mt={2} mb={2}>
                                    Cookie Setting
                                </MDTypography>
                                <MDBox mb={2} width='100%' sx={{
                                    borderRadius: "6px",
                                }}>
                                    <ReactQuill
                                        value={content}
                                        onChange={setContent}
                                        modules={modules}
                                        formats={formats}
                                        theme="snow"
                                        placeholder="Blog Detail"
                                        style={{
                                            height: "250px",
                                        }}
                                    />
                                </MDBox>
                                <MDBox mt={6} mb={1} sx={{ textAlign: "center" }}>
                                    <MDButton variant="gradient" color="info" onClick={handleSubmit}>
                                        Add Cookie Setting
                                    </MDButton>
                                </MDBox>
                            </div>
                        </Grid>
                    </Grid>
                </MDBox>
            </DashboardLayout>
            <MDSnackbar
                color="success"
                icon="check"
                title="Privacy Policy"
                content="Privacy Policy Added Successfully!"
                dateTime="0 Sec ago"
                open={successSB}
                onClose={() => setSuccessSB(false)}
                close={() => setSuccessSB(false)}
                bgWhite
            />
        </>
    );
}

export default CookieSetting;
