import axios from "axios";
import conf from '../conf/conf';

export class PostService{

    async createPost({ title="",content="", type="blog", visibility="public",asset,updateProgress=null }){
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            const formData = new FormData();
            if(asset){
                formData.append('asset',asset,asset.name);
            }
            formData.append('title',title);
            formData.append('content',content);
            formData.append('type',type);
            formData.append('visibility',visibility);

          const response = await axios.post(`${conf.backendUrl}/api/v1/post/create`, formData,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken} ${refreshToken}`,
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    if(updateProgress){
                        updateProgress(percentCompleted);
                    }
                }
            
            });
        return response.data;
        }catch (error) {
            console.log("Error in creating post " ,error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    }

    async forkPosts( postId,visibility="public",title="" ){
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if(!postId){
                throw new Error(400, "Post Id is required to fork post");
            }
            const response = await axios.post(`${conf.backendUrl}/api/v1/post/fork`, {
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
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
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
           const response = await axios.patch(`${conf.backendUrl}/api/v1/post/update/${postId}`, {
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
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    }


    async deletePost({postId}){
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if(!postId){
                throw new Error(400, "Post Id is required to delete post");
            }
            const response = await axios.delete(`${conf.backendUrl}/api/v1/post/delete/${postId}`,{
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`,
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error in deleting post " ,error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    }



    async getPost({postId}){
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if(!postId){
                throw new Error(400, "Post Id is required to get post");
            }
            const response = await axios.get(`${conf.backendUrl}/api/v1/post/get/${postId}`,{
                headers: {
                    Authorization: `Bearer ${accessToken} {refreshToken}`,
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error in getting post " ,error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};  
        }
    }


    async getAllPosts({page=1,limit=20,type='all'}){
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            const response = await axios.get(`${conf.backendUrl}/api/v1/post/get-all?page=${page}&limit=${limit}&type=${type}`,{
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`,
                }
            });
            return response.data
            
        } catch (error) {
         console.log("Error in getting all posts " ,error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    }

    async getPostDetailsForUpdate({postId}){
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if(!postId){
                throw new Error(400, "Post Id is required to get post details for update");
            }
            const response = await axios.get(`${conf.backendUrl}/api/v1/post/get-update/${postId}`,{
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`,
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error in getting post details for update " ,error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    }
}


export const postService = new PostService();