class SceneInit {
	createScene() {
		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100000);
		this.camera.position.set(0, 15, -200);
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color('#4b42f5');
		Showroom.createLights();
		this.createLights();
	}
	setShodow_Properties()
	{
		this.light.shadow.camera.near = 0.5;
		this.light.shadow.mapSize.width = 1024;
		this.light.shadow.bias = -0.001
		const mapArea = 100
		this.light.shadow.camera.top = this.light.shadow.camera.right = mapArea
		this.light.shadow.camera.left = this.light.shadow.camera.bottom = -mapArea
		this.light.shadow.camera.far = 500;
		this.light.shadow.mapSize.height = 1024;

	}
	createLights() {
		this.hemLight = new THREE.HemisphereLight(0xffffff, 0x404040, 1); 
		this.scene.add(this.hemLight);
		this.light = new THREE.DirectionalLight(0xffffff, .1);
		this.light.castShadow = true;
		this.light.position.set(0, 50, 0)
		this.setShodow_Properties()
		this.scene.add(this.light);
	}
	setControl_properties()
	{
		this.controls.maxPolarAngle = Math.PI / 2;
		this.controls.target = new THREE.Vector3(0, 15, 0);
		this.controls.maxDistance = 2000;

	}
	createControls() {
		this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
		this.setControl_properties();
		this.controls.update();
	}
	change_camera_pos(x,y,z)
	{
		this.camera.position.set(x,y,z);
	}

	add(obj)
	{
		this.scene.add(obj)
	}
	remove(obj)
	{
		this.scene.remove(obj)
	}

	createRenderer() {
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.shadowMap.enabled = true;
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		
	}

	
	
	
}
