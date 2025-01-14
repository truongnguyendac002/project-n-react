import React, { useEffect } from 'react';
import { useAppDispatch } from '../../redux/reduxHook';
import { setUserProfile, removeUserProfile } from '../../redux/slices/authSlice';
import { fetchUserInfo } from '../../services/authService';

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem('access-token');

            if (token) {
                try {
                    const response = await fetchUserInfo();
                    if (response.respCode === '000') {
                        dispatch(setUserProfile(response.data));
                    }
                    else {
                        console.log('Token failed:', response.respDesc);
                        dispatch(removeUserProfile());
                    }
                } catch (error) {
                    console.error('Authentication failed:', error);
                    dispatch(removeUserProfile());
                }
            } 
        };

        validateToken();
    }, [dispatch]);

    return <>{children}</>;

};

export default AuthWrapper;
