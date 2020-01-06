exports.handler = async(context, event, callback) =>{
    
    const {CurrentTask} = event;

    //calling task handlers
    switch(CurrentTask){

        case 'welcome' :
            await welcomeHandler(context, event, callback);
            break;

        case 'get-specials' :
            await getSpecialsHandler(context, event, callback);
            break;

        case 'make-reservation' :
            await makeReservationHandler(context, event, callback);
            break;

        case 'confirm-reservation' :
            await confirmReservationHandler(context, event, callback);
            break;

        case 'fallback' :
            await fallbackHandler(context, event, callback);
            break;

        default :
            await fallbackHandler(context, event, callback);
    } 
};

//welcome handler function
const welcomeHandler = async (context, event, callback) => {

    const Listen = true,
          Say = `Welcome to Deep Table, the worlds smartest restaurant, I'm Deep Table's  Virtual Assistant, I can tell you about todays special or help you make a reservation, What would you like to do today?`,
          Collect = false;

    speechOut(Say, Listen, Collect, callback);
}

//get-specials handler function
const getSpecialsHandler = async (context, event, callback) => {

    const Listen = true,
          Say = `Today's special is duck confit with roasted Brussels sprouts, super recommended, is there anything else I can help you with?`,
          Collect = false;

    speechOut(Say, Listen, Collect, callback);
}

//make-reservation handler function
const makeReservationHandler = async (context, event, callback) => {

    const Listen = false,
          Say = `Great, I can help you with that. I just need you to answer a few questions.`,
          Collect = {
            "name" : "make_reservation",
            "questions" : [
                {
                    "question" : {
                        "say" : "Great, I can help you with that. What's your first name?"
                    },
                    "name" : "first_name",
                    "type" : "Twilio.FIRST_NAME"
                },
                {
                    "question" : {
                        "say" : "When day would you like your reservation for?"
                    },
                    "name" : "date",
                    "type" : "Twilio.DATE"
                },
                {
                    "question" : {
                        "say" : "Great at what time?"
                    },
                    "name" : "time",
                    "type" : "Twilio.TIME"
                },
                {
                    "question" : {
                        "say" : "For how many people"
                    },
                    "name" : "party_size",
                    "type" : "Twilio.NUMBER"
                }
            ],
            "on_complete" : {
                "redirect" : "task://confirm-reservation"
            }
        };

    speechOut(Say, Listen, Collect, callback);
}

//confirm-reservation handler function
const confirmReservationHandler = async (context, event, callback) => {

    const moment = require('moment');

    const {first_name, date, time, party_size} = JSON.parse(event.Memory).twilio.collected_data.make_reservation.answers,
          datetime = `${date.answer} ${time.answer.replace(/:/g, '')}`,
          formated_date = moment(datetime, 'YYYY-MM-DD hmm').format('Do MMMM YYYY'),
          formated_time = moment(datetime, 'YYYY-MM-DD hmm').format('h:mm a');

    const Listen = false,
          Say = `Ok ${first_name.answer}. Your reservation for ${formated_date} at ${formated_time} for ${party_size.answer} people is now confirmed. thank you for booking with us`,
          Collect = false;

    speechOut(Say, Listen, Collect, callback);
}

//fallback handler function
const fallbackHandler = async (context, event, callback) => {

    const Listen = true,
          Say = `Welcome to Deep Table, the worlds smartest restaurant, I'm Deep Table's  Virtual Assistant, I can tell you about todays special or help you make a reservation, What would you like to do today?`,
          Collect = false;

    speechOut(Say, Listen, Collect, callback);
}

/** 
 * speech-out function 
 * @Say {string}             // message to speak out
 * @Listen {boolean}         // keep session true or false
 * @Collect {object}
 * @callback {function}      // return twilio function response 
 * */ 
const speechOut = (Say, Listen, Collect, callback) => {

    let responseObject = {
		"actions": []
    };

    if(Say)
        responseObject.actions.push(
            {
				"say": {
					"speech": Say
				}
			}
        );

    if(Listen)
        responseObject.actions.push(
            { 
                "listen": true 
            }
        );

    if(Collect)
        responseObject.actions.push(
            {
                "collect" : Collect
            }
        );

    // return twilio function response
    callback(null, responseObject);
}