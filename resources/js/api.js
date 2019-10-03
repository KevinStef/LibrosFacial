var subscriptionKey = "acaaf9fd6aca42729c6778bc7bd91b5d";

// URIS
var uriBaseIdentify = 'https://bibliotecafaceapi.cognitiveservices.azure.com/face/v1.0/identify/';
var uriBaseDetect = 'https://bibliotecafaceapi.cognitiveservices.azure.com/face/v1.0/detect';
var uriBasePersonGroup =  'https://bibliotecafaceapi.cognitiveservices.azure.com/face/v1.0/persongroups/';

var ajaxHeader = function(xhrObj){
  xhrObj.setRequestHeader("Content-Type","application/json");
  xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
}

var fileAjaxHeader = function(xhrObj){
  xhrObj.setRequestHeader("Content-Type","application/octet-stream");
  xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
}

var ajaxError = function(jqXHR, textStatus, errorThrown){
  var errorString = (errorThrown === "") ?
      "Error. " : errorThrown + " (" + jqXHR.status + "): ";
  errorString += (jqXHR.responseText === "") ?
      "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
          jQuery.parseJSON(jqXHR.responseText).message :
              jQuery.parseJSON(jqXHR.responseText).error.message;
  alert(errorString);
}

var api ={
  createPersonGroup: function(personGroupID, name, callback){
    var uriBase = uriBasePersonGroup + personGroupID;
    $.ajax({
      url: uriBase,
      beforeSend: ajaxHeader,
      type: 'PUT',
      data: JSON.stringify({name: name})
    })
    .done(function(data){
      console.log(data);
      callback(data);
    })
    .fail(function(jqXHR, textStatus, errorThrown){
      ajaxError(jqXHR, textStatus, errorThrown);
    });
  },
  createPerson: function(personGroupID, name,userData, callback){
    var uriBase = uriBasePersonGroup + personGroupID+ '/persons';
    $.ajax({
      url: uriBase,
      beforeSend: ajaxHeader,
      type: 'POST',
      data: JSON.stringify({name: name, userData: userData})
    })
    .done(function(data){
      console.log(data);
      callback(data);
    })
    .fail(function(jqXHR, textStatus, errorThrown){
      ajaxError(jqXHR, textStatus, errorThrown);
    });
  },
  addFace: function(personGroupID, personID, params, data, callback){
    var uriBase = uriBasePersonGroup + personGroupID+ '/persons/'+ personID+'/persistedFaces?'+$.param(params);
    $.ajax({
      url: uriBase,
      beforeSend: fileAjaxHeader,
      type: 'POST',
      data: data,
      cache: false,
      processData: false
    })
    .done(function(data_r){
      console.log(data_r);
      callback(data_r);
    })
    .fail(function(jqXHR, textStatus, errorThrown){
      ajaxError(jqXHR, textStatus, errorThrown);
    });
  },
  detectFace: function(params, data, callback){
    var uriBase = uriBaseDetect + '?' + $.param(params);
    $.ajax({
      url: uriBase,
      beforeSend: fileAjaxHeader,
      type: 'POST',
      data: data,
      cache: false,
      processData: false
    })
    .done(function(data_r){
      console.log(data_r);
      callback(data_r);
    })
    .fail(function(jqXHR, textStatus, errorThrown){
      ajaxError(jqXHR, textStatus, errorThrown);
    });
  },
  trainPersonGroup: function(personGroupID, callback){
    var uriBase = uriBasePersonGroup + personGroupID+ '/train';
    $.ajax({
      url: uriBase,
      beforeSend: ajaxHeader,
      type: 'POST'
    })
    .done(function(){
      console.log('Train Donde');
      callback();
    })
    .fail(function(jqXHR, textStatus, errorThrown){
      ajaxError(jqXHR, textStatus, errorThrown);
    });
  },
  listPersonGroups: function(callback){
    var uriBase = uriBasePersonGroup;
    $.ajax({
      url: uriBase,
      beforeSend: ajaxHeader,
      type: 'GET'
    })
    .done(function(data){
      console.log(data);
      callback(data);
    })
    .fail(function(jqXHR, textStatus, errorThrown){
      ajaxError(jqXHR, textStatus, errorThrown);
    });
  },
  deletePersonGroup: function(personGroupID,callback){
    var uriBase = uriBasePersonGroup+ personGroupID;
    $.ajax({
      url: uriBase,
      beforeSend: ajaxHeader,
      type: 'DELETE'
    })
    .done(function(){
      console.log('Delete Success');
      callback();
    })
    .fail(function(jqXHR, textStatus, errorThrown){
      ajaxError(jqXHR, textStatus, errorThrown);
    });
  },
  listPersons: function(personGroupID, callback){
    var uriBase = uriBasePersonGroup + personGroupID+ '/persons';
    $.ajax({
      url: uriBase,
      beforeSend: ajaxHeader,
      type: 'GET'
    })
    .done(function(data){
      console.log(data);
      callback(data);
    })
    .fail(function(jqXHR, textStatus, errorThrown){
      ajaxError(jqXHR, textStatus, errorThrown);
    });
  },
  getPerson: function(personGroupID, personID, callback){
    var uriBase = uriBasePersonGroup + personGroupID+ '/persons/'+ personID;
    $.ajax({
      url: uriBase,
      beforeSend: ajaxHeader,
      type: 'GET'
    })
    .done(function(data){
      console.log(data);
      callback(data);
    })
    .fail(function(jqXHR, textStatus, errorThrown){
      ajaxError(jqXHR, textStatus, errorThrown);
    });
  },
  deletePerson: function(personGroupID, personID, callback){
    var uriBase = uriBasePersonGroup + personGroupID+ '/persons/'+ personID;
    $.ajax({
      url: uriBase,
      beforeSend: ajaxHeader,
      type: 'DELETE'
    })
    .done(function(){
      console.log('Delete Success');
      callback();
    })
    .fail(function(jqXHR, textStatus, errorThrown){
      ajaxError(jqXHR, textStatus, errorThrown);
    });
  },
  deleteFace: function(personGroupID,personID, faceId,callback){
    var uriBase = uriBasePersonGroup + personGroupID+ '/persons/'+ personID+'/persistedFaces/'+ faceId;
    $.ajax({
      url: uriBase,
      beforeSend: ajaxHeader,
      type: 'DELETE'
    })
    .done(function(){
      console.log('Delete Success');
      callback();
    })
    .fail(function(jqXHR, textStatus, errorThrown){
      ajaxError(jqXHR, textStatus, errorThrown);
    });
  },
  identifyPerson: function(faceIds, personGroupID, callback){
    var uriBase = uriBaseIdentify;
    $.ajax({
      url: uriBase,
      beforeSend: ajaxHeader,
      type: 'POST',
      data: JSON.stringify({
        faceIds: faceIds,
        personGroupId: personGroupID
      })
    })
    .done(function(data){
      console.log(data);
      callback(data);
    })
    .fail(function(jqXHR, textStatus, errorThrown){
      ajaxError(jqXHR, textStatus, errorThrown);
    });
  }
};
