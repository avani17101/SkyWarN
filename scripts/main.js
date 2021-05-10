let Scene, Showroom, Load, currentModel, object, rotateOn = false;
let loaded_planes=false;
let airplane,enemy, missile, nataChained, nata, score = 0,plane_health=100, enemy_health = 100, f_count = 0, count=0, tres=5;
game_over=false, enemy_dead=false, airplane_dead=false, 
first=true;
stars = [], fuels = [],missiles=[], enemy_missiles = []

const reader = new FileReader();
function loadSample(path) {
	return new Promise((resolve) => {
		const loader = new THREE.GLTFLoader();
		loader.load(path, function(gltf) {
			gltf.scene.traverse(function(child) {
				if (child.isMesh) {
					child.castShadow = true;
					child.receiveShadow = true;
				}
			});
			currentModel = gltf.scene;
			gltf.scene.scale.set(100,100,100);
			Scene.scene.add(gltf.scene);
			resolve(gltf.scene);
		});
	});
}
function game_music()
{
	var listener = new THREE.AudioListener();
	var sound = new THREE.Audio(listener);
	var audioLoader = new THREE.AudioLoader();
	audioLoader.load('assets/sounds/game_music.mp3', function (buffer) {
		sound.setBuffer(buffer);
		sound.setLoop(true);
		sound.setVolume(0.5);
		sound.play();

	},
		// onProgress callback
		function (xhr) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},

		// onError callback
		function (err) {
			console.log('Error occured');
		}

	);
}
game_music();


function game_loop() {
	init();
	animate();
}
function setpos(model)
{
	model.scale.set(25, 25, 25);
	model.position.set(-100, 300, 800);
}

