


function processImage() {
  // Replace <Subscription Key> with your valid subscription key.


  // NOTE: You must use the same region in your REST call as you used to
  // obtain your subscription keys. For example, if you obtained your
  // subscription keys from westus, replace "westcentralus" in the URL
  // below with "westus".
  //
  // Free trial subscription keys are generated in the "westus" region.
  // If you use a free trial subscription key, you shouldn't need to change
  // this region.
  var uriBase =
      "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";

  // Request parameters.
  var params = {
      "returnFaceId": "true",
      "returnFaceLandmarks": "false",
      "returnFaceAttributes":
          "age,gender,headPose,smile,facialHair,glasses,emotion," +
          "hair,makeup,occlusion,accessories,blur,exposure,noise"
  };

  // Display the image.
  var sourceImageUrl = document.getElementById("inputImage").value;
  document.querySelector("#sourceImage").src = sourceImageUrl;

  // Perform the REST API call.
  $.ajax({
      url: uriBase + "?" + $.param(params),
      // Request headers.
      beforeSend: ajaxHeader,

      type: "POST",

      // Request body.
      data: '{"url": ' + '"' + sourceImageUrl + '"}',
  })

  .done(function(data) {
      // Show formatted JSON on webpage.
      $("#responseTextArea").val(JSON.stringify(data, null, 2));
  })

  .fail(function(jqXHR, textStatus, errorThrown) {
      ajaxError(jqXHR, textStatus, errorThrown);
  });
};




var tools ={
  encodeImageBase64: function(file, callback){
    var reader = new FileReader();
    reader.onloadend = function() {
      var data = reader.result;
      console.log('RESULT', data);
      callback(data);
    }
    reader.readAsDataURL(file);
  },
  encodeBinary: function(file, callback){
    var reader = new FileReader();
    reader.onloadend = function() {
      var data = reader.result;
      console.log('RESULT', data);
      callback(data);
    }
    reader.readAsArrayBuffer(file);
  },
  validate: function(str){
    if (str!== undefined && str!==null && str.length > 0) {
      return true;
    }
    return false;
  },
  validateNoSpace: function(str){
    if (tools.validate(str) && str.indexOf(' ') < 0) {
      return true;
    }return false;
  },
  spinnerButton: function(button, disabled){
    if (disabled) {
      $(button).text('Cargando...');
    }else{
      $(button).text($(button).data('default'));
    }
    //$(button).attr('disabled', disabled);
  },
  spinnerTable: function(body, disabled){
    $(body).empty();
    if (disabled) {
      var cols = $(body).parent().find('th').length;
      if (!cols) {
        cols = 1;
      }
      $(body).append('<tr><td colspan="'+cols+'">Cargando datos...</td></tr>');
    }
  },
  formatUserData: function(userData){
    var arr = userData.split(',');
    return arr.join('\n');
  },
  startWebCam: function(){
    navigator.getUserMedia = ( navigator.getUserMedia ||
                             navigator.webkitGetUserMedia ||
                             navigator.mozGetUserMedia ||
                             navigator.msGetUserMedia);

      var video;
      var webcamStream;
      if (navigator.getUserMedia) {
           navigator.getUserMedia (
              {video: true,audio: false},
              function(localMediaStream) {
                  video = document.querySelector('video');
                 video.srcObject = localMediaStream;
                 webcamStream = localMediaStream;
              },
              function(err) {
                 console.log("The following error occured: " + err);
              }
           );
        } else {
           console.log("getUserMedia not supported");
        }
  },
  getSnapShot: function(callback){
    var canvas = document.getElementById("myCanvas");
    var video = document.querySelector('video');
    var ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0,0, canvas.width, canvas.height);
    //var imageData = ctx.getImageData(0,0, canvas.width, canvas.height);
    //var buffer = imageData.data.buffer;
    //console.log(buffer);
    //callback(buffer);
    //callback(canvas.toDataURL());
    var url = canvas.toDataURL('image/jpeg');
    callback(url);
  }
};

var selectedGroup = '';
var selectedPerson = '';
var selectedFace  = '';
var persons_cache = [];

