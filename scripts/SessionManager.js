
var session = []

function addSession(phoneNumber , _session){
    
    session.push({number:phoneNumber,
    session:_session})

    console.log("Nova sessão adicionada Cel:"+phoneNumber+" ID:"+_session)

    setTimeout(()=>{
        console.log("Eliminando Cel:"+phoneNumber+" Session:"+_session)
        resetSessionWithPhone(phoneNumber);
        console.log("Session terminada.")
    }, 140000);
}


function resetSessionWithPhone(phone_number,_session){
    console.log("Numero de sessoẽs ativas:"+session.length)
    const keys = session.keys()
    const values = session.values()

    var index = session.indexOf(_session)
    var value = session.at(index);

    session = session.filter(el=>el.number!==phone_number)
    console.log("Numero de sessoẽs ativas após:"+session.length)

}

function getSessionByPhone(phone_number){
    var tempArr = session.filter(el =>el.number === phone_number);

    return tempArr.at(0).session;

}

function checkSessionExist(phone_number){
    console.log("Check if...")
    
    var tempArr = session.filter(el =>el.number === phone_number)
    
    return tempArr.length>0;

}


module.exports = { addSession, checkSessionExist , getSessionByPhone }