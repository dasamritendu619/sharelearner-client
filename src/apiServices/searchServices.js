import axios from 'axios';
import conf from '../conf/conf';

export class SearchServices {
    
        async searchPosts({query,page=1,limit=20}) {
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');
            try {
                if (!query) {
                    throw new Error("Query is required");   
                }
                const response = await axios.get(`${conf.backendUrl}/api/v1/search/posts?query=${query}&page=${page}&limit=${limit}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken} ${refreshToken}`
                    }
                });
    
                return response.data;
            } catch (error) {
                console.log('Error in searchPosts', error);
                return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
            }
        }

        async searchUsers({query,page=1,limit=20}) {
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');
            try {
                if (!query) {
                    throw new Error("Query is required");   
                }
                const response = await axios.get(`${conf.backendUrl}/api/v1/search/users?query=${query}&page=${page}&limit=${limit}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken} ${refreshToken}`
                    }
                });
    
                return response.data;
            } catch (error) {
                console.log('Error in searchUsers', error);
                return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
            }
        }

        async getSearchSuggestions({query}) {
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');
            try {
                if (!query) {
                    throw new Error("Query is required");
                }
                const response = await axios.get(`${conf.backendUrl}/api/v1/search/suggestions?query=${query.trim()}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken} ${refreshToken}`
                    }
                });
    
                return response.data;
            } catch (error) {
                console.log('Error in getSearchSuggestions', error);
                return {status:error.status || 400,message:error.message || "Something Went Wrong!",data:null};
            }
        }
}

export const searchServices = new SearchServices();