var main ={
  listPersonGroups: function(){
    tools.spinnerTable('.person-group-list',true);
    api.listPersonGroups(function(groups){
      tools.spinnerTable('.person-group-list',false);
      $('.person-group-list').empty();
      var t = '';
      if (groups.length > 0) {
        for (var i = 0; i < groups.length; i++) {
          var g = groups[i];
          t+='<tr>';
          t+='<td>'+g.personGroupId+'</td>';
          t+='<td>'+g.name+'</td>';
          t+='<td>';
          t+='<button class="btn btn-info btn-train-group" data-default="Entrenar" onclick="main.trainPersonGroup(\''+g.personGroupId+'\')">Entrenar</button>';
          t+='<button class="btn btn-success btn-choose-group" data-default="Seleccionar" onclick="main.choosePersonGroup(\''+g.personGroupId+'\')">Seleccionar</button>';
          t+='<button class="btn btn-danger btn-delete-group" data-default="Eliminar" onclick="main.deletePersonGroup(\''+g.personGroupId+'\')">Eliminar</button>';
          t+='</td>';
          t+='</tr>';
        }
      }else{
        t+='<tr><td colspan="3">No hay Grupos Registrados</td></tr>'
      }
      $('.person-group-list').append(t);
    });
  },
  listPersons: function(personGroupID){
    tools.spinnerTable('.person-group-person-list',true);
    api.listPersons(personGroupID,function(persons){
      tools.spinnerTable('.person-group-person-list',false);
      tools.spinnerButton('.btn-choose-group',false);
      tools.spinnerButton('.btn-add-person',false);
      $('.person-group-person-list').empty();
      var t = '';
      persons_cache = persons;
      if (persons.length > 0) {
        for (var i = 0; i < persons.length; i++) {
          var g = persons[i];
          t+='<tr>';
          t+='<td>'+g.personId+'</td>';
          t+='<td>'+g.name+'</td>';
          t+='<td>'+tools.formatUserData(g.userData)+'</td>';
          t+='<td>';
          t+='<button class="btn btn-success btn-choose-person" data-default="Seleccionar" onclick="main.choosePerson('+i+')">Seleccionar</button>';
          t+='<button class="btn btn-danger btn-delete-person" data-default="Eliminar" onclick="main.deletePerson('+i+')">Eliminar</button>';
          t+='</td>';
          t+='</tr>';
        }
      }else{
        t+='<tr><td colspan="4">No hay Personas Registradas</td></tr>'
      }
      $('.person-group-person-list').append(t);

      if (persons.length> 0) {
        if (isNaN(parseInt(selectedPerson))) {
          selectedPerson = 0;
        }
        main.choosePerson(selectedPerson);
      }

    });
  },
  listFaces: function(faces){
    $('.person-face-list').empty();
    var t = '';
    if (faces.length > 0) {
      for (var i = 0; i < faces.length; i++) {
        var g = faces[i];
        t+='<tr>';
        t+='<td>'+g+'</td>';
        t+='<td>';
        t+='<button class="btn btn-danger btn-delete-face" data-default="Eliminar" onclick="main.deleteFace('+g+')">Eliminar</button>';
        t+='</td>';
        t+='</tr>';
      }
    }else{
      t+='<tr><td colspan="2">No hay Fotos Registradas</td></tr>'
    }
    $('.person-face-list').append(t);
  },
  trainPersonGroup: function(personGroupID){
    tools.spinnerButton('.btn-train-group',true);
    api.trainPersonGroup(personGroupID, function(){
      tools.spinnerButton('.btn-train-group',false);
      alert('Entrenamiento terminado');
    });
  },
  deletePersonGroup: function(personGroupID){
    tools.spinnerButton('.btn-delete-group',true);
    api.deletePersonGroup(personGroupID,function(){
      tools.spinnerButton('.btn-delete-group',false);
      tools.spinnerButton('.btn-add-person',true);
      tools.spinnerButton('.btn-choose-person',true);
      tools.spinnerButton('.btn-delete-person',true);
      main.listPersonGroups();
    });
  },
  choosePersonGroup: function(personGroupID){
    tools.spinnerButton('.btn-choose-group',true);
    tools.spinnerButton('.btn-add-person',true);
    selectedGroup = personGroupID;
    main.listPersons(personGroupID);
  },
  createPersonGroup: function(){
    var personGroupID = $('.input-person-group-id').val();
    var personGroupName = $('.input-person-group-name').val();

    if (!tools.validateNoSpace(personGroupID)) {
      alert('Debe ingresar el id del grupo: Sin espacios');
      return false;
    }
    if (!tools.validate(personGroupName)) {
      alert('Debe ingresar el nombre del grupo');
      return false;
    }
    tools.spinnerButton('.btn-add-group',true);
    api.createPersonGroup(personGroupID, personGroupName, function(data){
      $('.modal').modal('hide');
      tools.spinnerButton('.btn-add-group',false);
      main.listPersonGroups(selectedGroup);
    });
  },
  createPerson: function(){
    var personName = $('.input-person-name').val();
    var personEmail = $('.input-person-email').val();
    var personCode = $('.input-person-code').val();
    var userData = 'email:'+personEmail+",codigo:"+personCode;

    if (!tools.validate(personName)) {
      alert('Debe ingresar el nombre de la Persona');
      return false;
    }

    tools.spinnerButton('.btn-add-person',true);
    api.createPerson(selectedGroup,personName,userData,function(result){
      $('.modal').modal('hide');
      tools.spinnerButton('.btn-add-person',false);
      main.listPersons(selectedGroup);
    });
  },
  choosePerson: function(index){
    selectedPerson = index;
    tools.spinnerButton('.btn-add-face',false);
    $('.person-name').text(persons_cache[index].name);
    var faces = [];
    if (persons_cache[index].persistedFaceIds) {
      faces = persons_cache[index].persistedFaceIds;
    }
    main.listFaces(faces);
  },
  deletePerson: function(index){
    api.deletePerson(selectedGroup,persons_cache[index].personId, function(){
      main.listPersons(selectedGroup);
    });
  },
  addFace: function(){
    tools.spinnerButton('.btn-add-face',true);
    var userData = {userData: ''};
    var image = $('.input-face-image')[0].files[0];
    if (image) {
      tools.encodeBinary(image, function(data){
        api.addFace(selectedGroup, persons_cache[selectedPerson].personId, userData, data, function(){
          $('.modal').modal('hide');
          tools.spinnerButton('.btn-add-face',false);
          main.listPersons(selectedGroup);
        });
      });
    }else{
      alert('Debe seleccionar una imágen');
    }
  },
  deleteFace: function(faceId){
    api.deleteFace(selectedGroup,persons_cache[selectedPerson].personId, faceId, function(){
      main.choosePerson(selectedPerson);
    });
  },
  identifyPerson: function(){
    isWorking = true;
    tools.getSnapShot(function(uri){
      fetch(uri).then(function(res){
        return res.blob();
      }).then(function(blobData){
        var params = {"returnFaceId": "true"};
        $('.person-identified').text('Detectando Rostro...')
        api.detectFace(params, blobData, function(faces){
          faceIds = [];
          if (faces && faces.length > 0) {
            faceIds.push(faces[0].faceId);
            $('.person-identified').text('Detectando Persona...')
            api.identifyPerson(faceIds,selectedGroup,function(result){
              if (result && result.length > 0) {
                var candidates = result[0].candidates;
                if (candidates && candidates.length > 0) {
                  var personID = candidates[0].personId;
                  api.getPerson(selectedGroup,personID, function(person){
                    isWorking = false;
                    identify = false;
                    $('.person-identified').text(person.name +'\n'+person.userData);
                  });
                }else{
                  isWorking = false;
                  $('.person-identified').text('Persona desconocida, no se encuentra en la base de datos');
                }
              }else{
                isWorking = false;
                $('.person-identified').text('Persona desconocida');
              }
            });
          }else{
            isWorking = false;
            $('.person-identified').text('No se ha detectado un rostro');
          }
        });
      });
    });
  }
}

var identify = false;
var isWorking = false;

$(document).ready(function(){
  main.listPersonGroups();

  $('.btn-add-group').click(function(){
    main.createPersonGroup();
  });

  $('.btn-add-person').click(function(){
    main.createPerson();
  });

  $('.btn-add-face').click(function(){
    main.addFace();
  });

  $('.btn-start-rec').click(function(){
    identify = true;
  });

  $('.btn-stop-rec').click(function(){
    identify = false;
  });

  tools.startWebCam();

  setInterval(function () {
    if (selectedGroup !== '' && identify && isWorking === false) {
      main.identifyPerson();
    }
  }, 1000);
});
