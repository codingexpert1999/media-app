import React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteImage } from '../../actions/profileActions'
import { State } from '../../interfaces'

const ProfileImages = (props: {setShowImages: Function}) => {
    const dispatch = useDispatch();

    const {user} = useSelector((state: State) => state.user);
    const {profileImages, currentProfile, profile} = useSelector((state: State) => state.profile)

    const [currentImage, setCurrentImage] = useState(0)

    if(profileImages.length === 0){
        return <></>
    }

    return (
        <div className="images-carousel">
            <div className="image">
                <div 
                    style={currentImage > 0 ? {} : {display: "none"}}
                    className="indicator left"
                >
                    <i 
                        className="fas fa-arrow-circle-left" 
                        onClick={() => setCurrentImage(currentImage - 1)}
                    ></i>
                </div>

                <img src={`${profileImages[currentImage].image_path}`} alt="User" />

                <div 
                    style={currentImage < profileImages.length - 1 ? {} : {display: "none"}}
                    className="indicator right"
                >
                    <i 
                        className="fas fa-arrow-circle-right" 
                        onClick={() => setCurrentImage(currentImage + 1)}
                    ></i>
                </div>

                {
                    (currentProfile.status === "public" || currentProfile.id === profile.id) &&
                    <a href={profileImages[currentImage].image_path} download>
                        <i className="fas fa-download"></i>
                    </a>
                }

                {
                    currentProfile.id === profile.id &&
                    <span className="delete-img" onClick={() => {
                        const confirm = window.confirm("Are you sure you want to delete this image?");

                        if(confirm){
                            let splittedImagePath = profileImages[currentImage].image_path.split("/");
                            let image = "profile-" + profile.id + "/" + splittedImagePath[splittedImagePath.length - 1];

                            dispatch(deleteImage(user.id, profile.id, image, currentImage))

                            setCurrentImage(0)
                            props.setShowImages(false);
                        }
                    }}>
                        <i className="fas fa-trash-alt"></i>
                    </span>
                }

                <div>
                    <span className="btn-close" onClick={() => props.setShowImages(false)}></span>
                </div>
            </div>
        </div>
    )
}

export default ProfileImages
