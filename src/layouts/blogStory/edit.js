// import React, { useState, useEffect } from "react";
// import Grid from "@mui/material/Grid";
// import Card from "@mui/material/Card";
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import MDButton from "components/MDButton";
// import MDSnackbar from "components/MDSnackbar";
// import { MuiFileInput } from "mui-file-input";
// import AttachFileIcon from "@mui/icons-material/AttachFile";
// import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";


// // Data
// import { useMaterialUIController } from "context";
// import axios from "axios";
// // Updated imports for Edit page
// import { useNavigate, useParams } from "react-router-dom";
// import InputAdornment from "@mui/material/InputAdornment";
// import { IconButton } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import MDInput from "components/MDInput";
// import { logout } from "layouts/common";
// import { blogCategory } from "layouts/staticData";

// function Edit_story() {
//     // Hooks for navigation and getting URL parameters
//     const navigate = useNavigate();
//     const {id} = useParams();
//     console.log("useParams()", useParams());
//     console. log("Editing story with ID:", id);

//     const token = localStorage.getItem("authToken");
//     const [controller] = useMaterialUIController();
//     const { sidenavColor } = controller;

//     // State for form fields
//     const [storyImage, setStoryImage] = useState(null); // For new image file
//     const [category, setCategory] = useState("");
//     const [title, setTitle] = useState("");
//     const [description, setDescription] = useState("");
//     const [previewUrl, setPreviewUrl] = useState(""); // To show existing or new image preview

//     // State for notifications and errors
//     const [successSB, setSuccessSB] = useState(false);
//     const [error, setError] = useState("");
//     const [errors, setErrors] = useState({})

//     // Fetch existing story data on component mount
//     useEffect(() => {
//         const fetchStoryData = async () => {
//             try {
//                console.log("Fetching story data for ID:", id);
// const response = await axios.get(
//   `${process.env.REACT_APP_BASE_URL}api/admin/get-blog-story/${id}`,
//   {
//     headers: {
//       "Authorization": `Bearer ${token}`,
//     },
//   }
// );
//                 if (response.data && response.data.data) {
//                     const storyData = response.data.data;
//                     setTitle(storyData.title);
//                     setCategory(storyData.category);
//                     setDescription(storyData.description);
//                     setPreviewUrl(storyData.image); // Set existing image URL for preview
//                 }
//             } catch (error) {
//                 console.error("Failed to fetch story data:", error);
//                 if (error?.response?.data?.Message === 'jwt expired') {
//                     logout(navigate);
//                 }
//             }
//         };

//         if (id) {
//             fetchStoryData();
//         }
//     }, [id, token, navigate]);


//     // Handle file change
//     const handleChangefile = (newFile) => {
//         if (newFile && newFile.type.startsWith("image/")) {
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 const img = new Image();
//                 img.onload = () => {
//                     if (img.width >= 360 && img.height >= 335) {
//                         setStoryImage(newFile);
//                         setPreviewUrl(URL.createObjectURL(newFile)); // Update preview with new image
//                         setError("");
//                     } else {
//                         setError("Small Image, Image must be at least 335x360 pixels.");
//                         setStoryImage(null);
//                         // Do not clear previewUrl here, so the old image remains visible
//                     }
//                 };
//                 img.src = e.target.result;
//             };
//             reader.readAsDataURL(newFile);
//         } else {
//             setError("Please select a valid image file.");
//             setStoryImage(null);
//         }
//     };

//     const handleRemoveImage = () => {
//         setStoryImage(null);
//         // In edit mode, removing should maybe revert to the original image,
//         // but for simplicity, we clear the preview. User would need to reload to see original.
//         // A better UX might store the original URL separately. For now, let's clear it.
//         setPreviewUrl("");
//     };

//     const handleUpdate = async () => {
//         let allError = {}

//         if (!title?.trim()) {
//             allError.title = "Please Enter title";
//         }

//         if (!category) {
//             allError.category = "Please Select Category.";
//         }

//         if (!description?.trim()) {
//             allError.description = "Please Add Description.";
//         }

//         if (Object.keys(allError).length > 0) {
//             setErrors(allError);
//             return;
//         }

//         // Image is not mandatory for an update
//         const formData = new FormData();
//         // Only append the image if a new one was selected
//         if (storyImage) {
//             formData.append("image", storyImage);
//         }
//         formData.append("_id", id); // Include the story ID in the form data
//         formData.append("title", title);
//         formData.append("category", category);
//         formData.append("description", description);

