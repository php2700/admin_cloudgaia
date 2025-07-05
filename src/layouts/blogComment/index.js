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

const label = { inputProps: { 'aria-label': 'Switch demo' } };

function BlogComment() {
    const navigate = useNavigate();
    const [controller] = useMaterialUIController();
    const { sidenavColor } = controller;
    const [blogCommentData, setBlogCommentData] = useState([]);
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
    const getBlogCommentData = async (page, search) => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_BASE_URL}api/admin/blog-comments`,
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
            const datas = response?.data?.blogCommentData?.data;
            setTotal_rows(response?.data?.blogCommentData?.total);
            setFirstpageurl(response?.data?.blogCommentData?.first_page_url);
            setFrom(response?.data?.blogCommentData?.from);
            setLastpage(response?.data?.blogCommentData?.last_page);
            setLastpageurl(response?.data?.blogCommentData?.last_page_url);
            setLinks(response?.data?.blogCommentData?.links);
            setNextpageurl(response?.data?.blogCommentData?.next_page_url);
            setPath(response?.data?.blogCommentData?.path);
            setPer_page(response?.data?.blogCommentData?.per_page);
            setPrevpageurl(response?.data?.blogCommentData?.prev_page_url);
            setTotal(response?.data?.blogCommentData?.total);
            setCurrentpage(response?.data?.blogCommentData?.current_page);

            const modifiedData = datas.map((blogComment) => {
                return {
                    _id: blogComment._id,
                    name: blogComment?.name,
                    comment: blogComment?.comment,
                    image: blogComment?.blogId?.image,
                    userImg: blogComment?.image
                };
            });

            setBlogCommentData(modifiedData);
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
        getBlogCommentData(newPage, searchText);
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
        getBlogCommentData(newPage, searchText);
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
                                        Growth
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={3}>

                                    {blogCommentData?.length === 0 ? (
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
                                                            Header: "userProfile ",
                                                            accessor: "userProfile",
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
                                                            Header: "Comment ",
                                                            accessor: "Comment",
                                                            width: "15%",
                                                            align: "left",
                                                        },
                                                    ],

                                                    rows: blogCommentData.map((blog, index) => ({
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
                                                        userProfile: (
                                                            <MDTypography
                                                                component="a"
                                                                variant="caption"
                                                                color="text"
                                                                fontWeight="medium"
                                                            >{console.log(`${process.env.REACT_APP_BASE_URL}${blog?.userImg}`)}
                                                                <img
                                                                    src={`${process.env.REACT_APP_BASE_URL}${blog?.userImg}`}
                                                                    alt="user Img"
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
                                                                {blog?.name}
                                                            </MDTypography>
                                                        ),
                                                        Comment: (
                                                            (
                                                                <MDTypography
                                                                    component="a"
                                                                    variant="caption"
                                                                    color="text"
                                                                    fontWeight="medium"
                                                                >
                                                                    {blog?.comment}
                                                                </MDTypography>
                                                            )
                                                        ),

                                                        Country: (
                                                            <MDTypography
                                                                component="a"
                                                                variant="caption"
                                                                color="text"
                                                                fontWeight="medium"
                                                            >
                                                                {blog.country}
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
        </>
    );
}

export default BlogComment;
