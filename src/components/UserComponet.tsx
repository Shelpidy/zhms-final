// import React, {useEffect } from "react";
// import { Box, Grid, Typography } from "@mui/material";
// import ImgMediaCard from "./CardComponent"
// import UserCard from "./UserCard"
// import User from "../models/Users"
// import { GetAllUsers } from "@/app/actions";
// import UserDataTable from "./UserTableComp";
// const UserComponent: React.FC = () => {

//   const [users, setUsers] = React.useState<User[]>([]);
//   useEffect(() => {
//     // Fetch users using the GetAllUsers function
//     GetAllUsers()
//       .then((res) => {
//         // Check if the response is an array before setting the state
//         if (Array.isArray(res)) {
//           console.log(res);
//           setUsers(res);
//         } else {
//           console.error('Invalid response format: Expected an array of users');
//         }
//       })
//       .catch((error) => {
//         console.error('Error fetching users:', error);
//       });
//   }, []);

//     return (
//         <Box
//         sx={{
//             display: "flex",
//             justifyContent: "center", // Center horizontally
//             alignItems: "center", // Center vertically
//             flexDirection: "column", // Ensure content is stacked vertically
//           }}
//         >
//         <Box>
//          <Typography variant="h4" component="h1" gutterBottom>
//            Users
//          </Typography>
//        </Box>
//        <Box sx={{marginTop: 3, marginLeft: -2}}>
//         {
//           users.map((user) => {
//             return (
//               <Grid item xs={12} sm={6} key={user.userId}>
//                 {/* <ImgMediaCard user={user} /> */}
//               </Grid>
//             );
//           })
//         }
//      </Box>

//         </Box>
//     )
// }
// export default UserComponent