var textureLoader = new THREE.TextureLoader();
var last_harmed_time = curTime();
var last_fired_time = curTime();
async function init() {
	load = false;
	let container = document.createElement('div');
	document.body.appendChild(container);
	load = true;
	window.addEventListener('resize', onWindowResize, false);
	if(load == true)
	{
		scenary = []
	}
	Scene = new SceneInit();
	Showroom = new ShowroomInit();
	if (load == false)
	{
		scenary = [Showroom]
	}
	

	var piece = -1;
	Scene.createScene();
	Scene.createRenderer();
	if(load == true)
	{
		piece = 1;
	}
	loaded_planes = false;
	container.appendChild(Scene.renderer.domElement);

	Scene.createControls();

	loadSample('assets/models/airplane.glb').then(function (model) {
		Scene.add(model);
		addTexture(model, 'assets/textures/blue.jpg')
		model.scale.set(6, 6, 6);
		airplane = model
		loadSample('assets/models/enemy.glb').then(function (model) {
			addTexture(model,'assets/textures/enemy.jpg' )
			Scene.add(model);
			setpos(model);
			enemy = model
			loaded_planes = true;
		});

	});
	loadSample('assets/models/fireball.glb').then(function (model) {
		addTexture(model,'assets/textures/moon2.png' )
		Scene.add(model);
		model.scale.set(100, 100, 100);
		model.position.set(-500, 300, 1000);
	
	});
	loadSample('assets/models/fireball.glb').then(function (model) {
		addTexture(model, 'assets/textures/moon_gray.jpg')
		Scene.add(model);
		model.scale.set(150,150,150);
		model.position.set(700, 500, 1000);
	
	});
	loadSample('assets/models/alien.glb').then(function (model) {
		addTexture(model, 'assets/textures/green.jpg')
		Scene.add(model);
		model.scale.set(25,25,25);
		model.rotation.y = -Math.PI*2/3;
		model.position.set(900, -300, 1000);
		nata = model;
	
	});
	
	loadSample('assets/models/asteroid.glb').then(function (model) {
		addTexture(model, 'assets/textures/planet.png')
		Scene.add(model);
		model.scale.set(150,150,150);
		model.position.set(900, -300, 1000);
		nataChained = model;
	
	});
	skyboxes = ['3','5','6']
	// var Skybox_name = skyboxes[Math.floor(Math.random() * skyboxes.length)];
	var Skybox_name = '1'
	loadSample('assets/models/asteroid.glb').then(function (model) {
		addTexture(model, 'assets/textures/moon_gray.jpg')
		Scene.add(model);
		model.scale.set(100,100,10);
		model.position.set(800, -100, 1000);
	});
	loadSample('assets/models/asteroid.glb').then(function (model) {
		addTexture(model, 'assets/textures/earth.jpg')
		Scene.add(model);
		model.scale.set(50,50,10);
		model.position.set(950, 700, 1000);
	});
	type = 'png'
	if(Skybox_name=='1') type= 'jpg'
	// *************** background **********************
	
	var cubeTex =
		[
			new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('img/Skybox'+Skybox_name+'/front.'+type), side: THREE.DoubleSide }), // Right side
			new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('img/Skybox'+ Skybox_name+'/back.'+type), side: THREE.DoubleSide }), // Left side
			new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('img/Skybox'+ Skybox_name+'/up.'+type), side: THREE.DoubleSide }), // Top side
			new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('img/Skybox'+ Skybox_name+'/down.'+type), side: THREE.DoubleSide }), // Bottom side
			new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('img/Skybox'+ Skybox_name+'/right.'+type), side: THREE.DoubleSide }), // Front side
			new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('img/Skybox'+ Skybox_name+'/left.'+type), side: THREE.DoubleSide }) // Back side
		];
	var geometry = new THREE.CubeGeometry(2000, 2000, 2000);
	var cubeMaterial = new THREE.MeshFaceMaterial(cubeTex);
	var mat = 1;
	var cube = new THREE.Mesh(geometry, cubeMaterial);
	var sec = 0;
	Scene.add(cube);
	// *************** background **********************

	var Speed = 8;

	// W - 87; A - 65; S - 83; D - 68 
	document.addEventListener("keydown", onDocumentKeyDown, false);
	function onDocumentKeyDown(event) {
		var keyCode = event.which;
		switch(keyCode)
		{
			case 87: 
				if(airplane.position.z+speed < 850)  //check if it doesnt hit up boundary
					airplane.position.z += Speed; //front
					break;
			case 83: 
				if(airplane.position.z-speed > -850)
					airplane.position.z -= Speed; //back
					break;
			case 68: 
				if(airplane.position.x-speed > -850)
					airplane.position.x -= Speed; //left
					break;
			case 65:
				if(airplane.position.x+speed < 850)
					airplane.position.x += Speed; //right
					break;
			case 38:
				if(airplane.position.y+speed < 850)
					airplane.position.y += Speed;  //up
					break;
			case 40: 
				if(airplane.position.y-speed > -850)
					airplane.position.y -= Speed;  //down
					break;
			case 32: fire();   //shoot missile at enemy
				break;		
		}
		

		Scene.change_camera_pos(airplane.position.x, airplane.position.y + 15, airplane.position.z - 200);
		// generate stars as airplane moves in games
		count = count + 1
		count = count % 40
		if (count == 0) {
			make_obj(1, 'star');
		}

		f_count = f_count + 1
		f_count = f_count % 50
		if(f_count == 0)
		{
			make_obj(1, 'fuel');
		}
		
	};

}

function onWindowResize() {
	aspect_ratio = window.innerWidth / window.innerHeight;
	Scene.camera.aspect = aspect_ratio;
	Proj = []
	Scene.camera.updateProjectionMatrix();
	size = []
	Scene.renderer.setSize(window.innerWidth, window.innerHeight);
}

function rotateModel() {
	if (rotateOn == true) currentModel.rotation.y += 0.005;
}


function animate() {
	enemy_chase();
	missiles_chase();
	enemy_missiles_shoot();
	enemy_missiles_chase();
	Collision_detection();
	requestAnimationFrame(animate);
	Scene.renderer.render(Scene.scene, Scene.camera);
	rotateModel();
	diff = (curTime() - last_harmed_time)/ 1000;
	HUDDisplay();
	if(enemy_dead == true && nata_freed == true)
		move_nata();
}

function move_nata()
{
	speed = 3;
	nata.scale.set(5,5,5)
	updatePos(nata, airplane, 0.05)
	

}
function HUDDisplay()
{
	display_text = getDisplayText()
	if (document.readyState == 'complete')
		document.getElementById("hud").innerHTML = display_text;
}
function getDisplayText()
{
	display_text = "Score : " + String(score) + "<br>" + "Health : " + String(plane_health) +  "<br>" + "Enemy Health : " + String(enemy_health) ;

	if (game_over) {
		display_text = "<MARQUE> <H1> GAME OVER </H1> </MARQUE>";
		if (airplane_dead)
			state = 'LOST!'
		if (enemy_dead)
			state = 'WON! Nata Rescued!'
			
		display_text += "<H1> YOU " + state + "<br> <h2> Your Score : " + String(score) + " </h2>"
	
	}
	return display_text;
}