//         try {
//             const response = await axios.patch(
//                 // Use the update endpoint with the story ID
//                 `${process.env.REACT_APP_BASE_URL}api/admin/update-blog-story/${id}`,
//                 formData,
//                 {
//                     headers: {
//                         "Authorization": `Bearer ${token}`,
//                         "Content-Type": "multipart/form-data",
//                     },
//                 }
//             );
//             if (response.status === 200) {
//                 setSuccessSB(true);
//                 navigate("/blog-story"); // Navigate back to the list after successful update
//             } else {
//                 setError("Failed to update the story.");
//             }
//         } catch (error) {
//             console.error("Error updating story:", error);
//             if (error?.response?.data?.Message === 'jwt expired') {
//                 logout(navigate);
//             }
//         }
//     };

//     return (
//         <DashboardLayout>
//             <DashboardNavbar />
//             <MDBox pt={6} pb={3}>
//                 <Grid container spacing={6}>
//                     <Grid item xs={12}>
//                         <Card>
//                             <MDBox
//                                 mx={2}
//                                 mt={-3}
//                                 py={3}
//                                 px={2}
//                                 variant="gradient"
//                                 bgColor={sidenavColor}
//                                 borderRadius="lg"
//                                 coloredShadow="info"
//                             >
//                                 <MDTypography variant="h6" color="white">
//                                     Edit Blog Story
//                                 </MDTypography>
//                             </MDBox>
//                             <MDBox pt={5} mx={2}>
//                                 <MDBox component="form" role="form" sx={{ minHeight: "60vh" }}>
//                                     <Grid container spacing={3}>
//                                         {/* Category Select */}
//                                         <Grid item xs={12} md={6} xl={4} display="flex" justifyContent="center">
//                                             <MDBox mb={2} width='100%'>
//                                                 <FormControl fullWidth>
//                                                     <InputLabel id="category-label">Category</InputLabel>
//                                                     <Select
//                                                         labelId="category-label"
//                                                         value={category}
//                                                         onChange={(e) => {
//                                                             setCategory(e.target.value);
//                                                             setErrors((prev) => ({ ...prev, category: "" }));
//                                                         }}
//                                                         label="Category"
//                                                         sx={{ height: "45px" }}
//                                                     >
//                                                         {blogCategory?.map((cat) => (
//                                                             <MenuItem key={cat} value={cat}>
//                                                                 {cat}
//                                                             </MenuItem>
//                                                         ))}
//                                                     </Select>
//                                                 </FormControl>
//                                                 {errors.category && (
//                                                     <div style={{ color: "red", fontSize: "12px", fontWeight: 350, marginTop: "8px" }}>{errors.category}</div>
//                                                 )}
//                                             </MDBox>
//                                         </Grid>

//                                         {/* Title Input */}
//                                         <Grid item xs={12} md={6} xl={4} display="flex" justifyContent="center">
//                                             <MDBox mb={2} width='100%'>
//                                                 <MDInput
//                                                     type="text"
//                                                     label="Title"
//                                                     fullWidth
//                                                     value={title}
//                                                     onChange={(e) => {
//                                                         setTitle(e.target.value);
//                                                         setErrors((prev) => ({ ...prev, title: "" }));
//                                                     }}
//                                                 />
//                                                 {errors.title && (
//                                                     <div style={{ color: "red", fontSize: "12px", fontWeight: 350, marginTop: "8px" }}>{errors.title}</div>
//                                                 )}
//                                             </MDBox>
//                                         </Grid>

//                                         {/* Description Input */}
//                                         <Grid item xs={12} md={6} xl={4} display="flex" justifyContent="center">
//                                             <MDBox mb={2} width='100%'>
//                                                 <MDInput
//                                                     type="text"
//                                                     label="Description"
//                                                     fullWidth
//                                                     multiline
//                                                     minRows={4}
//                                                     value={description}
//                                                     onChange={(e) => {
//                                                         setDescription(e.target.value);
//                                                         setErrors((prev) => ({ ...prev, description: "" }));
//                                                     }}
//                                                 />
//                                                 {errors.description && (
//                                                     <div style={{ color: "red", fontSize: "12px", fontWeight: 350, marginTop: "8px" }}>{errors.description}</div>
//                                                 )}
//                                             </MDBox>
//                                         </Grid>

