import axios from "axios";
import { backendUrl } from "../conf/conf";

export class SavedService {

    async toggleSavedPost({ postId}) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
           if(!postId){
               throw new Error(400, "Post id is required");
           }
           const response = await axios.post(`${backendUrl}/api/v1/saved/toggle/${postId}`,{},{
                headers: {
                     Authorization: `Bearer ${accessToken} ${refreshToken}`,
                }
              });
              return response.data;
        } catch (error) {
            console.log("Error in toggling saved post " ,error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    }

    async getSavedPost({ page=1,limit=10 }) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            const response = await axios.get(`${backendUrl}/api/v1/saved?page=${page}&limit=${limit}`,{
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`,
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error in getting saved posts " ,error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    }

    
}

export const savedService = new SavedService();