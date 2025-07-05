import React, { useRef, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import { MuiFileInput } from "mui-file-input";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

import { useMaterialUIController } from "context";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InputAdornment from "@mui/material/InputAdornment";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MDInput from "components/MDInput";
import { logout } from "layouts/common";
import { blogCategory } from "layouts/staticData";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        ['clean'],
    ],
};

const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet',
    'blockquote', 'code-block', 'link', 'image',
];


function Add_story() {
    const navigate = useNavigate();
    const token = localStorage.getItem("authToken");
    const [controller] = useMaterialUIController();
    const { sidenavColor } = controller;
    const [storyImage, setStoryImage] = useState(null);
    const [category, setCategory] = useState(null);
    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [successSB, setSuccessSB] = useState(false);
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({})
    const [content, setContent] = useState('');

    const handleChangefile = (newFile) => {
        if (newFile && newFile.type.startsWith("image/")) {

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    if (img.width >= 360 && img.height >= 335) {
                        setStoryImage(newFile);
                        setPreviewUrl(URL.createObjectURL(newFile))
                        setError("");
                    } else {
                        setError("Small Image,Image must be at least 335x360 pixels.");
                        setStoryImage(null);
                        setPreviewUrl("");
                    }
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(newFile);
        } else {
            setError("Please select a valid image file.");
            setStoryImage(null);
            setPreviewUrl("");
        }
    };

    const handleRemoveImage = () => {
        setStoryImage(null);
        setPreviewUrl("");
    };

    const handleSubmit = async () => {
        let allError = {}

        if (!title) {
            allError.title = "Please Enter title"
        } else if (!title?.trim()) {
            allError.title = "Please Enter title"
        }

        if (!category) {
            allError.category = "Please Select Category."
        }

        if (!description) {
            allError.description = "Please Add Description.";
        } else if (!description?.trim()) {
            allError.description = "Please Add Description.";
        }

        if (!content) {
            allError.content = "Please Add Detail.";
        }

        if (Object?.keys(allError)?.length > 0) {
            setErrors(allError)
            if (!storyImage) {
                setError("Please upload an Image.");
            }
            return
        }

        if (!storyImage) {
            setError("Please upload an Image.");
            return;
        }




        const formData = new FormData();
        formData.append("image", storyImage);
        formData.append("title", title);
        formData.append("category", category);
        formData.append("description", description)
        formData.append("content", content)

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}api/admin/add-blog-story`,
                formData,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (response.status === 200) {
                setSuccessSB(true);
                setStoryImage(null);
                setTitle("");
                setCategory("");
                setDescription("");
                setErrors({});
                navigate("/blog-story")
            } else {
                setError("Failed to upload the image.");
            }
        } catch (error) {
            console.error("Error uploading banner:", error);
            // setError("Error uploading the image.");
            if (error?.response?.data?.Message === 'jwt expired') {
                logout(navigate)
            }
        }
    };

    return (
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
                            <MDBox pt={5} mx={2}>
                                <MDBox component="form" role="form" sx={{ minHeight: "60vh" }}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6} xl={4} display="flex" justifyContent="center">
                                            <MDBox mb={2} width='100%'>
                                                <FormControl fullWidth>
                                                    <InputLabel id="client-title-label" sx={{ paddingTop: "8px", paddingBottom: "3px" }}>
                                                        Category
                                                    </InputLabel>
                                                    <Select
                                                        labelId="client-title-label"
                                                        value={category}
                                                        onChange={(e) => {
                                                            setCategory(e.target.value)
                                                            setErrors((prev) => ({ ...prev, category: "" }));
                                                        }}
                                                        label="Client title"
                                                        sx={{ height: "45px", marginTop: "8px" }}
                                                    >
                                                        {blogCategory?.map((sweets) => (
                                                            <MenuItem key={sweets} value={sweets}>
                                                                {sweets}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                {errors.category && (
                                                    <div style={{ color: "red", fontSize: "12px", fontWeight: 350, marginTop: "8px" }}>{errors.category}</div>
                                                )}
                                            </MDBox>
                                        </Grid>

                                        <Grid item xs={12} md={6} xl={4} display="flex" justifyContent="center">
                                            <MDBox mb={2} width='100%'>
                                                <MDInput
                                                    type="text"
                                                    label="Title"
                                                    fullWidth
                                                    multiline   // ✅ Add this line
                                                    minRows={2} // ✅ Optional: sets minimum visible rows
                                                    value={title}
                                                    onChange={(e) => {
                                                        setTitle(e.target.value);
                                                        setErrors((prev) => ({ ...prev, title: "" }));
                                                    }}
                                                    sx={{ marginTop: "8px" }}
                                                />

                                                <br /> {/* <-- YAHAN EK EXTRA LINE BREAK ADD KIYA HAI */}

                                                {errors.title && (
                                                    <div style={{ color: "red", fontSize: "12px", fontWeight: 350, marginTop: "8px" }}>
                                                        {errors.title}
                                                    </div>
                                                )}
                                            </MDBox>
                                        </Grid>
                                        <Grid item xs={12} md={6} xl={4} display="flex" justifyContent="center">
                                            <MDBox mb={2} width='100%'>
                                                <MDInput
                                                    type="text"
                                                    label="Description"
                                                    fullWidth
                                                    multiline
                                                    minRows={4}
                                                    value={description}
                                                    onChange={(e) => {
                                                        setDescription(e.target.value)
                                                        setErrors((prev) => ({ ...prev, description: "" }))
                                                    }
                                                    }
                                                    sx={{ marginTop: "8px" }}
                                                />
                                                {errors.description && (
                                                    <div style={{ color: "red", fontSize: "12px", fontWeight: 350, marginTop: "8px" }}>{errors.description}</div>
                                                )}
                                            </MDBox>
                                        </Grid>
                                        <Grid item xs={12} md={6} xl={4} mt={1}
                                            display="flex"
                                            //  justifyContent="center"
                                            flexDirection='column'
                                            alignItems="center"
                                        >

                                            <MDBox mb={2} width='100%'
                                                display="flex"
                                                flexDirection="column"
                                            // alignItems="center" 
                                            >
                                                <MuiFileInput
                                                    value={storyImage}
                                                    onChange={handleChangefile}
                                                    placeholder="Upload Image"
                                                    fullWidth
                                                    minHeight={'450px'}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <AttachFileIcon sx={{ marginRight: 1, color: "#757575" }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                                {error && (
                                                    <div style={{ color: "red", fontSize: "12px", fontWeight: 350, marginTop: "8px" }}>
                                                        {error}
                                                    </div>
                                                )}
                                            </MDBox>
                                            {previewUrl && (
                                                <MDBox mt={1}
                                                    sx={{ textAlign: "center" }}
                                                >
                                                    <img
                                                        src={previewUrl}
                                                        alt="Preview"
                                                        style={{
                                                            width: "360px",
                                                            height: "335px",
                                                            objectFit: "cover",
                                                            borderRadius: "8px",
                                                            marginTop: "8px",
                                                        }}
                                                    />
                                                    <MDBox mt={1}>
                                                        <MDTypography variant="caption" color="text">
                                                            {storyImage?.title}
                                                        </MDTypography>
                                                        <IconButton
                                                            onClick={handleRemoveImage}
                                                            color="error"
                                                            size="small"
                                                            sx={{ ml: 1 }}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </MDBox>
                                                </MDBox>
                                            )}
                                        </Grid>


                                        <Grid item xs={12} md={6} xl={4} display="flex" justifyContent="center">
                                            <MDBox mb={2} width='100%'>
                                                <ReactQuill
                                                    value={content}
                                                    onChange={setContent}
                                                    modules={modules}
                                                    formats={formats}
                                                    theme="snow"
                                                    placeholder="Blog Detail"
                                                />
                                                {errors.content && (
                                                    <div style={{ color: "red", fontSize: "12px", fontWeight: 350, marginTop: "8px" }}>{errors.content}</div>
                                                )}
                                            </MDBox>
                                        </Grid>
                                    </Grid>
                                    <MDBox mt={4} mb={1} sx={{ textAlign: "center" }}>
                                        <MDButton variant="gradient" color="info" onClick={handleSubmit}>
                                            Upload Story
                                        </MDButton>
                                    </MDBox>
                                </MDBox>
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            {/* Success Snackbar */}
            <MDSnackbar
                color="success"
                icon="check"
                title="Banner Upload"
                content="Banner uploaded successfully!"
                dateTime="0 Sec ago"
                open={successSB}
                onClose={() => setSuccessSB(false)}
                close={() => setSuccessSB(false)}
                bgWhite
            />
        </DashboardLayout>
    );
}
export default Add_story;
