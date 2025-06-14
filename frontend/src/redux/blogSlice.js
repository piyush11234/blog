import { createSlice } from "@reduxjs/toolkit";

const blogSlice = createSlice({
    name:"blog",
    initialState:{
        loading:false,
        blog:[]
        // blogProfile:null
    },
    reducers:{
        //actions
        setLoading:(state, action) => {
            state.loading = action.payload;
        },
        setBlog:(state, action) => {
            state.blog = action.payload;
        }
        // setblogProfile:(state, action) => {
        //     state.blogProfile = action.payload;
        // }
    }
});
export const {setLoading, setBlog} = blogSlice.actions;
export default blogSlice.reducer;