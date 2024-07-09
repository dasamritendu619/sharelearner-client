import axios from "axios";
import { backendUrl } from "../conf/conf";

export class LikesService {

    async toggleLikePost({postId}) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if (!postId) {
                throw new Error("Post id is required");
            }
            const response = await axios.post(`${backendUrl}/api/v1/likes/toggle-post/${postId}`,{},{
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.log('Error in toggleLikePost', error);
            return {status:error.status, message:error.message,data:null};
        }
    }


    async toggleLikeComment({commentId}) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if (!commentId) {
                throw new Error("Comment id is required");
            }
            const response = await axios.post(`${backendUrl}/api/v1/likes/toggle-comment/${commentId}`,{},{
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.log('Error in toggleLikeComment', error);
            return {status:error.status, message:error.message,data:null};
        }
    }

    async toggleLikeReply({replyId}) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if (!replyId) {
                throw new Error("Reply id is required");
            }
            const response = await axios.post(`${backendUrl}/api/v1/likes/toggle-reply/${replyId}`,{},{
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.log('Error in toggleLikeReply', error);
            return {status:error.status, message:error.message,data:null};
        }
    }

    async getProfilesWhoLikePost({postId}) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if (!postId) {
                throw new Error("Post id is required");
            }
            const response = await axios.get(`${backendUrl}/api/v1/likes/profiles/${postId}`,{
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.log('Error in getProfilesWhoLikePost', error);
            return {status:error.status, message:error.message,data:null};
        }
    }
}

export const likesService = new LikesService();