import React,{useState,useEffect,memo} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from './Loader';

export default memo(function AuthLayout({children, authentication = true}) {
    const navigate = useNavigate();
    const authStatus = useSelector(state => state.auth.status);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(authentication && authStatus !== authentication){
            navigate("/login")
        } else if(!authentication && authStatus !== authentication){
            console.log(authStatus)
            navigate("/")
        }
        setLoading(false)
    }, [authStatus, navigate, authentication])
    
    return loading ? <Loader/> : <>{children}</>
});