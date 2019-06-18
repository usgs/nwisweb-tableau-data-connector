import {data} from './params.js'



/* 
gets a list of parameters which have names containing the search term
*/
const getRelatedParams = (query) => {
    let results = [];
    for (const [key , value] of Object.entries(data.parm_nm)){
        if (value.toLowerCase().includes(query.toLowerCase())){
            results.push(data.parm_cd[key])
        }
    };
    return results;
}

export{getRelatedParams}