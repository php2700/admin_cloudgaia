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

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts

import Dashboard from "layouts/dashboard";

import Sweets from "layouts/sweets";
import SignIn from "layouts/authentication/sign-in";

// @mui icons
import Icon from "@mui/material/Icon";
import Overview from "layouts/blogStory";
import Add_story from "layouts/blogStory/add";
import Edit_Story from "layouts/blogStory/edit";
import Contact from "layouts/contact";
import Career from "layouts/career";
import Innovation from "layouts/innovation";
import Growth from "layouts/growth";
import Implementation from "layouts/implemention";
import Optimization from "layouts/optimization";
import BlogComment from "layouts/blogComment";
import PrivacyPolicy from "layouts/privacyPolicy";
import CookieSetting from "layouts/cookieSetting";


const routes = [
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },

  {
    type: "collapse",
    name: "Blog Stories",
    key: "blog Stories",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/blog-story",
    component: <Overview />,
  },

  {
    type: "collapse",
    name: "Add Blog Story",
    key: "add-blog-story",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/add-blog-story",
    component: <Add_story />,
  },
  {
    type: "collapse",
    name: "Edit Blog Story",
    key: "edit-blog-story",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/edit-blog-story/:id",
    component: <Edit_Story />,
  },
  {
    type: "collapse",
    name: "contact",
    key: "contact",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/contact",
    component: <Contact />,
  },
  {
    type: "collapse",
    name: "career",
    key: "career",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/career",
    component: <Career />,
  },
  {
    type: "collapse",
    name: "innovation",
    key: "innovation",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/innovation",
    component: <Innovation />,
  },
  {
    type: "collapse",
    name: "growth",
    key: "growth",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/growth",
    component: <Growth />,
  },

  {
    type: "collapse",
    name: "implementation",
    key: "implementation",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/implementation",
    component: <Implementation />,
  },
  {
    type: "collapse",
    name: "optimization",
    key: "optimization",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/optimization",
    component: <Optimization />,
  },
  {
    type: "collapse",
    name: "privacyPolicy",
    key: "privacyPolicy",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/privacyPolicy",
    component: <PrivacyPolicy />,
  },
  {
    type: "collapse",
    name: "cookieSetting",
    key: "cookieSetting",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/cookieSetting",
    component: <CookieSetting />,
  },
  // {
  //   type: "collapse",
  //   name: "blog-comments",
  //   key: "blog-comments",
  //   icon: <Icon fontSize="small">person</Icon>,
  //   route: "/blog-comments",
  //   component: <BlogComment />,
  // },

];

export default routes;

