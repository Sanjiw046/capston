import {v2 as cloudnary} from 'cloudinary';
import fs from 'fs';
 
cloudnary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRECT , // Click 'View API Keys' above to copy your API secret   
});


const uploadOnCloudnary = async (filepath)=>{
    try{
        // console.log(filepath);
        if(!filepath){
            return null;
        }
    
        const response = await cloudnary.uploader.upload(filepath);
        console.log('File is uploded on cloudnary',response.url);
        
        fs.unlinkSync(filepath);
        return response;
    }
    catch(err){
        //is used to delete the file at filepath from the local file system. 
        fs.unlinkSync(filepath);
        console.log("Error while uploading file on cloudnary",err);
        return err;
    }
}

//jab hume multiple images cloudnary pe ek sath upload karni hoti hia to
async function uploadBatchOnCloudinary(images) {
    try {
        // Create a list of promises where each promise represents an image upload task.
        const promises = images.map(async (image) => {
            //the method uploads the image located at image.path to Cloudinary.
            const response = await cloudnary.uploader.upload(image.path);
            return response;
        });

        // Wait for all upload promises to resolve.
        const results = await Promise.all(promises);
        
        // Delete the local files after uploading to Cloudinary.
        images.map((image) => fs.unlinkSync(image.path));
        return results;
    }
    catch (error) {
        console.error("Error uploading batch files on cloudinary", error);
        images.map((image) => fs.unlinkSync(image.path));
        return error;
    }
};

export default uploadOnCloudnary;
export {uploadBatchOnCloudinary};