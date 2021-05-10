class ShowroomInit extends SceneInit {
	constructor(spots, spot_left, spot_right, spot_back, spot_front) {
		super();
		this.spots = [
			this.spot_left = spot_left,
			this.spot_right = spot_right,
			this.spot_back = spot_back,
			this.spot_front = spot_front
		];		
	}
	setPos() {
		this.spots[0].position.set(-100, 10, 0);
		this.spots[1].position.set(100, 10, 0);
		this.spots[2].position.set(0, 10, -150);
		this.spots[3].position.set(0, 70, 150);
	}

	createLights() {
		for (let i = 0; i < this.spots.length; ++i) {
			this.spots[i] = new THREE.SpotLight();
			Scene.scene.add(this.spots[i]);
		}
		this.spots[0].position.set(-100, 10, 0);
		this.spots[1].position.set(100, 10, 0);
		this.spots[2].position.set(0, 10, -150);
		this.spots[3].position.set(0, 70, 150);
		
		for (let i = 0; i < this.spots.length; ++i) {
			this.spots[i].visible = false;
		}
	}


	
}