function updatePos(ob1, ob2, speed)
{	
	ob1.position.x += (ob2.position.x - ob1.position.x )*speed;
	ob1.position.y += (ob2.position.y - ob1.position.y )*speed;
	ob1.position.z += (ob2.position.z - ob1.position.z )*speed;
}
function enemy_chase() {
	if (!game_over)
	{
		if (!loaded_planes)
			return;
		updatePos(enemy, airplane, 0.003)
	}
}

function fire() {
	if (!game_over)
	{
		if (airplane == undefined || airplane_dead)
			return;
		loadSample('assets/models/missile.glb').then(function (model) {
			addTexture(model, 'assets/textures/blue.jpg')
			model.rotation.x = -Math.PI
			model.scale.set(4, 4, 3)
			plane_pos = airplane.position
			model.position.set(plane_pos.x - 20, plane_pos.y, plane_pos.z - 4)
			missiles.push(model);
			Scene.add(model)
			
		});

	}
	return;
	
}

function missiles_chase() {

	if (!game_over)
	{
		toberemoved = []
		speedx = 20;
		speedz = 20;
		for (var i = 0; i < missiles.length; i++) {
			speedx += 1;
			missiles[i].position.z += speedz;
			speedz += 1;
			if (Math.abs(missiles[i].position.z) >= 900) {
				speedz -= 1;
				toberemoved.push(i);
				Scene.remove(missiles[i]);
				
			}
		}
		missiles = removeElements(missiles, toberemoved)
	}
		
}
function collisionCheck_missile_Enemy()
{
	var missilestoberemoved = [];
	for (var i = 0; i < missiles.length; i++) {
		
		if (check_tres(missiles[i].position, enemy.position, 30))
			{
			if (enemy_health <= 0) {
				Scene.remove(enemy);
				enemy_dead = true;
				score += 50;
				Scene.remove(missiles[i]);
				missilestoberemoved.push(i);
				endGame();
				
			}
			else {
				enemy_health -= 5;
				score += 10;
				Scene.remove(missiles[i]);
				missilestoberemoved.push(i);

			}
			
		}
	}
	missiles = removeElements(missiles, missilestoberemoved);

}
function removeElements(arr, toremove)
{
	for (var i = 0; i <  toremove.length; i++) {
		arr.splice(toremove[i], 1);
	}
	return arr;
}
function collisionCheck_enemy_airplane()
{
	if (airplane == undefined || airplane_dead)
			return;

	var cur_time = curTime();
	diff =  (cur_time - last_harmed_time) / 1000;

	if (diff >= tres) {
		if (check_tres(enemy.position, airplane.position, 55)) {
			last_harmed_time = cur_time;
			first = false;
			if (plane_health >= 10)
				plane_health -= 10;
			if (plane_health <= 0) {
				Scene.remove(airplane);
				airplane_dead = true;
				endGame();
			}
		}
	}
}
function check_tres(ob1Pos, ob2Pos, thresh)
{
	if(Math.abs(ob1Pos.x - ob2Pos.x) <= thresh &&
		Math.abs(ob1Pos.y - ob2Pos.y) <= thresh &&
		Math.abs(ob1Pos.z - ob2Pos.z) <= thresh)
		return true;
	else
		return false;
	

}
function collisionCheck_star_airplane()
{
	var toberemoved = [];
	for (var i = 0; i < stars.length; i++) {
		if (check_tres(stars[i].position, airplane.position, 20))
		{
			score += 10
			Scene.remove(stars[i])
			toberemoved.push(i)

		}

	}
	stars = removeElements(stars, toberemoved)
}

function collisionCheck_fuel_airplane()
{
	var toberemoved = [];
	for (var i = 0; i < fuels.length; i++) {
		if (check_tres(fuels[i].position, airplane.position, 20))
		{
			plane_health += 10
			Scene.remove(fuels[i])
			toberemoved.push(i)
		}
	}
	fuels = removeElements(fuels, toberemoved)
}

function collisionCheck_enemyMissiles_airplane()
{
	toberemoved = []
		for (var i = 0; i < enemy_missiles.length; i++) {
			
			if (check_tres(airplane.position,  enemy_missiles[i][0].position, 20))
			 {
				if (plane_health <= 0)
				{
					Scene.remove(airplane);
					toberemoved.push(i)
					Scene.remove(enemy_missiles[i][0]);
					airplane_dead = true;
					endGame();
				}
				if (plane_health >= 5)
					plane_health -= 5;
				
			}
	
		}
	
		removeElements(enemy_missiles, toberemoved);
}

