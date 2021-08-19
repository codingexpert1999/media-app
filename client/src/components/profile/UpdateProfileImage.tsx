import React, {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { updateProfileImage } from '../../actions/profileActions';
import { State } from '../../interfaces';

const UpdateProfileImage = (props: {setShowUpdateImage: Function}) => {
    const dispatch = useDispatch()

    const {user} = useSelector((state: State) => state.user);
    const {profile} = useSelector((state: State) => state.profile);

    const [imageToUpload, setImageToUpload] = useState("")
    const [image, setImage] = useState<any>(null);

    const handleImageUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData();
        formData.set("image", image);

        try {
            dispatch(updateProfileImage(user.id, profile.id, formData));

            setImageToUpload("")
            setImage(null)
            props.setShowUpdateImage(false)
        } catch (err) {
            toast.error("Profile image couldn't be updated!")
        }
    }

    return (
        <div className="image-upload-container">
            <form onSubmit={handleImageUpload}>
                <div className="mb-3">
                    <label className="form-label">Choose an image for your profile</label>
                    <input type="file" className="form-control" onChange={e => {
                        if(e.target.files && e.target.files.length > 0){
                            setImage(e.target.files[0])
                            setImageToUpload(URL.createObjectURL(e.target.files[0]))
                        }
                    }}/>
                </div>

                {
                    imageToUpload !== "" &&
                    <div className="mb-3">
                        <img className="img-fluid" src={imageToUpload} alt="User" />
                    </div>
                }

                <button className="btn btn-primary" type="submit">Submit</button>
                <button className="btn btn-secondary" type="button" onClick={() => {
                    setImageToUpload("")
                    setImage(null)
                    props.setShowUpdateImage(false)
                }}>Cancel</button>
            </form>
        </div>
    )
}

export default UpdateProfileImage
