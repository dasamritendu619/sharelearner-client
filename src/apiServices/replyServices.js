import axios from "axios";
import { backendUrl } from "../conf/conf";

export class ReplyService {


    async createReply({ content, commentId  }) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if(!commentId){
                throw new Error(400, "Comment id is required");
            }
            if(!content){
                throw new Error(400, "Content is required");
            }
            const response = await axios.post(`${backendUrl}/api/v1/reply/create`, { 
                content, 
                commentId },
                {
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`,
                }
            });
            return response.data;
            
        } catch (error) {
            console.log("Error in creating reply " ,error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    }


    async updateReply({ replyId ,newContent  }) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if(!replyId){
                throw new Error(400, "Reply id is required");
            }
            if(!newContent){
                throw new Error(400, "Content is required");
            }
            const response = await axios.patch(`${backendUrl}/api/v1/reply/update/${replyId}`, {
                content: newContent
            },{
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`,
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error in updating reply " ,error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    }


    async deleteReply({replyId }) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
           if(!replyId){
               throw new Error(400, "Reply id is required");
           }
              const response = await axios.delete(`${backendUrl}/api/v1/reply/delete/${replyId}`, {
                headers: {
                     Authorization: `Bearer ${accessToken} ${refreshToken}`,
                }
              });
              return response.data;
        } catch (error) {
            console.log("Error in deleting reply " ,error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    }

    async getAllReplies({ commentId,page=1, limit=20  }) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
          if(!commentId){
              throw new Error(400, "Comment id is required");
          }
            const response = await axios.get(`${backendUrl}/api/v1/reply/getAll/${commentId}?page=${page}&limit=${limit}`, {
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`,
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error in getting all replies " ,error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    }


}

export const replyService = new ReplyService();