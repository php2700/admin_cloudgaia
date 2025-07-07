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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Switch from '@mui/material/Switch';
import { logout } from "layouts/common";
import Delete_Story from "./delete";

const label = { inputProps: { 'aria-label': 'Switch demo' } };

function Overview() {
    const navigate = useNavigate();
    const [controller] = useMaterialUIController();
    const { sidenavColor } = controller;
    const [blogData, setBlogData] = useState([]);
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
    const [per_page, setPer_page] = useState(10);
    const [current_page, setCurrentpage] = useState("");
    const [open, setOpen] = useState(false);
    const [sweetId, setSweetId] = useState();


    const token = localStorage.getItem("authToken");
    const getblogData = async (page, search) => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_BASE_URL}api/admin/blog_list`,
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
            const datas = response?.data?.blogData?.data;
            setTotal_rows(response?.data?.blogData?.total);
            setFirstpageurl(response?.data?.blogData?.first_page_url);
            setFrom(response?.data?.blogData?.from);
            setLastpage(response?.data?.blogData?.last_page);
            setLastpageurl(response?.data?.blogData?.last_page_url);
            setLinks(response?.data?.blogData?.links);
            setNextpageurl(response?.data?.blogData?.next_page_url);
            setPath(response?.data?.blogData?.path);
            setPer_page(response?.data?.blogData?.per_page);
            setPrevpageurl(response?.data?.blogData?.prev_page_url);
            setTotal(response?.data?.blogData?.total);
            setCurrentpage(response?.data?.blogData?.current_page);

            const modifiedData = datas.map((blog) => {
                return {
                    _id: blog._id,
                    image: blog?.image,
                    title: blog?.title,
                    category: blog?.category,
                    description: blog?.description,
                };
            });

            setBlogData(modifiedData);
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
        getblogData(newPage, searchText);
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
        getblogData(newPage, searchText);
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
                                        Add Blog Story
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={3}>
                                    <MDBox mx={2} mb={2}>
                                        <Link to={`/add-blog-story`}>
                                            <MDButton
                                                component="a"
                                                rel="noreferrer"
                                                variant="gradient"
                                                color={sidenavColor}
                                            >
                                                Add Story
                                            </MDButton>
                                        </Link>
                                    </MDBox>
                                    {blogData?.length === 0 ? (
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
                                                            Header: "Title ",
                                                            accessor: "Title",
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

                                                        { Header: "Edit", accessor: "Edit", align: "left" },
                                                        { Header: "Action", accessor: "Action", align: "left" },
                                                    ],

                                                    rows: blogData.map((blog, index) => ({
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
                                                            >{console.log(`${process.env.REACT_APP_BASE_URL}${blog?.image}`)}
                                                                <img
                                                                    src={`${process.env.REACT_APP_BASE_URL}${blog?.image}`}
                                                                    alt="Banner"
                                                                    style={{ width: "100px", height: "100px", borderRadius: "5px" }}
                                                                />
                                                            </MDTypography>
                                                        ),
                                                        Title: (
                                                            (
                                                                <MDTypography
                                                                    component="a"
                                                                    variant="caption"
                                                                    color="text"
                                                                    fontWeight="medium"
                                                                    
                                                                    sx={{
                                                                        overflow: 'hidden',
                                                                        with:'100%',
                                                                        textOverflow: 'ellipsis',
                                                                        display: '-webkit-box',
                                                                        WebkitLineClamp: '2',
                                                                        WebkitBoxOrient: 'vertical',
                                                                         wordBreak: 'break-word',
                                                                    }}
                                                                >
                                                                    {blog?.title}
                                                                </MDTypography>
                                                            )
                                                        ),
                                                        Description: (
                                                            <MDTypography
                                                                component="a"
                                                                variant="caption"
                                                                color="text"
                                                                fontWeight="medium"
                                                            >
                                                                {blog?.description}
                                                            </MDTypography>
                                                        ),
                                                        Category: (
                                                            <MDTypography
                                                                component="a"
                                                                variant="caption"
                                                                color="text"
                                                                fontWeight="medium"
                                                            >
                                                                {blog?.category}
                                                            </MDTypography>
                                                        ),
                                                        Edit: (
                                                            <Link to={`/edit-blog-story/${blog._id}`}
                                                                state={{ blogData: blog }}
                                                            >
                                                                <MDTypography
                                                                    component="span"
                                                                    variant="caption"
                                                                    fontWeight="medium"
                                                                    // onClick={() => handleEdit(blog)}
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
                                                                onClick={() => handleDelete(blog._id)}
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
            <Delete_Story
                open={open}
                handleClose={handleClose}
                data={getblogData}
                id={sweetId}
            />
        </>
    );
}

export default Overview;