//                                         {/* Image Upload and Preview */}
//                                         <Grid item xs={12} md={6} xl={4} mt={1} display="flex" flexDirection='column' alignItems="center">
//                                             <MDBox mb={2} width='100%' display="flex" flexDirection="column">
//                                                 <MuiFileInput
//                                                     value={storyImage}
//                                                     onChange={handleChangefile}
//                                                     placeholder="Upload New Image (Optional)"
//                                                     fullWidth
//                                                     InputProps={{
//                                                         startAdornment: (
//                                                             <InputAdornment position="start">
//                                                                 <AttachFileIcon sx={{ marginRight: 1, color: "#757575" }} />
//                                                             </InputAdornment>
//                                                         ),
//                                                     }}
//                                                 />
//                                                 {error && (
//                                                     <div style={{ color: "red", fontSize: "12px", fontWeight: 350, marginTop: "8px" }}>{error}</div>
//                                                 )}
//                                             </MDBox>
//                                             {previewUrl && (
//                                                 <MDBox mt={1} sx={{ textAlign: "center" }}>
//                                                     <img
//                                                         src={previewUrl}
//                                                         alt="Story Preview"
//                                                         style={{
//                                                             width: "360px",
//                                                             height: "335px",
//                                                             objectFit: "cover",
//                                                             borderRadius: "8px",
//                                                             marginTop: "8px",
//                                                         }}
//                                                     />
//                                                     <MDBox mt={1}>
//                                                         <IconButton onClick={handleRemoveImage} color="error" size="small" sx={{ ml: 1 }}>
//                                                             <DeleteIcon />
//                                                         </IconButton>
//                                                     </MDBox>
//                                                 </MDBox>
//                                             )}
//                                         </Grid>
//                                     </Grid>
//                                     <MDBox mt={4} mb={1} sx={{ textAlign: "center" }}>
//                                         <MDButton variant="gradient" color="info" onClick={handleUpdate}>
//                                             Update Story
//                                         </MDButton>
//                                     </MDBox>
//                                 </MDBox>
//                             </MDBox>
//                         </Card>
//                     </Grid>
//                 </Grid>
//             </MDBox>
//             {/* Success Snackbar */}
//             <MDSnackbar
//                 color="success"
//                 icon="check"
//                 title="Story Update"
//                 content="Story updated successfully!"
//                 dateTime="Just now"
//                 open={successSB}
//                 onClose={() => setSuccessSB(false)}
//                 close={() => setSuccessSB(false)}
//                 bgWhite
//             />
//         </DashboardLayout>
//     );
// }

