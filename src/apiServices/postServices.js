import axios from "axios";
import { backendUrl } from "../conf/conf";

export class PostService{

    async createPost({ title="",content="", type="blog", visibility="public",asset }){
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            const formData = new FormData();
            if(asset){
                formData.append('asset',asset);
            }
            formData.append('title',title);
            formData.append('content',content);
            formData.append('type',type);
            formData.append('visibility',visibility);

          const response = await axios.post(`${backendUrl}/api/v1/post/create`, formData,
            {
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`,
                }
            });
        return response.data;
        }catch (error) {
            console.log("Error in creating post " ,error);
            return {status:error.status,message:error.message,data:null};
        }
    }

    async forkPosts( postId,visibility="public",title="" ){
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if(!postId){
                throw new Error(400, "Post Id is required to fork post");
            }
            const response = await axios.post(`${backendUrl}/api/v1/post/fork`, {
                postId,
                visibility,
                title
            },{
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`,
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error in forking post " ,error);
            return {status:error.status,message:error.message,data:null};
        }
    }

    async updatePost({newTitle, newContent, newVisibility,postId}){
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if(!postId){
                throw new Error(400, "Post Id is required to update post");
            }
            if(!newTitle && !newContent && !newVisibility){
                throw new Error(400, "At least one field is required to update post");
            }
           const response = await axios.patch(`${backendUrl}/api/v1/post/update/${postId}`, {
            title: newTitle, 
            content: newContent, 
            visibility: newVisibility
            },{
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`,
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error in updating post " ,error);
            return {status:error.status,message:error.message,data:null};
        }
    }


    async deletePost({postId}){
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if(!postId){
                throw new Error(400, "Post Id is required to delete post");
            }
            const response = await axios.delete(`${backendUrl}/api/v1/post/delete/${postId}`,{
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`,
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error in deleting post " ,error);
            return {status:error.status,message:error.message,data:null};
        }
    }



    async getPost({postId}){
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if(!postId){
                throw new Error(400, "Post Id is required to get post");
            }
            const response = await axios.get(`${backendUrl}/api/v1/post/get/${postId}`,{
                headers: {
                    Authorization: `Bearer ${accessToken} {refreshToken}`,
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error in getting post " ,error);
            return {status:error.status,message:error.message,data:null};  
        }
    }


    async getAllPosts({page=1,limit=20,type='all'}){
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            const response = await axios.get(`${backendUrl}/api/v1/post/get-all?page=${page}&limit=${limit}&type=${type}`,{
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`,
                }
            });
            return response.data
            
        } catch (error) {
         console.log("Error in getting all posts " ,error);
            return {status:error.status,message:error.message,data:null};
        }
    }
}


export const postService = new PostService();