import axios from "axios";
import { backendUrl } from '../conf/conf';



export class MemberService {

    async toggleAdminRole({userId, groupId}){
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if(!userId){
                throw new Error(400, "User id is required");
            }
            if(!groupId){
                throw new Error(400, "Group id is required");
            }
            const response = await axios.patch(`${backendUrl}/api/v1/member/toggle-admin-role/${groupId}/${userId}`,{},{
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`,
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error in toggling admin role " ,error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    
    }



    async addGroupMember({userId, groupId}){
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if(!userId){
                throw new Error(400, "User id is required");
            }
            if(!groupId){
                throw new Error(400, "Group id is required");
            }
            const response = await axios.post(`${backendUrl}/api/v1/member/add-member/${groupId}/${userId}`,{},{
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`,
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error in adding member " ,error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    
    }


    async addUserUsingAdminId({groupId, adminId }){
        const accessToken = localStorage.getItem('accessToken');    
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if(!adminId){
                throw new Error(400, "Admin id is required");
            }
            if(!groupId){
                throw new Error(400, "Group id is required");
            }
            const response = await axios.post(`${backendUrl}/api/v1/member/join-group/${groupId}/${adminId}`,{},{
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`,
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error in adding user using admin id " ,error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    
    }


    async leftGroup({groupId }){
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if(!groupId){
                throw new Error(400, "Group id is required");
            }
            const response = await axios.delete(`${backendUrl}/api/v1/member/leave-group/${groupId}`,{
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`,
                }
            });
            return response.data;
            
        } catch (error) {
            console.log("Error in leaving group " ,error);
            return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    
    }


    async removeMember({groupId, userId }){
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if(!userId){
                throw new Error(400, "User id is required");
            }
            if(!groupId){
                throw new Error(400, "Group id is required");
            }
            const response = await axios.delete(`${backendUrl}/api/v1/member/remove-member/${groupId}/${userId}`,{
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`,
                }
            });
            return response.data;
        } catch (error) {
                console.log("Error in removing member " ,error);
                return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
        }
    
    }
}

export const memberService = new MemberService();