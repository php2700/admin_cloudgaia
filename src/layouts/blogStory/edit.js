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


function Edit_story() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from route
  const token = localStorage.getItem("authToken");

  const [controller] = useMaterialUIController();
  const { sidenavColor } = controller;
  const [content, setContent] = useState('');
  const [storyImage, setStoryImage] = useState(null);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const [successSB, setSuccessSB] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchStoryData = async () => {
      try {
        console.log("Fetching story data for ID:", id);
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
          setContent(storyData?.content)
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
    if (!content) {
      allError.content = "Please Add Detail.";
    }

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
    formData.append("content", content)


    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}api/admin/update-blog-story`,
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
