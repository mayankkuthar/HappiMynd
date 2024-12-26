import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { config } from "../../config";
import axios from "axios";

export const getDiscussTopics = async () => {
    try {
        const axiosRes = await axios({
            method: "get",
            url: `${config.BASE_URL}/api/v1/chat-bot/discussion-topics`,
        });
        return axiosRes?.data?.content;
    } catch (err) {
        const axiosRes = JSON.parse(JSON.stringify(err));

    }
};

export const getHelpLineTxt = async () => {
    try {
        const axiosRes = await axios({
            method: "get",
            url: `${config.BASE_URL}/api/v1/chat-bot/suicidal-thoughts`,
        });

        return axiosRes?.data?.content?.description;
    } catch (err) {
        const axiosRes = JSON.parse(JSON.stringify(err));

    }
};


export const getVideo = async (id) => {
    try {
        const axiosRes = await axios({
            method: "get",
            url: `${config.BASE_URL}/api/v1/chat-bot/square-breathing`,
        });
        
        return axiosRes?.data;
    } catch (err) {
        const axiosRes = JSON.parse(JSON.stringify(err));

    }
};

export const getAssessList = async () => {
    try {
        const axiosRes = await axios({
            method: "get",
            url: `${config.BASE_URL}/api/v1/chat-bot/categories`,
        });
        console.log("get assist ------------",axiosRes?.data?.categories);
        return axiosRes?.data?.categories;
    } catch (err) {
        const axiosRes = JSON.parse(JSON.stringify(err));
        console.log("catch error to get assist ",err.message);
    }
};
export const getScore = async (user_id) => {
    try {
        const axiosRes = await axios({
            method: "get",
            url: `${config.BASE_URL}/api/v1/chat-bot/assessments?user_id=${user_id}`,
        });
        return axiosRes?.data;
    } catch (err) {
        const axiosRes = JSON.parse(JSON.stringify(err));

    }
};

export const getQuestions = async (cat_id) => {
    try {
        const axiosRes = await axios({
            method: "get",
            url: `${config.BASE_URL}/api/v1/chat-bot/questions?language=english&chat_bot_category_id=${cat_id}`,
        });
        return axiosRes?.data?.questions;
    } catch (err) {
        const axiosRes = JSON.parse(JSON.stringify(err));

    }
};
export const getRecommendation = async (profileId, categoryId) => {
    try {
        const axiosRes = await axios({
            method: "get",
            url: `${config.BASE_URL}/api/v1/chat-bot/recommendations?user_profile_id=${profileId}&recommendation_category_id=${categoryId}`,
        });
        return axiosRes?.data?.content;
    } catch (err) {
        const axiosRes = JSON.parse(JSON.stringify(err));

    }
};
export const postScore = async (profile_id, cat_id, score) => {
    try {
        var formdata = new FormData();
        formdata.append("user_id", profile_id);
        formdata.append("chat_bot_category_id", cat_id);
        formdata.append("score", score);

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };
        var result = await fetch(`${config.BASE_URL}/api/v1/chat-bot/add-assessment`, requestOptions);
        obj = await result.json();
        console.log("data come from llm-----",obj);
        return obj
    } catch (err) {
        const axiosRes = JSON.parse(JSON.stringify(err));
        console.log("catch errrorfrom llm----- ",err.message);

    }
};




// export const getLLMResponse = async (input) => {
//     try {
//         let data = JSON.stringify({
//             "user_input": input
//         });
         
//         console.log("sending data ---",data);

//         const axiosRes = await axios({
//             method: 'post',
//             maxBodyLength: Infinity,
//             url: 'http://13.235.242.52/api/generate_response/',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             data: data
//         });
//         console.log("data_____", axiosRes)
//         // return axiosRes?.data;
//     } catch (err) {
//         const axiosRes = JSON.parse(JSON.stringify(err));
//         console.log("llm cathc error ---",err.message);
        
//     }
// };

export const getLLMResponse = async (input) => {
    try {
        let data = JSON.stringify({
            "user_input": input
        });
         
        console.log("sending data ---", data);

        const axiosRes = await axios({
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://13.235.242.52/api/generate_response/',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        });

        console.log("data_____", axiosRes.data);
        return axiosRes.data;
    } catch (err) {
        console.log("llm catch error ---", err.message);
        if (err.response) {
            console.log("Error response data: ", err.response.data);
            console.log("Error response status: ", err.response.status);
            console.log("Error response headers: ", err.response.headers);
        } else if (err.request) {
            console.log("Error request: ", err.request);
        } else {
            console.log("Error message: ", err.message);
        }
    }
};
