import axios from "axios";
import { config } from "../../config";
const qs = require('qs');
import React, { useState } from 'react'

import DeviceInfo from 'react-native-device-info';

import DeviceCountry from 'react-native-device-country';


export const getTopics = async () => {
    try {
        const axiosRes = await axios({
            method: "get",
            url: `${config.BASE_URL}/api/v1/prompt-list`,
        });

        return axiosRes.data;
    } catch (err) {
        const axiosRes = JSON.parse(JSON.stringify(err));
       
    }
};


export const getAccessToken = async () => {
    try {

        const axiosRes = await axios({
            method: "post",

            url: `${config.SONDE_URL}/platform/v1/oauth2/token`,
            headers: {
                // "Authorization": 'Basic NnU5NzZpN2x1ZGxvMXIyNHM5MzZiNWw1bzg6MWlvYmRnZmhva2tvbmQyb2hlcDByZDAzZms5MHFvaWwxNXU5Z203ZDliamlkOWVhcTdxNA==',
                "Authorization": 'Basic MXNoczl1cmRwOTI4djZsZ2dnOXBnNGQ5MjE6MWRmcThjbzR1Z3JqamQzZjRqMWJlNTluOGUzMTZndHRpZzN0NTRnZDkyaXVrbWNpYmpqbw==',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: qs.stringify({
                grant_type: 'client_credentials',
                scope: 'sonde-platform/users.write sonde-platform/voice-feature-scores.write sonde-platform/voice-feature-scores.read sonde-platform/storage.write'
            })

        });
      
        return axiosRes.data.access_token;
    } catch (err) {
        const axiosRes = JSON.parse(JSON.stringify(err));
        
    }
};

export const getUserIdentifier = async (userData, yob, token) => {
    const year=await new Date().getFullYear();
    let getYear=parseInt(yob);

    let mfgDet = await DeviceInfo.getManufacturer();
 
    try {
        let userProfile = {
            "yearOfBirth": (year-getYear)>= 18 ? `${yob}`:"Unknown",  // change for age restriction
            "gender":userData?.gender||"Male",
            "language":userData?.language,
            "device": {
                "type": "MOBILE",   //userData?.platform?.toUpperCase()
                "manufacturer": `${mfgDet}`?.toUpperCase(),
            },
            "diseases":[]
        }

        console.log("Payload is ---- ",userProfile,userData?.id);
        
        const axiosRes = await axios({
            method: "post",
            maxBodyLength: Infinity,
            url: `${config.SONDE_URL}/platform/v2/users?userIdentifier=${userData?.id}`,
            headers: { "Authorization": token, 'Content-Type': 'application/json', },
            data: userProfile
        });

        console.log("data return ",axiosRes);
        return axiosRes.data;

    } catch (err) {
        const axiosRes = JSON.parse(JSON.stringify(err));
        console.log("catch err  ",axiosRes);
       
    }
};
export const getSignedURL = async (token, identifier, userData) => {

    let system = DeviceInfo.getSystemName();
    let model = DeviceInfo.getModel();
    let country = await DeviceCountry.getCountryCode().then((result) => {
        return result?.code
    })



    try {
        let details = JSON.stringify({
            "fileType": "wav",
            "countryCode": `${country}`?.toUpperCase(),
            "userIdentifier": identifier?.userIdentifier,
            "audioMetaInfo": {
                "os": `${system}`.toUpperCase(),
                "device":"MOBILE", //userData?.platform?.toUpperCase(),
                "deviceModel": `${model}`,
            }
        });

        console.log("payload for sign ",details);

        const axiosRes = await axios({
            method: "post",
            url: `${config.SONDE_URL}/platform/v1/storage/files`,
            headers: { "Authorization": token, 'Content-Type': 'application/json', },
            data: details
        });

        return axiosRes.data;

    } catch (err) {
        const axiosRes = JSON.parse(JSON.stringify(err));
        
    }
};


export const uploadAudio = async (presignedURL, blobData) => {
    console.log("upload file to server ----->>>>>",presignedURL,blobData);

    try {
        const response = await fetch(presignedURL, {
            method: 'PUT',
            body: blobData,
            headers: {
                'Content-Type': 'audio/wav', // 
            },
        });

        if (response.ok) {
         
            return response
        } else {
            console.error('Error uploading file:', response.statusText);
  
        }
    } catch (error) {
        console.error('Error:', error);
    }
};


export const getScoreInference = async (token, identifier, url) => {

    try {
        let idata = JSON.stringify({
            "infer": [
                {
                    "type": "Acoustic",
                    "version": "v4"
                }
            ],

            "userIdentifier": identifier?.userIdentifier,
            "filePath": url?.filePath,
            "measureName": "mental-fitness"
        });

        const axiosRes = await axios({
            method: 'post',
            maxBodyLength: Infinity,
            url: `${config.SONDE_URL}/platform/async/v1/inference/voice-feature-scores`,
            headers: {
                "Authorization": token,
                'Content-Type': 'application/json'
            },
            data: idata
        });

        return axiosRes.data;
    } catch (err) {
        const axiosRes = JSON.parse(JSON.stringify(err));
       }
};

export const getReport = async (token, sondeJobId) => {
    try {

        const axiosRes = await axios({
            method: 'get',
            url: `${config.SONDE_URL}/platform/async/v1/inference/voice-feature-scores/${sondeJobId}`,
            // url: `https://api.sondeservices.com/platform/async/v1/inference/voice-feature-scores/${sondeJobId}`,
            headers: { "Authorization": token, },
        });
            return axiosRes.data;

    } catch (err) {
        const axiosRes = JSON.parse(JSON.stringify(err));
    }
};


export const saveReport = async (userData, report) => {


    let scoreVal = report?.result?.inference?.[0]?.score?.value
    let result = scoreVal >= 0 && scoreVal < 70 ? "Pay Attention" :
        scoreVal >= 70 && scoreVal <= 79 ? "Good" :
            scoreVal >= 80 && scoreVal <= 100 ? "Excellent" : "No score"


    let feat = report?.result?.inference?.[0]?.voiceFeatures
    if (feat?.[0]?.name == "Smoothness") { var smoothness = feat?.[0]?.score }
    if (feat?.[1]?.name == "Liveliness") { var liveliness = feat?.[1]?.score }
    if (feat?.[2]?.name == "Control") { var control = feat?.[2]?.score }
    if (feat?.[3]?.name == "Energy Range") { var energy_range = feat?.[3]?.score }
    if (feat?.[4]?.name == "Clarity") { var clarity = feat?.[4]?.score }
    if (feat?.[5]?.name == "Crispness") { var crispness = feat?.[5]?.score }
    if (feat?.[6]?.name == "Pause Duration") { var pause_dur = feat?.[6]?.score }
    if (feat?.[7]?.name == "Speech Rate") { var speech_rate = feat?.[7]?.score }



    try {

        let reports =
            JSON.stringify({
                "user_id": userData?.data?.id,
                "result": `${result}`,
                "score": `${scoreVal}`,
                "smoothness": `${smoothness}`,
                "liveliness": `${liveliness}`,
                "control": `${control}`,
                "energy_range": `${energy_range}`,
                "clarity": `${clarity}`,
                "crispness": `${crispness}`,
                "speech_rate": `${speech_rate}`,
                "pause_duration": `${pause_dur}`,
                "inferred_at": `${report?.result?.inferredAt}`
            });


        const axiosRes = await axios({
            method: 'post',
            maxBodyLength: Infinity,
            url: `${config.BASE_URL}/api/v1/score`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: reports
        });
        return JSON.stringify(axiosRes.data.status);
        

    } catch (err) {
        const axiosRes = JSON.parse(JSON.stringify(err));
    }
};




