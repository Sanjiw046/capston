import axios from "axios";

//isliye create kar rhe hain taki jo base url hai usse use kar sake
const instance = axios.create({
    baseURL : 'http://localhost:4003',
    withCredentials: true  //browser pe cookies show ho isliye credential ko true karna padta hai
})

export default instance;