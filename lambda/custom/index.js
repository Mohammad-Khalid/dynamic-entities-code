/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');


let groupList = [
  {
    id : "1",
    name : "group 1"
  },
  {
    id : "2",
    name : "group 2"
  },
  {
    id : "3",
    name : "group 3"
  },
  {
    id : "4",
    name : "group 4"
  },
  {
    id : "5",
    name : "group 5"
  }
];

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  async handle(handlerInput) {
    const speechText = 'Hello and Welcome to Emergency message sender, with my help you can send emergency notification to your group of working users about some precautionay text. What would you like to start with?';

    let values = [];
    if(groupList.length){

      for( let i = 0 ; i < groupList.length ; i++){

        values.push({
          id : groupList[i]._id,
          name : {
            value : groupList[i].name
          }
        });
      }
      
    }
    
    if(values.length){

      let replaceEntity = {
        type : 'Dialog.UpdateDynamicEntities',
        updateBehavior : 'REPLACE',
        types: [
          {
              name: 'groupList',
              values : values
          }
        ]
      }
      return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .addDirective(replaceEntity)
      .getResponse();
    }
    else{

      return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
    }

  },
};

const MyQueryIntentHanlder = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'MyQueryIntent';
  },
  async handle(handlerInput) {

    let speechText = `Oops, Sorry there is no group user added in your airport yet.`;

    console.log(groupList);

    if(groupList.length){
      speechText = `Which group would you like to send it to?. `;
      for( let i = 0 ; i < groupList.length ; i++){

        if(i === 0)
          speechText += `${groupList[i].name}`;
        else
          speechText += `, ${groupList[i].name}`;
      }
      
      speechText += `, or All Groups.`;
    }

    return handlerInput.responseBuilder
    .speak(speechText)
    .reprompt(speechText)
    .getResponse();
    
  },
};

const MyGroupListIntentHanlder = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
    && handlerInput.requestEnvelope.request.intent.name === 'MyGroupListIntent';
  },
  handle(handlerInput) {

    const { attributesManager, requestEnvelope} = handlerInput;
    let sessionAttributes = attributesManager.getSessionAttributes();
    const currentIntent = requestEnvelope.request.intent
    const {group_name} = requestEnvelope.request.intent.slots;

    console.log(group_name);
    const speechText = 'Got you group name';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'Emergency message sender is an assistant, with the help of it you can send an emergency notification to your list group workers. What would you like to start with?';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
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
  },
};

const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    console.log(handlerInput.requestEnvelope.request)
    const speechText = 'Exceptions, no intent matched';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    MyQueryIntentHanlder,
    MyGroupListIntentHanlder,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    FallbackIntentHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
