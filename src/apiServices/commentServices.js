import axios from 'axios';
import {backendUrl} from '../conf/conf'

export class CommentService {

    async createComment({postId, content}){
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if (!postId) {
                throw new Error("Post id is required");   
            }
            if (!content) {
                throw new Error("Content is required");   
            }
            const response = await axios.post(`${backendUrl}/api/v1/comment/create`, {postId, content}, {
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`
                }
            });

            return response.data;
        } catch (error) {
            console.log('Error in createComment', error);
            return {status:error.status, message:error.message,data:null};
        }
    }


    async updateComment({commentId, content}){
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if (!commentId) {
                throw new Error("Comment id is required");   
            }
            if (!content) {
                throw new Error("Content is required");   
            }
            const response = await axios.patch(`${backendUrl}/api/v1/comment/update/${commentId}`, {content}, {
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`
                }
            });

            return response.data;
        } catch (error) {
            console.log('Error in updateComment', error);
            return {status:error.status, message:error.message,data:null};
        }
    }


    async deleteComment({commentId}){
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if (!commentId) {
                throw new Error("Comment id is required");   
            }
            const response = await axios.delete(`${backendUrl}/api/v1/comment/delete/${commentId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`
                }
            });

            return response.data;
        } catch (error) {
            console.log('Error in deleteComment', error);
            return {status:error.status, message:error.message,data:null};
        }
    }


    async getallComments({postId,page=1,limit=20}){
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if (!postId) {
                throw new Error("Post id is required");   
            }
            const response = await axios.get(`${backendUrl}/api/v1/comment/getall/${postId}?page=${page}&limit=${limit}`, 
                {
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`
                }
            });

            return response.data;
        } catch (error) {
            console.log('Error in getallComments', error);
            return {status:error.status, message:error.message,data:null};
        }
    }
    
}

export const commentService=new CommentService();