import axios from "axios";
import conf from '../conf/conf';

export class FollowersService {

    async toggleFollowUser({profileId}) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if (!profileId) {
                throw new Error("Profile id is required");
            }
            const response = await axios.post(`${conf.backendUrl}/api/v1/followers/toggle-follow/${profileId}`,{},{
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.log('Error in getallComments', error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    }

    async getAllFollowers({username, page=1, limit=30}) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if (!username) {
                throw new Error("Username is required");
            }
            const response = await axios.get(`${conf.backendUrl}/api/v1/followers/followers/${username}?page=${page}&limit=${limit}`, {
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.log('Error in getallComments', error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    } 

    async getAllFollowings({username, page=1, limit=30}) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if (!username) {
                throw new Error("Username is required");
            }
            const response = await axios.get(`${conf.backendUrl}/api/v1/followers/followings/${username}?page=${page}&limit=${limit}`, {
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.log('Error in getallComments', error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    }

    async getSuggestedUsers({page=1, limit=30}) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            const response = await axios.get(`${conf.backendUrl}/api/v1/followers/suggested?page=${page}&limit=${limit}`, {
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.log('Error in getallComments', error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    }

}

export const followersService = new FollowersService();