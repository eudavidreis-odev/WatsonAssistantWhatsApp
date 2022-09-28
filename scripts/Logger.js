function dateLog(text) {
    console.log(new Date(), ' - ', text)
}

function dateError(text){
  console.error(new Date(), ' - ERROR- ', text)
}

module.exports = {dateLog,dateError}