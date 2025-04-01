import axios from "axios";
import conf from '../conf/conf';

export class MessageService {

    async sendMessage({receiverId,message}){
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if(!receiverId){
                throw new Error('receiverId is required');
            }
            if(!message){
                throw new Error('message is required');
            }
            const response = await axios.post(`${conf.backendUrl}/api/v1/message/send/${receiverId}`,{
                message
            },{
                headers:{
                    Authorization:`Bearer ${accessToken} ${refreshToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error in send message",error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    }

    async getMessage({receiverId}){
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if(!receiverId){
                throw new Error('receiverId is required');
            }
            const response = await axios.get(`${conf.backendUrl}/api/v1/message/${receiverId}`,{
                headers:{
                    Authorization:`Bearer ${accessToken} ${refreshToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error in send message",error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    }
    
}

export const messageService = new MessageService();