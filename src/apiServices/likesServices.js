import axios from "axios";
import conf from '../conf/conf';

export class LikesService {

    async toggleLikePost({postId}) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if (!postId) {
                throw new Error("Post id is required");
            }
            const response = await axios.post(`${conf.backendUrl}/api/v1/likes/toggle-post/${postId}`,{},{
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.log('Error in toggleLikePost', error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    }


    async toggleLikeComment({commentId}) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if (!commentId) {
                throw new Error("Comment id is required");
            }
            const response = await axios.post(`${conf.backendUrl}/api/v1/likes/toggle-comment/${commentId}`,{},{
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.log('Error in toggleLikeComment', error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    }

    async toggleLikeReply({replyId}) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if (!replyId) {
                throw new Error("Reply id is required");
            }
            const response = await axios.post(`${conf.backendUrl}/api/v1/likes/toggle-reply/${replyId}`,{},{
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.log('Error in toggleLikeReply', error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    }

    async getProfilesWhoLikePost({postId,page=1,limit=20}) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if (!postId) {
                throw new Error("Post id is required");
            }
            const response = await axios.get(`${conf.backendUrl}/api/v1/likes/profiles/${postId}?page=${page}&limit=${limit}`,{
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.log('Error in getProfilesWhoLikePost', error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    }
}

export const likesService = new LikesService();