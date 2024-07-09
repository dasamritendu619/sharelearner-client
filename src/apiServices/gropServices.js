import axios from "axios";
import { backendUrl } from "../conf/conf";

export class GroupService {

    async createGroup({groupName, description, image}) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if (!groupName) {
                throw new Error("Group name is required");
            }
            const formData = new FormData();
            formData.append('groupName', groupName);
            if (description) {
                formData.append('description', description);
            }
            if (image) {
                formData.append('image', image);
            }
            const response = await axios.post(`${backendUrl}/api/v1/group/create`,formData,{
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.log('Error in createGroup', error);
            return {status:error.status, message:error.message,data:null};
        }
    }


    async updateGroup({groupId, groupName, description}) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if (!groupId) {
                throw new Error("Group id is required");
            }
            if (!groupName && !description) {
                throw new Error("Group name or description is required");
            }
            const response = await axios.patch(`${backendUrl}/api/v1/group/update/${groupId}`,{
                groupName,
                description
            },{
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.log('Error in updateGroup', error);
            return {status:error.status, message:error.message,data:null};
        }
    }


    async updateGroupIcon({groupId, image}) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if (!groupId) {
                throw new Error("Group id is required");
            }
            if (!image) {
                throw new Error("Image Url is required");
            }
            const response = await axios.patch(`${backendUrl}/api/v1/group/update-icon/${groupId}`,{
                iconUrl:image
            },{
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.log('Error in updateGroupIcon', error);
            return {status:error.status, message:error.message,data:null};
        }
    }

    async updateGroupBanner({groupId, image}) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if (!groupId) {
                throw new Error("Group id is required");
            }
            if (!image) {
                throw new Error("Image Url is required");
            }
            const response = await axios.patch(`${backendUrl}/api/v1/group/update-banner/${groupId}`,{
                bannerUrl:image
            },{
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.log('Error in updateGroupBanner', error);
            return {status:error.status, message:error.message,data:null};
        }
    }


    async deleteGroup({groupId}) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if (!groupId) {
                throw new Error("Group id is required");
            }
            const response = await axios.delete(`${backendUrl}/api/v1/group/delete/${groupId}`,{
                headers: {
                    Authorization: `Bearer ${accessToken} ${refreshToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.log('Error in deleteGroup', error);
            return {status:error.status, message:error.message,data:null};
        }
    }
}

export const groupService = new GroupService();