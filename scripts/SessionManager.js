const log = require('./Logger')

/**Array para controle de sessões ativas. */
var session = []

/**Adiciona uma nova sessão, recebe o numero de quem enviou a mensagem, e a sessão do Watson 
 * Assistant.
 * Também adiciona um cronometro para excluir essa session, nesse caso o Watson Assistant 
 * mantém a sessão ativa durante 5 minutos (140000 milisegundos). Verifique o plano do seu 
 * serviço para saber o tempo coreto de seu Assistant.
 */
function addSession(phoneNumber , _session){
    
    session.push(
        {
            number:phoneNumber,
            session:_session
        }
    )

    log.dateLog("Nova sessão adicionada Cel:"+phoneNumber+" ID:"+_session)

    setTimeout(()=>{
        log.dateLog("Eliminando Cel:"+phoneNumber+" Session:"+_session)
        resetSessionWithPhone(phoneNumber);
        log.dateLog("Session terminada.")
    }, 140000);
}

/**Exclui uma sessão do Watson com base no número de telefone. */
function resetSessionWithPhone(phone_number){
    log.dateLog("Numero de sessoẽs ativas:"+session.length)
    session = session.filter(el=>el.number!==phone_number)
    log.dateLog("Numero de sessoẽs ativas após:"+session.length)

}

/**Retorna as sessões do Watson com base no número de telefone. */
function getSessionByPhone(phone_number){
    var tempArr = session.filter(el =>el.number === phone_number);

    return tempArr.at(0).session;

}

/**Checa se existe uma sessão ativa para esse número. */
function checkSessionExist(phone_number){
    log.dateLog("Check if...")
    
    var tempArr = session.filter(el =>el.number === phone_number)
    
    return tempArr.length>0;

}


module.exports = { addSession, checkSessionExist , getSessionByPhone }