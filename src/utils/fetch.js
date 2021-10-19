import fetch from "isomorphic-unfetch"; 

export async function post(url, jsonToStringify) {
    let options = {
        method: "POST",
        body: JSON.stringify(jsonToStringify),
        headers: {
            "Content-Type": "application/json",
        },
    };
    return await fetch(url, options);
}