function Collision_detection() 
{
	if (!game_over)
	{
		if (!enemy_dead && enemy != undefined)
		{
			collisionCheck_missile_Enemy();
			collisionCheck_enemy_airplane();
		}
		if (airplane == undefined || airplane_dead)
			return;
		collisionCheck_star_airplane();
		collisionCheck_fuel_airplane();
		collisionCheck_enemyMissiles_airplane();
	}	
	
}
function addTexture(model, location){
	var map = textureLoader.load(location);
	var material = new THREE.MeshPhongMaterial({ map: map });
	model.traverse(function (node) {
		if (node.isMesh) {
			node.material = material;
		}

	});
}
function invertSign(pos)
{
	if (Math.random() > 0.5)
		pos = -pos;
	return pos
}
function rand()
{
	return  (Math.floor(Math.random()) + 1)*45
}
function make_obj(num, type) {
	if (!game_over)
	{
		for (var i = 0; i < num; i++) {
				loadSample('assets/models/'+type+'.glb').then(function (model) {
				
				x = airplane.position.x + rand();
				y = airplane.position.y + rand();
				z = airplane.position.z + rand();
				x = invertSign(x);
				y = invertSign(y);
				model.position.set(x, y, z)
				Scene.add(model)
				if (type == 'star')
				{
					model.rotation.y = Math.PI / 2;
					addTexture(model,'assets/textures/redCarpet.jpg')
					model.scale.set(10, 10, 10)
					stars.push(model)
					
				}
				else
				{
					model.rotation.y = Math.PI / 8;
					addTexture(model,'assets/textures/blue.jpg')
					model.scale.set(3,3,3)
					model.position.set(x+30, y-1, z+2)
					fuels.push(model)

				}
				
				
			})
		}
	}
}
function normalize_vec(vec)
{
	sum = 0;
	for (var i = 0; i < 3; i++)
		sum = sum + Math.abs(vec[i]);

	for (var i = 0; i < 3; i++)
		vec[i] = vec[i] / sum;
	return vec
}
function enemy_missiles_shoot(num) {
	if (!game_over)
	{
		if (!enemy_dead) {
			cur_time = curTime();
			var diff = (cur_time - last_fired_time) 
			diff = diff / 1000; //converting to secs
			timeGap = 2
			if (diff >= timeGap) {
				last_fired_time = cur_time;
				loadSample('assets/models/fireball.glb').then(function (model) {
					addTexture(model, 'assets/textures/fire.jpg')
					model.rotation.x = -Math.PI
					model.position.set(enemy.position.x -20, enemy.position.y , enemy.position.z - 4)
					model.scale.set(7, 7, 7)
					plane_pos = airplane.position
					enemy_pos = enemy.position
					val_x = plane_pos.x - enemy_pos.x
					val_y = plane_pos.y - enemy_pos.y
					val_z =  plane_pos.z - enemy_pos.z
					val_pos = [val_x, val_y, val_z];
					val_loaded = true
					enemy_missiles.push([model, normalize_vec(val_pos)]);
					Scene.add(model)
				});
			}
		}
	}
}
function updatePosition(ob, vals)
{
	ob.position.x += vals[0];
	ob.position.y += vals[1];
	ob.position.z += vals[2];

}
function enemy_missiles_chase() 
{
	if (!game_over)
	{
		speed = 20;
		for (var i = 0; i < enemy_missiles.length; i++) {
			updatePosition(enemy_missiles[i][0], [speed*enemy_missiles[i][1][0], speed*enemy_missiles[i][1][1], speed*enemy_missiles[i][1][2]])
			
		}

	}    
}
function curTime(){
	var d = new Date();
	var cur_time = d.getTime();
	return cur_time;
}


function endGame() {
	game_over = true;
	
	if (enemy != undefined)
		Scene.remove(enemy)

	for (var i = 0; i < enemy_missiles.length; i++)
		Scene.remove(enemy_missiles[i][0]);

	for (var i = 0; i < missiles.length; i++)
		Scene.remove(missiles[i]);
	if(enemy_dead == true)
	{
		Scene.remove(nataChained)
		nata_freed = true;
	}
}


game_loop();