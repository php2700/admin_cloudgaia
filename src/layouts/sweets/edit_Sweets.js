import React, { useEffect, useState } from "react";
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


// Data
import { useMaterialUIController } from "context";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import InputAdornment from "@mui/material/InputAdornment";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MDInput from "components/MDInput";
import { sweetsData } from "layouts/staticData/index";
import Delete_Image from "./delete_image";
import { logout } from "layouts/common";


function Edit_Sweets() {
    const location = useLocation();
    const navigate = useNavigate();
    const { sweetData } = location.state || {};

    const token = localStorage.getItem("authToken");
    const [controller] = useMaterialUIController();
    const { sidenavColor } = controller;

    // State for image file and success message
    const [sweetsImage, setSweetsImage] = useState(null);
    const [amount, setAmount] = useState(null);
    const [category, setCategory] = useState(null);
    const [name, setName] = useState(null);
    const [_id, setId] = useState();
    const [open, setOpen] = useState(false)
    const [description, setDescription] = useState(null);

    const [previewUrl, setPreviewUrl] = useState("");
    const [successSB, setSuccessSB] = useState(false);
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({})

    const sweetsList = sweetsData;
    const handleChangefile = (newFile) => {
        if (newFile && newFile.type.startsWith("image/")) {

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    if (img.width >= 360 && img.height >= 335) {
                        setSweetsImage(newFile);
                        setPreviewUrl(URL.createObjectURL(newFile))
                        setError("");
                    } else {
                        setError("Small Image,Image must be at least 335x360 pixels.");
                        setSweetsImage(null);
                        setPreviewUrl("");
                    }
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(newFile);
        } else {
            setError("Please select a valid image file.");
            setSweetsImage(null);
            setPreviewUrl("");
        }
    };

    useEffect(() => {
        setId(sweetData?._id)
        setName(sweetData?.name)
        setAmount(sweetData?.amount)
        setCategory(sweetData?.category)
        setSweetsImage(sweetData?.image)
        setDescription(sweetData?.description)
        if (sweetData?.image) {
            setPreviewUrl(`${process.env.REACT_APP_BASE_URL}uploads/${sweetData?.image}`);
        }
    }, [sweetData]);

    const handleRemoveImage = () => {
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false)
    }

    const handleConfirmRemoveImage = () => {
        setSweetsImage(null);
        setPreviewUrl("");
        setOpen(false)
    }

    const handleSubmit = async () => {
        let allError = {}



        if (!name) {
            allError.name = "Please Enter Sweet Name"
        } else if (!name?.trim()) {
            allError.name = "Please Enter Sweet Name"
        } else if (!/^[a-zA-Z\s]*$/.test(name)) {
            allError.name = "Please Enter Valid Sweet Name"
        }

        if (!amount) {
            allError.amount = "Please Enter  Amount."
        } else if (!amount?.trim()) {
            allError.amount = "Please Enter  Amount."
        }

        if (!category) {
            allError.category = "Please Select Category."
        }

        if (!description) {
            allError.description = "Please Add Description.";
        } else if (!description?.trim()) {
            allError.description = "Please Enter Sweet description"
        }

        if (Object?.keys(allError)?.length > 0) {
            setErrors(allError)
            if (!sweetsImage) {
                setError("Please upload an Image.");
            }
            return
        }


        if (!sweetsImage) {
            setError("Please upload Image.");
            return;
        }

        const formData = new FormData();
        formData.append("_id", _id)
        formData.append("name", name);
        let formattedAmount;
        if (amount.includes('kg')) {
            formattedAmount = `${amount}`;
        } else {
            formattedAmount = `${amount}/kg`;
        }
        formData.append("amount", formattedAmount);
        formData.append("category", category);
        formData.append("description", description)
        if (sweetsImage && sweetsImage !== sweetData?.image) {
            formData.append("image", sweetsImage);
        }

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
            if (response.status === 200) {
                setSuccessSB(true);
                setSweetsImage(null);
                setId("")
                setName("");
                setAmount("");
                setDescription("")
                setCategory("");
                setErrors({});
                navigate("/sweets")
            } else {
                setError("Failed to upload the image.");
            }
        } catch (error) {
            if (error?.response?.data?.Message === 'jwt expired') {
                logout(navigate)
            }
            console.error("Error uploading banner:", error);
            // setError("Error uploading the image.");
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
                                    Edit Sweets
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={5} mx={2}>
                                <MDBox component="form" role="form" sx={{ minHeight: "60vh" }}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6} xl={4} display='flex' justifyContent='center'>
                                            <MDBox mb={2} width='100%'>
                                                <FormControl fullWidth>
                                                    <InputLabel id="client-name-label" sx={{ paddingTop: "8px" }}>
                                                        Category
                                                    </InputLabel>
                                                    <Select
                                                        labelId="client-name-label"
                                                        value={category || ""}
                                                        onChange={(e) => {
                                                            setCategory(e.target.value)
                                                            setErrors((prev) => ({ ...prev, category: "" }));
                                                        }}
                                                        label="Client Name"
                                                        sx={{ height: "45px", marginTop: "8px" }}
                                                    >
                                                        {sweetsList.map((sweets) => (
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
                                        <Grid item xs={12} md={6} xl={4} display="flex" justifyContent="center" >
                                            <MDBox mb={2} width='100%'>
                                                <MDInput
                                                    type="text"
                                                    label="Sweet Name"
                                                    fullWidth
                                                    value={name || ""}
                                                    onChange={(e) => {
                                                        setName(e.target.value)
                                                        setErrors((prev) => ({ ...prev, name: "" }))
                                                    }}
                                                    sx={{ marginTop: "8px" }}
                                                />
                                                {errors.name && (
                                                    <div style={{ color: "red", fontSize: "12px", fontWeight: 350, marginTop: "8px" }}>{errors.name}</div>
                                                )}
                                            </MDBox>
                                        </Grid>
                                        <Grid item xs={12} md={6} xl={4} display='flex' justifyContent='center'>
                                            <MDBox mb={2} width='100%'>
                                                <MDInput
                                                    type="text"
                                                    label="Amount Per kg"
                                                    fullWidth
                                                    value={amount?.split('/')[0] || ""}
                                                    onChange={(e) => {
                                                        let newAmount = e.target.value;
                                                        if (/^\d*$/.test(newAmount)) {
                                                            setAmount(newAmount)
                                                            setErrors((prev) => ({ ...prev, amount: "" }))
                                                        }
                                                    }
                                                    }
                                                    sx={{ marginTop: "8px" }}
                                                />
                                                {errors.amount && (
                                                    <div style={{ color: "red", fontSize: "12px", fontWeight: 350, marginTop: "8px" }}>{errors.amount}</div>
                                                )}
                                            </MDBox>
                                        </Grid>

                                        <Grid item xs={12} md={6} xl={4} mt={1}
                                            display='flex'
                                            flexDirection='column'
                                            alignItems="center"
                                        >
                                            <MDBox mb={2}
                                                width='100%'
                                                display="flex"
                                                flexDirection="column"
                                            >
                                                <MuiFileInput
                                                    // value={sweetsImage || null}
                                                    value={sweetsImage instanceof File ? sweetsImage : null}

                                                    onChange={handleChangefile}
                                                    // placeholder="Upload Image"
                                                    placeholder={
                                                        !previewUrl && !sweetsImage
                                                            ? "Upload Sweet Image"
                                                            : previewUrl
                                                                ? "Edit Sweet Image"
                                                                : "Replace Image"
                                                    }
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
                                                <MDBox mt={2} sx={{ textAlign: "center" }}>
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
                                                            {sweetsImage?.name}
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
                                                <MDInput
                                                    type="text"
                                                    label="Box Description"
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

                                    </Grid>
                                    <MDBox mt={4} mb={1} sx={{ textAlign: "center" }}>
                                        <MDButton variant="gradient" color="info" onClick={handleSubmit}>
                                            Edit
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
            <Delete_Image
                open={open}
                handleClose={handleClose}
                removeImage={handleConfirmRemoveImage}
            />
        </DashboardLayout>
    );
}

export default Edit_Sweets;
