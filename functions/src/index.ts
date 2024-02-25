import { onCall, HttpsError, onRequest } from "firebase-functions/v2/https";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import * as corsModule from 'cors';
import * as logger from "firebase-functions/logger";

// Your existing code here

const cors = corsModule({origin: true});

exports.plusone = onCall({
    cors: true,
}, (request) => {
    const email = request.auth?.token.email;
    const num = request.data.num;

    logger.log(email + " tried to increase his number by one:" + num);

    return {
        finalNum: num + 1,
    }
})


exports.hello = onRequest(
    (request, response) =>{
        cors(request, response, ()=>{
            response.status(200).send("Hi");
        })
    }
)