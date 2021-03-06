import $ from 'jquery';

import commentPropertiesProvider from './provider';

// require the viewer, make sure you added it to your project
// dependencies via npm install --save-dev bpmn-js
import EmbeddedComments from './Comments'
import * as propertiesPanelModule  from 'bpmn-js-properties-panel';
import * as propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/bpmn';
import BpmnJS from 'bpmn-js/lib/Modeler';

const viewer = new BpmnJS({
  container: '#canvas',
  additionalModules: [
    EmbeddedComments,
    propertiesPanelModule,
    propertiesProviderModule,
    commentPropertiesProvider
  ],
  propertiesPanel: {
    parent: '#js-properties-panel'
  }
});

/**
 * basic Login
 *
 * Get Username and Type from config.json
 * creates buttons for each UserType
 *
 * On Click of the Button the user will be set in window.config.user
 */

let availableUsers = [];

window.config = {user: {}};
$.getJSON("config.json").done(data => {

  config = data;
  let $login = $("#login");
  let $button

  availableUsers = data.users;
  console.log(availableUsers);

  document.getElementById('loginModal').style.display = 'block';

  $('#loginButton').on('click', function(e) {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    for (let user of availableUsers) {
      if (user.name === username && user.password === password) {
        config.user = user;
        $("#login").innerHTML = `<span>User: ${config.user.name} + Role: ${config.user.type}</span>`;
        document.getElementById('loginModal').style.display = 'none';
        break;
      }
    }
  });


  config.users.forEach(user => {
    $button = $("<button>")
        .on("click", function (e) {
          $('button.userType').removeClass("active");
          $(this).addClass("active");
          config.user = user
        });
    $button.addClass("userType")
    $button.text(user.name);
  });

  console.log(config.user);
});

function onLogin() {
  console.log('H');
}

async function openDiagram(diagram) {

  try {
    await viewer.importXML(diagram);

    console.log('success!');
    viewer.get('canvas').zoom('fit-viewport');
  } catch(err) {

    alert('could not import BPMN 2.0 XML, see console');
    return console.log('could not import BPMN 2.0 XML', err);
  }
}


// file save handling

var $download = $('[data-download]');

async function serialize() {
 // console.log(viewer);
  try {
    const { xml } = await viewer.saveXML();

    var encodedData = encodeURIComponent(xml);

    $download.attr({
      'href': 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData
    });
  } catch (err) {

    console.log('failed to serialize BPMN 2.0 xml', err);
  }
}


viewer.get('eventBus').on('element.click', (event) => {
  console.log(event);
} );


viewer.get('eventBus').on('shape.changed', (event) => {
  //console.log(event);
} );

viewer.on('comments.updated', serialize);
viewer.on('commandStack.changed', serialize);

viewer.on('canvas.click', function(event) {
  //console.log(event);
  viewer.get('comments').collapseAll();
});


viewer.on('comments.afterAdd', function (event) {
  defer(function () {
    event = restcall(event);

//  # Try To update the viewer

  });

});

function defer(fn) {
  setTimeout(fn, 0);
}




// file open handling

var $file = $('[data-open-file]');

function readFile(file, done) {

  if (!file) {
    return done(new Error('no file chosen'));
  }

  var reader = new FileReader();

  reader.onload = function(e) {
    done(null, e.target.result);
  };

  reader.readAsText(file);
}

$file.on('change', function() {
  readFile(this.files[0], function(err, xml) {

    if (err) {
      alert('could not read file, see console');
      return console.error('could not read file', err);
    }

    openDiagram(xml);
  });

});


// we use stringify to inline a simple BPMN diagram
import pizzaDiagram from '../resources/pizza-collaboration-annotated.bpmn';
import foreach from "foreach";

openDiagram(pizzaDiagram);


// file drag / drop ///////////////////////

function openFile(file, callback) {

  // check file api availability
  if (!window.FileReader) {
    return window.alert(
      'Looks like you use an older browser that does not support drag and drop. ' +
      'Try using a modern browser such as Chrome, Firefox or Internet Explorer > 10.');
  }

  // no file chosen
  if (!file) {
    return;
  }

  var reader = new FileReader();

  reader.onload = function(e) {

    var xml = e.target.result;

    callback(xml);
  };

  reader.readAsText(file);
}

(function onFileDrop(container, callback) {

  function handleFileSelect(e) {
    e.stopPropagation();
    e.preventDefault();

    var files = e.dataTransfer.files;
    openFile(files[0], callback);
  }

  function handleDragOver(e) {
    e.stopPropagation();
    e.preventDefault();

    e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  container.get(0).addEventListener('dragover', handleDragOver, false);
  container.get(0).addEventListener('drop', handleFileSelect, false);

})($('body'), openDiagram);

function syncDelay(milliseconds){
  var start = new Date().getTime();
  var end=0;
  while( (end-start) < milliseconds){
    end = new Date().getTime();
  }
}


function restcall(event) {


  $.ajax({
    url: 'https://sentimentanalysisweb.azurewebsites.net/api/predict',
    data:  JSON.stringify({
      "text": event.comment
    }),
    dataType: "json",
    contentType: 'application/json',
    type: 'POST',
    success: function (result) {
      // Do something with the result
      console.log(result)
      event.comment = event.comment + " " + result;
      // Auch das letzte Element im Array Comment updaten
      event.comments[event.comments.length - 1][1] = event.comment

      viewer.get('comments').updateElement(event);
    }
  });


}


