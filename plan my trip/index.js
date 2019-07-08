
const Alexa = require('ask-sdk-core');
let data = require('./data')
const MAX_QUESTION_COUNT = data.questions.length;

const TripIntnetHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'TripIntnet';
    },
    handle(handlerInput) {
        // 初始化所有地點的得分 
        // scores = {"Budapest"=0, "Mexico City"=0, "Hokkaido": 0, "Taipei": 0, "Heidelberg": 0, "Los Angeles":0 }
        let scores = {}
        for(var i=0; i<data.destinations.length; i++){
            var location = data.destinations[i];
            scores[location] = 0
        }
        
        // 初始化我們與Alexa對話的內容
        let attrs = handlerInput.attributesManager.getSessionAttributes();
        attrs.questionCount = 0; //從第一題開始問
        attrs.scores = scores;   //目前各地點的得分
        
        //從第一個問題開始問起
        let question = data.questions[0];
        //將第一個問題回傳
        var speechText = `Ok. Let's start it. ${question}`;
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(question)
            .getResponse();
    }
};


const YesNoIntentHandler = {
    canHandle(handlerInput) {
        
        //若你的回答是"YES" or "No"
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && ['AMAZON.YesIntent', 'AMAZON.NoIntent'].includes( handlerInput.requestEnvelope.request.intent.name);
    },
    handle(handlerInput) {
        
        // 取出我們與Alexa上一次對話的內容
        let attrs = handlerInput.attributesManager.getSessionAttributes();
        let currentQuestionCount = attrs.questionCount; //上次問到第幾個問題
        let scores = attrs.scores;                      //目前各地點的得分
        
        
        //判斷你的回答。若為"Yes"，針對對應的地點得分+1
        if(handlerInput.requestEnvelope.request.intent.name == 'AMAZON.YesIntent'){
            // 找出對應回答的地點
            let destinationMatch = data.questionDestinationMatch[currentQuestionCount];
            console.log(destinationMatch);
            // 對每一個地點的累加得分+1 
            for(var i=0; i<destinationMatch.length; i++){
                var location = destinationMatch[i];
                scores[location] = scores[location] + 1;
            }
        }
        
        // 往下一個題目，更新得分
        attrs.questionCount = currentQuestionCount + 1;
        attrs.scores = scores;
        
        //判斷問題是不是問完了
        if (attrs.questionCount >= MAX_QUESTION_COUNT) {
            //找出得分最高的地點
            var topDestination = '';
            var topScore = -1;
            //針對所有的地點，找出最高得分者
            for(var j=0; j<data.destinations.length; j++){
                var destination = data.destinations[j];
                let score = scores[destination];
                if (score > topScore) {
                    topDestination = destination;
                    topScore = score;
                }
            }
            //將結果回傳
            let speechText = `Based on my calculation. You'll enjoy ${topDestination} for your next vacation. Thanks for playing Plan my trip.`;
            return handlerInput.responseBuilder
                .speak(speechText)
                .getResponse();
                
        } else {
            //繼續問下一個問題
            let question = data.questions[currentQuestionCount + 1];
            let speechText = `Next question. ${question}`;
             return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(speechText)
                .getResponse();
        }
    }
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'Welcome to Plan my trip. I can find the best vacation destination for you. To start it, just say plan it or start planing.';
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speechText = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.message}`);
        const speechText = `Sorry, I couldn't understand what you said. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        TripIntnetHandler,
        YesNoIntentHandler,
        LaunchRequestHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