// export default Edit_story;
import React, { useState, useEffect } from "react";
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
import { FormControl, InputLabel, Select, MenuItem, InputAdornment, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MDInput from "components/MDInput";
import { useMaterialUIController } from "context";
import { useNavigate, useParams } from "react-router-dom";
import { logout } from "layouts/common";
import { blogCategory } from "layouts/staticData";
import axios from "axios";

function Edit_story() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from route
  const token = localStorage.getItem("authToken");

  const [controller] = useMaterialUIController();
  const { sidenavColor } = controller;

  const [storyImage, setStoryImage] = useState(null);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  console.log("Final previewUrl:", previewUrl);

  

  const [successSB, setSuccessSB] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchStoryData = async () => {
      try {
        console.log("Fetching story data for ID:", id); // Debugging log
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}api/admin/get-blog-story/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data?.data) {
          const storyData = response.data.data;
          setTitle(storyData.title);
          setCategory(storyData.category);
          setDescription(storyData.description);
        //   setPreviewUrl(storyData.image);
         if (storyData.image) {
        setPreviewUrl(`${process.env.REACT_APP_BASE_URL}${storyData.image}`);
        }
            
        }
    
      } catch (error) {
        console.error("Failed to fetch story data:", error?.response || error);
        if (error?.response?.data?.Message === "jwt expired") {
          logout(navigate);
        }
      }
    };

    if (id) fetchStoryData();
  }, [id, token, navigate]);

  const handleChangefile = (newFile) => {
    if (newFile && newFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          if (img.width >= 360 && img.height >= 335) {
            setStoryImage(newFile);
            setPreviewUrl(URL.createObjectURL(newFile));
            setError("");
          } else {
            setError("Image must be at least 335x360 pixels.");
            setStoryImage(null);
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(newFile);
    } else {
      setError("Please select a valid image file.");
      setStoryImage(null);
    }
  };

  const handleRemoveImage = () => {
    setStoryImage(null);
    setPreviewUrl("");
  };

  const handleUpdate = async () => {
    let allError = {};

    if (!title?.trim()) allError.title = "Please Enter Title";
    if (!category) allError.category = "Please Select Category";
    if (!description?.trim()) allError.description = "Please Add Description";

    if (Object.keys(allError).length > 0) {
      setErrors(allError);
      return;
    }

    const formData = new FormData();
    if (storyImage) formData.append("image", storyImage);
    formData.append("_id", id);
    formData.append("title", title);
    formData.append("category", category);
    formData.append("description", description);

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}api/admin/update-blog-story/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setSuccessSB(true);
        navigate("/blog-story");
      } else {
        setError("Failed to update the story.");
      }
    } catch (error) {
      console.error("Error updating story:", error?.response || error);
      if (error?.response?.data?.Message === "jwt expired") {
        logout(navigate);
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
                  Edit Blog Story
                </MDTypography>
              </MDBox>

              <MDBox pt={5} mx={2}>
                <MDBox component="form" role="form" sx={{ minHeight: "60vh" }}>
                  <Grid container spacing={3}>
                    {/* Category */}
                    <Grid item xs={12} md={6} xl={4}>
                      <FormControl fullWidth>
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                          labelId="category-label"
                          value={category}
                          onChange={(e) => {
                            setCategory(e.target.value);
                            setErrors((prev) => ({ ...prev, category: "" }));
                          }}
                          label="Category"
                          sx={{ height: "45px" }}
                        >
                          {blogCategory.map((cat) => (
                            <MenuItem key={cat} value={cat}>
                              {cat}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.category && (
                          <div style={{ color: "red", fontSize: "12px", marginTop: 8 }}>
                            {errors.category}
                          </div>
                        )}
                      </FormControl>
                    </Grid>

                    {/* Title */}
                    <Grid item xs={12} md={6} xl={4}>
                      <MDInput
                        type="text"
                        label="Title"
                        fullWidth
                        value={title}
                        onChange={(e) => {
                          setTitle(e.target.value);
                          setErrors((prev) => ({ ...prev, title: "" }));
                        }}
                      />
                      {errors.title && (
                        <div style={{ color: "red", fontSize: "12px", marginTop: 8 }}>
                          {errors.title}
                        </div>
                      )}
                    </Grid>

                    {/* Description */}
                    <Grid item xs={12} md={6} xl={4}>
                      <MDInput
                        type="text"
                        label="Description"
                        fullWidth
                        multiline
                        minRows={4}
                        value={description}
                        onChange={(e) => {
                          setDescription(e.target.value);
                          setErrors((prev) => ({ ...prev, description: "" }));
                        }}
                      />
                      {errors.description && (
                        <div style={{ color: "red", fontSize: "12px", marginTop: 8 }}>
                          {errors.description}
                        </div>
                      )}
                    </Grid>

                    {/* Image Upload */}
                    <Grid item xs={12} md={6} xl={4}>
                      <MDBox>
                        <MuiFileInput
                          value={storyImage}
                          onChange={handleChangefile}
                          placeholder="Upload New Image (Optional)"
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <AttachFileIcon sx={{ marginRight: 1, color: "#757575" }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                        {error && (
                          <div style={{ color: "red", fontSize: "12px", marginTop: 8 }}>
                            {error}
                          </div>
                        )}
                      </MDBox>

                      {/* Image Preview */}
                      {previewUrl && (
                        <MDBox mt={2} sx={{ textAlign: "center" }}>
                          <img
                            src={previewUrl}
                            alt="Story Preview"
                            style={{
                              width: "360px",
                              height: "335px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                          <IconButton onClick={handleRemoveImage} color="error" size="small">
                            <DeleteIcon />
                          </IconButton>
                        </MDBox>
                      )}
                    </Grid>
                  </Grid>

                  <MDBox mt={4} mb={1} sx={{ textAlign: "center" }}>
                    <MDButton variant="gradient" color="info" onClick={handleUpdate}>
                      Update Story
                    </MDButton>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      <MDSnackbar
        color="success"
        icon="check"
        title="Story Update"
        content="Story updated successfully!"
        dateTime="Just now"
        open={successSB}
        onClose={() => setSuccessSB(false)}
        close={() => setSuccessSB(false)}
        bgWhite
      />
    </DashboardLayout>
  );
}

export default Edit_story;
