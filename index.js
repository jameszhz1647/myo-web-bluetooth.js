window.onload = function(){
  let button_LU = document.getElementById("connect-LU");
  let button_LL = document.getElementById("connect-LL");
  let button_RU = document.getElementById("connect-RU");
  let button_RL = document.getElementById("connect-RL");
  let message = document.getElementById("message");

  if ( 'bluetooth' in navigator === false ) {
      button.style.display = 'none';
      message.innerHTML = 'This browser doesn\'t support the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API" target="_blank">Web Bluetooth API</a> :(';
  }

  let renderer, scene, camera;
  var mesh;

  let accelerometerData, gyroscopeData, poseData, emgData,
  orientationData, batteryLevel, armType, armSynced, myoDirection, myoLocked;

  var axis = new THREE.Vector3();
	var quaternion = new THREE.Quaternion();
	var quaternionHome = new THREE.Quaternion();
	var initialised = false;
	var timeout = null;

  button_LU.onclick = function(e){
    var myoController = new MyoWebBluetooth("left_upper_myo");
    myoController.connect();
    console.log("Device to connect:", myoController.name)

    myoController.onStateChange(function(state){

      if(state.batteryLevel){
        batteryLevel = state.batteryLevel + '%';
      }
      aimDevice = myoController.name;
      accelerometerData = state.accelerometer;
      gyroscopeData = state.gyroscope;
      poseData = state.pose;
      emgData = state.emgData;
      orientationData = state.orientation;
      armType = state.armType;
      armSynced = state.armSynced;
      myoDirection = state.myoDirection;
      myoLocked = state.myoLocked;

      displayData(aimDevice, 'LU');

      //***
      // Orientation data coming back from the Myo is very sensitive.
      // Not very useful to display on 3D cube as it is, but tried anyway.
      //***

      // if(mesh !== undefined){
      //   var angle = Math.sqrt( orientationData.x * orientationData.x + orientationData.y * orientationData.y + orientationData.z * orientationData.z );
      //
			// 	if ( angle > 0 ) {
			// 		axis.set( orientationData.x, orientationData.y, orientationData.z )
			// 		axis.multiplyScalar( 1 / angle );
			// 		quaternion.setFromAxisAngle( axis, angle );
      //
			// 		// if ( initialised === false ) {
			// 		// 	quaternionHome.copy( quaternion );
			// 		// 	quaternionHome.inverse();
			// 		// 	initialised = true;
			// 		// }
			// 	} else {
			// 		quaternion.set( 0, 0, 0, 1 );
			// 	}
      //
      //   // mesh.quaternion.copy( quaternionHome );
			// 	mesh.quaternion.multiply( quaternion );
      // }
    });
  }

  button_LL.onclick = function(e){
    var myoController = new MyoWebBluetooth("Myo");
    myoController.connect();
    console.log("Device to connect:", myoController.name)

    myoController.onStateChange(function(state){

      if(state.batteryLevel){
        batteryLevel = state.batteryLevel + '%';
      }
      aimDevice = myoController.name;
      accelerometerData = state.accelerometer;
      gyroscopeData = state.gyroscope;
      poseData = state.pose;
      emgData = state.emgData;
      orientationData = state.orientation;
      armType = state.armType;
      armSynced = state.armSynced;
      myoDirection = state.myoDirection;
      myoLocked = state.myoLocked;

      displayData(aimDevice, 'LL');
    });
  }

  // init();
  // render();

  function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.001, 10 );

    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementsByClassName('container')[0].appendChild( renderer.domElement );

    // var loader = new THREE.JSONLoader()
    // loader.load('myo.json', function(geometry){
    //   var material = new THREE.MeshPhongMaterial( { color: 0x888899, shininess: 15, side: THREE.DoubleSide } );
		// 		mesh = new THREE.Mesh( geometry, material );
    //     mesh.rotation.x = 0.5;
    //     mesh.scale.set(0.5, 0.5, 0.5);
		// 		scene.add( mesh );
    // })

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshPhongMaterial({color: 0x888899, shininess: 15, side: THREE.DoubleSide });
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = 0.5;
    scene.add(mesh);

    var light = new THREE.HemisphereLight( 0xddddff, 0x808080, 0.7 );
  			light.position.set( 0, 1, 0 );
  			scene.add( light );

		var light = new THREE.DirectionalLight( 0xffffff, 0.6 );
  			light.position.set( 1, 1, 1 );
  			scene.add( light );

		var light = new THREE.DirectionalLight( 0xffffff, 0.4 );
  			light.position.set( 1, -1, 1 );
  			scene.add( light );

    camera.position.z = 5;
  }

  function render(){
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  function displayData(aimDevice, arm){
    var deviceDiv = document.getElementsByClassName(`device-data-${arm}`)[0];
    deviceDiv.innerHTML = aimDevice;

    if(batteryLevel){
      var batteryLevelDiv = document.getElementsByClassName(`battery-data-${arm}`)[0];
      batteryLevelDiv.innerHTML = batteryLevel;
    }

    if(armType){
      var armTypeDiv = document.getElementsByClassName(`arm-type-data-${arm}`)[0];
      armTypeDiv.innerHTML = armType;
    }

    if(armSynced){
      var armSyncedDiv = document.getElementsByClassName(`arm-synced-data-${arm}`)[0];
      armSyncedDiv.innerHTML = armSynced;
    }

    if(myoDirection){
      var myoDirectionDiv = document.getElementsByClassName(`myo-direction-data-${arm}`)[0];
      myoDirectionDiv.innerHTML = myoDirection;
    }

    if(myoLocked){
      var myoLockedDiv = document.getElementsByClassName(`myo-locked-data-${arm}`)[0];
      myoLockedDiv.innerHTML = myoLocked;
    }

    // if(poseData){
    //   var poseDiv = document.getElementsByClassName(`pose-data-${arm}`)[0];
    //   poseDiv.innerHTML = poseData;

    //   var poseImage = document.getElementsByClassName(`pose-image-${arm}`)[0];

    //   switch(poseData){
    //     case 'fist':
    //       poseImage.src = "images/fist.jpg";
    //       break;
    //     case 'wave out':
    //       poseImage.src = "images/wave-out.jpg";
    //       break;
    //     case 'wave in':
    //       poseImage.src = "images/wave-in.jpg";
    //       break;
    //     case 'double tap':
    //       poseImage.src = "images/double-tap.jpg";
    //       break;
    //     case 'fingers spread':
    //       poseImage.src = "images/fingers-spread.jpg";
    //       break;
    //   }
    // }

    if(orientationData){
      var orientationXDiv = document.getElementsByClassName(`orientation-x-data-${arm}`)[0];
      orientationXDiv.innerHTML = orientationData.x;

      var orientationYDiv = document.getElementsByClassName(`orientation-y-data-${arm}`)[0];
      orientationYDiv.innerHTML = orientationData.y;

      var orientationZDiv = document.getElementsByClassName(`orientation-z-data-${arm}`)[0];
      orientationZDiv.innerHTML = orientationData.z;
    }

    if(accelerometerData){
      var accelerometerXDiv = document.getElementsByClassName(`accelerometer-x-data-${arm}`)[0];
      accelerometerXDiv.innerHTML = accelerometerData.x;

      var accelerometerYDiv = document.getElementsByClassName(`accelerometer-y-data-${arm}`)[0];
      accelerometerYDiv.innerHTML = accelerometerData.y;

      var accelerometerZDiv = document.getElementsByClassName(`accelerometer-z-data-${arm}`)[0];
      accelerometerZDiv.innerHTML = accelerometerData.z;
    }

    if(gyroscopeData){
      var gyroscopeXDiv = document.getElementsByClassName(`gyroscope-x-data-${arm}`)[0];
      gyroscopeXDiv.innerHTML = gyroscopeData.x;

      var gyroscopeYDiv = document.getElementsByClassName(`gyroscope-y-data-${arm}`)[0];
      gyroscopeYDiv.innerHTML = gyroscopeData.y;

      var gyroscopeZDiv = document.getElementsByClassName(`gyroscope-z-data-${arm}`)[0];
      gyroscopeZDiv.innerHTML = gyroscopeData.z;
    }
  }

}
