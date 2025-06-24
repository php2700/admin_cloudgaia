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
import MDButton from "components/MDButton";
import MDPagination from "components/MDPagination";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import axios from "axios";
import { useMaterialUIController } from "context";
import Delete_Sweets from "./delete_sweets";
import Edit_Sweets from "./edit_Sweets";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Description } from "@mui/icons-material";
import Switch from '@mui/material/Switch';
import View_Description from "./view_desc";
import { logout } from "layouts/common";

const label = { inputProps: { 'aria-label': 'Switch demo' } };

function Overview() {
    const navigate = useNavigate();
    const [controller] = useMaterialUIController();
    const { sidenavColor } = controller;
    const [sweetsData, setSweetsData] = useState([]);
    const [newPage, setNewPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [total_rows, setTotal_rows] = useState("");
    const [first_page_url, setFirstpageurl] = useState("");
    const [from, setFrom] = useState("");
    const [last_page, setLastpage] = useState("");
    const [last_page_url, setLastpageurl] = useState("");
    const [next_page_url, setNextpageurl] = useState("");
    const [links, setLinks] = useState("");
    const [total, setTotal] = useState("");
    const [prev_page_url, setPrevpageurl] = useState("");
    const [search, setSearch] = useState("");
    const [path, setPath] = useState("");
    const [error, setError] = useState();
    const [viewData, setViewData] = useState();
    const [viewOpen, setViewOpen] = useState(false);


    const [opendetailsmodel, setOpenDetailsModel] = useState(false);
    const [clientDetails, setClientDetails] = useState([]);
    const [showModel, setShowModel] = useState(false);
    const [per_page, setPer_page] = useState(10);
    const [current_page, setCurrentpage] = useState("");
    const [open, setOpen] = useState(false);
    const [sweetId, setSweetId] = useState();
    const [editSweetData, setEditSweetData] = useState();
    const [editModelOpen, setEditModelOpen] = useState(false);

    const token = localStorage.getItem("authToken");
    const getSweetsData = async (page, search) => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_BASE_URL}api/admin/sweets_list`,
                {
                    params: {
                        page: page,
                        search: search,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const datas = response?.data?.sweetsData?.data;
            setTotal_rows(response?.data?.sweetsData?.total);
            setFirstpageurl(response?.data?.sweetsData?.first_page_url);
            setFrom(response?.data?.sweetsData?.from);
            setLastpage(response?.data?.sweetsData?.last_page);
            setLastpageurl(response?.data?.sweetsData?.last_page_url);
            setLinks(response?.data?.sweetsData?.links);
            setNextpageurl(response?.data?.sweetsData?.next_page_url);
            setPath(response?.data?.sweetsData?.path);
            setPer_page(response?.data?.sweetsData?.per_page);
            setPrevpageurl(response?.data?.sweetsData?.prev_page_url);
            setTotal(response?.data?.sweetsData?.total);
            setCurrentpage(response?.data?.sweetsData?.current_page);

            const modifiedData = datas.map((sweet) => {
                return {
                    _id: sweet._id,
                    image: sweet?.image,
                    name: sweet?.name,
                    amount: sweet?.amount,
                    category: sweet?.category,
                    description: sweet?.description,
                    isWedding: sweet?.isWedding,
                    isSweet: sweet?.isSweet,
                    isBestSeller: sweet?.isBestSeller
                };
            });

            console.log(modifiedData, '2222')
            setSweetsData(modifiedData);
        } catch (error) {
            if (error?.response?.data?.Message === 'jwt expired') {
                logout(navigate)
            }
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setNewPage(page);
        }
    };

    const ApiCall = () => {
        getSweetsData(newPage, searchText);
    };
    // Calculate the total number of pages based on the data you receive
    const totalPages = Math.ceil(total_rows / per_page);
    const maxPageNumbers = 5;
    const currentPage = current_page; // Example: Replace with your current page
    const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
    const endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

    const pageNumbers = Array.from(
        { length: endPage - startPage + 1 },
        (_, index) => startPage + index
    );

    useEffect(() => {
        getSweetsData(newPage, searchText);
    }, [newPage, searchText]);

    const handleDelete = (id) => {
        setSweetId(id)
        setOpen(true);
    }


    const handleClose = () => {
        setOpen(false);
    };

    const handleview = (viewData) => {
        setViewData(viewData)
        setViewOpen(true)
    }

    const handleViewClose = () => {
        setViewOpen(false);
    }


    const handleUpdate = async (formData) => {
        try {
            const response = await axios.patch(
                `${process.env.REACT_APP_BASE_URL}api/admin/update_sweets`,
                formData,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (response.status === 200)
                ApiCall()
        } catch (error) {
            console.error("Error uploading banner:", error);
            setError("Error uploading the image.");
        }

    }

    const handleDashboardSweet = (sweetData) => {
        const updatedSweet = sweetData?.isSweet === true || sweetData?.isSweet === 'true' ? 'false' : 'true';

        const formData = new FormData();
        formData.append("_id", sweetData?._id)
        formData.append("isSweet", updatedSweet);
        formData.append("name", sweetData?.name);
        formData.append("amount", sweetData?.amount);
        formData.append("description", sweetData?.description)
        formData.append("category", sweetData?.category);
        handleUpdate(formData)
    }

    const handleDashboardWedding = (sweetsData) => {
        const updatedIsWedding = sweetsData?.isWedding === true || sweetsData?.isWedding === 'true' ? 'false' : 'true';

        const formData = new FormData();
        formData.append("_id", sweetsData?._id)
        formData.append("isWedding", updatedIsWedding);
        formData.append("name", sweetsData?.name);
        formData.append("amount", sweetsData?.amount);
        formData.append("category", sweetsData?.category);
        formData.append("description", sweetsData?.description);
        handleUpdate(formData)
    }

    const handleBestSeller = (sweetsData) => {
        const updetedBestseller = sweetsData?.isBestSeller === true || sweetsData?.isBestSeller === 'true' ? 'false' : 'true';
        const formData = new FormData();
        formData.append("_id", sweetsData?._id)
        formData.append("isBestSeller", updetedBestseller);
        formData.append("name", sweetsData?.name);
        formData.append("amount", sweetsData?.amount);
        formData.append("category", sweetsData?.category);
        formData.append("description", sweetsData?.description);
        handleUpdate(formData)
    }

    return (
        <>
            <DashboardLayout>
                <DashboardNavbar />
                <MDBox pt={6} pb={3}>
                    <Grid container spacing={6}>
                        <Grid item xs={12}>
                            <Card>
                                <MDBox
                                    mx={2}
                                    mt={-3}
                                    py={3}
                                    px={2}
                                    variant="gradient"
                                    bgColor={sidenavColor}
                                    borderRadius="lg"
                                    coloredShadow="info"
                                >
                                    <MDTypography variant="h6" color="white">
                                        Sweets
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={3}>
                                    <MDBox mx={2} mb={2}>
                                        <Link to={`/add-sweets`}>
                                            <MDButton
                                                component="a"
                                                rel="noreferrer"
                                                variant="gradient"
                                                color={sidenavColor}
                                            >
                                                Add Sweets
                                            </MDButton>
                                        </Link>
                                    </MDBox>
                                    {sweetsData?.length === 0 ? (
                                        <p style={{ textAlign: "center", fontWeight: "500", paddingBottom: "10px" }}>
                                            No Data Found
                                        </p>
                                    ) : (
                                        <div>
                                            <DataTable
                                                table={{
                                                    columns: [
                                                        { Header: "ID", accessor: "orderId", width: "1%", align: "left" },
                                                        {
                                                            Header: "Image ",
                                                            accessor: "Image",
                                                            width: "15%",
                                                            align: "left",
                                                        },
                                                        {
                                                            Header: "Name ",
                                                            accessor: "Name",
                                                            width: "15%",
                                                            align: "left",
                                                        },
                                                        {
                                                            Header: "Amount ",
                                                            accessor: "Amount",
                                                            width: "15%",
                                                            align: "left",
                                                        },
                                                        {
                                                            Header: "Category ",
                                                            accessor: "Category",
                                                            width: "15%",
                                                            align: "left",
                                                        },
                                                        {
                                                            Header: "Description ",
                                                            accessor: "Description",
                                                            width: "15%",
                                                            align: "left",
                                                        },
                                                        { Header: "DashboardSweet", accessor: "DashboardSweet", align: "left" },
                                                        { Header: "DashboardWedding", accessor: "DashboardWedding", align: "left" },
                                                        { Header: "BestSeller", accessor: "BestSeller", align: "left" },

                                                        { Header: "Edit", accessor: "Edit", align: "left" },
                                                        { Header: "Action", accessor: "Action", align: "left" },
                                                    ],

                                                    rows: sweetsData.map((sweet, index) => ({
                                                        orderId: (
                                                            <MDTypography
                                                                component="a"
                                                                variant="caption"
                                                                color="text"
                                                                fontWeight="medium"
                                                            >
                                                                {index + 1}
                                                            </MDTypography>
                                                        ),
                                                        Image: (
                                                            <MDTypography
                                                                component="a"
                                                                variant="caption"
                                                                color="text"
                                                                fontWeight="medium"
                                                            >
                                                                <img
                                                                    src={`${process.env.REACT_APP_BASE_URL}uploads/${sweet?.image}`}
                                                                    alt="Banner"
                                                                    style={{ width: "100px", height: "100px", borderRadius: "5px" }}
                                                                />
                                                            </MDTypography>
                                                        ),
                                                        Name: (
                                                            <MDTypography
                                                                component="a"
                                                                variant="caption"
                                                                color="text"
                                                                fontWeight="medium"
                                                            >
                                                                {sweet?.name}
                                                            </MDTypography>
                                                        ),
                                                        Amount: (
                                                            <MDTypography
                                                                component="a"
                                                                variant="caption"
                                                                color="text"
                                                                fontWeight="medium"
                                                            >
                                                                {sweet?.amount}
                                                            </MDTypography>
                                                        ),
                                                        Description: (
                                                            // <MDTypography
                                                            //     component="a"
                                                            //     variant="caption"
                                                            //     color="text"
                                                            //     fontWeight="medium"
                                                            // >
                                                            //     {sweet?.description}
                                                            // </MDTypography>
                                                            <MDButton variant="gradient" color="info" onClick={() => { handleview(sweet?.description) }}>
                                                                view
                                                            </MDButton>
                                                        ),
                                                        DashboardSweet: (
                                                            <MDTypography
                                                                component="a"
                                                                variant="caption"
                                                                color="text"
                                                                fontWeight="medium"
                                                            >
                                                                <Switch {...label}
                                                                    onChange={() => handleDashboardSweet(sweet)}
                                                                    // defaultChecked={sweet?.isSweet == 'true' ? true : false} />
                                                                    checked={sweet?.isSweet === true || sweet?.isSweet === "true"} />
                                                            </MDTypography>
                                                        ),
                                                        DashboardWedding: (
                                                            <MDTypography
                                                                component="a"
                                                                variant="caption"
                                                                color="text"
                                                                fontWeight="medium"
                                                            >
                                                                <Switch {...label} onChange={() => handleDashboardWedding(sweet)}
                                                                    checked={sweet?.isWedding === true || sweet?.isWedding === "true"} />
                                                            </MDTypography>
                                                        ),
                                                        BestSeller: (
                                                            <MDTypography
                                                                component="a"
                                                                variant="caption"
                                                                color="text"
                                                                fontWeight="medium"
                                                            >
                                                                <Switch {...label} onChange={() => handleBestSeller(sweet)}
                                                                    checked={sweet?.isBestSeller === true || sweet?.isBestSeller === "true"} />
                                                            </MDTypography>
                                                        ),
                                                        Category: (
                                                            <MDTypography
                                                                component="a"
                                                                variant="caption"
                                                                color="text"
                                                                fontWeight="medium"
                                                            >
                                                                {sweet?.category}
                                                            </MDTypography>
                                                        ),
                                                        Edit: (
                                                            <Link to={`/edit-sweets`}
                                                                state={{ sweetData: sweet }}
                                                            >
                                                                <MDTypography
                                                                    component="span"
                                                                    variant="caption"
                                                                    fontWeight="medium"
                                                                    // onClick={() => handleEdit(sweet)}
                                                                    sx={{
                                                                        cursor: "pointer",
                                                                        textDecoration: "none",
                                                                        fontSize: '18px'
                                                                    }}
                                                                >
                                                                    <EditIcon />
                                                                </MDTypography>
                                                            </Link>
                                                        ),
                                                        Action: (
                                                            <MDTypography
                                                                component="span"
                                                                variant="caption"
                                                                color="error"
                                                                fontWeight="medium"
                                                                onClick={() => handleDelete(sweet._id)}
                                                                sx={{
                                                                    cursor: "pointer",
                                                                    textDecoration: "none",
                                                                    fontSize: '18px'
                                                                }}
                                                            >
                                                                <DeleteIcon />
                                                            </MDTypography>
                                                        ),
                                                    })),
                                                }}
                                                isSorted={false}
                                                entriesPerPage={false}
                                                showTotalEntries={false}
                                                noEndBorder
                                            />
                                            <div className="page_number">
                                                <MDPagination>
                                                    <MDPagination
                                                        item
                                                        key="prev"
                                                        onClick={() => handlePageChange(current_page - 1)}
                                                    >
                                                        <span className="admin_paginetions_iocn">
                                                            <MdKeyboardArrowLeft />
                                                        </span>
                                                    </MDPagination>

                                                    {pageNumbers.map((pageNumber) => (
                                                        <MDPagination
                                                            item
                                                            key={pageNumber}
                                                            active={pageNumber === current_page}
                                                            onClick={() => handlePageChange(pageNumber, search)}
                                                        >
                                                            {pageNumber}
                                                        </MDPagination>
                                                    ))}

                                                    <MDPagination
                                                        item
                                                        key="next"
                                                        onClick={() => handlePageChange(current_page + 1)}
                                                    >
                                                        <span className="admin_paginetions_iocn">
                                                            <MdKeyboardArrowRight />
                                                        </span>
                                                    </MDPagination>
                                                </MDPagination>
                                            </div>
                                        </div>
                                    )}
                                </MDBox>
                            </Card>
                        </Grid>
                    </Grid>
                </MDBox>
            </DashboardLayout>
            <Delete_Sweets
                open={open}
                handleClose={handleClose}
                data={getSweetsData}
                id={sweetId}
            />
            <View_Description
                open={viewOpen}
                handleClose={handleViewClose}
                data={viewData}
            />
        </>
    );
}

export default Overview;
