import axios from 'axios';
import conf from '../conf/conf';

export class AuthService {

    async registerUser({ username, email, password, fullName }) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if (!username || !email || !password || !fullName) {
                throw new Error('All fields are required');
            }
            const response = await axios.post(`${conf.backendUrl}/api/v1/user/register`,{
                username,
                email,
                password,
                fullName
            },{
                headers:{
                    "Authorization":`Bearer ${accessToken} ${refreshToken}`,
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error in registerUser",error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    }


    async verifyUser({otp , identifier}) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if(!otp || !identifier){
                throw new Error('All fields are required');
            }
            console.log(otp),
            console.log(identifier)
            const response = await axios.post(`${conf.backendUrl}/api/v1/user/verify`,{
                otp,
                identifier
            },{
                headers:{
                    Authorization:`Bearer ${accessToken} ${refreshToken}`
                }
            });
            if (response.data.status >=400 || !response.data.data) {
                throw new Error(response.data.message);
            }
            localStorage.setItem("accessToken",response.data.data.accessToken);
            localStorage.setItem("refreshToken",response.data.data.refreshToken);

            return response.data;
        } catch (error) {
            console.log("Error in verifyUser",error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    }


    async loginUser({ identifier, password }) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if (!identifier || !password) {
                throw new Error('All fields are required');
            }
            const response = await axios.post(`${conf.backendUrl}/api/v1/user/login`,{
                identifier,
                password
            },{
                headers:{
                    Authorization:`Bearer ${accessToken} ${refreshToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error in loginUser",error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    }


    async logoutUser() {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            const response = await axios.post(`${conf.backendUrl}/api/v1/user/logout`,{},{
                headers:{
                    Authorization:`Bearer ${accessToken} ${refreshToken}`
                }
            });
            return response.data;
        }
        catch (error) {
            console.log("Error in logoutUser",error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    }


    async getCurrentUser() {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
       
        try {
            if (!accessToken || !refreshToken) {
                throw new Error('Access token or refresh token is missing');
            }
            const response = await axios.get(`${conf.backendUrl}/api/v1/user/me`,{
                headers:{
                    Authorization:`Bearer ${accessToken} ${refreshToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error in getCurrentUser",error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    }

    
    async getCurrentUserDetails() {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
       
        try {
            const response = await axios.get(`${conf.backendUrl}/api/v1/user/me/details`,{
                headers:{
                    Authorization:`Bearer ${accessToken} ${refreshToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error in getCurrentUser",error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    }


    async refreshAccessToken() {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if(!refreshToken){
                throw new Error('refresh token is missing');
            }
            const response = await axios.post(`${conf.backendUrl}/api/v1/user/refresh`,{},{
                headers:{
                    Authorization:`Bearer ${accessToken} ${refreshToken}`
                }
            });
            
            if (response.data.status >=400 || !response.data.data) {
                throw new Error(response.data.message);
            }
            localStorage.setItem("accessToken",response.data.data.accessToken);

            return response.data;
            
        } catch (error) {
            console.log("Error in refreshAccessToken",error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    }


    async changePassword({oldPassword, newPassword}) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if (!oldPassword || !newPassword) {
                throw new Error('All fields are required');
            }
            const response = await axios.patch(`${conf.backendUrl}/api/v1/user/change-password`,{
                oldPassword,
                newPassword
            },{
                headers:{
                    Authorization:`Bearer ${accessToken} ${refreshToken}`
                }
            });
            return response.data;
            
        } catch (error) {
            console.log("Error in changePassword",error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    }


    async sendForgotPasswordEmail({email}) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if(!email){
                throw new Error('email is required');
            }
            const response = await axios.post(`${conf.backendUrl}/api/v1/user/forgot-password`,{
                email
            },{
                headers:{
                    Authorization:`Bearer ${accessToken} ${refreshToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error in sendForgotPasswordEmail",error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    }

    
    async resetPassword({otp, email, newPassword}) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
           if(!otp || !email || !newPassword){
               throw new Error('All fields are required');
           }
           const response = await axios.patch(`${conf.backendUrl}/api/v1/user/verify-reset-password`,{
               otp,
               email,
               newPassword
           },{
               headers:{
                   Authorization:`Bearer ${accessToken} ${refreshToken}`
               }
           });
           return response.data; 
        } catch (error) {
            console.log("Error in resetPassword",error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    }


    async sendEmailForUpdateEmailRequest({newEmail }) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if(!newEmail){
                throw new Error('email is required');
            }
            const response = await axios.post(`${conf.backendUrl}/api/v1/user/update-email`,{
                email:newEmail
            },{
                headers:{
                    Authorization:`Bearer ${accessToken} ${refreshToken}`
                }
            });
            return response.data;
        } catch (error) {
           console.log("Error in sendEmailForUpdateEmailRequest",error);
              return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null}; 
        }
    }


    async changeEmail({otp, newEmail}) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if(!otp || !newEmail){
                throw new Error('All fields are required');
            }
            const response = await axios.post(`${conf.backendUrl}/api/v1/user/verify-change-email`,{
                otp,
                email:newEmail
            },{
                headers:{
                    Authorization:`Bearer ${accessToken} ${refreshToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error in changeEmail",error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    }


    async updateUserDetails({fullName,dob,gender,education,about,address,links,interest}) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if (!fullName && !dob && !gender && !education && !about && !address && !links && !interest) {
                throw new Error(400, "Atleast one field is required");
            }
            const response = await axios.patch(`${conf.backendUrl}/api/v1/user/update-details`,{
                fullName,
                dob,
                gender,
                education,
                about,
                address,
                links,
                interest
            },{
                headers:{
                    Authorization:`Bearer ${accessToken} ${refreshToken}`
                }
            });
            return response.data;
        } catch (error) {
           console.log("Error in updateUserDetails",error);
              return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null}; 
        }
    }


    async updateAvatar({avatar}) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if (!avatar) {
                throw new Error(400, "Avatar URL is required");
            }
            const formData = new FormData();
            formData.append('avatar',avatar,'avatar.jpeg');
            const response = await axios.patch(`${conf.backendUrl}/api/v1/user/update-avatar`,formData,{
                headers:{   
                    Authorization:`Bearer ${accessToken} ${refreshToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error in updateAvatar",error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    }


    async updateCoverPhoto({coverPhoto}) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if (!coverPhoto) {
                throw new Error(400, "Cover Photo URL is required");
            }
            const formData = new FormData();
            formData.append('coverPhoto',coverPhoto,'coverPhoto.jpeg');
            const response = await axios.patch(`${conf.backendUrl}/api/v1/user/update-cover-photo`,formData,{
                headers:{
                    Authorization:`Bearer ${accessToken} ${refreshToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error in updateCoverPhoto",error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    }


    async checkUserNameAvailability({username}) {
        try {
           if(!username){
               throw new Error('username is required');
           }
           const response = await axios.get(`${conf.backendUrl}/api/v1/user/check-username/${username}`);
           return response.data;
        } catch (error) {
            console.log("Error in checkUserNameAvailability",error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    }


    async getProfile({username}) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if(!username){
                throw new Error('username is required');
            }
            const response = await axios.get(`${conf.backendUrl}/api/v1/user/${username}`,{
                headers:{
                    Authorization:`Bearer ${accessToken} ${refreshToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error in getProfile",error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    }


}

export const authService = new AuthService();